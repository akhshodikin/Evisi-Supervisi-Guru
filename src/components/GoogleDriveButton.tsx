import React from 'react';
import { User } from 'firebase/auth';
import { CheckCircle2, HardDrive, LogOut, Loader2 } from 'lucide-react';

interface GoogleDriveButtonProps {
  user: User | null;
  isConnected: boolean;
  isLoading?: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  compact?: boolean;
}

export const GoogleDriveButton: React.FC<GoogleDriveButtonProps> = ({
  user,
  isConnected,
  isLoading = false,
  onSignIn,
  onSignOut,
  compact = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        <span>Menghubungkan ke Drive...</span>
      </div>
    );
  }

  if (isConnected && user) {
    if (compact) {
      return (
        <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg text-[11px] shadow-2xs">
          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold truncate max-w-[120px]">Drive Aktif</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <button
            onClick={onSignOut}
            title="Putuskan sambungan Google Drive"
            className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-2.5 bg-emerald-50/80 border border-emerald-200/90 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
            ) : (
              (user.displayName || user.email || 'G')[0].toUpperCase()
            )}
          </div>
          <div className="min-w-0 overflow-hidden text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 truncate text-[11px]">
                {user.displayName || 'Akun Google'}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-semibold text-[9px]">
                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-700" /> Drive Terhubung
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          title="Keluar dari Google Drive"
          className="ml-3 px-2 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-semibold transition flex items-center space-x-1 flex-shrink-0"
        >
          <LogOut className="w-3 h-3" />
          <span>Putus</span>
        </button>
      </div>
    );
  }

  // Official Google Sign-in button style
  return (
    <button
      onClick={onSignIn}
      type="button"
      className="inline-flex items-center justify-center px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow-sm space-x-2 active:scale-98"
    >
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      <span>Hubungkan Google Drive</span>
    </button>
  );
};
