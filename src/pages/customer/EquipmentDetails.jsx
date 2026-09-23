import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Clock, FileText, AlertTriangle, Send, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DateRangePicker } from '../../components/equipment/DateRangePicker';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EquipmentDetails = () => {
  const { user, navigateTo } = useAuth();
  const equipmentId = window._navigationParams?.equipmentId;

  const [equipment, setEquipment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (equipmentId) {
      api.getEquipmentById(equipmentId).then(setEquipment);
    }
  }, [equipmentId]);

  if (!equipment) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-500">Equipment not found.</p>
        <button
          onClick={() => navigateTo('marketplace')}
          className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white rounded-md text-sm font-semibold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const handleSendRequest = async () => {
    if (!startDate || !endDate) {
      setErrorMsg('Please select start and end dates.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.createRentalRequest({
        equipmentId: equipment.id,
        customer: user,
        startDate,
        endDate,
      });

      if (!res.success) {
        setErrorMsg(res.error);
        setSubmitting(false);
        return;
      }

      // Navigate to CustomerRentalDetails page for this new pending request
      navigateTo('customer_rental_details', { requestId: res.request.id });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit request');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      {/* Back button */}
      <button
        onClick={() => navigateTo('marketplace')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#F7F7F8] border border-[#E5E5E5] rounded-md overflow-hidden relative">
            <img
              src={equipment.imageUrl}
              alt={equipment.name}
              className="w-full h-80 object-cover object-center"
            />
            <div className="absolute top-4 right-4">
              <StatusBadge status={equipment.status} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <span>{equipment.category}</span>
              <span>•</span>
              <span>Condition: {equipment.condition}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">{equipment.name}</h1>
          </div>

          {/* Rate Highlights */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F7F7F8] border border-[#E5E5E5] rounded-md">
            <div>
              <span className="text-xs text-[#6B7280] block">Daily Rental Rate</span>
              <span className="text-xl font-bold text-[#1A1A1A]">${equipment.rentalRate} <span className="text-xs font-normal text-[#6B7280]">/ day</span></span>
            </div>
            <div>
              <span className="text-xs text-[#6B7280] block">Security Advance</span>
              <span className="text-xl font-bold text-[#1A1A1A]">${equipment.advanceAmount}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#1A1A1A]">Equipment Description</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">{equipment.description}</p>
          </div>

          {/* Safety & Instructions */}
          {equipment.instructions && (
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-md text-xs space-y-1.5">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                Usage & Maintenance Instructions
              </h4>
              <p className="text-amber-800 leading-normal">{equipment.instructions}</p>
            </div>
          )}
        </div>

        {/* Right Column: Date Selection & Reservation Action */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-5 space-y-5 sticky top-20">
            
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Request Rental</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Pre-booking confirmation window: <strong>{equipment.prebookingWindowMinutes} mins</strong>
              </p>
            </div>

            {/* Date Range Picker */}
            <DateRangePicker
              equipmentId={equipment.id}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              rentalRate={equipment.rentalRate}
              advanceAmount={equipment.advanceAmount}
            />

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-[#DC2626] font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Notice explaining PENDING behavior */}
            <div className="p-3 bg-gray-100 border border-[#E5E5E5] rounded-md text-xs text-[#6B7280] space-y-1">
              <p className="font-medium text-[#1A1A1A]">Note on Reservations:</p>
              <p>
                Submitting a pending request lets the owner review your dates. The equipment remains available to others until the owner approves your request.
              </p>
            </div>

            <button
              onClick={handleSendRequest}
              disabled={submitting || !startDate || !endDate}
              className={`w-full py-3 px-4 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${
                !startDate || !endDate
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#16A34A] hover:bg-green-700 text-white shadow-sm'
              }`}
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Request...' : 'Send Rental Request'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
