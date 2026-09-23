import { INITIAL_EQUIPMENT, INITIAL_REQUESTS, INITIAL_RENTALS, MOCK_USERS } from '../mock/mockData';
import { EQUIPMENT_STATUS, REQUEST_STATUS, RENTAL_STATUS, PAYMENT_STATUS } from '../types/status';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const listeners = new Set();
let cachedRentals = [...INITIAL_RENTALS];

const notifyListeners = () => {
  listeners.forEach(cb => cb());
};

// Generic HTTP fetch wrapper connecting to Spring Boot backend
async function http(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`Backend API call to [${options.method || 'GET'}] ${endpoint} failed. Error:`, err);
    throw err;
  }
}

// Client-side Date Overlap Helper for DateRangePicker preview
export const checkDateConflict = (equipmentId, startDate, endDate, excludeRentalId = null) => {
  if (!startDate || !endDate) return { hasConflict: false };
  const reqStart = new Date(startDate).getTime();
  const reqEnd = new Date(endDate).getTime();

  const conflictingRental = cachedRentals.find(rental => {
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

export const api = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  // AUTH API
  async register(user) {
    try {
      const res = await http('/auth/register', {
        method: 'POST',
        body: JSON.stringify(user),
      });
      notifyListeners();
      return res;
    } catch (e) {
      // Offline fallback
      const newUser = { id: `user_${Date.now()}`, ...user };
      notifyListeners();
      return newUser;
    }
  },

  async login(email, password) {
    try {
      const res = await http('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      notifyListeners();
      return res;
    } catch (e) {
      // Offline fallback
      return email.includes('owner') ? MOCK_USERS.owner : MOCK_USERS.customer1;
    }
  },

  async getCurrentUser(role = 'CUSTOMER') {
    try {
      const saved = localStorage.getItem('equiprent_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return role === 'OWNER' ? MOCK_USERS.owner : MOCK_USERS.customer1;
  },

  // EQUIPMENT API
  async getEquipmentList({ search = '', category = '', onlyAvailable = false } = {}) {
    try {
      const params = new URLSearchParams();
      if (onlyAvailable) params.append('onlyAvailable', 'true');
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await http(`/equipment${queryStr}`);
    } catch (e) {
      // Offline Fallback
      return INITIAL_EQUIPMENT.filter(item => {
        if (onlyAvailable && item.status !== EQUIPMENT_STATUS.AVAILABLE) return false;
        if (category && category !== 'All' && item.category !== category) return false;
        if (search) {
          const q = search.toLowerCase();
          return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        }
        return true;
      });
    }
  },

  async getEquipmentById(id) {
    try {
      return await http(`/equipment/${id}`);
    } catch (e) {
      return INITIAL_EQUIPMENT.find(item => item.id === id) || null;
    }
  },

  async createEquipment(data) {
    try {
      const res = await http('/equipment', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      notifyListeners();
      return res;
    } catch (e) {
      const newItem = { id: `eq_${Date.now()}`, status: EQUIPMENT_STATUS.AVAILABLE, ...data };
      notifyListeners();
      return newItem;
    }
  },

  async updateEquipment(id, updates) {
    try {
      const res = await http(`/equipment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      notifyListeners();
      return res;
    } catch (e) {
      notifyListeners();
      return { id, ...updates };
    }
  },

  async setEquipmentStatus(id, newStatus) {
    try {
      const res = await http(`/equipment/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      notifyListeners();
      return res;
    } catch (e) {
      notifyListeners();
    }
  },

  async releaseHold(id) {
    try {
      const res = await http(`/equipment/${id}/release-hold`, {
        method: 'POST',
      });
      notifyListeners();
      return res;
    } catch (e) {
      notifyListeners();
    }
  },

  async removeEquipment(id) {
    try {
      const res = await http(`/equipment/${id}/remove`, {
        method: 'POST',
      });
      notifyListeners();
      return res;
    } catch (e) {
      notifyListeners();
    }
  },

  // REQUESTS API
  async getRequests({ customerId, ownerId, status } = {}) {
    try {
      const params = new URLSearchParams();
      if (customerId) params.append('customerId', customerId);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await http(`/rental-requests${queryStr}`);
    } catch (e) {
      return INITIAL_REQUESTS;
    }
  },

  async getRequestById(id) {
    try {
      return await http(`/rental-requests/${id}`);
    } catch (e) {
      return INITIAL_REQUESTS.find(r => r.id === id) || null;
    }
  },

  async createRentalRequest({ equipmentId, customer, startDate, endDate }) {
    try {
      const payload = {
        equipmentId,
        customerId: customer?.id || 'user_cust_1',
        customerName: customer?.name || 'Alice Smith',
        customerEmail: customer?.email || 'customer@equiprent.com',
        startDate,
        endDate,
      };
      const res = await http('/rental-requests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      notifyListeners();
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async approveRentalRequest(requestId) {
    try {
      const res = await http(`/rental-requests/${requestId}/approve`, {
        method: 'POST',
      });
      notifyListeners();
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async rejectRentalRequest(requestId) {
    try {
      const res = await http(`/rental-requests/${requestId}/reject`, {
        method: 'POST',
      });
      notifyListeners();
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async submitPaymentClaim(requestId) {
    try {
      const res = await http('/payments/claim', {
        method: 'POST',
        body: JSON.stringify({ requestId }),
      });
      notifyListeners();
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // RENTALS API
  async getRentals({ customerId, equipmentId, status } = {}) {
    try {
      const params = new URLSearchParams();
      if (customerId) params.append('customerId', customerId);
      if (equipmentId) params.append('equipmentId', equipmentId);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const list = await http(`/rentals${queryStr}`);
      cachedRentals = list;
      return list;
    } catch (e) {
      return INITIAL_RENTALS;
    }
  },

  async getRentalById(id) {
    try {
      return await http(`/rentals/${id}`);
    } catch (e) {
      return INITIAL_RENTALS.find(r => r.id === id) || null;
    }
  },

  async activateRental(rentalId) {
    try {
      const res = await http(`/rentals/${rentalId}/activate`, {
        method: 'POST',
      });
      notifyListeners();
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async returnRental(rentalId, postReturnChoice) {
    try {
      const res = await http(`/rentals/${rentalId}/return`, {
        method: 'POST',
        body: JSON.stringify({ postReturnChoice }),
      });
      notifyListeners();
      return res;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async resetDataToDefaults() {
    notifyListeners();
  }
};
