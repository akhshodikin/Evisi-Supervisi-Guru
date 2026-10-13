import React, { useState } from 'react';
import { TeacherAdminAudit, AdminDocItem, AdminDocStatus, SchoolSettings } from '../../types';
import { calculateAuditScore } from '../../data/adminDocsData';
import { 
  FileCheck2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Save, 
  FileText, 
  Printer, 
  Upload, 
  Calendar,
  User,
  ShieldCheck,
  Building,
  Award
} from 'lucide-react';

interface AdminDocAuditModalProps {
  isOpen: boolean;
  audit: TeacherAdminAudit | null;
  settings: SchoolSettings;
  canEdit: boolean;
  onClose: () => void;
  onSave: (updatedAudit: TeacherAdminAudit) => void;
  onPrint?: (audit: TeacherAdminAudit) => void;
}

export const AdminDocAuditModal: React.FC<AdminDocAuditModalProps> = ({
  isOpen,
  audit,
  settings,
  canEdit,
  onClose,
  onSave,
  onPrint
}) => {
  if (!isOpen || !audit) return null;

  const [items, setItems] = useState<AdminDocItem[]>(audit.items);
  const [catatanKepsek, setCatatanKepsek] = useState(audit.catatanKepsek || '');
  const [tindakLanjut, setTindakLanjut] = useState(audit.tindakLanjut || '');
  const [auditor, setAuditor] = useState(audit.auditor || settings.principalName);
  const [auditDate, setAuditDate] = useState(audit.auditDate || new Date().toISOString().split('T')[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Semua');

  // Compute live score
  const scoreResult = calculateAuditScore(items);

  const handleStatusChange = (id: string, newStatus: AdminDocStatus) => {
    if (!canEdit) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const score = newStatus === 'lengkap' ? 2 : newStatus === 'kurang' ? 1 : 0;
          return {
            ...item,
            status: newStatus,
            score,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    if (!canEdit) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleQuickUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            fileName: file.name,
            fileUrl: URL.createObjectURL(file),
            status: 'lengkap',
            score: 2,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    const updated: TeacherAdminAudit = {
      ...audit,
      items,
      totalScore: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      percentage: scoreResult.percentage,
      predicate: scoreResult.predicate,
      catatanKepsek,
      tindakLanjut,
      auditor,
      auditDate,
      isVerified: true
    };
    onSave(updated);
    onClose();
  };

  const categories = ['Semua', 'Perencanaan', 'Pelaksanaan', 'Penilaian', 'Penunjang'];
  const filteredItems = activeCategoryFilter === 'Semua' 
    ? items 
    : items.filter(i => i.category === activeCategoryFilter);

  const lengkapCount = items.filter(i => i.status === 'lengkap').length;
  const kurangCount = items.filter(i => i.status === 'kurang').length;
  const tidakAdaCount = items.filter(i => i.status === 'tidak_ada').length;

  return (
    <div className="no-print fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-6 flex flex-col max-h-[90vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Supervisi Administrasi SD
                </span>
                <span className="text-xs text-slate-400">• {audit.classSubject}</span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">{audit.teacherName}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onPrint && (
              <button
                type="button"
                onClick={() => onPrint(audit)}
                className="px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
                title="Cetak lembar instrumen"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak Instrumen</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Score Overview Banner */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-emerald-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hasil Kelengkapan Dokumen
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  scoreResult.percentage >= 86 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : scoreResult.percentage >= 71 
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  Predikat: {scoreResult.predicate}
                </span>
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-slate-900">{scoreResult.percentage}%</span>
                <span className="text-xs font-semibold text-slate-500">
                  (Skor {scoreResult.totalScore} dari maksimal {scoreResult.maxScore} poin)
                </span>
              </div>
            </div>

            {/* Status counter badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lengkapCount} Lengkap</span>
              </span>
              <span className="px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-semibold flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{kurangCount} Kurang Lengkap</span>
              </span>
              <span className="px-2.5 py-1.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 font-semibold flex items-center space-x-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>{tidakAdaCount} Belum Ada</span>
              </span>
            </div>
          </div>

          {/* Audit Metadata Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Tanggal Pemeriksaan</label>
              <input
                type="date"
                disabled={!canEdit}
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Pejabat Pemeriksa (Auditor)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Semester &amp; Tahun Ajaran</label>
              <div className="p-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-medium truncate">
                {audit.semester} • {audit.schoolYear}
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeCategoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat} {cat !== 'Semua' && `(${items.filter(i => i.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Document Checklist Items */}
          <div className="space-y-3">
            {filteredItems.map((doc) => {
              return (
                <div 
                  key={doc.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    doc.status === 'lengkap'
                      ? 'bg-white border-slate-200 hover:border-emerald-300'
                      : doc.status === 'kurang'
                      ? 'bg-amber-50/40 border-amber-200/80'
                      : 'bg-rose-50/40 border-rose-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {doc.no}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 pl-7 leading-relaxed">{doc.standard}</p>
                    </div>

                    {/* Status Button Toggle */}
                    <div className="flex items-center space-x-1.5 pl-7 sm:pl-0 flex-shrink-0">
                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => handleStatusChange(doc.id, 'lengkap')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                          doc.status === 'lengkap'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ada &amp; Lengkap</span>
                      </button>

                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => handleStatusChange(doc.id, 'kurang')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                          doc.status === 'kurang'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Kurang</span>
                      </button>

                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => handleStatusChange(doc.id, 'tidak_ada')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                          doc.status === 'tidak_ada'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tidak Ada</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes & File Attachment Row */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pl-7 text-xs">
                    <div className="flex-1">
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={doc.notes || ''}
                        onChange={(e) => handleNotesChange(doc.id, e.target.value)}
                        placeholder="Catatan pemeriksa (misal: sudah disahkan, perlu revisi tujuan pembelajaran)..."
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {doc.fileName ? (
                        <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-medium truncate max-w-[180px]">
                          📎 {doc.fileName}
                        </span>
                      ) : canEdit ? (
                        <label className="cursor-pointer px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition">
                          <Upload className="w-3 h-3" />
                          <span>Lampirkan Berkas</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleQuickUpload(doc.id, e)}
                          />
                        </label>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Supervisor Notes & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Catatan Evaluasi Kepala Sekolah / Pengawas
              </label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={catatanKepsek}
                onChange={(e) => setCatatanKepsek(e.target.value)}
                placeholder="Catatan menyeluruh mengenai kedisiplinan dan kualitas administrasi pembelajaran..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Rekomendasi Tindak Lanjut Pembinaan
              </label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={tindakLanjut}
                onChange={(e) => setTindakLanjut(e.target.value)}
                placeholder="Tindak lanjut pembinaan (misal: pendampingan kombel, pelatihan mandiri PMM)..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-slate-500">
            Total {items.length} dokumen standar administrasi guru Kurikulum Merdeka SD
          </p>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
            >
              Tutup
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Hasil Pemeriksaan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
