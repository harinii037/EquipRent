import React from 'react';
import { STATUS_CONFIG } from '../../types/status';

export const StatusBadge = ({ status, customLabel = null }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    dot: 'bg-gray-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {customLabel || config.label}
    </span>
  );
};
