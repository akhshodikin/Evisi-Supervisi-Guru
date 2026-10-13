import React from 'react';
import { BackupDataPayload } from '../../utils/backupRestore';
import { 
  RotateCcw, 
  X, 
  AlertTriangle, 
  School, 
  Users, 
  ClipboardList, 
  FileCheck2, 
  Calendar, 
  ShieldCheck 
} from 'lucide-react';

interface RestoreModalProps {
  isOpen: boolean;
  backupData: BackupDataPayload | null;
  onClose: () => void;
  onConfirmRestore: (data: BackupDataPayload) => void;
}

export const RestoreModal: React.FC<RestoreModalProps> = ({
  isOpen,
  backupData,
  onClose,
  onConfirmRestore
}) => {
  if (!isOpen || !backupData) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return isoString;
    }
  };

  return (
    <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Pemulihan Data (Restore)</h3>
              <p className="text-[11px] text-slate-500">
                Periksa rincian data cadangan sebelum melakukan pemulihan ke sistem.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* School Information Card */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="flex items-start space-x-2.5">
            <School className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-xs">
                {backupData.schoolInfo.name || backupData.data.settings.schoolName}
              </h4>
              <p className="text-[11px] text-slate-500">
                NPSN: {backupData.schoolInfo.npsn || '-'} • TP: {backupData.schoolInfo.schoolYear || '-'} ({backupData.schoolInfo.semester || 'Ganjil'})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Waktu Cadangan: <strong>{formatDate(backupData.exportDate)}</strong></span>
          </div>
        </div>

        {/* Data Statistics Grid */}
        <div>
          <h5 className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider mb-2">
            Ringkasan Berkas yang Akan Dipulihkan:
          </h5>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl">
              <div className="flex justify-center mb-1">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-bold text-slate-800 text-sm">{backupData.summary.totalTeachers}</div>
              <div className="text-[10px] text-slate-500">Tenaga Pendidik</div>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <div className="flex justify-center mb-1">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-bold text-slate-800 text-sm">{backupData.summary.totalObservations}</div>
              <div className="text-[10px] text-slate-500">Supervisi Guru</div>
            </div>

            <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl">
              <div className="flex justify-center mb-1">
                <FileCheck2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="font-bold text-slate-800 text-sm">{backupData.summary.totalAdminAudits}</div>
              <div className="text-[10px] text-slate-500">Audit Dokumen</div>
            </div>
          </div>
        </div>

        {/* Warning Notification */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="font-semibold block mb-0.5">Perhatian:</strong>
            Pemulihan data akan mengganti seluruh data aktif saat ini dengan data dari berkas cadangan ini. Pastikan Anda sudah mengunduh cadangan data terbaru saat ini jika diperlukan sewaktu-waktu.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirmRestore(backupData)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ya, Pulihkan Data Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
