import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckSquare, ShieldAlert, ArrowRight, Plus, Eye, Wrench } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EQUIPMENT_STATUS, REQUEST_STATUS, RENTAL_STATUS } from '../../types/status';

export const OwnerDashboard = () => {
  const { navigateTo } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [rentals, setRentals] = useState([]);

  const fetchData = async () => {
    const eq = await api.getEquipmentList({ onlyAvailable: false });
    const reqs = await api.getRequests();
    const rents = await api.getRentals();
    setEquipmentList(eq);
    setRequests(reqs);
    setRentals(rents);
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = api.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  // Compute metrics
  const totalEquipmentCount = equipmentList.filter(e => e.status !== EQUIPMENT_STATUS.REMOVED).length;
  const pendingRequestsCount = requests.filter(r => r.status === REQUEST_STATUS.PENDING).length;
  const activeRentalsCount = rentals.filter(r => r.status === RENTAL_STATUS.ACTIVE).length;
  const onHoldCount = equipmentList.filter(e => e.status === EQUIPMENT_STATUS.ON_HOLD).length;

  const pendingRequests = requests.filter(r => r.status === REQUEST_STATUS.PENDING);
  const activeRentals = rentals.filter(r => r.status === RENTAL_STATUS.ACTIVE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      {/* Header Banner */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-6 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Owner Overview</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage equipment inventory, respond to rental requests, and oversee active rentals.
          </p>
        </div>
        <button
          onClick={() => navigateTo('manage_equipment')}
          className="px-4 py-2.5 bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Equipment
        </button>
      </div>

      {/* Summary Cards with Status Colors (4 metrics across) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Equipment */}
        <div className="bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6B7280]">Total Inventory</span>
            <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{totalEquipmentCount}</p>
          </div>
          <div className="p-3 bg-white border border-[#E5E5E5] text-gray-700 rounded-md">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Pending Requests (Yellow/Amber #EAB308) */}
        <div className="bg-amber-50/60 border border-amber-300 rounded-md p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800">Pending Requests</span>
            <p className="text-2xl font-bold text-amber-900 mt-1">{pendingRequestsCount}</p>
          </div>
          <div className="p-3 bg-white border border-amber-300 text-[#EAB308] rounded-md">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Active Rentals (Green #16A34A) */}
        <div className="bg-green-50/60 border border-green-300 rounded-md p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-green-800">Active Rentals</span>
            <p className="text-2xl font-bold text-green-900 mt-1">{activeRentalsCount}</p>
          </div>
          <div className="p-3 bg-white border border-green-300 text-[#16A34A] rounded-md">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: On Hold (Yellow/Amber #EAB308) */}
        <div className="bg-amber-50/60 border border-amber-300 rounded-md p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800">Equipment On Hold</span>
            <p className="text-2xl font-bold text-amber-900 mt-1">{onHoldCount}</p>
          </div>
          <div className="p-3 bg-white border border-amber-300 text-[#EAB308] rounded-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Sections (Full width, NO sidebars) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pending Requests Quick Action Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EAB308]" />
              Pending Rental Requests ({pendingRequests.length})
            </h2>
            <button
              onClick={() => navigateTo('rental_requests')}
              className="text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] flex items-center gap-1"
            >
              View All Requests <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-8 rounded-md text-center">
              <p className="text-xs text-[#6B7280]">No pending requests awaiting approval right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <Card key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={req.status} />
                      <span className="text-xs text-[#6B7280]">{req.customerName}</span>
                    </div>
                    <h4 className="font-bold text-[#1A1A1A] text-sm">{req.equipmentName}</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Dates: {req.startDate} to {req.endDate} ({req.totalDays} days) • Total: <strong>${req.totalAmount}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('rental_requests')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1A1A1A] hover:bg-black rounded-md"
                  >
                    Review Request
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Active Rentals Quick Action Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#16A34A]" />
              Active Rentals ({activeRentals.length})
            </h2>
          </div>

          {activeRentals.length === 0 ? (
            <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-8 rounded-md text-center">
              <p className="text-xs text-[#6B7280]">No equipment currently out on active rental.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRentals.map((rent) => (
                <Card key={rent.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={rent.status} />
                    <span className="text-xs font-semibold text-[#16A34A]">${rent.totalAmount}</span>
                  </div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">{rent.equipmentName}</h4>
                  <p className="text-xs text-[#6B7280]">Renter: {rent.customerName} ({rent.customerEmail})</p>
                  
                  <button
                    onClick={() => navigateTo('owner_rental_details', { rentalId: rent.id })}
                    className="w-full py-1.5 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E5E5] hover:bg-gray-100 rounded-md flex items-center justify-center gap-1 mt-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Manage / Return Workflow
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
