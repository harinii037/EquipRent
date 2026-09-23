import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, QrCode, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ImageUpload } from '../../components/common/ImageUpload';

export const ManageEquipment = () => {
  const { navigateTo } = useAuth();
  const editingEquipment = window._navigationParams?.equipment;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Power Tools',
    description: '',
    condition: 'Excellent',
    rentalRate: 30,
    advanceAmount: 50,
    instructions: '',
    prebookingWindowMinutes: 30,
    imageUrl: '',
    upiQrUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        name: editingEquipment.name || '',
        category: editingEquipment.category || 'Power Tools',
        description: editingEquipment.description || '',
        condition: editingEquipment.condition || 'Excellent',
        rentalRate: editingEquipment.rentalRate || 30,
        advanceAmount: editingEquipment.advanceAmount || 50,
        instructions: editingEquipment.instructions || '',
        prebookingWindowMinutes: editingEquipment.prebookingWindowMinutes || 30,
        imageUrl: editingEquipment.imageUrl || '',
        upiQrUrl: editingEquipment.upiQrUrl || '',
      });
    }
  }, [editingEquipment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Equipment name is required.');
      return;
    }
    if (!formData.imageUrl) {
      setErrorMsg('Please upload an equipment photo.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      if (editingEquipment) {
        await api.updateEquipment(editingEquipment.id, formData);
      } else {
        await api.createEquipment(formData);
      }
      setSaving(false);
      navigateTo('my_equipment');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save equipment.');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      <button
        onClick={() => navigateTo('my_equipment')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Equipment
      </button>

      <div className="bg-[#F7F7F8] border border-[#E5E5E5] p-6 rounded-md">
        <h1 className="text-xl font-bold text-[#1A1A1A]">
          {editingEquipment ? 'Edit Equipment Listing' : 'Add New Equipment to Marketplace'}
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Fill out all specifications, image attachments, and pre-booking window times.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-xs text-[#DC2626] font-semibold rounded-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Section 1: Images Upload (REUSING ImageUpload component twice) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 border border-[#E5E5E5] rounded-md">
            
            {/* Unified ImageUpload Usage #1: Equipment Photo */}
            <ImageUpload
              label="1. Equipment Main Photo *"
              helperText="Upload a clear photo of the equipment"
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              previewHeight="h-44"
            />

            {/* Unified ImageUpload Usage #2: Owner UPI QR Code Image */}
            <ImageUpload
              label="2. Owner UPI QR Code Image"
              helperText="Upload UPI QR Code for receiving rental payments"
              value={formData.upiQrUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, upiQrUrl: url }))}
              previewHeight="h-44"
            />

          </div>

          {/* Section 2: Basic Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Equipment Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. DeWalt 20V Cordless Drill Combo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              >
                <option value="Power Tools">Power Tools</option>
                <option value="Heavy Machinery">Heavy Machinery</option>
                <option value="Audio/Visual">Audio/Visual</option>
              </select>
            </div>
          </div>

          {/* Section 3: Financials & Prebooking Window */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Daily Rental Rate ($) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.rentalRate}
                onChange={(e) => setFormData({ ...formData, rentalRate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Security Advance Deposit ($) *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.advanceAmount}
                onChange={(e) => setFormData({ ...formData, advanceAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Prebooking Window (Minutes) *</label>
              <input
                type="number"
                min="5"
                max="1440"
                required
                value={formData.prebookingWindowMinutes}
                onChange={(e) => setFormData({ ...formData, prebookingWindowMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Section 4: Condition & Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Physical Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              >
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Include features, accessories included, performance specifications..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Safety & Maintenance Instructions</label>
              <textarea
                rows={2}
                placeholder="e.g. Requires 2-stroke oil mix, wear goggles..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
            <button
              type="button"
              onClick={() => navigateTo('my_equipment')}
              className="px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-green-700 rounded-md shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : (editingEquipment ? 'Update Equipment' : 'Publish Equipment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
