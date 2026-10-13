import React, { useState } from 'react';
import { Teacher } from '../../types';
import { 
  Users2, 
  X, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  UserPlus, 
  FileSpreadsheet,
  Info
} from 'lucide-react';

interface TeacherImportModalProps {
  isOpen: boolean;
  importedTeachers: Teacher[];
  skippedCount?: number;
  fileName: string;
  existingTeachersCount: number;
  onClose: () => void;
  onConfirmImport: (teachers: Teacher[], mode: 'merge' | 'replace') => void;
}

export const TeacherImportModal: React.FC<TeacherImportModalProps> = ({
  isOpen,
  importedTeachers,
  skippedCount = 0,
  fileName,
  existingTeachersCount,
  onClose,
  onConfirmImport
}) => {
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 flex-shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Pratinjau &amp; Konfirmasi Impor Data Guru</h3>
              <p className="text-[11px] text-slate-500">
                Memuat berkas <strong className="text-slate-700">{fileName}</strong> ({importedTeachers.length} data guru terdeteksi)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Info Banner */}
          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-teal-900">
              <FileSpreadsheet className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>
                Ditemukan <strong>{importedTeachers.length} tenaga pendidik</strong> siap diimpor ke sistem.
              </span>
            </div>
            {skippedCount > 0 && (
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                {skippedCount} baris kosong/diabaikan
              </span>
            )}
          </div>

          {/* Import Mode Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block text-xs">Pilih Metode Impor Data:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Merge */}
              <div
                onClick={() => setImportMode('merge')}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                  importMode === 'merge'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-xs">
                    <span>Gabungkan Data (Merge)</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                      Rekomendasi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Memperbarui data jika NIP/Nama sudah ada dan menambahkan guru baru. Riwayat supervisi tetap aman.
                  </p>
                </div>
              </div>

              {/* Option 2: Replace */}
              <div
                onClick={() => setImportMode('replace')}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                  importMode === 'replace'
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-xs">Gantikan Semua (Replace All)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Menghapus seluruh {existingTeachersCount} guru aktif dan menggantinya hanya dengan data dari berkas ini.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {importMode === 'replace' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-amber-800 text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Peringatan:</strong> Mode ini akan mereset master guru yang ada. Pastikan berkas cadangan telah dibuat sebelum melanjutkan.
              </span>
            </div>
          )}

          {/* Table Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold text-xs">Daftar Guru Hasil Pembacaan Berkas:</span>
              <span className="text-[10px] text-slate-400">Menampilkan {importedTeachers.length} guru</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-2.5 w-8 text-center">No</th>
                    <th className="p-2.5">Nama Guru</th>
                    <th className="p-2.5">NIP</th>
                    <th className="p-2.5">Jenis Guru</th>
                    <th className="p-2.5">Tugas / Mapel</th>
                    <th className="p-2.5">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importedTeachers.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-2.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{t.name}</td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-600">{t.nip || '-'}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          t.type === 'Guru Kelas'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700">{t.classSubject}</td>
                      <td className="p-2.5 text-[11px] text-slate-500 truncate max-w-[120px]">
                        {t.email || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end space-x-2.5 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirmImport(importedTeachers, importMode)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Impor {importedTeachers.length} Guru Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
