import React from 'react';
import { UserRole, AuthUser, ManagedSchool } from '../types';
import { ShieldCheck, UserCheck, Eye, GraduationCap, Sparkles, LogIn, KeyRound, School, ChevronDown } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  currentUser?: AuthUser | null;
  currentSchool?: ManagedSchool | null;
  managedSchools?: ManagedSchool[];
  onRoleChange: (role: UserRole) => void;
  onOpenLoginModal?: () => void;
  onOpenSchoolSwitcher?: () => void;
  onSelectSchool?: (schoolId: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ 
  currentRole, 
  currentUser,
  currentSchool,
  managedSchools = [],
  onRoleChange,
  onOpenLoginModal,
  onOpenSchoolSwitcher,
  onSelectSchool
}) => {
  return (
    <div className="no-print bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap justify-between items-center gap-2 border-b border-slate-700/80 z-40">
      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        {/* School Switcher Pill */}
        {currentSchool && onOpenSchoolSwitcher && (
          <button
            type="button"
            onClick={onOpenSchoolSwitcher}
            className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-750 text-white px-2.5 py-1 rounded-md border border-slate-700 text-[11px] font-semibold transition cursor-pointer shadow-2xs group"
            title="Klik untuk beralih antara 2 lembaga sekolah"
          >
            <School className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-amber-300">{currentSchool.shortName}</span>
            <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentSchool.statusLabel.includes('Induk') ? 'Lembaga 1 (Induk)' : 'Lembaga 2 (Plt)'}
            </span>
            <span className="text-[10px] text-slate-400 underline decoration-dotted ml-0.5">
              Ganti ▾
            </span>
          </button>
        )}

        <span className="inline-flex items-center space-x-1 bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] shadow-xs">
          <Sparkles className="w-3 h-3" />
          <span>Alur GROW Aktif</span>
        </span>

        {currentUser ? (
          <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Login:</span>
            <span className="font-semibold text-emerald-300 font-mono">{currentUser.email}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">{currentUser.name}</span>
            {onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="ml-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
              >
                Ganti
              </button>
            )}
          </div>
        ) : (
          onOpenLoginModal && (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded font-semibold border border-amber-500/40 text-[11px] cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>Masuk Email Terdaftar</span>
            </button>
          )
        )}
      </div>

      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <span className="hidden md:inline text-slate-400 text-[11px] mr-1">Simulasi Peran:</span>
        <button
          onClick={() => onRoleChange('admin')}
          className={`px-2.5 py-1 rounded transition flex items-center space-x-1 font-medium text-[11px] cursor-pointer ${
            currentRole === 'admin'
              ? 'bg-slate-700 text-white ring-1 ring-amber-400 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => onRoleChange('kepala_sekolah')}
          className={`px-2.5 py-1 rounded transition flex items-center space-x-1 font-medium text-[11px] cursor-pointer ${
            currentRole === 'kepala_sekolah'
              ? 'bg-slate-700 text-white ring-1 ring-emerald-400 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kepala Sekolah</span>
        </button>

        <button
          onClick={() => onRoleChange('pengawas')}
          className={`px-2.5 py-1 rounded transition flex items-center space-x-1 font-medium text-[11px] cursor-pointer ${
            currentRole === 'pengawas'
              ? 'bg-slate-700 text-white ring-1 ring-sky-400 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>Pengawas</span>
        </button>

        <button
          onClick={() => onRoleChange('guru')}
          className={`px-2.5 py-1 rounded transition flex items-center space-x-1 font-medium text-[11px] cursor-pointer ${
            currentRole === 'guru'
              ? 'bg-slate-700 text-white ring-1 ring-indigo-400 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Guru</span>
        </button>
      </div>
    </div>
  );
};

