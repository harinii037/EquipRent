package com.equiprent.repository;

import com.equiprent.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByRequestId(String requestId);
    Optional<Payment> findByRentalId(String rentalId);
}
