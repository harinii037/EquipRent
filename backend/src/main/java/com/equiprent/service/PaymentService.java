package com.equiprent.service;

import com.equiprent.exception.ResourceNotFoundException;
import com.equiprent.model.Payment;
import com.equiprent.model.PaymentStatus;
import com.equiprent.model.Rental;
import com.equiprent.model.RentalRequest;
import com.equiprent.repository.PaymentRepository;
import com.equiprent.repository.RentalRepository;
import com.equiprent.repository.RentalRequestRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final RentalRepository rentalRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          RentalRequestRepository rentalRequestRepository,
                          RentalRepository rentalRepository) {
        this.paymentRepository = paymentRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.rentalRepository = rentalRepository;
    }

    public Payment submitPaymentClaim(String requestId, String transactionReference) {
        RentalRequest request = rentalRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental request not found: " + requestId));

        // Mark Request payment status as PAYMENT_SUBMITTED
        request.setPaymentStatus(PaymentStatus.PAYMENT_SUBMITTED);
        rentalRequestRepository.save(request);

        // Mark associated Rental if created
        Optional<Rental> rentalOpt = rentalRepository.findAll().stream()
                .filter(r -> r.getRequestId().equals(requestId))
                .findFirst();

        String rentalId = null;
        if (rentalOpt.isPresent()) {
            Rental rental = rentalOpt.get();
            rental.setPaymentStatus(PaymentStatus.PAYMENT_SUBMITTED);
            rentalRepository.save(rental);
            rentalId = rental.getId();
        }

        // Record Payment claim
        Payment payment = new Payment();
        payment.setId("pay_" + System.currentTimeMillis());
        payment.setRequestId(requestId);
        payment.setRentalId(rentalId);
        payment.setAmount(request.getTotalAmount());
        payment.setStatus(PaymentStatus.PAYMENT_SUBMITTED);
        payment.setTransactionReference(transactionReference != null ? transactionReference : "UPI_CLAIM_" + System.currentTimeMillis());
        payment.setCreatedAt(Instant.now().toString());

        return paymentRepository.save(payment);
    }
}
