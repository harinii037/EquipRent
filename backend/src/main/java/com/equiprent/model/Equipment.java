package com.equiprent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment")
public class Equipment {
    @Id
    private String id;

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private String condition;
    private double rentalRate;
    private double advanceAmount;
    private String pricingBasis;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private int prebookingWindowMinutes;

    @Column(columnDefinition = "TEXT")
    private String upiQrUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status;

    private String createdAt;

    public Equipment() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public double getRentalRate() { return rentalRate; }
    public void setRentalRate(double rentalRate) { this.rentalRate = rentalRate; }

    public double getAdvanceAmount() { return advanceAmount; }
    public void setAdvanceAmount(double advanceAmount) { this.advanceAmount = advanceAmount; }

    public String getPricingBasis() { return pricingBasis; }
    public void setPricingBasis(String pricingBasis) { this.pricingBasis = pricingBasis; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public int getPrebookingWindowMinutes() { return prebookingWindowMinutes; }
    public void setPrebookingWindowMinutes(int prebookingWindowMinutes) { this.prebookingWindowMinutes = prebookingWindowMinutes; }

    public String getUpiQrUrl() { return upiQrUrl; }
    public void setUpiQrUrl(String upiQrUrl) { this.upiQrUrl = upiQrUrl; }

    public EquipmentStatus getStatus() { return status; }
    public void setStatus(EquipmentStatus status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
