import React, { useState } from 'react';
import { AuthUser, SchoolSettings, Teacher } from '../../types';
import { getRegisteredUsers, findRegisteredUserByEmail } from '../../services/authService';
import { googleSignIn } from '../../services/googleDriveService';
import { 
  LogIn, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  School,
  Sparkles,
  Mail,
  Loader2
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  settings: SchoolSettings;
  teachers: Teacher[];
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  settings,
  teachers,
  onLoginSuccess,
  onLogout
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pimpinan' | 'guru'>('all');

  if (!isOpen) return null;

  const registeredUsers = getRegisteredUsers(settings, teachers);
  const pimpinanUsers = registeredUsers.filter(u => u.role !== 'guru');
  const guruUsers = registeredUsers.filter(u => u.role === 'guru');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim()) {
      setErrorMessage('Harap masukkan alamat email.');
      return;
    }

    const matchedUser = findRegisteredUserByEmail(emailInput, settings, teachers);
    if (matchedUser) {
      onLoginSuccess({ ...matchedUser, loginMethod: 'email' });
      onClose();
    } else {
      setErrorMessage(
        `Email "${emailInput}" tidak terdaftar dalam basis data SIGUR SD ${settings.schoolName}. Silakan pilih salah satu email resmi di bawah atau hubungi administrator.`
      );
    }
  };

  const handleSelectUser = (user: AuthUser) => {
    setErrorMessage(null);
    onLoginSuccess({ ...user, loginMethod: 'email' });
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (!res || !res.user) {
        setIsLoadingGoogle(false);
        return;
      }

      const googleEmail = res.user.email || '';
      const matchedUser = findRegisteredUserByEmail(googleEmail, settings, teachers);

      if (matchedUser) {
        onLoginSuccess({
          ...matchedUser,
          avatarUrl: res.user.photoURL || matchedUser.avatarUrl,
          loginMethod: 'google'
        });
        onClose();
      } else {
        // If email not found in registered list
        setErrorMessage(
          `Akun Google "${googleEmail}" berhasil diautentikasi namun belum terdaftar sebagai Tenaga Pendidik / Pimpinan di ${settings.schoolName}. Silakan pilih salah satu email yang terdaftar di bawah.`
        );
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User closed the popup, do nothing
      } else if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        setErrorMessage('Domain localhost belum terdaftar pada Google OAuth Firebase Console. Silakan pilih akun resmi Anda langsung dari daftar pengguna di bawah.');
      } else {
        setErrorMessage(err.message || 'Gagal melakukan login dengan Google.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            <span>Administrator</span>
          </span>
        );
      case 'kepala_sekolah':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            <span>Kepala Sekolah</span>
          </span>
        );
      case 'pengawas':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <Eye className="w-3 h-3 text-sky-600" />
            <span>Pengawas Pembina</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <GraduationCap className="w-3 h-3 text-indigo-600" />
            <span>Guru SD (Belajar.id)</span>
          </span>
        );
    }
  };

  const displayedUsers =
    activeTab === 'pimpinan'
      ? pimpinanUsers
      : activeTab === 'guru'
      ? guruUsers
      : registeredUsers;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 flex flex-col max-h-[92vh] overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-auto min-w-[90px] max-w-[130px] rounded-xl bg-white px-2.5 py-1 border border-slate-600/80 flex items-center justify-center flex-shrink-0 shadow-md">
              <img src="/logo.png" alt="e-Visi Supervisi Guru Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Autentikasi Pengguna
                </span>
                <span className="text-xs text-slate-400">• e-Visi Supervisi Guru</span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Masuk Sesuai Email Terdaftar
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Current Login Status Banner if logged in */}
          {currentUser && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    Masuk Sebagai: {currentUser.name}
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    {currentUser.email} • {currentUser.title || currentUser.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                Keluar
              </button>
            </div>
          )}

          {/* Google Sign In Button */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilihan 1: Masuk dengan Akun Google
            </label>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60"
            >
              {isLoadingGoogle ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="text-xs">Memverifikasi Akun Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-xs">
                    Masuk dengan Akun Google (Email Terdaftar)
                  </span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-500 mt-1.5 text-center">
              Khusus akun yang telah terdaftar dalam sistem (misal: akh.shodikin@gmail.com).
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              atau
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form Direct Email Input */}
          <form onSubmit={handleEmailSubmit}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilihan 2: Masukkan Email Terdaftar
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Contoh: akh.shodikin@gmail.com atau nama@guru.sd.belajar.id"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Masuk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Select from Registered Accounts List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilihan 3: Pilih Cepat Akun Terdaftar ({registeredUsers.length} Akun)
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-2.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 px-2 rounded-lg font-semibold transition text-center ${
                  activeTab === 'all'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({registeredUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pimpinan')}
                className={`flex-1 py-1 px-2 rounded-lg font-semibold transition text-center ${
                  activeTab === 'pimpinan'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pimpinan & Admin ({pimpinanUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guru')}
                className={`flex-1 py-1 px-2 rounded-lg font-semibold transition text-center ${
                  activeTab === 'guru'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dewan Guru ({guruUsers.length})
              </button>
            </div>

            {/* Users List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {displayedUsers.map((u, idx) => {
                const isCurrent = currentUser?.email.toLowerCase() === u.email.toLowerCase();
                return (
                  <div
                    key={`${u.email}-${idx}`}
                    onClick={() => handleSelectUser(u)}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer group ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 group-hover:bg-emerald-700 transition">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {u.name}
                          </span>
                          {getRoleBadge(u.role)}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition">
                          Pilih Akun
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center space-x-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{settings.schoolName} • Pasuruan</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
