package com.equiprent.repository;

import com.equiprent.model.Rental;
import com.equiprent.model.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, String> {
    List<Rental> findByCustomerId(String customerId);
    List<Rental> findByEquipmentId(String equipmentId);
    List<Rental> findByEquipmentIdAndStatusIn(String equipmentId, List<RentalStatus> statuses);
    List<Rental> findByStatus(RentalStatus status);
}
