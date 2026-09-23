package com.equiprent.config;

import com.equiprent.model.*;
import com.equiprent.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final RentalRepository rentalRepository;

    public DataInitializer(UserRepository userRepository,
                           EquipmentRepository equipmentRepository,
                           RentalRequestRepository rentalRequestRepository,
                           RentalRepository rentalRepository) {
        this.userRepository = userRepository;
        this.equipmentRepository = equipmentRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.rentalRepository = rentalRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Owner User
            User owner = new User(
                    "user_owner_1",
                    "Robert Jenkins",
                    "owner@equiprent.com",
                    "password",
                    UserRole.OWNER,
                    "+1 (555) 234-5678",
                    "robert@upi",
                    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80"
            );
            userRepository.save(owner);

            // Customer User 1
            User cust1 = new User(
                    "user_cust_1",
                    "Alice Smith",
                    "customer@equiprent.com",
                    "password",
                    UserRole.CUSTOMER,
                    "+1 (555) 876-5432",
                    null,
                    null
            );
            userRepository.save(cust1);

            // Customer User 2
            User cust2 = new User(
                    "user_cust_2",
                    "David Miller",
                    "david@example.com",
                    "password",
                    UserRole.CUSTOMER,
                    "+1 (555) 987-6543",
                    null,
                    null
            );
            userRepository.save(cust2);

            // Initial Equipment
            Equipment eq1 = new Equipment();
            eq1.setId("eq_1");
            eq1.setOwnerId("user_owner_1");
            eq1.setName("DeWalt 20V MAX Cordless Drill Combo Kit");
            eq1.setCategory("Power Tools");
            eq1.setDescription("Heavy duty impact driver and drill set with 2 Ah lithium ion batteries, rapid charger, and tough carrying bag. Excellent for framing, woodworking, and home masonry.");
            eq1.setImageUrl("https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80");
            eq1.setCondition("Excellent");
            eq1.setRentalRate(25.0);
            eq1.setAdvanceAmount(50.0);
            eq1.setInstructions("Always wear eye protection. Charge batteries fully before returning. Do not expose charger to rain.");
            eq1.setPrebookingWindowMinutes(30);
            eq1.setUpiQrUrl("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80");
            eq1.setStatus(EquipmentStatus.AVAILABLE);
            eq1.setCreatedAt("2026-09-01T09:00:00.000Z");
            equipmentRepository.save(eq1);

            Equipment eq2 = new Equipment();
            eq2.setId("eq_2");
            eq2.setOwnerId("user_owner_1");
            eq2.setName("Honda 3000W Super Quiet Inverter Generator");
            eq2.setCategory("Heavy Machinery");
            eq2.setDescription("Fuel efficient and whisper quiet (50-57 dBA). Ideal for jobsite power, outdoors, tailgating, and emergency home backup power.");
            eq2.setImageUrl("https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&auto=format&fit=crop&q=80");
            eq2.setCondition("Good");
            eq2.setRentalRate(65.0);
            eq2.setAdvanceAmount(120.0);
            eq2.setInstructions("Operate outdoors in well ventilated space only. Return with full tank of unleaded gasoline (91 octane).");
            eq2.setPrebookingWindowMinutes(60);
            eq2.setUpiQrUrl("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80");
            eq2.setStatus(EquipmentStatus.AVAILABLE);
            eq2.setCreatedAt("2026-09-05T14:30:00.000Z");
            equipmentRepository.save(eq2);

            Equipment eq3 = new Equipment();
            eq3.setId("eq_3");
            eq3.setOwnerId("user_owner_1");
            eq3.setName("Sony FX3 Full-Frame Cinema Camera Kit");
            eq3.setCategory("Audio/Visual");
            eq3.setDescription("Compact 4K cinema camera with XLR audio handle, 2x 160GB CFexpress cards, 3x batteries, and 24-70mm f/2.8 GM lens.");
            eq3.setImageUrl("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80");
            eq3.setCondition("Like New");
            eq3.setRentalRate(110.0);
            eq3.setAdvanceAmount(300.0);
            eq3.setInstructions("Handle with extreme care. Keep sensor cap on when swapping lenses. Inspect lens glass before and after use.");
            eq3.setPrebookingWindowMinutes(45);
            eq3.setUpiQrUrl("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80");
            eq3.setStatus(EquipmentStatus.BOOKED);
            eq3.setCreatedAt("2026-09-10T11:15:00.000Z");
            equipmentRepository.save(eq3);

            Equipment eq4 = new Equipment();
            eq4.setId("eq_4");
            eq4.setOwnerId("user_owner_1");
            eq4.setName("Stihl Professional Gasoline Chainsaw 20\"");
            eq4.setCategory("Power Tools");
            eq4.setDescription("High performance 50cc gas chainsaw designed for heavy wood cutting, tree felling, and firewood prep.");
            eq4.setImageUrl("https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80");
            eq4.setCondition("Good");
            eq4.setRentalRate(40.0);
            eq4.setAdvanceAmount(80.0);
            eq4.setInstructions("Requires 50:1 2-stroke oil mix. Always engage chain brake when idle. Safety chaps and helmet required.");
            eq4.setPrebookingWindowMinutes(30);
            eq4.setUpiQrUrl("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80");
            eq4.setStatus(EquipmentStatus.ACTIVE);
            eq4.setCreatedAt("2026-09-12T16:00:00.000Z");
            equipmentRepository.save(eq4);

            Equipment eq5 = new Equipment();
            eq5.setId("eq_5");
            eq5.setOwnerId("user_owner_1");
            eq5.setName("Bosch Professional Rotary Hammer Drill");
            eq5.setCategory("Power Tools");
            eq5.setDescription("SDS-Plus heavy duty concrete breaker and rotary hammer for demolition and core drilling in solid masonry.");
            eq5.setImageUrl("https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&auto=format&fit=crop&q=80");
            eq5.setCondition("Fair");
            eq5.setRentalRate(30.0);
            eq5.setAdvanceAmount(60.0);
            eq5.setInstructions("Use chisel lube grease on shank. Do not force tool — let hammer weight do the work.");
            eq5.setPrebookingWindowMinutes(30);
            eq5.setUpiQrUrl("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80");
            eq5.setStatus(EquipmentStatus.ON_HOLD);
            eq5.setCreatedAt("2026-09-14T08:20:00.000Z");
            equipmentRepository.save(eq5);

            // Initial Rental Requests
            RentalRequest req1 = new RentalRequest();
            req1.setId("req_101");
            req1.setEquipmentId("eq_1");
            req1.setEquipmentName("DeWalt 20V MAX Cordless Drill Combo Kit");
            req1.setCustomerId("user_cust_1");
            req1.setCustomerName("Alice Smith");
            req1.setCustomerEmail("customer@equiprent.com");
            req1.setStartDate("2026-09-26");
            req1.setEndDate("2026-09-28");
            req1.setTotalDays(3);
            req1.setRentalRate(25.0);
            req1.setAdvanceAmount(50.0);
            req1.setTotalAmount(125.0);
            req1.setStatus(RequestStatus.PENDING);
            req1.setPaymentStatus(PaymentStatus.UNPAID);
            req1.setCreatedAt(java.time.Instant.now().minusSeconds(600).toString());
            req1.setExpiresAt(java.time.Instant.now().plusSeconds(1800).toString());
            rentalRequestRepository.save(req1);

            RentalRequest req2 = new RentalRequest();
            req2.setId("req_102");
            req2.setEquipmentId("eq_2");
            req2.setEquipmentName("Honda 3000W Super Quiet Inverter Generator");
            req2.setCustomerId("user_cust_2");
            req2.setCustomerName("David Miller");
            req2.setCustomerEmail("david@example.com");
            req2.setStartDate("2026-10-01");
            req2.setEndDate("2026-10-05");
            req2.setTotalDays(5);
            req2.setRentalRate(65.0);
            req2.setAdvanceAmount(120.0);
            req2.setTotalAmount(445.0);
            req2.setStatus(RequestStatus.PENDING);
            req2.setPaymentStatus(PaymentStatus.PAYMENT_SUBMITTED);
            req2.setCreatedAt(java.time.Instant.now().minusSeconds(300).toString());
            req2.setExpiresAt(java.time.Instant.now().plusSeconds(3300).toString());
            rentalRequestRepository.save(req2);

            // Initial Rentals
            Rental rent1 = new Rental();
            rent1.setId("rent_201");
            rent1.setRequestId("req_103");
            rent1.setEquipmentId("eq_3");
            rent1.setEquipmentName("Sony FX3 Full-Frame Cinema Camera Kit");
            rent1.setEquipmentImage("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80");
            rent1.setCustomerId("user_cust_1");
            rent1.setCustomerName("Alice Smith");
            rent1.setCustomerEmail("customer@equiprent.com");
            rent1.setCustomerPhone("+1 (555) 876-5432");
            rent1.setStartDate("2026-09-24");
            rent1.setEndDate("2026-09-27");
            rent1.setTotalDays(4);
            rent1.setTotalAmount(740.0);
            rent1.setStatus(RentalStatus.BOOKED);
            rent1.setPaymentStatus(PaymentStatus.PAYMENT_SUBMITTED);
            rent1.setCreatedAt("2026-09-22T10:15:00.000Z");
            rentalRepository.save(rent1);

            Rental rent2 = new Rental();
            rent2.setId("rent_202");
            rent2.setRequestId("req_099");
            rent2.setEquipmentId("eq_4");
            rent2.setEquipmentName("Stihl Professional Gasoline Chainsaw 20\"");
            rent2.setEquipmentImage("https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80");
            rent2.setCustomerId("user_cust_2");
            rent2.setCustomerName("David Miller");
            rent2.setCustomerEmail("david@example.com");
            rent2.setCustomerPhone("+1 (555) 987-6543");
            rent2.setStartDate("2026-09-20");
            rent2.setEndDate("2026-09-25");
            rent2.setTotalDays(6);
            rent2.setTotalAmount(320.0);
            rent2.setStatus(RentalStatus.ACTIVE);
            rent2.setPaymentStatus(PaymentStatus.PAYMENT_SUBMITTED);
            rent2.setCreatedAt("2026-09-19T14:00:00.000Z");
            rent2.setActivatedAt("2026-09-20T08:30:00.000Z");
            rentalRepository.save(rent2);
        }
    }
}
