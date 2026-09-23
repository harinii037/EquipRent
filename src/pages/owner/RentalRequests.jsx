import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Clock, Calendar, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';
import { api, checkDateConflict } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Card } from '../../components/common/Card';
import { REQUEST_STATUS, PAYMENT_STATUS } from '../../types/status';

export const RentalRequests = () => {
  const { navigateTo } = useAuth();
  const [requests, setRequests] = useState([]);
  const [errorMap, setErrorMap] = useState({});
  const [selectedForReject, setSelectedForReject] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchRequests = async () => {
    const data = await api.getRequests();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
    const unsubscribe = api.subscribe(fetchRequests);
    return () => unsubscribe();
  }, []);

  const handleApprove = async (requestId) => {
    setErrorMap(prev => ({ ...prev, [requestId]: '' }));
    
    const res = await api.approveRentalRequest(requestId);
    if (!res.success) {
      setErrorMap(prev => ({ ...prev, [requestId]: res.error }));
      return;
    }

    fetchRequests();
    navigateTo('owner_rental_details', { rentalId: res.rental.id });
  };

  const handleConfirmReject = async () => {
    if (selectedForReject) {
      await api.rejectRentalRequest(selectedForReject.id);
      setSelectedForReject(null);
      fetchRequests();
    }
  };

  const pendingRequests = requests.filter(r => r.status === REQUEST_STATUS.PENDING);
  const otherRequests = requests.filter(r => r.status !== REQUEST_STATUS.PENDING);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-5 rounded-md">
        <h1 className="text-xl font-bold text-[#1A1A1A]">Incoming Rental Requests</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Review dates, verify payment claim submissions, check date conflicts, and approve or reject rental requests.
        </p>
      </div>

      {/* Section 1: Pending Requests (Action Required) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#EAB308]" />
          Pending Approval ({pendingRequests.length})
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-8 rounded-md text-center">
            <p className="text-xs text-[#6B7280]">No pending requests needing action.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => {
              // Live check for conflict warning
              const conflict = checkDateConflict(req.equipmentId, req.startDate, req.endDate);

              return (
                <Card key={req.id} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} />
                        {req.paymentStatus === PAYMENT_STATUS.PAYMENT_SUBMITTED ? (
                          <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded">
                            Customer Submitted Payment Claim
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#6B7280]">Unpaid</span>
                        )}
                      </div>
                      <h3 className="font-bold text-[#1A1A1A] text-base mt-1">{req.equipmentName}</h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#6B7280] block">Customer</span>
                      <strong className="text-xs text-[#1A1A1A] font-semibold">{req.customerName} ({req.customerEmail})</strong>
                    </div>
                  </div>

                  {/* Dates & Pricing Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white border border-[#E5E5E5] p-3 rounded-md">
                    <div>
                      <span className="text-[#6B7280] block">Rental Period</span>
                      <strong className="text-[#1A1A1A]">{req.startDate} to {req.endDate}</strong> ({req.totalDays} days)
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Pre-booking Expiry</span>
                      <strong className="text-amber-800">{new Date(req.expiresAt).toLocaleTimeString()}</strong>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Total Amount</span>
                      <strong className="text-[#16A34A] text-sm">${req.totalAmount}</strong>
                    </div>
                  </div>

                  {/* Payment Claim Notice for Owner */}
                  {req.paymentStatus === PAYMENT_STATUS.PAYMENT_SUBMITTED && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                      <div>
                        <strong>Payment Claim Submitted (Self-Reported):</strong>
                        <p className="mt-0.5 text-amber-800">
                          Customer has reported submitting payment via your UPI QR code. Please verify receipt in your UPI bank app upon approval/handoff.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Conflict Warning Alert if date overlaps */}
                  {conflict.hasConflict && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-[#DC2626] font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                      <div>
                        <strong>Date Conflict Warning:</strong> This equipment is already booked or active for overlapping dates ({conflict.conflictingRental.startDate} to {conflict.conflictingRental.endDate}). Approving will be blocked until conflicting rental is resolved.
                      </div>
                    </div>
                  )}

                  {/* Inline Error Message */}
                  {errorMap[req.id] && (
                    <div className="p-3 bg-red-50 border border-red-300 text-xs text-[#DC2626] font-bold rounded-md flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errorMap[req.id]}
                    </div>
                  )}

                  {/* Approval / Rejection Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedForReject(req);
                        setIsRejectModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#DC2626] hover:bg-red-700 rounded-md flex items-center gap-1.5 shadow-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-green-700 rounded-md flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      Approve Request
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Historical / Processed Requests */}
      {otherRequests.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-sm font-bold text-[#6B7280]">Processed Requests History ({otherRequests.length})</h2>
          <div className="space-y-2">
            {otherRequests.map(req => (
              <div key={req.id} className="bg-[#F7F7F8] border border-[#E5E5E5] p-3 rounded-md flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <StatusBadge status={req.status} />
                  <span className="font-semibold text-[#1A1A1A]">{req.equipmentName}</span>
                  <span className="text-[#6B7280]">({req.customerName})</span>
                </div>
                <div className="text-[#6B7280]">
                  {req.startDate} to {req.endDate} • ${req.totalAmount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Rejection */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        title="Reject Rental Request?"
        message={`Are you sure you want to decline the rental request for "${selectedForReject?.equipmentName}" submitted by ${selectedForReject?.customerName}?`}
        confirmText="Decline Request"
        variant="danger"
      />
    </div>
  );
};
