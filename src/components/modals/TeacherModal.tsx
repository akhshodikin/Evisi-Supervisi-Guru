import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { UserPlus, UserCog, X } from 'lucide-react';

export const SD_CLASSES = [
  { value: 'Kelas 1', label: 'Kelas 1 (Fase A)' },
  { value: 'Kelas 2', label: 'Kelas 2 (Fase A)' },
  { value: 'Kelas 3', label: 'Kelas 3 (Fase B)' },
  { value: 'Kelas 4', label: 'Kelas 4 (Fase B)' },
  { value: 'Kelas 5', label: 'Kelas 5 (Fase C)' },
  { value: 'Kelas 6', label: 'Kelas 6 (Fase C)' },
];

export const SD_MERDEKA_SUBJECTS = [
  { value: 'Pendidikan Agama Islam', label: 'Pendidikan Agama Islam & Budi Pekerti (PAI)' },
  { value: 'PJOK', label: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)' },
  { value: 'Bahasa Inggris', label: 'Bahasa Inggris SD' },
  { value: 'Bahasa Daerah', label: 'Bahasa Daerah / Muatan Lokal (Bahasa Jawa)' },
  { value: 'Seni Rupa', label: 'Seni Rupa' },
  { value: 'Seni Musik', label: 'Seni Musik' },
  { value: 'Seni Tari', label: 'Seni Tari' },
  { value: 'Seni Teater', label: 'Seni Teater' },
  { value: 'Pendidikan Pancasila', label: 'Pendidikan Pancasila (PPKn)' },
  { value: 'Matematika', label: 'Matematika' },
  { value: 'IPAS', label: 'IPAS (Ilmu Pengetahuan Alam & Sosial)' },
  { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' },
  { value: 'Pendidikan Agama Kristen', label: 'Pendidikan Agama Kristen & Budi Pekerti' },
  { value: 'Pendidikan Agama Katolik', label: 'Pendidikan Agama Katolik & Budi Pekerti' },
  { value: 'Pendidikan Agama Hindu', label: 'Pendidikan Agama Hindu & Budi Pekerti' },
];

interface TeacherModalProps {
  isOpen: boolean;
  teacherToEdit: Teacher | null;
  onClose: () => void;
  onSave: (teacherData: Partial<Teacher>) => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  teacherToEdit,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [type, setType] = useState<string>('Guru Kelas');
  const [classSubject, setClassSubject] = useState('Kelas 4');
  const [isCustomClassSubject, setIsCustomClassSubject] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Cuti' | 'Pindah'>('Aktif');

  useEffect(() => {
    if (teacherToEdit) {
      setName(teacherToEdit.name);
      setNip(teacherToEdit.nip);
      setType(teacherToEdit.type);
      setClassSubject(teacherToEdit.classSubject);
      setPhone(teacherToEdit.phone || '');
      setEmail(teacherToEdit.email || '');
      setStatus(teacherToEdit.status);

      const isKnown = 
        SD_CLASSES.some(c => c.value === teacherToEdit.classSubject) ||
        SD_MERDEKA_SUBJECTS.some(s => s.value === teacherToEdit.classSubject);
      setIsCustomClassSubject(!isKnown && Boolean(teacherToEdit.classSubject));
    } else {
      setName('');
      setNip('');
      setType('Guru Kelas');
      setClassSubject('Kelas 4');
      setPhone('');
      setEmail('');
      setStatus('Aktif');
      setIsCustomClassSubject(false);
    }
  }, [teacherToEdit, isOpen]);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setIsCustomClassSubject(false);
    if (newType === 'Guru Kelas') {
      if (!classSubject || !classSubject.toLowerCase().includes('kelas')) {
        setClassSubject('Kelas 4');
      }
    } else if (newType === 'Guru Mata Pelajaran') {
      if (!classSubject || classSubject.toLowerCase().includes('kelas')) {
        setClassSubject('Pendidikan Agama Islam');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(teacherToEdit ? { id: teacherToEdit.id } : {}),
      name,
      nip,
      type,
      classSubject,
      phone,
      email,
      status
    });
  };

  return (
    <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <h3 className="font-bold text-sm flex items-center">
            {teacherToEdit ? (
              <>
                <UserCog className="w-4 h-4 text-amber-400 mr-2" />
                <span>Edit Data Tenaga Pendidik</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-emerald-400 mr-2" />
                <span>Tambah Guru Baru</span>
              </>
            )}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Guru (dengan Gelar)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Siti Rahma, S.Pd"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">NIP / NUPTK</label>
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Contoh: 199005152015022001"
              className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Guru</label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Guru Kelas">Guru Kelas</option>
                <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {type === 'Guru Kelas' ? 'Pilihan Kelas (Jenjang SD)' : 'Mata Pelajaran (Kurikulum Merdeka SD)'}
              </label>
              <select
                value={isCustomClassSubject ? '__custom__' : classSubject}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomClassSubject(true);
                  } else {
                    setIsCustomClassSubject(false);
                    setClassSubject(e.target.value);
                  }
                }}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                {type === 'Guru Kelas' ? (
                  <optgroup label="Pilihan Kelas (Jenjang SD)">
                    {SD_CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <optgroup label="Mata Pelajaran Kurikulum Merdeka SD">
                    {SD_MERDEKA_SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </optgroup>
                )}
                {/* Fallback if current classSubject is an existing custom string */}
                {classSubject && 
                  !isCustomClassSubject &&
                  !SD_CLASSES.some(c => c.value === classSubject) && 
                  !SD_MERDEKA_SUBJECTS.some(s => s.value === classSubject) && (
                    <option value={classSubject}>{classSubject}</option>
                )}
                <option value="__custom__">+ Ketik Kustom...</option>
              </select>

              {isCustomClassSubject && (
                <input
                  type="text"
                  value={classSubject}
                  onChange={(e) => setClassSubject(e.target.value)}
                  placeholder={type === 'Guru Kelas' ? 'Contoh: Kelas 4B' : 'Contoh: PJOK Kelas 1-6'}
                  className="w-full mt-2 p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                  required
                />
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email (Akun Belajar.id / Resmi)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: guru.sd@belajar.id"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kontak Telepon / WA</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Pindah">Pindah</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow transition"
            >
              {teacherToEdit ? 'Simpan Perubahan' : 'Tambah Guru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
