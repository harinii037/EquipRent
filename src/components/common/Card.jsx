import React from 'react';

export const Card = ({ children, className = '', onClick = null, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-4 transition-all ${
        hover ? 'hover:border-gray-400 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
