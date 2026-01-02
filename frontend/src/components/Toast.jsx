import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColor} ${textColor} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <p className="text-sm font-medium">{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
};

export default Toast;
