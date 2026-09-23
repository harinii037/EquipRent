import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Calendar, User, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card } from '../../components/common/Card';

export const RentalHistory = () => {
  const { navigateTo } = useAuth();
  const equipmentId = window._navigationParams?.equipmentId;

  const [equipment, setEquipment] = useState(null);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    if (equipmentId) {
      api.getEquipmentById(equipmentId).then(setEquipment);
      api.getRentals({ equipmentId }).then(setRentals);
    }
  }, [equipmentId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <button
        onClick={() => navigateTo('my_equipment')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Equipment
      </button>

      {/* Equipment Header Summary */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-5 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {equipment && <StatusBadge status={equipment.status} />}
            <span className="text-xs text-[#6B7280]">Historical Log</span>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">{equipment?.name || 'Equipment History'}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Category: {equipment?.category} • Rate: ${equipment?.rentalRate}/day
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
          <History className="w-4 h-4 text-gray-700" />
          Completed & Active Rental History ({rentals.length})
        </h2>

        {rentals.length === 0 ? (
          <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-8 rounded-md text-center">
            <p className="text-xs text-[#6B7280]">No rental history records logged for this equipment yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rentals.map(rent => (
              <Card key={rent.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={rent.status} />
                    <span className="font-semibold text-[#1A1A1A]">{rent.customerName}</span>
                    <span className="text-[#6B7280]">({rent.customerEmail})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{rent.startDate} to {rent.endDate} ({rent.totalDays} days)</span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[#6B7280] block text-[11px]">Total Earned</span>
                  <span className="font-bold text-[#16A34A] text-sm">${rent.totalAmount}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
