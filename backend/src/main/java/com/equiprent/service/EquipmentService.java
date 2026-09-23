package com.equiprent.service;

import com.equiprent.exception.ResourceNotFoundException;
import com.equiprent.exception.BadRequestException;
import com.equiprent.model.Equipment;
import com.equiprent.model.EquipmentStatus;
import com.equiprent.model.Rental;
import com.equiprent.model.RentalStatus;
import com.equiprent.repository.EquipmentRepository;
import com.equiprent.repository.RentalRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final RentalRepository rentalRepository;

    public EquipmentService(EquipmentRepository equipmentRepository, RentalRepository rentalRepository) {
        this.equipmentRepository = equipmentRepository;
        this.rentalRepository = rentalRepository;
    }

    public List<Equipment> getAllEquipment(Boolean onlyAvailable, String search, String category) {
        List<Equipment> list;

        if (Boolean.TRUE.equals(onlyAvailable)) {
            list = equipmentRepository.findByStatus(EquipmentStatus.AVAILABLE);
        } else {
            // Exclude REMOVED items from general list unless requested specifically
            list = equipmentRepository.findByStatusNot(EquipmentStatus.REMOVED);
        }

        return list.stream().filter(item -> {
            boolean matchesCat = (category == null || category.isEmpty() || category.equalsIgnoreCase("All") || item.getCategory().equalsIgnoreCase(category));
            
            String q = (search != null) ? search.trim().toLowerCase() : "";
            boolean matchesSearch = q.isEmpty() || (
                (item.getName() != null && item.getName().toLowerCase().contains(q)) ||
                (item.getCategory() != null && item.getCategory().toLowerCase().contains(q)) ||
                (item.getDescription() != null && item.getDescription().toLowerCase().contains(q))
            );

            return matchesCat && matchesSearch;
        }).collect(Collectors.toList());
    }

    public Equipment getEquipmentById(String id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
    }

    public Equipment createEquipment(Equipment equipment) {
        if (equipment.getName() == null || equipment.getName().trim().isEmpty()) {
            throw new BadRequestException("Equipment name is required");
        }
        if (equipment.getRentalRate() <= 0) {
            throw new BadRequestException("Rental rate must be positive");
        }
        if (equipment.getAdvanceAmount() < 0) {
            throw new BadRequestException("Advance amount cannot be negative");
        }
        if (equipment.getPrebookingWindowMinutes() <= 0) {
            equipment.setPrebookingWindowMinutes(30); // Default 30 mins
        }

        if (equipment.getId() == null || equipment.getId().isEmpty()) {
            equipment.setId("eq_" + System.currentTimeMillis());
        }
        if (equipment.getStatus() == null) {
            equipment.setStatus(EquipmentStatus.AVAILABLE);
        }
        if (equipment.getCreatedAt() == null) {
            equipment.setCreatedAt(java.time.Instant.now().toString());
        }

        return equipmentRepository.save(equipment);
    }

    public Equipment updateEquipment(String id, Equipment updates) {
        Equipment existing = getEquipmentById(id);

        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getImageUrl() != null) existing.setImageUrl(updates.getImageUrl());
        if (updates.getCondition() != null) existing.setCondition(updates.getCondition());
        if (updates.getRentalRate() > 0) existing.setRentalRate(updates.getRentalRate());
        if (updates.getAdvanceAmount() >= 0) existing.setAdvanceAmount(updates.getAdvanceAmount());
        if (updates.getInstructions() != null) existing.setInstructions(updates.getInstructions());
        if (updates.getPrebookingWindowMinutes() > 0) existing.setPrebookingWindowMinutes(updates.getPrebookingWindowMinutes());
        if (updates.getUpiQrUrl() != null) existing.setUpiQrUrl(updates.getUpiQrUrl());

        return equipmentRepository.save(existing);
    }

    public Equipment setEquipmentStatus(String id, EquipmentStatus newStatus) {
        Equipment existing = getEquipmentById(id);
        existing.setStatus(newStatus);
        return equipmentRepository.save(existing);
    }

    public Equipment releaseHold(String id) {
        Equipment existing = getEquipmentById(id);
        if (existing.getStatus() != EquipmentStatus.ON_HOLD) {
            throw new BadRequestException("Equipment is not currently ON_HOLD");
        }
        existing.setStatus(EquipmentStatus.AVAILABLE);
        return equipmentRepository.save(existing);
    }

    public Equipment removeEquipment(String id) {
        Equipment existing = getEquipmentById(id);
        // Soft removal: set status to REMOVED!
        existing.setStatus(EquipmentStatus.REMOVED);
        return equipmentRepository.save(existing);
    }

    // Helper: Date conflict check against BOOKED and ACTIVE rentals
    public boolean checkDateConflict(String equipmentId, String startDateStr, String endDateStr) {
        List<Rental> activeOrBookedRentals = rentalRepository.findByEquipmentIdAndStatusIn(
                equipmentId, List.of(RentalStatus.BOOKED, RentalStatus.ACTIVE)
        );

        try {
            LocalDate reqStart = LocalDate.parse(startDateStr);
            LocalDate reqEnd = LocalDate.parse(endDateStr);

            for (Rental rental : activeOrBookedRentals) {
                LocalDate rentStart = LocalDate.parse(rental.getStartDate());
                LocalDate rentEnd = LocalDate.parse(rental.getEndDate());

                // Overlap condition: reqStart <= rentEnd && reqEnd >= rentStart
                if (!reqStart.isAfter(rentEnd) && !reqEnd.isBefore(rentStart)) {
                    return true; // Conflict found
                }
            }
        } catch (DateTimeParseException e) {
            // Fallback string compare if dates are formatted non-standard
            for (Rental rental : activeOrBookedRentals) {
                if (startDateStr.compareTo(rental.getEndDate()) <= 0 && endDateStr.compareTo(rental.getStartDate()) >= 0) {
                    return true;
                }
            }
        }

        return false; // No conflict
    }
}
