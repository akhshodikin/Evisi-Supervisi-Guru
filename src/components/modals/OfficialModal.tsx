import React, { useState, useEffect } from 'react';
import { SchoolSettings } from '../../types';
import { UserCheck, Eye, X } from 'lucide-react';

interface OfficialModalProps {
  isOpen: boolean;
  type: 'ks' | 'pengawas';
  settings: SchoolSettings;
  onClose: () => void;
  onSave: (data: Partial<SchoolSettings>) => void;
}

export const OfficialModal: React.FC<OfficialModalProps> = ({
  isOpen,
  type,
  settings,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [extra1, setExtra1] = useState('');
  const [extra2, setExtra2] = useState('');

  useEffect(() => {
    if (type === 'ks') {
      setName(settings.principalName);
      setNip(settings.principalNip);
      setExtra1(settings.principalTitle || `Kepala Sekolah ${settings.schoolName}`);
      setExtra2('');
    } else {
      setName(settings.supervisorName);
      setNip(settings.supervisorNip);
      setExtra1(settings.supervisorArea || 'Kecamatan Tosari, Kab. Pasuruan');
      setExtra2(settings.supervisorPhone || '0852-3344-6039');
    }
  }, [type, settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'ks') {
      onSave({
        principalName: name.trim(),
        principalNip: nip.trim(),
        principalTitle: extra1.trim()
      });
    } else {
      onSave({
        supervisorName: name.trim(),
        supervisorNip: nip.trim(),
        supervisorArea: extra1.trim(),
        supervisorPhone: extra2.trim()
      });
    }
  };

  return (
    <div className="no-print fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <h3 className="font-bold text-sm flex items-center">
            {type === 'ks' ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400 mr-2" />
                <span>Edit Data Kepala Sekolah (Penilai Utama)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-sky-400 mr-2" />
                <span>Edit Data Pengawas Pembina SD</span>
              </>
            )}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap (dengan Gelar)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {type === 'ks' ? 'Jabatan / Satuan Pendidikan' : 'Wilayah Binaan / Kecamatan'}
            </label>
            <input
              type="text"
              value={extra1}
              onChange={(e) => setExtra1(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {type === 'pengawas' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kontak Telepon / WhatsApp</label>
              <input
                type="text"
                value={extra2}
                onChange={(e) => setExtra2(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

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
              Simpan Data Pejabat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
