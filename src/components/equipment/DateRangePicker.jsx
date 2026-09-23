import React from 'react';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { checkDateConflict } from '../../services/api';

export const DateRangePicker = ({
  equipmentId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  rentalRate,
  advanceAmount,
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Calculate days & total
  let totalDays = 0;
  let totalCost = 0;

  if (startDate && endDate) {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    if (endMs >= startMs) {
      totalDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
      totalCost = (totalDays * rentalRate) + advanceAmount;
    }
  }

  // Live conflict check
  let conflictInfo = { hasConflict: false };
  if (startDate && endDate && totalDays > 0) {
    conflictInfo = checkDateConflict(equipmentId, startDate, endDate);
  }

  return (
    <div className="space-y-4 bg-white border border-[#E5E5E5] p-4 rounded-md">
      <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-700" />
        Select Rental Dates
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1">Start Date</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#F7F7F8] border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1">End Date</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#F7F7F8] border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
          />
        </div>
      </div>

      {/* Conflict Validation Feedback */}
      {startDate && endDate && (
        <div>
          {conflictInfo.hasConflict ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Date Conflict Warning!</strong>
                Equipment is already booked/active from{' '}
                <span className="font-semibold">{conflictInfo.conflictingRental.startDate}</span> to{' '}
                <span className="font-semibold">{conflictInfo.conflictingRental.endDate}</span>. Please choose non-overlapping dates.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-xs text-green-800">
              <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Equipment is available for these dates!</span>
            </div>
          )}
        </div>
      )}

      {/* Pricing Summary */}
      {totalDays > 0 && (
        <div className="pt-3 border-t border-[#E5E5E5] space-y-1.5 text-xs">
          <div className="flex justify-between text-[#6B7280]">
            <span>Rental Fee ({totalDays} days @ ${rentalRate}/day):</span>
            <span className="font-semibold text-[#1A1A1A]">${totalDays * rentalRate}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Security Deposit (refundable):</span>
            <span className="font-semibold text-[#1A1A1A]">${advanceAmount}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-1 border-t border-[#E5E5E5]">
            <span>Total Payable:</span>
            <span className="text-[#16A34A] text-base">${totalCost}</span>
          </div>
        </div>
      )}
    </div>
  );
};
