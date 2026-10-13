import React, { useState } from 'react';
import { Target, X } from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    program: string;
    focus: string;
    target: string;
    status: 'Direncanakan' | 'Proses' | 'Selesai';
  }) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [program, setProgram] = useState('');
  const [focus, setFocus] = useState('');
  const [target, setTarget] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<'Direncanakan' | 'Proses' | 'Selesai'>('Direncanakan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !focus) return;
    onSubmit({
      program,
      focus,
      target,
      status
    });
    setProgram('');
    setFocus('');
  };

  return (
    <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <h3 className="font-bold text-sm flex items-center">
            <Target className="w-4 h-4 text-purple-400 mr-2" />
            <span>Tambah Rencana Tindak Lanjut (W - WILL)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Bentuk Program / Kegiatan</label>
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Contoh: Komunitas Belajar (Kombel) Guru / Pelatihan Mandiri PMM"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Area Fokus Pengembangan</label>
            <input
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="Contoh: Pembuatan Rubrik Asesmen Teman Sejawat & HOTS"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Batas Waktu</label>
              <input
                type="date"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Pelaksanaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Direncanakan">Direncanakan</option>
                <option value="Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow transition"
            >
              Simpan Tindak Lanjut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
