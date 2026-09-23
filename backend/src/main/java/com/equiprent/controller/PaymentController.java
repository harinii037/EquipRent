package com.equiprent.controller;

import com.equiprent.model.Payment;
import com.equiprent.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/claim")
    public ResponseEntity<Map<String, Object>> submitPaymentClaim(@RequestBody Map<String, String> body) {
        String requestId = body.get("requestId");
        String transactionRef = body.get("transactionReference");

        Payment payment = paymentService.submitPaymentClaim(requestId, transactionRef);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("payment", payment);
        return ResponseEntity.ok(response);
    }
}
