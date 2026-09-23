package com.equiprent.controller;

import com.equiprent.model.Rental;
import com.equiprent.model.RentalRequest;
import com.equiprent.service.RentalRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rental-requests")
public class RentalRequestController {

    private final RentalRequestService rentalRequestService;

    public RentalRequestController(RentalRequestService rentalRequestService) {
        this.rentalRequestService = rentalRequestService;
    }

    @GetMapping
    public ResponseEntity<List<RentalRequest>> getAllRequests(@RequestParam(required = false) String customerId) {
        List<RentalRequest> requests = rentalRequestService.getAllRequests(customerId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalRequest> getRequestById(@PathVariable String id) {
        RentalRequest request = rentalRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRentalRequest(@RequestBody RentalRequest requestInput) {
        RentalRequest created = rentalRequestService.createRentalRequest(requestInput, null);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("request", created);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveRequestPost(@PathVariable String id) {
        Rental rental = rentalRequestService.approveRequest(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rental", rental);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveRequestPut(@PathVariable String id) {
        Rental rental = rentalRequestService.approveRequest(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rental", rental);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectRequestPost(@PathVariable String id) {
        RentalRequest rejected = rentalRequestService.rejectRequest(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("request", rejected);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectRequestPut(@PathVariable String id) {
        RentalRequest rejected = rentalRequestService.rejectRequest(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("request", rejected);
        return ResponseEntity.ok(response);
    }
}
