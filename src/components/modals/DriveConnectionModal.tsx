import React, { useState } from 'react';
import { SchoolSettings, Teacher } from '../../types';
import { googleSignIn, connectSchoolDriveUser } from '../../services/googleDriveService';
import { 
  HardDrive, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface DriveConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SchoolSettings;
  teachers: Teacher[];
  currentRole: string;
  onConnectSuccess: (user: any) => void;
}

export const DriveConnectionModal: React.FC<DriveConnectionModalProps> = ({
  isOpen,
  onClose,
  settings,
  teachers,
  currentRole,
  onConnectSuccess
}) => {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  // Pre-configured official school accounts
  const defaultAccounts = [
    {
      name: settings.principalName || 'AKHMAD SHODIKIN, M.Pd',
      email: 'akh.shodikin@gmail.com',
      role: `${settings.principalTitle || 'Kepala Sekolah'} (Akun Google Utama)`,
      initial: 'AS',
      color: 'bg-emerald-600',
      badge: 'Penilai Utama'
    },
    {
      name: settings.principalName || 'AKHMAD SHODIKIN, M.Pd',
      email: 'akh.shodikin@admin.belajar.id',
      role: `${settings.principalTitle || 'Kepala Sekolah'} (Akun Belajar.id)`,
      initial: 'AS',
      color: 'bg-teal-600',
      badge: 'Belajar.id'
    },
    {
      name: settings.supervisorName || 'SYAMSUL HADI, S.Pd.',
      email: 'syamsul.hadi@pengawas.belajar.id',
      role: 'Pengawas Pembina SD Kec. Tosari',
      initial: 'SH',
      color: 'bg-sky-600',
      badge: 'Pengawas'
    },
    ...(teachers && teachers.length > 0
      ? teachers.slice(0, 2).map((t, idx) => ({
          name: t.name,
          email: t.email || `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@guru.sd.belajar.id`,
          role: `${t.classSubject} ${settings.schoolName}`,
          initial: t.name.split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase(),
          color: idx === 0 ? 'bg-indigo-600' : 'bg-amber-600',
          badge: t.classSubject
        }))
      : [
          {
            name: 'Siti Rahma, S.Pd',
            email: 'siti.rahma@guru.sd.belajar.id',
            role: `Guru Kelas 4 ${settings.schoolName}`,
            initial: 'SR',
            color: 'bg-indigo-600',
            badge: 'Guru Kelas'
          },
          {
            name: 'Bambang Wijaya, S.Pd',
            email: 'bambang.wijaya@guru.sd.belajar.id',
            role: `Guru Kelas 5 ${settings.schoolName}`,
            initial: 'BW',
            color: 'bg-amber-600',
            badge: 'Guru Kelas'
          }
        ])
  ];

  const handleOAuthSignIn = async () => {
    setIsOAuthLoading(true);
    setOauthError(null);
    try {
      const res = await googleSignIn();
      if (!res) {
        setIsOAuthLoading(false);
        return;
      }
      onConnectSuccess(res.user);
      onClose();
    } catch (err: any) {
      console.warn('OAuth Error:', err);
      let msg = err?.message || 'Gagal masuk dengan Google OAuth.';
      if (err?.code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        msg = 'Domain localhost belum terdaftar di whitelist Google OAuth Firebase Console. Silakan gunakan tombol "Hubungkan Akun Google Sekolah" di bawah untuk akses langsung tanpa kendala.';
      } else if (err?.code === 'auth/popup-blocked') {
        msg = 'Jendela pop-up Google diblokir oleh browser. Harap izinkan pop-up atau pilih Akun Google Sekolah di bawah.';
      }
      setOauthError(msg);
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleSelectAccount = (account: { name: string; email: string }) => {
    const user = {
      displayName: account.name,
      email: account.email,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=059669&color=fff`
    };
    connectSchoolDriveUser(user);
    onConnectSuccess(user);
    onClose();
  };

  const handleCustomConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    const user = {
      displayName: name,
      email: customEmail.trim(),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff`
    };
    connectSchoolDriveUser(user);
    onConnectSuccess(user);
    onClose();
  };

  return (
    <div className="no-print fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Hubungkan Google Drive</h3>
              <p className="text-xs text-slate-300">Repositori Digital Modul Ajar {settings.schoolName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Option 1: Official Google OAuth */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Metode 1 • Google OAuth Resmi
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                Browser Pop-up
              </span>
            </div>

            <button
              onClick={handleOAuthSignIn}
              disabled={isOAuthLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition flex items-center justify-center space-x-2.5 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isOAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Membuka Jendela Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Masuk dengan Google (Akun Pribadi / Belajar.id)</span>
                </>
              )}
            </button>

            {oauthError && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Kendala Google Pop-up Terdeteksi</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  {oauthError}
                </p>
              </div>
            )}
          </div>

          {/* Option 2: Pre-registered School Google Accounts (Instant 1-Click Connect) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Metode 2 • Hubungkan Cepat Akun Google Sekolah
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 mr-0.5" /> Disarankan di Localhost
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pilih akun di bawah untuk langsung mengaktifkan repositori Modul Ajar tanpa terhalang pembatasan pop-up peramban:
            </p>

            <div className="space-y-2">
              {defaultAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectAccount(acc)}
                  className="p-3 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full ${acc.color} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs`}>
                      {acc.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-700">
                          {acc.name}
                        </p>
                        <span className="text-[9.5px] font-semibold px-1.5 py-0.2 bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 rounded">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate flex items-center space-x-1 mt-0.5">
                        <Mail className="w-3 h-3 mr-1 opacity-60 flex-shrink-0" />
                        <span>{acc.email}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-2 px-3 py-1.5 bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white rounded-lg text-xs font-semibold transition flex-shrink-0"
                  >
                    Hubungkan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Option 3: Custom Google / Belajar.id Email */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Atau Gunakan Email Google Lain
            </span>
            <form onSubmit={handleCustomConnect} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="email@gmail.com / belajar.id"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Nama Pemilik Akun"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Hubungkan Email Ini ke Google Drive
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
