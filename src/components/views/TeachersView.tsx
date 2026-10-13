import React, { useState, useRef, useEffect } from 'react';
import { Teacher, UserRole } from '../../types';
import { 
  Users2, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText,
  ChevronDown 
} from 'lucide-react';

interface TeachersViewProps {
  teachers: Teacher[];
  currentRole: UserRole;
  schoolName?: string;
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacher: Teacher) => void;
  onExportTeachersXlsx?: () => void;
  onDownloadTemplateXlsx?: () => void;
  onExportTeachersCsv?: () => void;
  onImportFile?: (file: File) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  currentRole,
  schoolName,
  onAddTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onExportTeachersXlsx,
  onDownloadTemplateXlsx,
  onExportTeachersCsv,
  onImportFile
}) => {
  const [search, setSearch] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  const canEdit = currentRole === 'admin' || currentRole === 'kepala_sekolah';

  // Tutup dropdown menu unduh saat mengklik di luar area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.value = '';
    if (onImportFile) {
      onImportFile(file);
    }
  };

  const filtered = teachers.filter((t) => {
    const s = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(s) ||
      t.nip.toLowerCase().includes(s) ||
      t.classSubject.toLowerCase().includes(s) ||
      t.type.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-100 flex-shrink-0">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Master Data Guru &amp; Tenaga Pendidik</h3>
            <p className="text-xs text-slate-500">
              Total {teachers.length} guru terdaftar di {schoolName || 'sekolah ini'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Pencarian */}
          <div className="relative flex-1 sm:w-48 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru, NIP, kelas..."
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Menu Unduh (Download Master Data & Template Excel XLSX) */}
          <div className="relative" ref={downloadMenuRef}>
            <button
              type="button"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              title="Unduh Data Guru atau Template Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh Format</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDownloadMenu && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs animate-fade-in divide-y divide-slate-100">
                {/* 1. Template Impor XLSX (Utama & Rekomendasi) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDownloadMenu(false);
                    onDownloadTemplateXlsx && onDownloadTemplateXlsx();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 flex items-start space-x-2.5 text-slate-700 transition"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 text-[11.5px] flex items-center space-x-1.5">
                      <span>Template Impor Guru (.xlsx)</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded uppercase">
                        Mudah Diisi
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                      Format tabel rapi di Excel + Tab panduan &amp; pilihan mapel SD
                    </div>
                  </div>
                </button>

                {/* 2. Unduh Master Data Guru XLSX */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDownloadMenu(false);
                    onExportTeachersXlsx && onExportTeachersXlsx();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start space-x-2.5 text-slate-700 transition"
                >
                  <Download className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800 text-[11.5px]">Unduh Data Guru (.xlsx)</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Ekspor data {teachers.length} guru aktif ke format Excel
                    </div>
                  </div>
                </button>

                {/* 3. Cadangan CSV Standar */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDownloadMenu(false);
                    onExportTeachersCsv && onExportTeachersCsv();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-600 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <div className="text-[11px]">Unduh Data Guru (.csv)</div>
                </button>
              </div>
            )}
          </div>

          {/* Tombol Unggah / Impor Data Guru (XLSX, XLS, CSV) */}
          {canEdit && (
            <label className="cursor-pointer px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Guru (.xlsx)</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/json"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          )}

          {/* Tombol Tambah Guru Manual */}
          {canEdit && (
            <button
              onClick={onAddTeacher}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 flex-shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Guru</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">No</th>
                <th className="p-3">Nama Lengkap Guru</th>
                <th className="p-3">NIP / NUPTK</th>
                <th className="p-3">Jenis Guru</th>
                <th className="p-3">Tugas / Kelas</th>
                <th className="p-3">Status</th>
                {canEdit && <th className="p-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="p-8 text-center text-slate-400 italic">
                    Tidak ditemukan data guru yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900 leading-snug">{t.name}</p>
                      {t.email && <p className="text-[10px] text-slate-400">{t.email}</p>}
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-700">{t.nip}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium ${
                        t.type === 'Guru Kelas'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{t.classSubject}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        {t.status}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => onEditTeacher(t)}
                          title="Edit Guru"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTeacher(t)}
                          title="Hapus Guru"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
