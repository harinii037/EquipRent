import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" (red), "warning" (yellow), "success" (green), "neutral" (gray)
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-[#DC2626] hover:bg-red-700 text-white';
      case 'success':
        return 'bg-[#16A34A] hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-[#EAB308] hover:bg-amber-600 text-white';
      default:
        return 'bg-[#1A1A1A] hover:bg-gray-800 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-none animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E5E5] rounded-md max-w-md w-full p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className={`p-2.5 rounded-full shrink-0 ${
            variant === 'danger' ? 'bg-red-100 text-[#DC2626]' :
            variant === 'warning' ? 'bg-amber-100 text-[#EAB308]' : 'bg-green-100 text-[#16A34A]'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">{title}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-md hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
