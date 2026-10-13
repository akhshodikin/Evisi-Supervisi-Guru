import React, { useState, useMemo, useEffect } from 'react';
import { TeacherAdminAudit, UserRole, SchoolSettings } from '../../types';
import { STANDARD_SD_ADMIN_DOCS } from '../../data/adminDocsData';
import { AdminDocAuditModal } from '../modals/AdminDocAuditModal';
import { AdminDocPrintModal } from '../modals/AdminDocPrintModal';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Printer, 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Building,
  Table as TableIcon,
  LayoutGrid,
  Check,
  Minus,
  X
} from 'lucide-react';

interface AdminDocsViewProps {
  audits: TeacherAdminAudit[];
  settings: SchoolSettings;
  currentRole: UserRole;
  selectedTeacherId?: string | null;
  onClearSelectedTeacher?: () => void;
  onUpdateAudit: (updatedAudit: TeacherAdminAudit) => void;
  onOpenAuditForTeacher?: (teacherId: string) => void;
}

export const AdminDocsView: React.FC<AdminDocsViewProps> = ({
  audits,
  settings,
  currentRole,
  selectedTeacherId,
  onClearSelectedTeacher,
  onUpdateAudit,
  onOpenAuditForTeacher
}) => {
  const [search, setSearch] = useState('');
  const [selectedPredicate, setSelectedPredicate] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [activeAudit, setActiveAudit] = useState<TeacherAdminAudit | null>(null);

  // Auto-focus selected teacher when navigated from observation
  useEffect(() => {
    if (selectedTeacherId) {
      const matched = audits.find(a =>
        a.teacherId === selectedTeacherId ||
        a.id === selectedTeacherId ||
        a.id === `AUDIT-${selectedTeacherId}`
      );
      if (matched) {
        setSearch(matched.teacherName);
        setActiveAudit(matched);
        setIsModalOpen(true);
      }
    }
  }, [selectedTeacherId, audits]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    type: 'individual' | 'rekap';
    audit: TeacherAdminAudit | null;
  }>({
    isOpen: false,
    type: 'individual',
    audit: null
  });

  const canEdit = currentRole === 'admin' || currentRole === 'kepala_sekolah' || currentRole === 'pengawas';

  // Overall Statistics
  const stats = useMemo(() => {
    const totalTeachers = audits.length;
    if (totalTeachers === 0) return { avgPercentage: 0, sangatBaik: 0, baik: 0, kurang: 0, totalMissingDocs: 0 };

    const totalPercentage = audits.reduce((sum, a) => sum + a.percentage, 0);
    const avgPercentage = Math.round(totalPercentage / totalTeachers);
    const sangatBaik = audits.filter(a => a.percentage >= 86).length;
    const baik = audits.filter(a => a.percentage >= 71 && a.percentage < 86).length;
    const kurang = audits.filter(a => a.percentage < 71).length;

    let totalMissingDocs = 0;
    audits.forEach(a => {
      totalMissingDocs += a.items.filter(i => i.status !== 'lengkap').length;
    });

    return { avgPercentage, sangatBaik, baik, kurang, totalMissingDocs };
  }, [audits]);

  // Filtered audits
  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchSearch = 
        a.teacherName.toLowerCase().includes(search.toLowerCase()) ||
        a.nip.includes(search) ||
        a.classSubject.toLowerCase().includes(search.toLowerCase());

      const matchPredicate = 
        selectedPredicate === 'Semua' || a.predicate === selectedPredicate;

      return matchSearch && matchPredicate;
    });
  }, [audits, search, selectedPredicate]);

  const handleOpenAuditModal = (audit: TeacherAdminAudit) => {
    setActiveAudit(audit);
    setIsModalOpen(true);
  };

  const handlePrintMatrix = () => {
    setPrintModalState({
      isOpen: true,
      type: 'rekap',
      audit: null
    });
  };

  const handleExportCsv = () => {
    const headers = [
      'No',
      'Nama Guru',
      'NIP',
      'Tugas/Kelas',
      'Skor Total',
      'Maksimal',
      'Persentase',
      'Predikat',
      ...STANDARD_SD_ADMIN_DOCS.map(d => d.name)
    ];

    const rows = audits.map((a, idx) => {
      const docStatuses = STANDARD_SD_ADMIN_DOCS.map(std => {
        const found = a.items.find(i => i.id === std.id);
        if (!found) return 'Tidak Ada';
        return found.status === 'lengkap' ? 'Lengkap' : found.status === 'kurang' ? 'Kurang' : 'Tidak Ada';
      });

      return [
        idx + 1,
        `"${a.teacherName}"`,
        `'${a.nip}`,
        `"${a.classSubject}"`,
        a.totalScore,
        a.maxScore,
        `${a.percentage}%`,
        `"${a.predicate}"`,
        ...docStatuses.map(s => `"${s}"`)
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Kelengkapan_Administrasi_Guru_SD_${settings.schoolYear.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Standar Kurikulum Merdeka PMM 2026
              </span>
              <span className="text-xs text-slate-400">Tahun Ajaran {settings.schoolYear}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Kelengkapan Dokumen Administrasi Guru
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Instrumen pengawasan 14 dokumen perangkat perencanaan, pelaksanaan, asesmen, dan penunjang pembelajaran tenaga pendidik {settings.schoolName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={handlePrintMatrix}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Rata-rata Sekolah
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-teal-400">{stats.avgPercentage}%</span>
              <span className="text-[11px] text-slate-300 font-medium">Kategori Baik</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-teal-400 h-1.5 rounded-full" 
                style={{ width: `${stats.avgPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Predikat Sangat Baik
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-400">{stats.sangatBaik}</span>
              <span className="text-[11px] text-slate-400">dari {audits.length} guru</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 mt-2 font-medium">Skor kelengkapan &ge; 86%</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Predikat Baik
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-sky-400">{stats.baik}</span>
              <span className="text-[11px] text-slate-400">dari {audits.length} guru</span>
            </div>
            <p className="text-[10px] text-sky-400/80 mt-2 font-medium">Skor kelengkapan 71% - 85%</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Dokumen Perlu Dilengkapi
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-amber-400">{stats.totalMissingDocs}</span>
              <span className="text-[11px] text-slate-400">berkas catatan</span>
            </div>
            <p className="text-[10px] text-amber-400/80 mt-2 font-medium">Perlu tindak lanjut pembinaan</p>
          </div>
        </div>
      </div>

      {/* Active Filter Banner when navigated from Observation */}
      {selectedTeacherId && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-teal-600 text-white rounded-lg">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-teal-950 text-xs sm:text-sm">
                Memeriksa Dokumen Administrasi Terpilih dari Supervisi: {search || selectedTeacherId}
              </p>
              <p className="text-[11px] text-teal-700">
                Data 14 instrumen dokumen terhubung langsung dengan proses supervisi pembelajaran.
              </p>
            </div>
          </div>
          {onClearSelectedTeacher && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onClearSelectedTeacher();
              }}
              className="px-3 py-1.5 bg-white hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
            >
              Tampilkan Semua Guru
            </button>
          )}
        </div>
      )}

      {/* Controls Bar: Search, Filters & View Toggle */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama guru, NIP, kelas..."
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Predicate Filter */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={selectedPredicate}
              onChange={(e) => setSelectedPredicate(e.target.value)}
              className="w-full sm:w-auto p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
            >
              <option value="Semua">Semua Predikat</option>
              <option value="Sangat Baik">Sangat Baik (&ge; 86%)</option>
              <option value="Baik">Baik (71% - 85%)</option>
              <option value="Cukup">Cukup (56% - 70%)</option>
              <option value="Perlu Pembinaan">Perlu Pembinaan (&lt; 56%)</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kartu Guru</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              viewMode === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Matriks 14 Dokumen</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAudits.length === 0 ? (
            <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 italic">
              Tidak ada data pemeriksaan administrasi yang sesuai dengan filter.
            </div>
          ) : (
            filteredAudits.map((audit) => {
              const lengkapCount = audit.items.filter(i => i.status === 'lengkap').length;
              const kurangCount = audit.items.filter(i => i.status === 'kurang').length;
              const missingCount = audit.items.filter(i => i.status === 'tidak_ada').length;

              return (
                <div
                  key={audit.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full inline-block mb-1">
                          {audit.classSubject}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-teal-700 transition-colors">
                          {audit.teacherName}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-500">{audit.nip}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex-shrink-0 ${
                        audit.percentage >= 86
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : audit.percentage >= 71
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {audit.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                        <span>Kelengkapan Berkas:</span>
                        <span>{lengkapCount} dari 14 Lengkap</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                        <div 
                          className="bg-emerald-500 h-2 transition-all" 
                          style={{ width: `${(lengkapCount / 14) * 100}%` }} 
                          title={`${lengkapCount} Lengkap`}
                        />
                        <div 
                          className="bg-amber-400 h-2 transition-all" 
                          style={{ width: `${(kurangCount / 14) * 100}%` }} 
                          title={`${kurangCount} Kurang Lengkap`}
                        />
                        <div 
                          className="bg-rose-400 h-2 transition-all" 
                          style={{ width: `${(missingCount / 14) * 100}%` }} 
                          title={`${missingCount} Belum Ada`}
                        />
                      </div>
                    </div>

                    {/* Breakdown pills */}
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium pt-1">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        {lengkapCount} Lengkap
                      </span>
                      {kurangCount > 0 && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                          {kurangCount} Kurang
                        </span>
                      )}
                      {missingCount > 0 && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
                          {missingCount} Belum Ada
                        </span>
                      )}
                    </div>

                    {/* Auditor / Date info */}
                    <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 space-y-0.5">
                      <p className="truncate">
                        <span className="text-slate-400">Pemeriksa:</span> {audit.auditor}
                      </p>
                      <p>
                        <span className="text-slate-400">Tanggal Audit:</span> {audit.auditDate}
                      </p>
                    </div>

                    {/* Principal Note snippet */}
                    {audit.catatanKepsek && (
                      <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 italic line-clamp-2">
                        "{audit.catatanKepsek}"
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAuditModal(audit)}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <span>{canEdit ? 'Periksa / Edit Dokumen' : 'Lihat Detail Pemeriksaan'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintModalState({ isOpen: true, type: 'individual', audit })}
                      className="p-2.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-xl transition flex items-center justify-center cursor-pointer border border-slate-200"
                      title="Cetak Lembar Instrumen A4 Guru Ini"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: MATRIX TABLE VIEW */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Matriks Supervisi 14 Dokumen Administrasi Guru
              </h3>
              <p className="text-xs text-slate-500">
                Rekapitulasi status seluruh guru {settings.schoolName} ({settings.schoolYear})
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium">
              <span className="flex items-center space-x-1 text-emerald-700">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Lengkap (2 pt)</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-700">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Kurang (1 pt)</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-700">
                <X className="w-3.5 h-3.5 stroke-[3]" />
                <span>Belum Ada (0 pt)</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 text-slate-700 uppercase text-[9px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3 sticky left-0 bg-slate-100 z-10 w-10 text-center">No</th>
                  <th className="p-3 sticky left-10 bg-slate-100 z-10 min-w-[160px]">Nama Guru &amp; Mapel</th>
                  <th className="p-3 text-center min-w-[70px]">Skor (%)</th>
                  {STANDARD_SD_ADMIN_DOCS.map((doc) => (
                    <th 
                      key={doc.id} 
                      className="p-2.5 text-center min-w-[100px] border-l border-slate-200" 
                      title={`${doc.no}. ${doc.name}: ${doc.standard}`}
                    >
                      <div className="font-extrabold text-slate-900 truncate max-w-[110px]">
                        {doc.no}. {doc.id === 'doc-14' ? 'Kokurikuler' : doc.name.split(' ')[0]}
                      </div>
                      <div className="text-[8px] text-slate-500 normal-case truncate max-w-[110px]">
                        {doc.category}
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-center min-w-[80px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAudits.map((audit, idx) => (
                  <tr key={audit.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-bold text-slate-500 sticky left-0 bg-white">
                      {idx + 1}
                    </td>
                    <td className="p-3 sticky left-10 bg-white min-w-[160px]">
                      <p className="font-bold text-slate-900 truncate">{audit.teacherName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{audit.classSubject}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        audit.percentage >= 86 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : audit.percentage >= 71 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {audit.percentage}%
                      </span>
                    </td>

                    {/* 14 Status Cells */}
                    {STANDARD_SD_ADMIN_DOCS.map((doc) => {
                      const item = audit.items.find(i => i.id === doc.id);
                      const status = item?.status || 'tidak_ada';

                      return (
                        <td 
                          key={doc.id} 
                          className="p-2 text-center border-l border-slate-100"
                          title={item?.notes || doc.name}
                        >
                          {status === 'lengkap' ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs font-bold text-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : status === 'kurang' ? (
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-2xs font-bold text-xs">
                              !
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-2xs font-bold text-xs">
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAuditModal(audit)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintModalState({ isOpen: true, type: 'individual', audit })}
                          className="p-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg transition cursor-pointer"
                          title="Cetak Dokumen Guru"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Doc Audit Modal */}
      <AdminDocAuditModal
        isOpen={isModalOpen}
        audit={activeAudit}
        settings={settings}
        canEdit={canEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => {
          onUpdateAudit(updated);
          setActiveAudit(updated);
        }}
        onPrint={(auditToPrint) => {
          setPrintModalState({
            isOpen: true,
            type: 'individual',
            audit: auditToPrint
          });
        }}
      />

      {/* Admin Doc Print Preview & Export Modal (A4 Standard) */}
      <AdminDocPrintModal
        isOpen={printModalState.isOpen}
        type={printModalState.type}
        audit={printModalState.audit}
        allAudits={audits}
        settings={settings}
        onClose={() => setPrintModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
