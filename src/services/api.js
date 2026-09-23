import { INITIAL_EQUIPMENT, INITIAL_REQUESTS, INITIAL_RENTALS, MOCK_USERS } from '../mock/mockData';
import { EQUIPMENT_STATUS, REQUEST_STATUS, RENTAL_STATUS, PAYMENT_STATUS } from '../types/status';

const STORAGE_KEYS = {
  EQUIPMENT: 'equiprent_equipment',
  REQUESTS: 'equiprent_requests',
  RENTALS: 'equiprent_rentals',
};

// Internal state initialized from LocalStorage or mockData
const loadInitialData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load from storage', e);
  }
  return fallback;
};

let equipmentStore = loadInitialData(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
let requestsStore = loadInitialData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
let rentalsStore = loadInitialData(STORAGE_KEYS.RENTALS, INITIAL_RENTALS);

const listeners = new Set();

const persistAndNotify = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipmentStore));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requestsStore));
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentalsStore));
  } catch (e) {
    console.error('Failed to persist to storage', e);
  }
  listeners.forEach(cb => cb());
};

// Date overlap validation helper
// Standard interval overlap: (startA <= endB) && (endA >= startB)
export const checkDateConflict = (equipmentId, startDate, endDate, excludeRentalId = null) => {
  const reqStart = new Date(startDate).getTime();
  const reqEnd = new Date(endDate).getTime();

  // Find any existing rental for this equipment with status BOOKED or ACTIVE
  const conflictingRental = rentalsStore.find(rental => {
    if (rental.equipmentId !== equipmentId) return false;
    if (excludeRentalId && rental.id === excludeRentalId) return false;
    if (rental.status !== RENTAL_STATUS.BOOKED && rental.status !== RENTAL_STATUS.ACTIVE) return false;

    const rentStart = new Date(rental.startDate).getTime();
    const rentEnd = new Date(rental.endDate).getTime();

    return (reqStart <= rentEnd) && (reqEnd >= rentStart);
  });

  return {
    hasConflict: !!conflictingRental,
    conflictingRental,
  };
};

// Lazy evaluation of request expiries
const lazyEvaluateExpiries = () => {
  const now = Date.now();
  let changed = false;

  requestsStore = requestsStore.map(req => {
    if (req.status === REQUEST_STATUS.PENDING) {
      const expiresAtMs = new Date(req.expiresAt).getTime();
      // If expired and payment claim has NOT been submitted
      if (now > expiresAtMs && req.paymentStatus !== PAYMENT_STATUS.PAYMENT_SUBMITTED) {
        changed = true;
        return { ...req, status: REQUEST_STATUS.EXPIRED };
      }
    }
    return req;
  });

  if (changed) {
    persistAndNotify();
  }
};

export const api = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  // Users & Auth Mock
  async getCurrentUser(role = 'CUSTOMER') {
    return role === 'OWNER' ? MOCK_USERS.owner : MOCK_USERS.customer1;
  },

  // Equipment API
  async getEquipmentList({ search = '', category = '', onlyAvailable = false } = {}) {
    lazyEvaluateExpiries();
    return equipmentStore.filter(item => {
      // Marketplace constraint: MUST ONLY show equipment with status AVAILABLE
      if (onlyAvailable && item.status !== EQUIPMENT_STATUS.AVAILABLE) {
        return false;
      }
      
      // Never show REMOVED items in general customer search
      if (onlyAvailable && item.status === EQUIPMENT_STATUS.REMOVED) {
        return false;
      }

      const matchesCategory = !category || category === 'All' || item.category === category;

      const q = search.trim().toLowerCase();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );

      return matchesCategory && matchesSearch;
    });
  },

  async getEquipmentById(id) {
    lazyEvaluateExpiries();
    return equipmentStore.find(e => e.id === id) || null;
  },

  async createEquipment(data) {
    const newItem = {
      id: `eq_${Date.now()}`,
      ownerId: MOCK_USERS.owner.id,
      status: EQUIPMENT_STATUS.AVAILABLE,
      createdAt: new Date().toISOString(),
      ...data,
    };
    equipmentStore = [newItem, ...equipmentStore];
    persistAndNotify();
    return newItem;
  },

  async updateEquipment(id, updates) {
    equipmentStore = equipmentStore.map(item => item.id === id ? { ...item, ...updates } : item);
    persistAndNotify();
    return equipmentStore.find(item => item.id === id);
  },

  async setEquipmentStatus(id, newStatus) {
    equipmentStore = equipmentStore.map(item => item.id === id ? { ...item, status: newStatus } : item);
    persistAndNotify();
  },

  // Requests API
  async getRequests({ customerId, ownerId, status } = {}) {
    lazyEvaluateExpiries();
    return requestsStore.filter(req => {
      if (customerId && req.customerId !== customerId) return false;
      if (status && req.status !== status) return false;
      return true;
    });
  },

  async getRequestById(id) {
    lazyEvaluateExpiries();
    return requestsStore.find(r => r.id === id) || null;
  },

  async createRentalRequest({ equipmentId, customer, startDate, endDate }) {
    lazyEvaluateExpiries();
    const equipment = equipmentStore.find(e => e.id === equipmentId);
    if (!equipment) throw new Error('Equipment not found');

    if (equipment.status !== EQUIPMENT_STATUS.AVAILABLE) {
      return { success: false, error: 'Equipment is currently not available for rental.' };
    }

    // Date conflict check
    const { hasConflict, conflictingRental } = checkDateConflict(equipmentId, startDate, endDate);
    if (hasConflict) {
      return {
        success: false,
        error: `Date conflict: This equipment is already booked from ${conflictingRental.startDate} to ${conflictingRental.endDate}.`,
      };
    }

    // Calculate duration & pricing
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diffDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
    const totalAmount = (diffDays * equipment.rentalRate) + equipment.advanceAmount;

    // Calculate expiry
    const prebookingWindow = equipment.prebookingWindowMinutes || 30;
    const expiresAt = new Date(Date.now() + prebookingWindow * 60 * 1000).toISOString();

    const newRequest = {
      id: `req_${Date.now()}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      startDate,
      endDate,
      totalDays: diffDays,
      rentalRate: equipment.rentalRate,
      advanceAmount: equipment.advanceAmount,
      totalAmount,
      status: REQUEST_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    // PENDING REQUEST DOES NOT RESERVE OR BLOCK EQUIPMENT!
    // Equipment status remains AVAILABLE!
    requestsStore = [newRequest, ...requestsStore];
    persistAndNotify();

    return { success: true, request: newRequest };
  },

  async approveRentalRequest(requestId) {
    lazyEvaluateExpiries();
    const request = requestsStore.find(r => r.id === requestId);
    if (!request) return { success: false, error: 'Request not found.' };

    if (request.status === REQUEST_STATUS.EXPIRED) {
      return { success: false, error: 'Cannot approve request: Pre-booking window has expired.' };
    }

    if (request.status !== REQUEST_STATUS.PENDING) {
      return { success: false, error: `Request is already ${request.status}.` };
    }

    // Re-check date conflict immediately before approving!
    const { hasConflict, conflictingRental } = checkDateConflict(request.equipmentId, request.startDate, request.endDate);
    if (hasConflict) {
      return {
        success: false,
        error: `Cannot approve request! Equipment was booked for overlapping dates (${conflictingRental.startDate} to ${conflictingRental.endDate}) by another rental.`,
      };
    }

    const equipment = equipmentStore.find(e => e.id === request.equipmentId);
    if (!equipment) return { success: false, error: 'Equipment not found.' };

    // Update request status to APPROVED
    requestsStore = requestsStore.map(r => r.id === requestId ? { ...r, status: REQUEST_STATUS.APPROVED } : r);

    // Create new Rental record with status BOOKED
    const newRental = {
      id: `rent_${Date.now()}`,
      requestId: request.id,
      equipmentId: request.equipmentId,
      equipmentName: request.equipmentName,
      equipmentImage: equipment.imageUrl,
      customerId: request.customerId,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      startDate: request.startDate,
      endDate: request.endDate,
      totalDays: request.totalDays,
      totalAmount: request.totalAmount,
      status: RENTAL_STATUS.BOOKED,
      paymentStatus: request.paymentStatus,
      createdAt: new Date().toISOString(),
    };

    rentalsStore = [newRental, ...rentalsStore];

    // Transition equipment status to BOOKED
    equipmentStore = equipmentStore.map(e => e.id === request.equipmentId ? { ...e, status: EQUIPMENT_STATUS.BOOKED } : e);

    persistAndNotify();
    return { success: true, rental: newRental };
  },

  async rejectRentalRequest(requestId) {
    requestsStore = requestsStore.map(r => r.id === requestId ? { ...r, status: REQUEST_STATUS.REJECTED } : r);
    persistAndNotify();
    return { success: true };
  },

  async submitPaymentClaim(requestId) {
    // Transition payment state to PAYMENT_SUBMITTED
    requestsStore = requestsStore.map(r => r.id === requestId ? { ...r, paymentStatus: PAYMENT_STATUS.PAYMENT_SUBMITTED } : r);
    rentalsStore = rentalsStore.map(rent => rent.requestId === requestId ? { ...rent, paymentStatus: PAYMENT_STATUS.PAYMENT_SUBMITTED } : rent);
    persistAndNotify();
    return { success: true };
  },

  // Rentals API
  async getRentals({ customerId, equipmentId, status } = {}) {
    lazyEvaluateExpiries();
    return rentalsStore.filter(r => {
      if (customerId && r.customerId !== customerId) return false;
      if (equipmentId && r.equipmentId !== equipmentId) return false;
      if (status && r.status !== status) return false;
      return true;
    });
  },

  async getRentalById(id) {
    lazyEvaluateExpiries();
    return rentalsStore.find(r => r.id === id) || null;
  },

  async activateRental(rentalId) {
    const rental = rentalsStore.find(r => r.id === rentalId);
    if (!rental) return { success: false, error: 'Rental not found' };

    rentalsStore = rentalsStore.map(r => r.id === rentalId ? { ...r, status: RENTAL_STATUS.ACTIVE, activatedAt: new Date().toISOString() } : r);
    equipmentStore = equipmentStore.map(e => e.id === rental.equipmentId ? { ...e, status: EQUIPMENT_STATUS.ACTIVE } : e);

    persistAndNotify();
    return { success: true };
  },

  async returnRental(rentalId, postReturnChoice) {
    const rental = rentalsStore.find(r => r.id === rentalId);
    if (!rental) return { success: false, error: 'Rental not found' };

    // Mark rental status as RETURNED
    rentalsStore = rentalsStore.map(r => r.id === rentalId ? { ...r, status: RENTAL_STATUS.RETURNED, returnedAt: new Date().toISOString() } : r);

    // Apply Post-Return Choice to equipment:
    // ADD_BACK (green) -> AVAILABLE
    // HOLD (yellow) -> ON_HOLD
    // REMOVE (red) -> REMOVED (soft delete)
    let nextEqStatus = EQUIPMENT_STATUS.AVAILABLE;
    if (postReturnChoice === 'HOLD') nextEqStatus = EQUIPMENT_STATUS.ON_HOLD;
    if (postReturnChoice === 'REMOVE') nextEqStatus = EQUIPMENT_STATUS.REMOVED;

    equipmentStore = equipmentStore.map(e => e.id === rental.equipmentId ? { ...e, status: nextEqStatus } : e);

    persistAndNotify();
    return { success: true };
  },

  async releaseHold(equipmentId) {
    equipmentStore = equipmentStore.map(e => e.id === equipmentId ? { ...e, status: EQUIPMENT_STATUS.AVAILABLE } : e);
    persistAndNotify();
    return { success: true };
  },

  async removeEquipment(equipmentId) {
    // Soft delete rule: equipment status = REMOVED. Rental history preserved!
    equipmentStore = equipmentStore.map(e => e.id === equipmentId ? { ...e, status: EQUIPMENT_STATUS.REMOVED } : e);
    persistAndNotify();
    return { success: true };
  },

  async resetDataToDefaults() {
    equipmentStore = [...INITIAL_EQUIPMENT];
    requestsStore = [...INITIAL_REQUESTS];
    rentalsStore = [...INITIAL_RENTALS];
    persistAndNotify();
  }
};
