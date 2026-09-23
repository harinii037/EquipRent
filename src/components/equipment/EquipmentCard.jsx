import React from 'react';
import { Tag, ShieldAlert, ArrowRight, Edit, Eye, Lock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Card } from '../common/Card';
import { EQUIPMENT_STATUS } from '../../types/status';

export const EquipmentCard = ({
  equipment,
  onSelect,
  onEdit = null,
  onRemove = null,
  onReleaseHold = null,
  isOwner = false,
}) => {
  return (
    <Card className="flex flex-col justify-between h-full bg-[#F7F7F8] border border-[#E5E5E5] rounded-md overflow-hidden group hover:border-gray-400 transition-colors">
      <div>
        {/* Thumbnail Image */}
        <div className="relative w-full h-44 bg-gray-200 overflow-hidden rounded-t-sm">
          <img
            src={equipment.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'}
            alt={equipment.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 right-2.5">
            <StatusBadge status={equipment.status} />
          </div>
          <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-none text-white text-xs px-2 py-1 rounded font-medium">
            {equipment.category}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-[#1A1A1A] text-base leading-snug line-clamp-2">
              {equipment.name}
            </h3>
          </div>

          <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">
            {equipment.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs py-2 px-2.5 bg-white border border-[#E5E5E5] rounded-md mb-3">
            <div>
              <span className="text-[#6B7280] block text-[11px]">Daily Rate</span>
              <span className="font-bold text-[#1A1A1A] text-sm">${equipment.rentalRate} <span className="text-xs font-normal text-[#6B7280]">/day</span></span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Security Deposit</span>
              <span className="font-semibold text-[#1A1A1A] text-sm">${equipment.advanceAmount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Condition: <strong className="text-[#1A1A1A] font-medium">{equipment.condition}</strong></span>
            <span>Pre-booking: <strong className="text-[#1A1A1A] font-medium">{equipment.prebookingWindowMinutes}m</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 pt-0 mt-2">
        {isOwner ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit && onEdit(equipment)}
              className="flex-1 px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-md hover:bg-gray-100 flex items-center justify-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>

            {equipment.status === EQUIPMENT_STATUS.ON_HOLD && (
              <button
                onClick={() => onReleaseHold && onReleaseHold(equipment.id)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-[#16A34A] rounded-md hover:bg-green-700 flex items-center justify-center gap-1"
              >
                Release Hold
              </button>
            )}

            {equipment.status !== EQUIPMENT_STATUS.REMOVED && (
              <button
                onClick={() => onRemove && onRemove(equipment)}
                className="px-3 py-2 text-xs font-semibold text-[#DC2626] bg-white border border-red-200 rounded-md hover:bg-red-50 flex items-center justify-center"
                title="Remove Equipment"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onSelect(equipment)}
            className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-[#1A1A1A] hover:bg-black rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Check Availability & Rent
          </button>
        )}
      </div>
    </Card>
  );
};
