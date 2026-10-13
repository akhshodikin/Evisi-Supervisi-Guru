import React, { useState } from 'react';
import { NavView, UserRole, SchoolSettings, AuthUser, ManagedSchool } from '../types';
import { 
  BarChart3, 
  ClipboardList, 
  PlusCircle, 
  Target, 
  Users2, 
  UserCheck, 
  FileText, 
  Settings,
  School, 
  HardDrive, 
  Camera, 
  FileCheck2, 
  LogIn, 
  KeyRound,
  Building2,
  RefreshCw
} from 'lucide-react';
import { PhotoUploadModal } from './modals/PhotoUploadModal';

interface SidebarProps {
  currentView: NavView;
  currentRole: UserRole;
  settings: SchoolSettings;
  currentUser?: AuthUser | null;
  currentSchool?: ManagedSchool | null;
  managedSchools?: ManagedSchool[];
  onNavigate: (view: NavView) => void;
  onOpenNewObs: () => void;
  onOpenLoginModal?: () => void;
  onOpenSchoolSwitcher?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  currentRole,
  settings,
  currentUser,
  currentSchool,
  managedSchools = [],
  onNavigate,
  onOpenNewObs,
  onOpenLoginModal,
  onOpenSchoolSwitcher
}) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('SIGUR_SD_USER_AVATARS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user avatars', e);
    }
    return {};
  });

  const getUserDisplay = () => {
    if (currentUser) {
      const initials = currentUser.name
        .split(' ')
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'US';
      const roleColor =
        currentUser.role === 'admin'
          ? 'bg-amber-600'
          : currentUser.role === 'kepala_sekolah'
          ? 'bg-emerald-600'
          : currentUser.role === 'pengawas'
          ? 'bg-sky-600'
          : 'bg-indigo-600';

      return {
        name: currentUser.name,
        role: currentUser.title || currentUser.role.replace('_', ' '),
        email: currentUser.email,
        initials,
        color: roleColor
      };
    }

    switch (currentRole) {
      case 'admin':
        return {
          name: 'Administrator SIGUR',
          role: 'Admin Sistem',
          email: 'admin@sigur-sd.id',
          initials: 'AD',
          color: 'bg-amber-600'
        };
      case 'kepala_sekolah':
        return {
          name: settings.principalName,
          role: settings.principalTitle || 'Kepala Sekolah (Penilai)',
          email: 'akh.shodikin@gmail.com',
          initials: 'AS',
          color: 'bg-emerald-600'
        };
      case 'pengawas':
        return {
          name: settings.supervisorName,
          role: 'Pengawas Pembina SD',
          email: 'syamsul.hadi@pengawas.belajar.id',
          initials: 'SH',
          color: 'bg-sky-600'
        };
      case 'guru':
        return {
          name: 'Siti Rahma, S.Pd',
          role: 'Guru Kelas 4',
          email: 'siti.rahma@guru.sd.belajar.id',
          initials: 'SR',
          color: 'bg-indigo-600'
        };
    }
  };

  const user = getUserDisplay();
  const currentAvatarUrl = 
    (currentUser?.email && userAvatars[currentUser.email]) || 
    userAvatars[currentRole] || 
    currentUser?.avatarUrl || 
    null;

  const handleSavePhoto = (photoDataUrl: string | null) => {
    setUserAvatars((prev) => {
      const updated = { ...prev };
      const key = currentUser?.email || currentRole;
      if (photoDataUrl) {
        updated[key] = photoDataUrl;
      } else {
        delete updated[key];
      }
      try {
        localStorage.setItem('SIGUR_SD_USER_AVATARS', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save avatar', err);
      }
      return updated;
    });
  };

  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard Analitik', icon: BarChart3, color: 'text-emerald-400' },
    { type: 'header', label: 'Modul Alur GROW' },
    { id: 'observations' as NavView, label: 'Daftar Supervisi', icon: ClipboardList, color: 'text-sky-400' },
    { id: 'admin-docs' as NavView, label: 'Administrasi Guru', icon: FileCheck2, color: 'text-teal-400' },
    { id: 'modul-ajar' as NavView, label: 'Modul Ajar (Drive)', icon: HardDrive, color: 'text-amber-400' },
    { id: 'new-obs', label: '+ Observasi Baru', icon: PlusCircle, color: 'text-emerald-400', isAction: true },
    { id: 'followup' as NavView, label: 'Rencana Tindak Lanjut', icon: Target, color: 'text-indigo-400' },
    { type: 'header', label: 'Data & Laporan' },
    { id: 'teachers' as NavView, label: 'Master Data Guru', icon: Users2, color: 'text-teal-400' },
    { id: 'supervisors' as NavView, label: 'Pengawas & KS', icon: UserCheck, color: 'text-violet-400' },
    { id: 'reports' as NavView, label: 'Laporan & Cetak A4', icon: FileText, color: 'text-rose-400' },
    { id: 'settings' as NavView, label: 'Pengaturan Sekolah', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <aside className="no-print bg-slate-900 text-white w-full md:w-64 flex-shrink-0 transition-all duration-200 flex flex-col justify-between shadow-xl border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3 bg-slate-950/40">
          <div className="w-10 h-10 bg-emerald-600/90 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 border border-emerald-400/40">
            <School className="w-5 h-5 text-amber-300" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-base leading-tight tracking-wide text-amber-400 flex flex-col">
              <span>E-VISI GURU</span>
              <span className="text-[11px] font-semibold text-emerald-400 tracking-normal normal-case">
                Supervisi Akademik SD
              </span>
            </h1>
            <p className="text-[9.5px] text-slate-400 font-medium tracking-tight uppercase truncate mt-0.5">
              {settings.schoolName}
            </p>
          </div>
        </div>

        {/* Active Managed School Switcher Card */}
        {currentSchool && onOpenSchoolSwitcher && (
          <div className="mx-3 my-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/90 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>Lembaga Aktif</span>
              </span>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {managedSchools.length} Lembaga
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate leading-tight">
                {currentSchool.name}
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] text-emerald-400 font-mono">NPSN: {currentSchool.npsn}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[9.5px] text-slate-400 truncate">{currentSchool.statusLabel}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenSchoolSwitcher}
              className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold border border-slate-700 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-teal-400" />
              <span>Ganti Lembaga ({managedSchools.length})</span>
            </button>
          </div>
        )}

        {/* Active User Profile Badge */}
        <div className="px-4 py-3 bg-slate-850/60 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/20 group">
          <div
            onClick={() => setIsPhotoModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsPhotoModalOpen(true);
              }
            }}
            title="Klik untuk unggah atau ganti foto profil"
            className={`group/avatar relative w-8 h-8 rounded-full ${user.color} flex items-center justify-center font-bold text-xs uppercase text-white ring-2 ring-white/20 shadow-xs flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:ring-emerald-400 hover:scale-105 active:scale-95`}
          >
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{user.initials}</span>
            )}

            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <Camera className="w-3.5 h-3.5 text-white drop-shadow-xs" />
            </div>

            {/* Bottom-right camera badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center ring-1 ring-slate-900 text-white shadow-xs">
              <Camera className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[9.5px] text-slate-400 font-mono truncate">{user.email}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-emerald-400 font-medium capitalize truncate">
                {user.role}
              </span>
              <div className="flex items-center space-x-1.5">
                {onOpenLoginModal && (
                  <button
                    type="button"
                    onClick={onOpenLoginModal}
                    title="Ganti akun / Masuk sesuai email"
                    className="text-[9.5px] text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-0.5 cursor-pointer font-semibold"
                  >
                    <KeyRound className="w-2.5 h-2.5 mr-0.5" />
                    <span>Akun</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  title="Unggah / ganti foto profil"
                  className="text-[9.5px] text-slate-400 hover:text-emerald-300 transition-colors flex items-center space-x-0.5 cursor-pointer"
                >
                  <Camera className="w-2.5 h-2.5 mr-0.5" />
                  <span>Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 text-xs">
          {navItems.map((item, idx) => {
            if (item.type === 'header') {
              return (
                <div key={idx} className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {item.label}
                </div>
              );
            }

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  onClick={onOpenNewObs}
                  className="w-full text-left flex items-center px-3 py-2.5 rounded-lg text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition group"
                >
                  <item.icon className="w-4 h-4 mr-2.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            }

            const isActive = currentView === item.id;
            const Icon = item.icon;
            if (!Icon) return null;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as NavView)}
                className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg transition ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / School Info */}
      <div className="p-3.5 border-t border-slate-800/80 text-[10px] text-slate-400 bg-slate-950/40">
        <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
          <span>NPSN: {settings.npsn}</span>
          <span 
            className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800/60 text-[9px] font-mono font-bold"
            title={`Versi Aplikasi ${new Date().getFullYear()}`}
          >
            v{new Date().getFullYear()}
          </span>
        </div>
        <p className="text-slate-400 truncate">Kec. Tosari, Kab. Pasuruan</p>
      </div>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={currentAvatarUrl}
        userName={user.name}
        userRole={user.role}
        userInitials={user.initials}
        userColor={user.color}
        onSavePhoto={handleSavePhoto}
      />
    </aside>
  );
};
