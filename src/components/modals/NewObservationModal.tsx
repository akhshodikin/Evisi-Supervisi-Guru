import React, { useState } from 'react';
import { Teacher } from '../../types';
import { CalendarPlus, X } from 'lucide-react';

interface NewObservationModalProps {
  isOpen: boolean;
  teachers: Teacher[];
  defaultObserver: string;
  onClose: () => void;
  onSubmit: (data: {
    teacherId: string;
    subject: string;
    classTarget: string;
    date: string;
    observer: string;
  }) => void;
}

export const NewObservationModal: React.FC<NewObservationModalProps> = ({
  isOpen,
  teachers,
  defaultObserver,
  onClose,
  onSubmit
}) => {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [subject, setSubject] = useState('IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [classTarget, setClassTarget] = useState('Kelas 4');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observer, setObserver] = useState(defaultObserver);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;
    onSubmit({
      teacherId,
      subject,
      classTarget,
      date,
      observer
    });
  };

  return (
    <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <h3 className="font-bold text-sm flex items-center">
            <CalendarPlus className="w-4 h-4 text-amber-400 mr-2" />
            <span>Buat Jadwal Supervisi Baru (Alur GROW)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Guru yang Diobservasi</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.type} - {t.classSubject})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                <optgroup label="Muatan Pelajaran Guru Kelas (SD)">
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Matematika">Matematika</option>
                  <option value="IPAS (Ilmu Pengetahuan Alam & Sosial)">IPAS</option>
                  <option value="Pendidikan Pancasila">Pendidikan Pancasila (PPKn)</option>
                </optgroup>
                <optgroup label="Mata Pelajaran Khusus Jenjang SD">
                  <option value="Pendidikan Agama Islam">Pendidikan Agama Islam (PAI & BP)</option>
                  <option value="PJOK / Penjaskes">Penjaskes / PJOK</option>
                  <option value="Bahasa Inggris">Bahasa Inggris SD</option>
                  <option value="Bahasa Daerah / Mulok">Bahasa Daerah / Muatan Lokal</option>
                  <option value="Seni Budaya & Prakarya">Seni Budaya & Prakarya (SBdP)</option>
                  <option value="Pendidikan Agama Kristen">Pendidikan Agama Kristen & BP</option>
                  <option value="Pendidikan Agama Katolik">Pendidikan Agama Katolik & BP</option>
                  <option value="Pendidikan Agama Hindu">Pendidikan Agama Hindu & BP</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas Sasaran</label>
              <select
                value={classTarget}
                onChange={(e) => setClassTarget(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                <option value="Kelas 1">Kelas 1</option>
                <option value="Kelas 2">Kelas 2</option>
                <option value="Kelas 3">Kelas 3</option>
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Rencana Observasi</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Observer / Kepala Sekolah</label>
              <input
                type="text"
                value={observer}
                onChange={(e) => setObserver(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-slate-700 text-[11px] leading-relaxed space-y-1">
            <span className="font-bold text-emerald-900 block">Instrumen Observasi Kinerja Guru:</span>
            <p>
              Supervisi mengintegrasikan <strong>Rubrik Alur GROW (PMM)</strong> dan <strong>Unsur Pembelajaran Mendalam (Deep Learning - 33 Indikator)</strong> berbasis pendekatan Mindful, Meaningful, dan Joyful.
            </p>
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
              Jadwalkan & Mulai GROW
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
