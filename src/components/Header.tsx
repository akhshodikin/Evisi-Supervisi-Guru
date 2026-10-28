import React, { useState } from 'react';
import { NavView, SchoolSettings, AppNotification, AuthUser } from '../types';
import { GoogleDriveButton } from './GoogleDriveButton';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { User } from 'firebase/auth';
import { Bell, Calendar, Award, LogIn, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentView: NavView;
  settings: SchoolSettings;
  notifications: AppNotification[];
  currentUser?: AuthUser | null;
  isDriveConnected?: boolean;
  driveUser?: User | null;
  isDriveLoading?: boolean;
  onSignInDrive?: () => void;
  onSignOutDrive?: () => void;
  onOpenPrintPreview?: () => void;
  onOpenLoginModal?: () => void;
  onManualCloudSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  settings,
  notifications,
  currentUser,
  isDriveConnected = false,
  driveUser = null,
  isDriveLoading = false,
  onSignInDrive,
  onSignOutDrive,
  onOpenPrintPreview,
  onOpenLoginModal,
  onManualCloudSync
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const schoolName = settings.schoolName || 'Satuan Pendidikan';

  const viewTitles: Record<NavView, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Analitik Supervisi',
      subtitle: `Pendekatan GROW Coaching & Pembelajaran Kurikulum Merdeka PMM • ${schoolName}`
    },
    observations: {
      title: 'Daftar Supervisi Guru',
      subtitle: `Jadwal dan Rekam Jejak Pelaksanaan Observasi Kelas ${schoolName}`
    },
    'obs-detail': {
      title: 'Modul Supervisi GROW Berjenjang',
      subtitle: `Formulir Reflektif: Goal (Pra), Reality (Kelas), Options (Pasca), & Will (Aksi) • ${schoolName}`
    },
    'modul-ajar': {
      title: 'Repositori Modul Ajar Guru',
      subtitle: `Pengelolaan Berkas PDF Modul Ajar Tersimpan di Google Drive • ${schoolName}`
    },
    'admin-docs': {
      title: 'Kelengkapan Dokumen Administrasi Guru',
      subtitle: `Instrumen Supervisi 14 Dokumen Perangkat Pembelajaran SD Kurikulum Merdeka • ${schoolName}`
    },
    followup: {
      title: 'Monitoring Rencana Tindak Lanjut Guru',
      subtitle: `Pelaksanaan Mentoring, Pelatihan Mandiri PMM, dan Kombel ${schoolName}`
    },
    teachers: {
      title: 'Master Data Tenaga Pendidik',
      subtitle: `Daftar Guru Kelas dan Guru Mata Pelajaran ${schoolName}`
    },
    supervisors: {
      title: 'Profil Pejabat Penilai & Pengawas',
      subtitle: `Data Kepala Sekolah dan Pengawas Pembina SD Kecamatan Tosari • ${schoolName}`
    },
    reports: {
      title: 'Laporan & Rekapitulasi Supervisi A4',
      subtitle: `Format Cetak Resmi Pemerintah Kabupaten Pasuruan Dinas Pendidikan • ${schoolName}`
    },
    settings: {
      title: 'Pengaturan Satuan Pendidikan',
      subtitle: `Identitas Sekolah, Pejabat Penilai, dan Kustomisasi Logo Kop Surat • ${schoolName}`
    }
  };

  const { title, subtitle } = viewTitles[currentView] || {
    title: 'E-VISI GURU - Supervisi Akademik SD',
    subtitle: schoolName
  };

  return (
    <header className="no-print mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200/80">
      <div className="flex items-center space-x-3 min-w-0">
        <div className="h-12 w-auto min-w-[96px] max-w-[140px] bg-white rounded-xl border border-slate-200/90 px-2 py-1 flex items-center justify-center flex-shrink-0 shadow-xs hover:border-emerald-300 transition-all">
          <img src="/logo.png" alt="e-Visi Supervisi Guru" className="h-full w-auto object-contain" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">{title}</h2>
          <p className="text-xs text-slate-500 leading-normal truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 self-end sm:self-center">
        {/* Quick Report Print if on reports view */}
        {currentView === 'reports' && onOpenPrintPreview && (
          <button
            onClick={onOpenPrintPreview}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
          >
            <span>Pratinjau A4</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg relative transition"
            title="Notifikasi Supervisi"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-fade-in">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h4 className="font-bold text-slate-800">Notifikasi Supervisi</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                  {notifications.length} Info
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-lg border text-left ${
                      notif.type === 'warning'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : notif.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <p className="font-bold text-[11px]">{notif.title}</p>
                    <p className="text-[10.5px] mt-0.5 opacity-90">{notif.description}</p>
                    <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Status Button */}
        {onSignInDrive && onSignOutDrive && (
          <div className="border-l pl-2.5 border-slate-200 hidden sm:block">
            <GoogleDriveButton
              user={driveUser}
              isConnected={isDriveConnected}
              isLoading={isDriveLoading}
              onSignIn={onSignInDrive}
              onSignOut={onSignOutDrive}
              compact={true}
            />
          </div>
        )}

        {/* Real-time Cloud Sync Indicator */}
        <div className="border-l pl-2.5 border-slate-200">
          <CloudSyncIndicator onManualSync={onManualCloudSync} />
        </div>

        {/* School Year / Semester Badge */}
        <div className="border-l pl-2.5 border-slate-200 flex items-center space-x-1.5">
          <div className="px-2.5 py-1 bg-slate-100 font-semibold text-slate-700 rounded-lg text-xs border border-slate-200 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>TA {settings.schoolYear} - Sem {settings.semester}</span>
          </div>
        </div>

        {/* User Account / Login Button */}
        {onOpenLoginModal && (
          <div className="border-l pl-2.5 border-slate-200">
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-semibold border border-slate-200 hover:border-emerald-300 transition flex items-center space-x-2 cursor-pointer shadow-2xs"
                title={`Akun aktif: ${currentUser.email} (${currentUser.name})`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold uppercase flex-shrink-0">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[11px] font-bold leading-tight truncate max-w-[130px]">{currentUser.name.split(',')[0]}</p>
                  <p className="text-[9px] text-slate-500 font-mono leading-none truncate max-w-[130px]">{currentUser.email}</p>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
