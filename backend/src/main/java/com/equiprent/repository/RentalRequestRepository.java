package com.equiprent.repository;

import com.equiprent.model.RentalRequest;
import com.equiprent.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RentalRequestRepository extends JpaRepository<RentalRequest, String> {
    List<RentalRequest> findByCustomerId(String customerId);
    List<RentalRequest> findByEquipmentId(String equipmentId);
    List<RentalRequest> findByStatus(RequestStatus status);
}
