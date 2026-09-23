import React, { useState, useEffect } from 'react';
import { Plus, Wrench, ShieldAlert, History, Edit, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { EquipmentCard } from '../../components/equipment/EquipmentCard';
import { Modal } from '../../components/common/Modal';
import { EQUIPMENT_STATUS } from '../../types/status';

export const MyEquipmentList = () => {
  const { navigateTo } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedForRemove, setSelectedForRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const fetchEquipment = async () => {
    const items = await api.getEquipmentList({ onlyAvailable: false });
    setEquipmentList(items);
  };

  useEffect(() => {
    fetchEquipment();
    const unsubscribe = api.subscribe(fetchEquipment);
    return () => unsubscribe();
  }, []);

  const handleReleaseHold = async (equipmentId) => {
    await api.releaseHold(equipmentId);
    fetchEquipment();
  };

  const handleConfirmRemove = async () => {
    if (selectedForRemove) {
      // Soft delete: sets status to REMOVED!
      await api.removeEquipment(selectedForRemove.id);
      setSelectedForRemove(null);
      fetchEquipment();
    }
  };

  const filteredItems = equipmentList.filter(item => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-5 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">My Equipment Inventory</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage listing details, physical availability, hold statuses, and rental history.
          </p>
        </div>
        <button
          onClick={() => navigateTo('manage_equipment')}
          className="px-4 py-2 bg-[#16A34A] hover:bg-green-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E5E5E5]">
        {['ALL', 'AVAILABLE', 'BOOKED', 'ACTIVE', 'ON_HOLD', 'REMOVED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
              filter === tab
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            {tab === 'ALL' ? 'All Items' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-12 rounded-md text-center">
          <Wrench className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#1A1A1A]">No equipment listed under this filter</h3>
          <p className="text-xs text-[#6B7280] mt-1">Try switching filter tabs or click Add Equipment to list new inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="relative flex flex-col justify-between h-full">
              <EquipmentCard
                equipment={item}
                isOwner={true}
                onEdit={(eq) => navigateTo('manage_equipment', { equipment: eq })}
                onReleaseHold={handleReleaseHold}
                onRemove={(eq) => {
                  setSelectedForRemove(eq);
                  setIsRemoveModalOpen(true);
                }}
              />
              <button
                onClick={() => navigateTo('rental_history', { equipmentId: item.id })}
                className="mt-2 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] flex items-center justify-center gap-1.5 py-1.5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-md"
              >
                <History className="w-3.5 h-3.5" />
                View Rental History
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Equipment Soft-Removal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Equipment from Marketplace?"
        message={`Are you sure you want to remove "${selectedForRemove?.name}"? The equipment status will be changed to REMOVED and hidden from the customer marketplace, but all past rental records will be preserved.`}
        confirmText="Remove Equipment"
        variant="danger"
      />
    </div>
  );
};
