import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  CloudOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  subscribeCloudStatus, 
  CloudStatusInfo, 
  getCurrentCloudStatus 
} from '../services/cloudSyncService';

interface CloudSyncIndicatorProps {
  onManualSync?: () => void;
  className?: string;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({ 
  onManualSync,
  className = '' 
}) => {
  const [statusInfo, setStatusInfo] = useState<CloudStatusInfo>(getCurrentCloudStatus());
  const [showTooltip, setShowTooltip] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    const unsub = subscribeCloudStatus((info) => {
      setStatusInfo(info);
    });
    return unsub;
  }, []);

  const handleManualSyncClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onManualSync) {
      setIsManualSyncing(true);
      try {
        await onManualSync();
      } finally {
        setTimeout(() => setIsManualSyncing(false), 600);
      }
    }
  };

  const getStatusBadge = () => {
    switch (statusInfo.status) {
      case 'connected':
        return {
          icon: <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />,
          dot: 'bg-emerald-500',
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          label: 'Cloud Real-time'
        };
      case 'syncing':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />,
          dot: 'bg-amber-500 animate-pulse',
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          label: 'Menyinkronkan...'
        };
      case 'error':
      case 'offline':
      default:
        return {
          icon: <CloudOff className="w-3.5 h-3.5 text-slate-500" />,
          dot: 'bg-slate-400',
          bg: 'bg-slate-100 border-slate-200 text-slate-700',
          label: 'Lokal (Offline)'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium shadow-2xs transition select-none ${badge.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
        {badge.icon}
        <span className="hidden sm:inline font-semibold">{badge.label}</span>

        {onManualSync && (
          <button
            type="button"
            onClick={handleManualSyncClick}
            title="Klik untuk sinkronisasi paksa ke Cloud"
            className="ml-1 p-0.5 hover:bg-black/5 rounded text-current opacity-70 hover:opacity-100 transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isManualSyncing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Tooltip detail */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900/95 backdrop-blur-xs text-white p-2.5 rounded-xl text-[10px] shadow-xl z-50 pointer-events-none border border-slate-700 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-slate-200">
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>Status Sinkronisasi Otomatis</span>
          </div>
          <p className="text-slate-300 leading-snug">{statusInfo.message}</p>
          {statusInfo.lastSyncedAt && (
            <p className="text-[9px] text-slate-400 font-mono">
              Terakhir sinkron: {statusInfo.lastSyncedAt.toLocaleTimeString('id-ID')}
            </p>
          )}
          <p className="text-[9px] text-emerald-300 italic pt-0.5 border-t border-slate-800">
            Semua perubahan otomatis tersimpan &amp; real-time tersinkron antar HP dan Laptop.
          </p>
        </div>
      )}
    </div>
  );
};
