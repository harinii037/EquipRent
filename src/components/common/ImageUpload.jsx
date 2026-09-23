import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

export const ImageUpload = ({
  value,
  onChange,
  label = "Upload Image",
  helperText = "PNG, JPG or WebP up to 5MB",
  previewHeight = "h-40",
  aspectRatio = "aspect-video",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Convert to Data URL / Local URL for preview and mock state
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group rounded-md overflow-hidden border border-[#E5E5E5] bg-[#F7F7F8]">
          <img
            src={value}
            alt="Upload Preview"
            className={`w-full ${previewHeight} object-cover object-center`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-xs font-medium text-[#1A1A1A] rounded-md shadow-sm hover:bg-gray-100 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-[#DC2626] text-xs font-medium text-white rounded-md shadow-sm hover:bg-red-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-gray-900 bg-gray-100'
              : 'border-[#E5E5E5] bg-[#F7F7F8] hover:border-gray-400 hover:bg-gray-100/50'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-white border border-[#E5E5E5] rounded-full text-gray-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">{helperText}</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
