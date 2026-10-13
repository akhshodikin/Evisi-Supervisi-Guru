import React from 'react';
import { SchoolSettings, UserRole } from '../../types';
import { UserCheck, Eye, Edit3, Shield, MapPin, Phone, Building } from 'lucide-react';

interface SupervisorsViewProps {
  settings: SchoolSettings;
  currentRole: UserRole;
  onEditOfficial: (type: 'ks' | 'pengawas') => void;
}

export const SupervisorsView: React.FC<SupervisorsViewProps> = ({
  settings,
  currentRole,
  onEditOfficial
}) => {
  const canEdit = currentRole === 'admin' || currentRole === 'kepala_sekolah' || currentRole === 'pengawas';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kepala Sekolah Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Kepala Sekolah (Penilai Utama)</h4>
                <p className="text-[11px] text-slate-500">Penanggung jawab supervisi akademik satuan pendidikan</p>
              </div>
            </div>

            {canEdit && (
              <button
                onClick={() => onEditOfficial('ks')}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Data</span>
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                Nama Lengkap &amp; Gelar
              </span>
              <p className="font-extrabold text-slate-900 text-sm">{settings.principalName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                  NIP / NUPTK
                </span>
                <p className="font-mono font-bold text-slate-800">{settings.principalNip}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                  Jabatan Satuan
                </span>
                <p className="font-semibold text-slate-800 truncate">{settings.principalTitle || 'Kepala Sekolah'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2 text-slate-700">
              <Building className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Dinas Pendidikan dan Kebudayaan Kabupaten Pasuruan</span>
            </div>
          </div>
        </div>

        {/* Pengawas Pembina SD Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Pengawas Pembina SD</h4>
                <p className="text-[11px] text-slate-500">Monitoring &amp; evaluasi tingkat kecamatan</p>
              </div>
            </div>

            {canEdit && (
              <button
                onClick={() => onEditOfficial('pengawas')}
                className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Data</span>
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                Nama Pengawas Pembina
              </span>
              <p className="font-extrabold text-slate-900 text-sm">{settings.supervisorName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                  NIP Pengawas
                </span>
                <p className="font-mono font-bold text-slate-800">{settings.supervisorNip}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                  Wilayah Binaan
                </span>
                <p className="font-semibold text-slate-800 truncate">{settings.supervisorArea}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2 text-slate-700">
              <Phone className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>Kontak / WhatsApp: {settings.supervisorPhone || '0852-3344-6039'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role explanation */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-800 block mb-0.5">Mekanisme Kemitraan Supervisi:</span>
          Kepala Sekolah melaksanakan observasi kelas dan coaching reflektif (GROW) secara berkala kepada seluruh guru. Pengawas Pembina SD mendampingi proses, memberikan verifikasi instrumen, dan menandatangani rekapitulasi laporan resmi supervisi satuan pendidikan.
        </div>
      </div>
    </div>
  );
};
