package com.equiprent.repository;

import com.equiprent.model.Equipment;
import com.equiprent.model.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, String> {
    List<Equipment> findByStatus(EquipmentStatus status);
    List<Equipment> findByOwnerId(String ownerId);
    List<Equipment> findByStatusNot(EquipmentStatus status);
}
