export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

export const RENTAL_STATUS = {
  BOOKED: 'BOOKED',
  ACTIVE: 'ACTIVE',
  RETURNED: 'RETURNED',
};

export const EQUIPMENT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  REMOVED: 'REMOVED',
};

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAYMENT_SUBMITTED: 'PAYMENT_SUBMITTED',
};

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  OWNER: 'OWNER',
};

// Status styling & badges definitions
export const STATUS_CONFIG = {
  // Equipment
  [EQUIPMENT_STATUS.AVAILABLE]: { label: 'Available', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', dot: 'bg-[#16A34A]' },
  [EQUIPMENT_STATUS.BOOKED]: { label: 'Booked', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-600' },
  [EQUIPMENT_STATUS.ACTIVE]: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-600' },
  [EQUIPMENT_STATUS.ON_HOLD]: { label: 'On Hold', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-[#EAB308]' },
  [EQUIPMENT_STATUS.REMOVED]: { label: 'Removed', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', dot: 'bg-[#DC2626]' },

  // Request
  [REQUEST_STATUS.PENDING]: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-[#EAB308]' },
  [REQUEST_STATUS.APPROVED]: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', dot: 'bg-[#16A34A]' },
  [REQUEST_STATUS.REJECTED]: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', dot: 'bg-[#DC2626]' },
  [REQUEST_STATUS.EXPIRED]: { label: 'Expired', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', dot: 'bg-gray-400' },

  // Rental
  [RENTAL_STATUS.BOOKED]: { label: 'Booked', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-600' },
  [RENTAL_STATUS.ACTIVE]: { label: 'In Use / Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-600' },
  [RENTAL_STATUS.RETURNED]: { label: 'Returned', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-500' },

  // Payment
  [PAYMENT_STATUS.UNPAID]: { label: 'Unpaid', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  [PAYMENT_STATUS.PAYMENT_SUBMITTED]: { label: 'Payment Submitted (Claim)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
};
