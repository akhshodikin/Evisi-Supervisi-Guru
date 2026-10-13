import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="no-print fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-slide-up">
      <div className="flex-shrink-0">
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
        {type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
      </div>
      <div className="flex-1 text-xs">
        <p className="font-medium text-slate-100">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
