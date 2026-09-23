import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldAlert, Play, Check, RotateCcw, AlertTriangle, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Stepper } from '../../components/common/Stepper';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { RENTAL_STATUS, EQUIPMENT_STATUS, PAYMENT_STATUS } from '../../types/status';

export const OwnerRentalDetails = () => {
  const { navigateTo } = useAuth();
  const rentalId = window._navigationParams?.rentalId;

  const [rental, setRental] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [showPostReturnModal, setShowPostReturnModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    if (rentalId) {
      const rent = await api.getRentalById(rentalId);
      setRental(rent);
      if (rent) {
        const eq = await api.getEquipmentById(rent.equipmentId);
        setEquipment(eq);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = api.subscribe(fetchData);
    return () => unsubscribe();
  }, [rentalId]);

  const handleActivateRental = async () => {
    setActionLoading(true);
    await api.activateRental(rental.id);
    setActionLoading(false);
    fetchData();
  };

  const handlePostReturnChoice = async (choice) => {
    // choice: 'ADD_BACK' | 'HOLD' | 'REMOVE'
    setActionLoading(true);
    await api.returnRental(rental.id, choice);
    setShowPostReturnModal(false);
    setActionLoading(false);
    fetchData();
  };

  if (!rental) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-500">Rental details not found.</p>
        <button onClick={() => navigateTo('owner_dashboard')} className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white rounded-md text-xs font-semibold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <button
        onClick={() => navigateTo('owner_dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header Info */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-5 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={rental.status} />
            <span className="text-xs text-[#6B7280]">Rental ID: {rental.id}</span>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">{rental.equipmentName}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Renter: <strong>{rental.customerName}</strong> ({rental.customerEmail})
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#6B7280] block">Total Booking Value</span>
          <span className="text-xl font-bold text-[#1A1A1A]">${rental.totalAmount}</span>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white border border-[#E5E5E5] p-6 rounded-md shadow-xs">
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4">Rental Handoff Timeline</h3>
        <Stepper currentStatus={rental.status} />
      </div>

      {/* Customer Payment Claim Notice */}
      {rental.paymentStatus === PAYMENT_STATUS.PAYMENT_SUBMITTED && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-md text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold">Customer Submitted Payment Claim (Self-Reported)</p>
            <p className="text-xs text-amber-800">
              The customer claims payment has been transferred via your UPI QR code. Please verify receipt in your mobile UPI banking app before handing over the equipment.
            </p>
          </div>
        </div>
      )}

      {/* State Machine Action Controls */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-6 rounded-md space-y-4">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Manage Rental Handoff Actions</h3>
        
        {rental.status === RENTAL_STATUS.BOOKED && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-[#E5E5E5] rounded-md">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">Ready to Dispatch / Hand Over Equipment?</p>
              <p className="text-xs text-[#6B7280]">Marking active transitions rental status from BOOKED → ACTIVE.</p>
            </div>
            <button
              onClick={handleActivateRental}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0"
            >
              <Play className="w-4 h-4" />
              {actionLoading ? 'Updating...' : 'Activate Rental'}
            </button>
          </div>
        )}

        {rental.status === RENTAL_STATUS.ACTIVE && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-[#E5E5E5] rounded-md">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">Customer Returned Equipment?</p>
              <p className="text-xs text-[#6B7280]">Mark returned to complete rental and choose equipment post-return state.</p>
            </div>
            <button
              onClick={() => setShowPostReturnModal(true)}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Mark Returned
            </button>
          </div>
        )}

        {rental.status === RENTAL_STATUS.RETURNED && (
          <div className="p-4 bg-gray-100 border border-[#E5E5E5] rounded-md text-xs text-gray-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>This rental has been completed and marked RETURNED. Equipment current status: <strong>{equipment?.status}</strong>.</span>
          </div>
        )}
      </div>

      {/* Post-Return Decision Modal (3-Way Choice: Add Back / Hold / Remove) */}
      {showPostReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border border-[#E5E5E5] rounded-md max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">Post-Return Inventory Decision</h3>
              <p className="text-xs text-[#6B7280] mt-1">
                Equipment has been marked as <strong>RETURNED</strong>. What would you like to do with this equipment in your catalog?
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Add Back (Green #16A34A) */}
              <button
                onClick={() => handlePostReturnChoice('ADD_BACK')}
                className="w-full text-left p-4 rounded-md border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors flex items-start gap-3"
              >
                <div className="p-2 bg-[#16A34A] text-white rounded-md shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-sm">Add Back to Marketplace (Green)</h4>
                  <p className="text-xs text-green-800 mt-0.5">
                    Set status to <strong>AVAILABLE</strong>. Equipment becomes immediately visible and rentable for customers.
                  </p>
                </div>
              </button>

              {/* Option 2: Hold (Yellow #EAB308) */}
              <button
                onClick={() => handlePostReturnChoice('HOLD')}
                className="w-full text-left p-4 rounded-md border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 transition-colors flex items-start gap-3"
              >
                <div className="p-2 bg-[#EAB308] text-white rounded-md shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Put Equipment On Hold (Yellow)</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Set status to <strong>ON_HOLD</strong>. Equipment is hidden from marketplace for inspection/maintenance. You can release hold later.
                  </p>
                </div>
              </button>

              {/* Option 3: Remove (Red #DC2626) */}
              <button
                onClick={() => handlePostReturnChoice('REMOVE')}
                className="w-full text-left p-4 rounded-md border-2 border-red-500 bg-red-50 hover:bg-red-100 transition-colors flex items-start gap-3"
              >
                <div className="p-2 bg-[#DC2626] text-white rounded-md shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Remove Equipment (Red)</h4>
                  <p className="text-xs text-red-800 mt-0.5">
                    Set status to <strong>REMOVED</strong>. Hidden permanently from customer marketplace. Rental history remains fully intact.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPostReturnModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
