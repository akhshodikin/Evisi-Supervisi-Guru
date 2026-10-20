import React, { useState, useEffect } from 'react';
import { SchoolSettings, Teacher, ObservationData, TeacherAdminAudit, ManagedSchool } from '../../types';
import { DEFAULT_LOGO_PASURUAN, DEFAULT_LOGO_TUTWURI } from '../../data/initialData';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Upload, 
  Image as ImageIcon, 
  Database, 
  Download, 
  UploadCloud,
  FileCheck2,
  Users,
  ClipboardList,
  Building2,
  School,
  ArrowRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface SettingsViewProps {
  settings: SchoolSettings;
  teachers?: Teacher[];
  observations?: ObservationData[];
  adminAudits?: TeacherAdminAudit[];
  currentSchoolId?: string;
  managedSchools?: ManagedSchool[];
  onSaveSettings: (settings: SchoolSettings) => void;
  onResetDemo: () => void;
  onExportBackup?: () => void;
  onRequestRestore?: (file: File) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenSchoolSwitcher?: () => void;
  onSwitchSchool?: (schoolId: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  teachers = [],
  observations = [],
  adminAudits = [],
  currentSchoolId = 'kandangan-1',
  managedSchools = [],
  onSaveSettings,
  onResetDemo,
  onExportBackup,
  onRequestRestore,
  onShowToast,
  onOpenSchoolSwitcher,
  onSwitchSchool
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });

  // Keep form data synchronized when active school switches
  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (field: keyof SchoolSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onShowToast('Pengaturan identitas sekolah & kop surat berhasil disimpan!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Harap pilih berkas gambar yang valid (PNG, JPG, atau SVG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (side === 'left') {
        setFormData(prev => ({ ...prev, logoLeft: result }));
      } else {
        setFormData(prev => ({ ...prev, logoRight: result }));
      }
      onShowToast(`Logo ${side === 'left' ? 'Kiri (Kab. Pasuruan)' : 'Kanan (Sekolah)'} berhasil diunggah.`);
    };
    reader.readAsDataURL(file);
  };

  const resetLogoToDefault = (side: 'left' | 'right') => {
    if (side === 'left') {
      setFormData(prev => ({ ...prev, logoLeft: DEFAULT_LOGO_PASURUAN }));
    } else {
      setFormData(prev => ({ ...prev, logoRight: DEFAULT_LOGO_TUTWURI }));
    }
    onShowToast(`Logo ${side === 'left' ? 'Kiri' : 'Kanan'} dikembalikan ke logo bawaan.`);
  };

  const handleBackupFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Clear input value so selecting the same file again works
    e.target.value = '';
    if (onRequestRestore) {
      onRequestRestore(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 0. KARTU PENGELOLAAN MULTI-LEMBAGA SEKOLAH */}
      {managedSchools.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-xl flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-white text-sm sm:text-base">
                    Kepala Sekolah Multi-Lembaga ({managedSchools.length} Sekolah)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Aktif
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Beralih lembaga secara instan untuk mengelola master data guru dan instrumen supervisi masing-masing sekolah.
                </p>
              </div>
            </div>

            {onOpenSchoolSwitcher && (
              <button
                type="button"
                onClick={onOpenSchoolSwitcher}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ganti Lembaga / Tambah</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {managedSchools.map((school) => {
              const isActive = school.id === currentSchoolId;

              return (
                <div
                  key={school.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-white/10 border-emerald-400/60 ring-2 ring-emerald-400/40'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  } flex flex-col justify-between space-y-3`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-xs truncate">
                        {school.name}
                      </span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-500 text-white shadow-2xs">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-300">
                      <span className="font-mono text-emerald-300">NPSN: {school.npsn}</span>
                      <span>•</span>
                      <span className="text-slate-300">{school.statusLabel}</span>
                    </div>
                  </div>

                  {!isActive && onSwitchSchool && (
                    <button
                      type="button"
                      onClick={() => onSwitchSchool(school.id)}
                      className="w-full py-1.5 px-2 bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-600 transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Beralih ke Lembaga Ini</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. KARTU PENGATURAN IDENTITAS SEKOLAH & KOP */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex-shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Pengaturan Satuan Pendidikan &amp; Kop Dokumen</h3>
            <p className="text-slate-500 text-[11px]">
              Sesuaikan identitas sekolah, pejabat penilai, dan logo resmi untuk cetak A4.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
              <input
                type="text"
                value={formData.schoolYear}
                onChange={(e) => handleChange('schoolYear', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Satuan Pendidikan</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah (dengan Gelar)</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => handleChange('principalName', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.principalNip}
                onChange={(e) => handleChange('principalNip', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Semester Aktif</label>
            <select
              value={formData.semester}
              onChange={(e) => handleChange('semester', e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>

          {/* PENGATURAN LOGO KOP SURAT */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-xs">Pengaturan Logo Kop Surat &amp; Dokumen A4</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Anda dapat mengunggah berkas logo resmi satuan pendidikan atau daerah (format PNG transparan, JPG, atau SVG).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Logo Kiri: Pemkab Pasuruan */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-white border border-slate-300 rounded-xl p-1 flex items-center justify-center shadow-inner flex-shrink-0">
                    <img
                      src={formData.logoLeft}
                      alt="Logo Kiri"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <span className="font-bold text-slate-800 text-xs block truncate">Logo Kiri (Pemda)</span>
                    <span className="text-[10px] text-slate-500 block truncate">Lambang Kab. Pasuruan</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 pt-1">
                  <label className="flex-1 cursor-pointer px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center text-[11px] font-semibold transition flex items-center justify-center space-x-1 shadow-2xs">
                    <Upload className="w-3 h-3" />
                    <span>Unggah Logo Kiri</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'left')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => resetLogoToDefault('left')}
                    title="Kembalikan ke Logo Bawaan"
                    className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Logo Kanan: Tut Wuri / Sekolah */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-white border border-slate-300 rounded-xl p-1 flex items-center justify-center shadow-inner flex-shrink-0">
                    <img
                      src={formData.logoRight}
                      alt="Logo Kanan"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <span className="font-bold text-slate-800 text-xs block truncate">Logo Kanan (Sekolah)</span>
                    <span className="text-[10px] text-slate-500 block truncate">Tut Wuri / Lambang SD</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 pt-1">
                  <label className="flex-1 cursor-pointer px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center text-[11px] font-semibold transition flex items-center justify-center space-x-1 shadow-2xs">
                    <Upload className="w-3 h-3" />
                    <span>Unggah Logo Kanan</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'right')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => resetLogoToDefault('right')}
                    title="Kembalikan ke Logo Bawaan Tut Wuri"
                    className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logoRight: '/logo.png' }));
                    onShowToast('Logo Kanan berhasil diatur ke Logo Resmi e-Visi Supervisi Guru!');
                  }}
                  className="w-full mt-1.5 py-1 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[10.5px] font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>✦ Gunakan Logo Resmi e-Visi (Alur GROW)</span>
                </button>
              </div>
            </div>

            {/* Showcase Banner Logo Resmi Aplikasi e-Visi */}
            <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <div className="flex items-center space-x-3.5">
                <div className="w-20 h-13 bg-white rounded-xl p-1.5 shadow-sm border border-slate-600 flex items-center justify-center flex-shrink-0">
                  <img src="/logo.png" alt="e-Visi Supervisi Guru" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-amber-400">Logo Resmi Aplikasi e-Visi Supervisi Guru</h5>
                  <p className="text-[10.5px] text-slate-300 leading-snug">
                    Identitas visual resmi bersimbol Buku, Figur Guru-Murid, Panah Peningkatan, dan Alur G-R-O-W Coaching.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
                Aktif di Aplikasi
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2">
            <button
              type="button"
              onClick={onResetDemo}
              className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-semibold text-xs border border-rose-200 transition flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Bawaan Demo</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs text-xs transition flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. KARTU CADANGAN & PEMULIHAN SISTEM (BACKUP & RESTORE) */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Cadangan &amp; Pemulihan Data (Backup &amp; Restore)</h3>
            <p className="text-slate-500 text-[11px]">
              Amankan seluruh data aplikasi ke berkas JSON atau pulihkan data supervisi dari cadangan sebelumnya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Opsi 1: Unduh Cadangan Data (Backup) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3.5 hover:border-emerald-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <span>Cadangkan Data (Backup JSON)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Unduh seluruh data aktif (identitas sekolah, master guru, supervisi GROW, audit administrasi, dan foto profil) ke berkas <span className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">.json</span>.
              </p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-600 font-medium">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{teachers.length} Guru</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-600 font-medium">
                  <ClipboardList className="w-3 h-3 text-slate-400" />
                  <span>{observations.length} Supervisi</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-600 font-medium">
                  <FileCheck2 className="w-3 h-3 text-slate-400" />
                  <span>{adminAudits.length} Audit</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onExportBackup}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Cadangan (.json)</span>
            </button>
          </div>

          {/* Opsi 2: Pulihkan Data (Restore) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3.5 hover:border-blue-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <UploadCloud className="w-3.5 h-3.5" />
                </div>
                <span>Pulihkan Data (Restore JSON)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pilih dan muat berkas cadangan <span className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">.json</span> untuk mengembalikan data sekolah dan rekaman supervisi Anda.
              </p>
              <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-lg text-[10px] text-blue-800 leading-tight">
                💡 Sistem akan menampilkan ringkasan data terlebih dahulu sebelum melakukan pemulihan.
              </div>
            </div>

            <div>
              <label className="w-full cursor-pointer py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas Cadangan</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleBackupFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
