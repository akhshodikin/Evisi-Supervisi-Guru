import React, { useState } from 'react';
import { ManagedSchool } from '../../types';
import { getSchoolQuickStats } from '../../data/schoolsData';
import { 
  Building2, 
  Check, 
  ArrowRight, 
  Plus, 
  X, 
  School, 
  Users, 
  ClipboardList, 
  MapPin, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SchoolSwitcherModalProps {
  isOpen: boolean;
  currentSchoolId: string;
  managedSchools: ManagedSchool[];
  onClose: () => void;
  onSelectSchool: (schoolId: string) => void;
  onAddSchool?: (newSchool: ManagedSchool) => void;
}

export const SchoolSwitcherModal: React.FC<SchoolSwitcherModalProps> = ({
  isOpen,
  currentSchoolId,
  managedSchools,
  onClose,
  onSelectSchool,
  onAddSchool
}) => {
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolNpsn, setNewSchoolNpsn] = useState('');
  const [newSchoolShort, setNewSchoolShort] = useState('');
  const [newSchoolStatus, setNewSchoolStatus] = useState('Lembaga Binaan (Plt. KS)');
  const [newSchoolAddress, setNewSchoolAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim() || !newSchoolNpsn.trim()) {
      setErrorMsg('Nama sekolah dan NPSN wajib diisi.');
      return;
    }

    const id = `sch-${Date.now()}`;
    const newSchool: ManagedSchool = {
      id,
      name: newSchoolName.trim().toUpperCase(),
      npsn: newSchoolNpsn.trim(),
      shortName: newSchoolShort.trim() || newSchoolName.trim(),
      statusLabel: newSchoolStatus,
      badgeColor: 'purple',
      address: newSchoolAddress.trim() || 'Kecamatan Tosari, Kabupaten Pasuruan'
    };

    if (onAddSchool) {
      onAddSchool(newSchool);
    }

    setIsAddingSchool(false);
    setNewSchoolName('');
    setNewSchoolNpsn('');
    setNewSchoolShort('');
    setNewSchoolAddress('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-5 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Pilih Lembaga / Ganti Sekolah
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Kepala Sekolah 2 Lembaga
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelola master data guru, supervisi alur GROW, dan administrasi per lembaga secara terpisah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <School className="w-4 h-4 text-emerald-600" />
              <span>Daftar Lembaga yang Anda Pimpin ({managedSchools.length})</span>
            </span>

            {!isAddingSchool && onAddSchool && (
              <button
                type="button"
                onClick={() => setIsAddingSchool(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Lembaga Baru</span>
              </button>
            )}
          </div>

          {/* Form Tambah Lembaga Baru (Expandable) */}
          {isAddingSchool && (
            <form onSubmit={handleCreateSchool} className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                <h4 className="font-bold text-teal-900 flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-teal-700" />
                  <span>Tambah Lembaga Pendidikan Baru</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingSchool(false)}
                  className="text-slate-400 hover:text-slate-600 text-[11px]"
                >
                  Batal
                </button>
              </div>

              {errorMsg && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px]">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan *</label>
                  <input
                    type="text"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="Contoh: SDN MOROREJO I TOSARI"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPSN Sekolah *</label>
                  <input
                    type="text"
                    value={newSchoolNpsn}
                    onChange={(e) => setNewSchoolNpsn(e.target.value)}
                    placeholder="Contoh: 205219715"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Singkat / Label</label>
                  <input
                    type="text"
                    value={newSchoolShort}
                    onChange={(e) => setNewSchoolShort(e.target.value)}
                    placeholder="Contoh: SDN Mororejo 1"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Penugasan Kepala Sekolah</label>
                  <select
                    value={newSchoolStatus}
                    onChange={(e) => setNewSchoolStatus(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    <option value="Lembaga Binaan (Plt. KS)">Lembaga Binaan (Plt. KS)</option>
                    <option value="Lembaga Induk (Definitif)">Lembaga Induk (Definitif)</option>
                    <option value="Lembaga Dampingan">Lembaga Dampingan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Satuan Pendidikan</label>
                <input
                  type="text"
                  value={newSchoolAddress}
                  onChange={(e) => setNewSchoolAddress(e.target.value)}
                  placeholder="Desa / Dusun, Kecamatan Tosari, Kabupaten Pasuruan"
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSchool(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition shadow-xs cursor-pointer"
                >
                  Simpan &amp; Daftarkan Lembaga
                </button>
              </div>
            </form>
          )}

          {/* Cards Lembaga Sekolah */}
          <div className="space-y-3">
            {managedSchools.map((school, index) => {
              const isActive = school.id === currentSchoolId;
              const stats = getSchoolQuickStats(school.id);

              return (
                <div
                  key={school.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-3 rounded-2xl flex-shrink-0 text-white shadow-xs ${
                        isActive 
                          ? 'bg-emerald-600' 
                          : index === 1 
                          ? 'bg-blue-600' 
                          : 'bg-slate-700'
                      }`}>
                        <School className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                            {school.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {school.statusLabel}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-500 flex-wrap gap-y-1">
                          <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                            NPSN: {school.npsn}
                          </span>
                          {school.address && (
                            <span className="flex items-center space-x-1 text-slate-400">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-xs">{school.address}</span>
                            </span>
                          )}
                        </div>

                        {/* Quick Stats Pill */}
                        <div className="flex items-center space-x-2 pt-1 text-[11px]">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium shadow-2xs">
                            <Users className="w-3 h-3 text-teal-600" />
                            <span>{stats.totalTeachers} Guru Terdaftar</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium shadow-2xs">
                            <ClipboardList className="w-3 h-3 text-sky-600" />
                            <span>{stats.totalObservations} Supervisi</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="sm:self-center shrink-0">
                      {isActive ? (
                        <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Lembaga Aktif</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSchool(school.id);
                            onClose();
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer group"
                        >
                          <span>Beralih ke Lembaga Ini</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Isolasi Data Terjamin</p>
              <p className="text-amber-800">
                Setiap lembaga memiliki berkas master data guru, jadwal supervisi alur GROW, modul ajar, dan instrumen 14 dokumen administrasi tersendiri. Beralih lembaga tidak akan mencampuradukkan data kedua sekolah.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
