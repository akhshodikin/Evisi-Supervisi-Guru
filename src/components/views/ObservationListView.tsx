import React, { useState, useMemo } from 'react';
import { ObservationData, ObsStatus, SchoolSettings, TeacherAdminAudit } from '../../types';
import { INITIAL_SETTINGS } from '../../data/initialData';
import { findAuditForTeacher } from '../../data/adminDocsData';
import { exportObservationsToExcelHtml, exportObservationsToCsv } from '../../utils/excelExport';
import { 
  Search, 
  PlusCircle, 
  ArrowRight, 
  Trash2, 
  SlidersHorizontal, 
  User, 
  Filter, 
  RotateCcw, 
  X,
  ClipboardList,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  FileCheck2,
  FileText
} from 'lucide-react';
import { calculateDeepLearningStats } from '../../data/deepLearningData';

interface ObservationListViewProps {
  observations: ObservationData[];
  adminAudits?: TeacherAdminAudit[];
  settings?: SchoolSettings;
  onOpenDetail: (obsId: string) => void;
  onOpenNewModal: () => void;
  onDeleteObs: (obs: ObservationData) => void;
  onOpenAdminDocsForTeacher?: (teacherId: string) => void;
}

export const ObservationListView: React.FC<ObservationListViewProps> = ({
  observations,
  adminAudits = [],
  settings = INITIAL_SETTINGS,
  onOpenDetail,
  onOpenNewModal,
  onDeleteObs,
  onOpenAdminDocsForTeacher
}) => {
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterAdminDocs, setFilterAdminDocs] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Extract unique teacher names from observations
  const uniqueTeachers = useMemo(() => {
    const teacherMap = new Map<string, string>();
    observations.forEach((o) => {
      if (o.teacherName) teacherMap.set(o.teacherName, o.teacherName);
    });
    return Array.from(teacherMap.keys()).sort();
  }, [observations]);

  // Quick filter status options with live count
  const statusOptions = useMemo(() => {
    return [
      {
        value: '',
        label: 'Semua Status',
        count: observations.length,
        activeClass: 'bg-slate-900 text-white shadow-xs'
      },
      {
        value: 'Pra Observasi',
        label: 'Pra Observasi (Goal)',
        count: observations.filter(o => o.status === 'Pra Observasi').length,
        activeClass: 'bg-emerald-600 text-white shadow-xs'
      },
      {
        value: 'Observasi',
        label: 'Observasi (Reality)',
        count: observations.filter(o => o.status === 'Observasi').length,
        activeClass: 'bg-sky-600 text-white shadow-xs'
      },
      {
        value: 'Pasca Observasi',
        label: 'Pasca Observasi (Options)',
        count: observations.filter(o => o.status === 'Pasca Observasi').length,
        activeClass: 'bg-amber-600 text-white shadow-xs'
      },
      {
        value: 'Tindak Lanjut',
        label: 'Tindak Lanjut (Will)',
        count: observations.filter(o => o.status === 'Tindak Lanjut').length,
        activeClass: 'bg-purple-600 text-white shadow-xs'
      },
      {
        value: 'Selesai',
        label: 'Selesai',
        count: observations.filter(o => o.status === 'Selesai').length,
        activeClass: 'bg-slate-700 text-white shadow-xs'
      }
    ];
  }, [observations]);

  // Filter observations based on search, selected teacher, status, and administrative completeness
  const filtered = useMemo(() => {
    return observations.filter((o) => {
      const s = search.toLowerCase();
      const matchSearch =
        !search ||
        o.teacherName.toLowerCase().includes(s) ||
        o.subject.toLowerCase().includes(s) ||
        o.observer.toLowerCase().includes(s) ||
        o.id.toLowerCase().includes(s) ||
        o.nip.toLowerCase().includes(s);

      const matchTeacher = selectedTeacher ? o.teacherName === selectedTeacher : true;
      const matchStatus = filterStatus ? o.status === filterStatus : true;

      // Filter by administrative completeness
      let matchAdmin = true;
      if (filterAdminDocs) {
        const audit = findAuditForTeacher(o, adminAudits);
        if (!audit) {
          matchAdmin = false;
        } else if (filterAdminDocs === 'sangat_baik') {
          matchAdmin = audit.percentage >= 86;
        } else if (filterAdminDocs === 'baik') {
          matchAdmin = audit.percentage >= 71 && audit.percentage < 86;
        } else if (filterAdminDocs === 'perlu_perbaikan') {
          matchAdmin = audit.percentage < 71;
        }
      }

      return matchSearch && matchTeacher && matchStatus && matchAdmin;
    });
  }, [observations, adminAudits, search, selectedTeacher, filterStatus, filterAdminDocs]);

  const hasActiveFilters = Boolean(search || selectedTeacher || filterStatus || filterAdminDocs);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedTeacher('');
    setFilterStatus('');
    setFilterAdminDocs('');
  };

  const handleExportExcel = () => {
    exportObservationsToExcelHtml(filtered, settings);
    setExportNotice(`Berhasil mengekspor ${filtered.length} data supervisi ke file Excel (.xls).`);
    setTimeout(() => setExportNotice(null), 5000);
  };

  const handleExportCsv = () => {
    exportObservationsToCsv(filtered, settings);
    setExportNotice(`Berhasil mengekspor ${filtered.length} data supervisi ke file CSV.`);
    setTimeout(() => setExportNotice(null), 5000);
  };

  const getStatusBadge = (status: ObsStatus) => {
    switch (status) {
      case 'Pra Observasi':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">Pra (Goal)</span>;
      case 'Observasi':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-md font-bold text-[10px]">Observasi (Reality)</span>;
      case 'Pasca Observasi':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-bold text-[10px]">Pasca (Options)</span>;
      case 'Tindak Lanjut':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md font-bold text-[10px]">Tindak Lanjut (Will)</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 bg-slate-200 text-slate-800 rounded-md font-bold text-[10px]">Selesai</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Filter & Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* 1. Free Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari guru, NIP, mapel, nomor observasi..."
                className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Hapus pencarian teks"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Filter Berdasarkan Nama Guru */}
            <div className="relative flex-1 min-w-[180px] sm:flex-initial sm:w-52">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="">Semua Guru ({observations.length})</option>
                {uniqueTeachers.map((tName) => {
                  const count = observations.filter(o => o.teacherName === tName).length;
                  return (
                    <option key={tName} value={tName}>
                      {tName} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 3. Filter Berdasarkan Status Supervisi */}
            <div className="relative flex-1 min-w-[180px] sm:flex-initial sm:w-48">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="">Semua Alur GROW</option>
                <option value="Pra Observasi">Pra Observasi (Goal)</option>
                <option value="Observasi">Observasi (Reality)</option>
                <option value="Pasca Observasi">Pasca Observasi (Options)</option>
                <option value="Tindak Lanjut">Tindak Lanjut (Will)</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            {/* 4. Filter Berdasarkan Kelengkapan Dokumen Administrasi */}
            <div className="relative flex-1 min-w-[190px] sm:flex-initial sm:w-52">
              <FileCheck2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={filterAdminDocs}
                onChange={(e) => setFilterAdminDocs(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                title="Filter berdasarkan kelengkapan 14 dokumen administrasi guru"
              >
                <option value="">Kelengkapan Administrasi</option>
                <option value="sangat_baik">Lengkap (≥86% - Sangat Baik)</option>
                <option value="baik">Cukup Lengkap (71 - 85%)</option>
                <option value="perlu_perbaikan">Perlu Dilengkapi (&lt;71%)</option>
              </select>
            </div>

            {/* 5. Tombol Reset Filter */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer flex-shrink-0"
                title="Reset semua filter pencarian"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
                title="Unduh data observasi yang tersaring ke format Excel (.xls)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ekspor Excel ({filtered.length})</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="px-2 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                title="Unduh data dalam format CSV"
              >
                <span>CSV</span>
              </button>
            </div>

            <button
              onClick={onOpenNewModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5 flex-shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Jadwal Observasi</span>
            </button>
          </div>
        </div>

        {/* Export notification alert */}
        {exportNotice && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-lg text-xs flex items-center justify-between shadow-2xs animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">{exportNotice}</span>
            </div>
            <button
              onClick={() => setExportNotice(null)}
              className="text-emerald-600 hover:text-emerald-800 text-xs font-bold px-2 py-0.5"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Quick Filter Badges for Supervision Status */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Status:
            </span>
            {statusOptions.map((st) => {
              const isSelected = filterStatus === st.value;
              return (
                <button
                  key={st.value}
                  onClick={() => setFilterStatus(st.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? st.activeClass
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{st.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/30 text-current' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Results Counter */}
          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">{filtered.length}</span> dari <span className="font-bold text-slate-800">{observations.length}</span> observasi
            {hasActiveFilters && (
              <span className="ml-1 text-emerald-600 font-semibold">(Difilter)</span>
            )}
          </div>
        </div>
      </div>

      {/* Observation Table with Synchronized Administrative Document Completeness Column */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">No. Observasi</th>
                <th className="p-3">Guru &amp; NIP</th>
                <th className="p-3">Kelas / Mapel</th>
                <th className="p-3">Tanggal / Observer</th>
                <th className="p-3">Skor Supervisi</th>
                <th className="p-3">
                  <div className="flex items-center space-x-1 text-teal-800">
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Administrasi Guru (14 Dokumen)</span>
                  </div>
                </th>
                <th className="p-3">Tahap Alur GROW</th>
                <th className="p-3 text-center">Kelola Supervisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                      <div className="p-3 bg-slate-100 rounded-full">
                        <ClipboardList className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-600 text-sm">
                        Tidak ada data observasi yang cocok
                      </p>
                      <p className="text-xs text-slate-400 max-w-md">
                        {hasActiveFilters
                          ? 'Silakan coba ubah nama guru, status supervisi, atau kata kunci pencarian Anda.'
                          : 'Belum ada data observasi supervisi yang tersedia.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Hapus Semua Filter</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const audit = findAuditForTeacher(o, adminAudits);
                  const lengkapCount = audit ? audit.items.filter(i => i.status === 'lengkap').length : 0;
                  const isExcellent = audit ? audit.percentage >= 86 : false;
                  const isGood = audit ? audit.percentage >= 71 && audit.percentage < 86 : false;

                  return (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-slate-700">{o.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 leading-snug">{o.teacherName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NIP: {o.nip}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-slate-800">{o.subject}</p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600 font-semibold">
                          {o.classTarget}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-700">{o.date}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">{o.observer}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-baseline space-x-1">
                          <span className="font-extrabold text-emerald-700 text-sm">{o.score}</span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium block">{o.category}</span>
                        {o.deepLearning?.scores && (
                          <div className="mt-1">
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              <span>DL: {calculateDeepLearningStats(o.deepLearning.scores).overall.percentage}%</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* KOLOM TERINTEGRASI: KELENGKAPAN DOKUMEN ADMINISTRASI GURU */}
                      <td className="p-3">
                        {audit ? (
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] inline-flex items-center space-x-1 ${
                              isExcellent
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isGood
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              <FileCheck2 className="w-3 h-3 flex-shrink-0" />
                              <span>{audit.percentage}% • {audit.predicate}</span>
                            </span>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {lengkapCount}/14 Dokumen Lengkap
                            </div>
                            {onOpenAdminDocsForTeacher && (
                              <button
                                type="button"
                                onClick={() => onOpenAdminDocsForTeacher(audit.teacherId || o.teacherId)}
                                className="text-[10px] text-teal-700 hover:text-teal-900 font-semibold underline block cursor-pointer transition hover:translate-x-0.5"
                                title="Periksa 14 instrumen dokumen administrasi guru ini"
                              >
                                Periksa 14 Dokumen →
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Sinkronisasi otomatis</span>
                        )}
                      </td>

                      <td className="p-3">{getStatusBadge(o.status)}</td>
                      <td className="p-3 text-center space-x-1">
                        <button
                          onClick={() => onOpenDetail(o.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs text-xs transition inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Buka Supervisi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteObs(o)}
                          title="Hapus Supervisi"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition inline-block cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
