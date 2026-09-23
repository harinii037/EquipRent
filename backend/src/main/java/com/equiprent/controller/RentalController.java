package com.equiprent.controller;

import com.equiprent.model.Rental;
import com.equiprent.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals(
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String equipmentId) {
        List<Rental> rentals = rentalService.getAllRentals(customerId, equipmentId);
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable String id) {
        Rental rental = rentalService.getRentalById(id);
        return ResponseEntity.ok(rental);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activateRentalPost(@PathVariable String id) {
        Rental activated = rentalService.activateRental(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rental", activated);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activateRentalPut(@PathVariable String id) {
        Rental activated = rentalService.activateRental(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rental", activated);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Map<String, Object>> returnRentalPost(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String choice = (body != null && body.containsKey("postReturnChoice")) ? body.get("postReturnChoice") : "ADD_BACK";
        Rental returned = rentalService.returnRental(id, choice);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rental", returned);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<Map<String, Object>> returnRentalPut(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String choice = (body != null && body.containsKey("postReturnChoice")) ? body.get("postReturnChoice") : "ADD_BACK";
        Rental returned = rentalService.returnRental(id, choice);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("rental", returned);
        return ResponseEntity.ok(response);
    }
}
