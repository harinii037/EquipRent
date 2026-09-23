package com.equiprent.controller;

import com.equiprent.model.Equipment;
import com.equiprent.model.EquipmentStatus;
import com.equiprent.service.EquipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment(
            @RequestParam(required = false) Boolean onlyAvailable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<Equipment> items = equipmentService.getAllEquipment(onlyAvailable, search, category);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable String id) {
        Equipment item = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<Equipment> createEquipment(@RequestBody Equipment equipment) {
        Equipment created = equipmentService.createEquipment(equipment);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable String id, @RequestBody Equipment updates) {
        Equipment updated = equipmentService.updateEquipment(id, updates);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Equipment> setStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        EquipmentStatus status = EquipmentStatus.valueOf(statusStr.toUpperCase());
        Equipment updated = equipmentService.setEquipmentStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/release-hold")
    public ResponseEntity<Equipment> releaseHoldPost(@PathVariable String id) {
        Equipment updated = equipmentService.releaseHold(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/release-hold")
    public ResponseEntity<Equipment> releaseHoldPut(@PathVariable String id) {
        Equipment updated = equipmentService.releaseHold(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Equipment> removeEquipment(@PathVariable String id) {
        Equipment removed = equipmentService.removeEquipment(id);
        return ResponseEntity.ok(removed);
    }

    @PostMapping("/{id}/remove")
    public ResponseEntity<Equipment> removeEquipmentPost(@PathVariable String id) {
        Equipment removed = equipmentService.removeEquipment(id);
        return ResponseEntity.ok(removed);
    }
}
