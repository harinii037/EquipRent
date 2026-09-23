# EquipRent

## Equipment Rental Management System

EquipRent is a web-based Equipment Rental Management System developed for BIZ HACK’26. It enables customers to discover equipment, submit date-based rental requests, and track rentals, while allowing owners to manage equipment, approve requests, track rental lifecycle, and handle equipment after return.

---

## Problem Statement

Equipment rentals are often managed through informal communication and manual processes, making it difficult to:

- Discover available equipment efficiently
- Check availability for specific rental dates
- Manage rental requests and approvals
- Track the rental lifecycle
- Handle equipment after it is returned
- Maintain rental history

EquipRent provides a structured platform to manage these activities through a single system.

---

## Proposed Solution

EquipRent connects equipment owners and customers through a centralized rental management platform.

### Customers can:

- Register and log in
- Browse available equipment
- Search equipment by name, category, or description
- View equipment details and rental pricing
- Select rental dates
- Submit rental requests
- Submit payment claims through the owner's UPI QR
- Track rental status and history

### Owners can:

- Add and manage equipment listings
- Set rental rates and advance amounts
- Specify equipment condition and usage instructions
- Upload equipment images and UPI QR codes
- Define a prebooking window
- Review and approve or reject rental requests
- Track active and completed rentals
- Manage returned equipment

---

## Key Features

- User authentication
- Equipment listing and management
- Equipment search
- Date-based availability checking
- Rental request management
- Owner approval and rejection
- Rental lifecycle tracking
- Prebooking window and request expiry
- UPI payment claim workflow
- Equipment post-return management
- Rental history preservation
- Responsive user interface

---

## Rental Workflow

```text
Customer discovers equipment
          ↓
Selects rental dates
          ↓
Availability checked
          ↓
Rental request submitted
          ↓
PENDING
          ↓
Owner reviews request
          ↓
Conflict re-check
          ↓
Owner approves
          ↓
BOOKED
          ↓
ACTIVE
          ↓
RETURNED
          ↓
Owner manages equipment
   ┌──────┼──────┐
   ↓      ↓      ↓
Add Back Hold   Remove
   ↓      ↓      ↓
Available On Hold Removed


Request Expiry

Each owner can define a prebooking window for rental requests.

When a customer submits a request:

expiresAt = createdAt + prebookingWindow

```

If the customer does not submit the payment claim before the expiry time:

```text
PENDING → EXPIRED
```

Expired requests:

* Do not create a rental
* Do not reserve the equipment
* Cannot be approved by the owner

---

## Equipment Status

| Status    | Description                                 |
| --------- | ------------------------------------------- |
| AVAILABLE | Equipment is available for rental           |
| BOOKED    | Equipment has an approved upcoming rental   |
| ACTIVE    | Equipment is currently being rented         |
| ON_HOLD   | Equipment is temporarily unavailable        |
| REMOVED   | Equipment is no longer available for rental |

---

## Request Status

| Status   | Description                         |
| -------- | ----------------------------------- |
| PENDING  | Request is waiting for owner action |
| APPROVED | Owner has approved the request      |
| REJECTED | Owner has rejected the request      |
| EXPIRED  | Request expired before completion   |

---

## Rental Status

| Status   | Description                            |
| -------- | -------------------------------------- |
| BOOKED   | Rental has been approved and scheduled |
| ACTIVE   | Rental is currently in progress        |
| RETURNED | Equipment has been returned            |

---

## Post-Return Equipment Management

After an equipment item is returned, the owner can choose:

### Add Back

Equipment becomes:

```text
AVAILABLE
```

and is visible for new rentals.

### Hold

Equipment becomes:

```text
ON_HOLD
```

and is hidden from customers until the owner releases the hold.

### Remove

Equipment becomes:

```text
REMOVED
```

and is hidden from new rentals.

Rental history is preserved even when equipment is removed.

---

## Payment Workflow

EquipRent uses a UPI QR based payment claim workflow.

```text
Owner uploads UPI QR
        ↓
Customer views QR
        ↓
Customer pays externally
        ↓
Customer clicks "I've Paid"
        ↓
PAYMENT_SUBMITTED
```

The system does not automatically verify the payment or mark it as successful.

---

## Technology Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Frontend        | React, Vite, Tailwind CSS |
| Backend         | Java, Spring Boot         |
| Database        | PostgreSQL                |
| Authentication  | Spring Security / JWT     |
| API             | REST                      |
| Icons           | Lucide React              |
| Version Control | Git, GitHub               |
| API Testing     | Postman                   |
| IDE             | VS Code                   |

---

## System Architecture

```text
                ┌─────────────────────┐
                │      Customer       │
                └──────────┬──────────┘
                           │
                           │
                ┌──────────▼──────────┐
                │     React / Vite    │
                │      Frontend       │
                └──────────┬──────────┘
                           │ REST API
                           │
                ┌──────────▼──────────┐
                │   Spring Boot API   │
                │       Backend       │
                └──────────┬──────────┘
                           │
                ┌──────────▼──────────┐
                │     PostgreSQL      │
                │       Database      │
                └─────────────────────┘
                           ▲
                           │
                ┌──────────┴──────────┐
                │        Owner        │
                │ Equipment Management│
                └─────────────────────┘
```

---

## Project Structure

```text
EquipRent/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── public/
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Screenshots

### Customer Login

![Customer Login](screenshots/customer-login.png)

### Marketplace

![Marketplace](screenshots/marketplace.png)

### Equipment Details

![Equipment Details](screenshots/equipment-details.png)

### My Rentals

![My Rentals](screenshots/my-rentals.png)

### Rental Details

![Rental Details](screenshots/rental-details.png)

### Owner Dashboard

![Owner Dashboard](screenshots/owner-dashboard.png)

### Add Equipment

![Add Equipment](screenshots/add-equipment.png)

### My Equipment

![My Equipment](screenshots/my-equipment.png)

### Rental Requests

![Rental Requests](screenshots/rental-requests.png)

### Owner Rental Detail

![Owner Rental Detail](screenshots/owner-rental-detail.png)

### Rental History

![Rental History](screenshots/rental-history.png)

---

## Database Design

The system is designed around the following major entities:

* User
* Equipment
* RentalRequest
* Rental
* Payment

The rental history is preserved to maintain a record of completed and past rentals.

---

## Business Rules

* Pending requests do not reserve equipment.
* Multiple overlapping pending requests can exist for the same equipment.
* Equipment becomes BOOKED only after owner approval.
* Availability is rechecked before approval.
* Overlapping BOOKED or ACTIVE rentals are not allowed.
* Expired requests cannot be approved.
* Removed equipment remains available in rental history.
* Payment claims are recorded as submitted and are not automatically verified.

---

## Setup and Installation

### Prerequisites

Make sure the following are installed:

* Node.js and npm
* Java 17 or higher
* PostgreSQL
* Maven
* Git

### Clone the Repository

```bash
git clone https://github.com/harinii037/EquipRent.git
cd EquipRent
```

### Database Setup

Create a PostgreSQL database named:

```text
equiprent
```

Configure the following environment variables:

```text
DB_URL=jdbc:postgresql://localhost:5432/equiprent
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Run the Frontend

From the project root:

```bash
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Modules

The backend provides REST APIs for:

* Authentication
* User management
* Equipment management
* Rental requests
* Rentals
* Payments
* Equipment lifecycle management

---

## Validation and Business Logic

The system validates:

* Equipment availability
* Rental date conflicts
* Request expiry
* Owner approval
* Rental lifecycle transitions
* Equipment status transitions
* Payment claim submission

---

## Team

| Member          | Role                 |
| --------------- | -------------------- |
| Harini V        | Backend & Core Logic |
| Shaziya Fathima S F | Frontend & UI/UX     |

---

## Hackathon

**Event:** BIZ HACK’26
**Problem Statement:** PS68 – Equipment Rental Management System

---

## Repository

GitHub Repository:

[https://github.com/harinii037/EquipRent](https://github.com/harinii037/EquipRent)

---

## Project Summary

EquipRent provides a structured solution for managing equipment rentals by connecting customers and equipment owners through date-based discovery, rental requests, owner approval, payment claims, rental lifecycle tracking, and post-return equipment management.

```

