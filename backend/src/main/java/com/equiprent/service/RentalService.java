package com.equiprent.service;

import com.equiprent.exception.BadRequestException;
import com.equiprent.exception.ResourceNotFoundException;
import com.equiprent.model.Equipment;
import com.equiprent.model.EquipmentStatus;
import com.equiprent.model.Rental;
import com.equiprent.model.RentalStatus;
import com.equiprent.repository.EquipmentRepository;
import com.equiprent.repository.RentalRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final EquipmentRepository equipmentRepository;

    public RentalService(RentalRepository rentalRepository, EquipmentRepository equipmentRepository) {
        this.rentalRepository = rentalRepository;
        this.equipmentRepository = equipmentRepository;
    }

    public List<Rental> getAllRentals(String customerId, String equipmentId) {
        if (customerId != null && !customerId.isEmpty()) {
            return rentalRepository.findByCustomerId(customerId);
        }
        if (equipmentId != null && !equipmentId.isEmpty()) {
            return rentalRepository.findByEquipmentId(equipmentId);
        }
        return rentalRepository.findAll();
    }

    public Rental getRentalById(String id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found with id: " + id));
    }

    public Rental activateRental(String rentalId) {
        Rental rental = getRentalById(rentalId);

        if (rental.getStatus() != RentalStatus.BOOKED) {
            throw new BadRequestException("Rental must be in BOOKED status to activate");
        }

        Equipment equipment = equipmentRepository.findById(rental.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));

        // Transition Rental: BOOKED -> ACTIVE
        rental.setStatus(RentalStatus.ACTIVE);
        rental.setActivatedAt(Instant.now().toString());

        // Transition Equipment: BOOKED -> ACTIVE
        equipment.setStatus(EquipmentStatus.ACTIVE);
        equipmentRepository.save(equipment);

        return rentalRepository.save(rental);
    }

    public Rental returnRental(String rentalId, String postReturnChoice) {
        Rental rental = getRentalById(rentalId);

        if (rental.getStatus() != RentalStatus.ACTIVE) {
            throw new BadRequestException("Rental must be in ACTIVE status to return");
        }

        Equipment equipment = equipmentRepository.findById(rental.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));

        // Transition Rental: ACTIVE -> RETURNED
        rental.setStatus(RentalStatus.RETURNED);
        rental.setReturnedAt(Instant.now().toString());

        // Apply Post-Return Choice to Equipment:
        // ADD_BACK -> AVAILABLE
        // HOLD -> ON_HOLD
        // REMOVE -> REMOVED (soft delete, history intact)
        EquipmentStatus nextEqStatus = EquipmentStatus.AVAILABLE;
        if ("HOLD".equalsIgnoreCase(postReturnChoice)) {
            nextEqStatus = EquipmentStatus.ON_HOLD;
        } else if ("REMOVE".equalsIgnoreCase(postReturnChoice)) {
            nextEqStatus = EquipmentStatus.REMOVED;
        }

        equipment.setStatus(nextEqStatus);
        equipmentRepository.save(equipment);

        return rentalRepository.save(rental);
    }
}
