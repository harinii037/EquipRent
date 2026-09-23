import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, QrCode, CheckCircle2, AlertCircle, ShieldAlert, CreditCard } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Stepper } from '../../components/common/Stepper';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PAYMENT_STATUS, REQUEST_STATUS, RENTAL_STATUS } from '../../types/status';

export const CustomerRentalDetails = () => {
  const { navigateTo } = useAuth();
  const requestId = window._navigationParams?.requestId;
  const rentalId = window._navigationParams?.rentalId;

  const [request, setRequest] = useState(null);
  const [rental, setRental] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchData = async () => {
    if (requestId) {
      const r = await api.getRequestById(requestId);
      setRequest(r);
      if (r) {
        const eq = await api.getEquipmentById(r.equipmentId);
        setEquipment(eq);
      }
    }
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
  }, [requestId, rentalId]);

  // Pre-booking window Countdown Timer
  useEffect(() => {
    if (!request || request.status !== REQUEST_STATUS.PENDING) return;

    const timer = setInterval(() => {
      const expiresMs = new Date(request.expiresAt).getTime();
      const diffMs = expiresMs - Date.now();

      if (diffMs <= 0) {
        setTimeLeftStr('Expired');
        clearInterval(timer);
        fetchData(); // Trigger re-read for lazy expiry update
      } else {
        const mins = Math.floor(diffMs / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeftStr(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [request]);

  const handlePaidClaim = async () => {
    if (!request && !rental) return;
    setSubmittingPayment(true);
    const idToSubmit = request ? request.id : rental.requestId;
    await api.submitPaymentClaim(idToSubmit);
    setSubmittingPayment(false);
    fetchData();
  };

  if (!request && !rental) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-500">Rental record not found.</p>
        <button onClick={() => navigateTo('my_rentals')} className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white rounded-md text-xs font-semibold">
          Back to My Rentals
        </button>
      </div>
    );
  }

  const currentStatus = rental ? rental.status : (request.status === REQUEST_STATUS.APPROVED ? RENTAL_STATUS.BOOKED : RENTAL_STATUS.BOOKED);
  const paymentStatus = rental ? rental.paymentStatus : request.paymentStatus;
  const targetReq = request || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <button
        onClick={() => navigateTo('my_rentals')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Rentals
      </button>

      {/* Header Summary */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-5 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={rental ? rental.status : request.status} />
            <span className="text-xs text-[#6B7280]">Record ID: {rental ? rental.id : request.id}</span>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">{equipment?.name || targetReq.equipmentName}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Dates: <strong>{targetReq.startDate || rental?.startDate}</strong> to <strong>{targetReq.endDate || rental?.endDate}</strong> ({targetReq.totalDays || rental?.totalDays} days)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#6B7280] block">Total Amount Payable</span>
          <span className="text-xl font-bold text-[#1A1A1A]">${targetReq.totalAmount || rental?.totalAmount}</span>
        </div>
      </div>

      {/* Timeline Stepper */}
      <div className="bg-white border border-[#E5E5E5] p-6 rounded-md shadow-xs">
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4">Rental Progress Stepper</h3>
        <Stepper currentStatus={rental ? rental.status : null} requestStatus={request ? request.status : null} />
      </div>

      {/* Pre-Booking Window Countdown Banner */}
      {request && request.status === REQUEST_STATUS.PENDING && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#EAB308] shrink-0" />
            <div>
              <p className="text-xs font-bold">Pre-Booking Confirmation Window</p>
              <p className="text-xs text-amber-800">
                Submit payment claim before window expires to keep your pending request active.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-amber-700 block">Time Remaining</span>
            <span className="text-lg font-mono font-bold text-amber-900">{timeLeftStr || '30m 00s'}</span>
          </div>
        </div>
      )}

      {/* UPI Payment Claim Section */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-6 rounded-md space-y-5">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <QrCode className="w-5 h-5 text-gray-700" />
              Owner UPI Payment QR Code
            </h3>
            <p className="text-xs text-[#6B7280]">Pay via your preferred mobile UPI app (GPay, PhonePe, Paytm, BHIM)</p>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${
            paymentStatus === PAYMENT_STATUS.PAYMENT_SUBMITTED
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          }`}>
            {paymentStatus === PAYMENT_STATUS.PAYMENT_SUBMITTED ? 'Claim Submitted' : 'Unpaid'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* QR Code Image */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white border border-[#E5E5E5] rounded-md text-center">
            <img
              src={equipment?.upiQrUrl || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80'}
              alt="Owner UPI QR Code"
              className="w-48 h-48 object-contain rounded border border-[#E5E5E5]"
            />
            <p className="text-xs font-semibold text-[#1A1A1A] mt-2">Scan & Pay Total: ${targetReq.totalAmount || rental?.totalAmount}</p>
            <p className="text-[11px] text-[#6B7280]">UPI ID: robert@upi</p>
          </div>

          {/* Payment Action Instructions */}
          <div className="md:col-span-7 space-y-4">
            <ol className="text-xs text-[#6B7280] space-y-2 list-decimal list-inside bg-white p-4 border border-[#E5E5E5] rounded-md">
              <li>Scan the owner's UPI QR code using any UPI payment app on your phone.</li>
              <li>Transfer exact total amount (<strong>${targetReq.totalAmount || rental?.totalAmount}</strong>).</li>
              <li>After completing payment in your app, click <strong>"I've Paid"</strong> below to inform the owner.</li>
            </ol>

            {paymentStatus === PAYMENT_STATUS.PAYMENT_SUBMITTED ? (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-md text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#EAB308]" />
                  Payment Claim Submitted
                </div>
                <p className="text-xs text-amber-800">
                  You have reported payment submission for this request. The owner will inspect your claim upon request approval / handoff.
                </p>
              </div>
            ) : (
              <button
                onClick={handlePaidClaim}
                disabled={submittingPayment || request?.status === REQUEST_STATUS.EXPIRED}
                className={`w-full py-3 px-4 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${
                  request?.status === REQUEST_STATUS.EXPIRED
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#16A34A] hover:bg-green-700 text-white shadow-sm'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                {submittingPayment ? 'Submitting Payment Claim...' : "I've Paid (Submit Payment Claim)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
