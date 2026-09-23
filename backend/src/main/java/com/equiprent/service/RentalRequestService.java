package com.equiprent.service;

import com.equiprent.exception.BadRequestException;
import com.equiprent.exception.ConflictException;
import com.equiprent.exception.ResourceNotFoundException;
import com.equiprent.model.*;
import com.equiprent.repository.EquipmentRepository;
import com.equiprent.repository.RentalRepository;
import com.equiprent.repository.RentalRequestRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RentalRequestService {

    private final RentalRequestRepository rentalRequestRepository;
    private final EquipmentRepository equipmentRepository;
    private final RentalRepository rentalRepository;
    private final EquipmentService equipmentService;

    public RentalRequestService(RentalRequestRepository rentalRequestRepository,
                                EquipmentRepository equipmentRepository,
                                RentalRepository rentalRepository,
                                EquipmentService equipmentService) {
        this.rentalRequestRepository = rentalRequestRepository;
        this.equipmentRepository = equipmentRepository;
        this.rentalRepository = rentalRepository;
        this.equipmentService = equipmentService;
    }

    public void lazyEvaluateExpiries() {
        Instant now = Instant.now();
        List<RentalRequest> pendings = rentalRequestRepository.findByStatus(RequestStatus.PENDING);
        for (RentalRequest req : pendings) {
            if (req.getExpiresAt() != null && req.getPaymentStatus() != PaymentStatus.PAYMENT_SUBMITTED) {
                try {
                    Instant exp = Instant.parse(req.getExpiresAt());
                    if (now.isAfter(exp)) {
                        req.setStatus(RequestStatus.EXPIRED);
                        rentalRequestRepository.save(req);
                    }
                } catch (Exception ignored) {}
            }
        }
    }

    public List<RentalRequest> getAllRequests(String customerId) {
        lazyEvaluateExpiries();
        if (customerId != null && !customerId.isEmpty()) {
            return rentalRequestRepository.findByCustomerId(customerId);
        }
        return rentalRequestRepository.findAll();
    }

    public RentalRequest getRequestById(String id) {
        lazyEvaluateExpiries();
        return rentalRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental request not found with id: " + id));
    }

    public RentalRequest createRentalRequest(RentalRequest requestInput, User customer) {
        lazyEvaluateExpiries();

        Equipment equipment = equipmentRepository.findById(requestInput.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));

        if (equipment.getStatus() != EquipmentStatus.AVAILABLE) {
            throw new BadRequestException("Equipment is not currently AVAILABLE for rental");
        }

        // Validate date conflict before submitting
        boolean hasConflict = equipmentService.checkDateConflict(
                equipment.getId(), requestInput.getStartDate(), requestInput.getEndDate()
        );
        if (hasConflict) {
            throw new ConflictException("Date conflict: Equipment is already booked or active for overlapping dates.");
        }

        // Calculate total days & amount
        int totalDays = 1;
        try {
            LocalDate start = LocalDate.parse(requestInput.getStartDate());
            LocalDate end = LocalDate.parse(requestInput.getEndDate());
            if (end.isBefore(start)) {
                throw new BadRequestException("End date cannot be before start date");
            }
            long days = ChronoUnit.DAYS.between(start, end);
            totalDays = Math.max(1, (int) days);
        } catch (Exception e) {
            if (requestInput.getTotalDays() > 0) totalDays = requestInput.getTotalDays();
        }

        double totalAmount = (totalDays * equipment.getRentalRate()) + equipment.getAdvanceAmount();

        int prebookingWindow = equipment.getPrebookingWindowMinutes() > 0 ? equipment.getPrebookingWindowMinutes() : 30;
        Instant now = Instant.now();
        Instant expiresAt = now.plus(prebookingWindow, ChronoUnit.MINUTES);

        RentalRequest request = new RentalRequest();
        request.setId("req_" + System.currentTimeMillis());
        request.setEquipmentId(equipment.getId());
        request.setEquipmentName(equipment.getName());
        request.setCustomerId(customer != null ? customer.getId() : requestInput.getCustomerId());
        request.setCustomerName(customer != null ? customer.getName() : requestInput.getCustomerName());
        request.setCustomerEmail(customer != null ? customer.getEmail() : requestInput.getCustomerEmail());
        request.setStartDate(requestInput.getStartDate());
        request.setEndDate(requestInput.getEndDate());
        request.setTotalDays(totalDays);
        request.setRentalRate(equipment.getRentalRate());
        request.setAdvanceAmount(equipment.getAdvanceAmount());
        request.setTotalAmount(totalAmount);
        request.setStatus(RequestStatus.PENDING);
        request.setPaymentStatus(PaymentStatus.UNPAID);
        request.setCreatedAt(now.toString());
        request.setExpiresAt(expiresAt.toString());

        // RULE 1: Equipment status remains AVAILABLE! Pending requests do NOT reserve equipment!
        return rentalRequestRepository.save(request);
    }

    public Rental approveRequest(String requestId) {
        lazyEvaluateExpiries();

        RentalRequest request = getRequestById(requestId);

        if (request.getStatus() == RequestStatus.EXPIRED) {
            throw new BadRequestException("Cannot approve request: Pre-booking window has EXPIRED.");
        }
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request is already " + request.getStatus());
        }

        // MANDATORY RULE 2 & 3: RE-CHECK date conflict immediately before approving!
        boolean hasConflict = equipmentService.checkDateConflict(
                request.getEquipmentId(), request.getStartDate(), request.getEndDate()
        );
        if (hasConflict) {
            throw new ConflictException("Cannot approve request! Equipment was booked for overlapping dates by another rental.");
        }

        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));

        // 1. Transition Request: PENDING -> APPROVED
        request.setStatus(RequestStatus.APPROVED);
        rentalRequestRepository.save(request);

        // 2. Create Rental: BOOKED
        Rental rental = new Rental();
        rental.setId("rent_" + System.currentTimeMillis());
        rental.setRequestId(request.getId());
        rental.setEquipmentId(equipment.getId());
        rental.setEquipmentName(equipment.getName());
        rental.setEquipmentImage(equipment.getImageUrl());
        rental.setCustomerId(request.getCustomerId());
        rental.setCustomerName(request.getCustomerName());
        rental.setCustomerEmail(request.getCustomerEmail());
        rental.setStartDate(request.getStartDate());
        rental.setEndDate(request.getEndDate());
        rental.setTotalDays(request.getTotalDays());
        rental.setTotalAmount(request.getTotalAmount());
        rental.setAdvanceAmount(request.getAdvanceAmount());
        rental.setStatus(RentalStatus.BOOKED);
        rental.setPaymentStatus(request.getPaymentStatus());
        rental.setCreatedAt(Instant.now().toString());

        Rental savedRental = rentalRepository.save(rental);

        // 3. Transition Equipment: AVAILABLE -> BOOKED
        equipment.setStatus(EquipmentStatus.BOOKED);
        equipmentRepository.save(equipment);

        return savedRental;
    }

    public RentalRequest rejectRequest(String requestId) {
        RentalRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request is not PENDING");
        }

        request.setStatus(RequestStatus.REJECTED);
        return rentalRequestRepository.save(request);
    }
}
