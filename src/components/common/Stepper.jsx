import React from 'react';
import { Check, Clock, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { RENTAL_STATUS, REQUEST_STATUS } from '../../types/status';

export const Stepper = ({ currentStatus, requestStatus = null }) => {
  // Steps order: Pending -> Booked -> Active -> Returned
  const steps = [
    { key: 'PENDING', label: 'Pending Request' },
    { key: 'BOOKED', label: 'Booked' },
    { key: 'ACTIVE', label: 'Active / In Use' },
    { key: 'RETURNED', label: 'Returned' },
  ];

  // Determine active index
  let activeIndex = 0;
  if (requestStatus === REQUEST_STATUS.REJECTED || requestStatus === REQUEST_STATUS.EXPIRED) {
    activeIndex = -1; // Special failed state
  } else if (currentStatus === RENTAL_STATUS.RETURNED) {
    activeIndex = 3;
  } else if (currentStatus === RENTAL_STATUS.ACTIVE) {
    activeIndex = 2;
  } else if (currentStatus === RENTAL_STATUS.BOOKED || requestStatus === REQUEST_STATUS.APPROVED) {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  if (requestStatus === REQUEST_STATUS.REJECTED || requestStatus === REQUEST_STATUS.EXPIRED) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3 text-red-800">
        <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
        <div>
          <p className="text-sm font-semibold">Request {requestStatus === REQUEST_STATUS.REJECTED ? 'Rejected' : 'Expired'}</p>
          <p className="text-xs text-red-600">
            {requestStatus === REQUEST_STATUS.REJECTED
              ? 'The owner declined this rental request.'
              : 'The pre-booking window expired before payment confirmation was submitted.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5E5E5] -translate-y-1/2 z-0" />
        
        {/* Active progress line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#16A34A] -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  isCompleted
                    ? 'bg-[#16A34A] border-[#16A34A] text-white'
                    : isCurrent
                    ? 'bg-white border-[#16A34A] text-[#16A34A] ring-4 ring-green-100'
                    : 'bg-white border-[#E5E5E5] text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  isCurrent
                    ? 'text-[#1A1A1A] font-semibold'
                    : isCompleted
                    ? 'text-green-800'
                    : 'text-[#6B7280]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
