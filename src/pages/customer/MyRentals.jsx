import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, Eye, AlertCircle, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card } from '../../components/common/Card';
import { RENTAL_STATUS, REQUEST_STATUS } from '../../types/status';

export const MyRentals = () => {
  const { user, navigateTo } = useAuth();
  const [requests, setRequests] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, BOOKED, ACTIVE, RETURNED
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const reqs = await api.getRequests({ customerId: user.id });
    const rents = await api.getRentals({ customerId: user.id });
    setRequests(reqs);
    setRentals(rents);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = api.subscribe(fetchData);
    return () => unsubscribe();
  }, [user.id]);

  // Merge items into unified view
  const combinedItems = [
    ...requests.map(r => ({ ...r, itemType: 'REQUEST' })),
    ...rentals.map(r => ({ ...r, itemType: 'RENTAL' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredItems = combinedItems.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return item.status === REQUEST_STATUS.PENDING;
    if (filter === 'BOOKED') return item.status === RENTAL_STATUS.BOOKED || item.status === REQUEST_STATUS.APPROVED;
    if (filter === 'ACTIVE') return item.status === RENTAL_STATUS.ACTIVE;
    if (filter === 'RETURNED') return item.status === RENTAL_STATUS.RETURNED;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F7F8] border border-[#E5E5E5] p-5 rounded-md">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">My Rental Requests & Bookings</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Track status, submit payment claims, and manage return schedules.
          </p>
        </div>
        <button
          onClick={() => navigateTo('marketplace')}
          className="px-3.5 py-2 text-xs font-semibold bg-[#1A1A1A] text-white rounded-md hover:bg-black flex items-center gap-1.5 shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          Rent New Equipment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E5E5E5]">
        {['ALL', 'PENDING', 'BOOKED', 'ACTIVE', 'RETURNED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
              filter === tab
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(n => <div key={n} className="h-28 bg-[#F7F7F8] border border-[#E5E5E5] rounded-md animate-pulse" />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-10 text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#1A1A1A]">No rental records found</h3>
          <p className="text-xs text-[#6B7280] mt-1">
            {filter === 'ALL'
              ? 'You have not submitted any rental requests yet.'
              : `No rental items with status ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {item.paymentStatus === 'PAYMENT_SUBMITTED' && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                      Payment Claim Submitted
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-[#1A1A1A] text-base">{item.equipmentName}</h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {item.startDate} to {item.endDate} ({item.totalDays} days)
                  </span>
                  <span>•</span>
                  <span>Total Amount: <strong className="text-[#1A1A1A]">${item.totalAmount}</strong></span>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                <button
                  onClick={() => navigateTo('customer_rental_details', {
                    requestId: item.itemType === 'REQUEST' ? item.id : item.requestId,
                    rentalId: item.itemType === 'RENTAL' ? item.id : null,
                  })}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-md hover:bg-gray-100 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  View Details & Payment
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
