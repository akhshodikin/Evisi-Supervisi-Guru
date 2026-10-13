import { useState, useEffect, useRef } from 'react';
import { 
  UserRole, 
  NavView, 
  SchoolSettings, 
  Teacher, 
  ObservationData, 
  AppNotification,
  TeacherAdminAudit,
  AuthUser,
  ManagedSchool
} from './types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_TEACHERS, 
  INITIAL_OBSERVATIONS 
} from './data/initialData';
import { DEFAULT_DEEP_LEARNING_SCORES } from './data/deepLearningData';
import { 
  INITIAL_TEACHER_ADMIN_AUDITS, 
  STANDARD_SD_ADMIN_DOCS,
  syncTeacherAudits,
  findAuditForTeacher,
  syncObservationModulAjarWithAudit 
} from './data/adminDocsData';
import { 
  DEFAULT_MANAGED_SCHOOLS, 
  loadSchoolData, 
  saveSchoolData, 
  getSchoolStoragePrefix,
  SchoolBundleData 
} from './data/schoolsData';
import { 
  subscribeToSchoolCloud, 
  saveSchoolToCloud,
  subscribeToManagedSchoolsCloud,
  saveManagedSchoolsCloud 
} from './services/cloudSyncService';
import { SchoolSwitcherModal } from './components/modals/SchoolSwitcherModal';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { ObservationListView } from './components/views/ObservationListView';
import { ObservationDetailView } from './components/views/ObservationDetailView';
import { ModulAjarView } from './components/views/ModulAjarView';
import { AdminDocsView } from './components/views/AdminDocsView';
import { FollowUpView } from './components/views/FollowUpView';
import { TeachersView } from './components/views/TeachersView';
import { SupervisorsView } from './components/views/SupervisorsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/modals/ConfirmModal';
import { NewObservationModal } from './components/modals/NewObservationModal';
import { TeacherModal } from './components/modals/TeacherModal';
import { FollowUpModal } from './components/modals/FollowUpModal';
import { OfficialModal } from './components/modals/OfficialModal';
import { A4PrintModal } from './components/modals/A4PrintModal';
import { LoginModal } from './components/modals/LoginModal';
import { DriveConnectionModal } from './components/modals/DriveConnectionModal';
import { RestoreModal } from './components/modals/RestoreModal';
import { TeacherImportModal } from './components/modals/TeacherImportModal';
import { exportDataBackup, readBackupFile, BackupDataPayload } from './utils/backupRestore';
import { 
  exportTeachersToXlsx,
  downloadTeacherTemplateXlsx,
  exportTeachersToCsv, 
  downloadTeacherTemplateCsv, 
  parseTeacherImportFile, 
  mergeTeachers 
} from './utils/teacherDataIO';
import { initAuth, googleSignIn, logout, getSavedDriveUser } from './services/googleDriveService';
import { User } from 'firebase/auth';

const STORAGE_KEY = 'SIGUR_SD_KANDANGAN_STATE_V3';

export default function App() {
  // 1. Multi-School Management State
  const [managedSchools, setManagedSchools] = useState<ManagedSchool[]>(() => {
    try {
      const saved = localStorage.getItem('SIGUR_SD_MANAGED_SCHOOLS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading managed schools', e);
    }
    return DEFAULT_MANAGED_SCHOOLS;
  });

  const [currentSchoolId, setCurrentSchoolId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('SIGUR_SD_ACTIVE_SCHOOL_ID');
      if (saved) return saved;
    } catch (e) {
      console.error('Error loading active school ID', e);
    }
    return 'kandangan-1';
  });

  const [isSchoolSwitcherModalOpen, setIsSchoolSwitcherModalOpen] = useState(false);
  const currentSchool = managedSchools.find(s => s.id === currentSchoolId) || managedSchools[0];
  const currentStoragePrefix = getSchoolStoragePrefix(currentSchoolId);

  // Load persistent state bundle for active school
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    return loadSchoolData(currentSchoolId).settings;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    return loadSchoolData(currentSchoolId).teachers;
  });

  const [observations, setObservations] = useState<ObservationData[]>(() => {
    return loadSchoolData(currentSchoolId).observations;
  });

  // User Authentication State (Default: Email terdaftar Kepala Sekolah akh.shodikin@gmail.com)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CURRENT_USER`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading current user', e);
    }
    return {
      email: 'akh.shodikin@gmail.com',
      name: 'AKHMAD SHODIKIN, M.Pd',
      role: 'kepala_sekolah' as UserRole,
      nip: '198503182009031009',
      title: 'Kepala Sekolah (Penilai Utama)',
      loginMethod: 'email'
    };
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser?.role || 'kepala_sekolah';
  });
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [activeObsId, setActiveObsId] = useState<string>(() => observations[0]?.id || 'OBS-2026-001');

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem(`${STORAGE_KEY}_CURRENT_USER`, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving current user', e);
    }
    showToast(`Berhasil masuk sebagai ${user.name} (${user.email})!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_CURRENT_USER`);
    } catch (e) {
      console.error('Error clearing current user', e);
    }
    showToast('Anda telah keluar dari akun.', 'info');
  };

  // Selected teacher for deep-link navigation to Admin Docs view
  const [selectedAdminTeacherId, setSelectedAdminTeacherId] = useState<string | null>(null);

  // Teacher Administrative Document Audits
  const [adminAudits, setAdminAudits] = useState<TeacherAdminAudit[]>(() => {
    return loadSchoolData(currentSchoolId).adminAudits;
  });

  // Automatically keep admin audits synchronized with teachers & settings for current school
  useEffect(() => {
    setAdminAudits(prevAudits => {
      let needsSync = teachers.length !== prevAudits.length;
      if (!needsSync) {
        for (const t of teachers) {
          const match = findAuditForTeacher(t, prevAudits);
          if (!match || match.teacherName !== t.name || match.nip !== t.nip || match.classSubject !== t.classSubject) {
            needsSync = true;
            break;
          }
        }
      }

      if (needsSync) {
        const synced = syncTeacherAudits(teachers, prevAudits, settings);
        try {
          localStorage.setItem(`${currentStoragePrefix}_ADMIN_AUDITS`, JSON.stringify(synced));
        } catch (e) {
          console.error(e);
        }
        return synced;
      }
      return prevAudits;
    });
  }, [teachers, settings, currentStoragePrefix]);

  // Switch Active School Handler
  const handleSwitchSchool = (targetSchoolId: string) => {
    if (targetSchoolId === currentSchoolId) return;

    // 1. Persist current school's data before switching
    saveSchoolData(currentSchoolId, {
      settings,
      teachers,
      observations,
      adminAudits
    });

    // 2. Load target school data bundle
    const targetBundle = loadSchoolData(targetSchoolId);
    const targetSchool = managedSchools.find(s => s.id === targetSchoolId);

    // 3. Update memory state for target school
    setCurrentSchoolId(targetSchoolId);
    setSettings(targetBundle.settings);
    setTeachers(targetBundle.teachers);
    setObservations(targetBundle.observations);
    setAdminAudits(targetBundle.adminAudits);

    // 4. Update active observation ID to the target school's first observation
    if (targetBundle.observations.length > 0) {
      setActiveObsId(targetBundle.observations[0].id);
    } else {
      setActiveObsId('');
    }
    setSelectedAdminTeacherId(null);

    // 5. Persist active school ID to localStorage
    try {
      localStorage.setItem('SIGUR_SD_ACTIVE_SCHOOL_ID', targetSchoolId);
    } catch (e) {
      console.error(e);
    }

    showToast(
      `Beralih ke ${targetSchool?.name || 'sekolah terpilih'}! Data guru & supervisi lembaga ini siap digunakan.`,
      'success'
    );
  };

  // Add New Managed School Handler
  const handleAddManagedSchool = (newSchool: ManagedSchool) => {
    const updated = [...managedSchools, newSchool];
    setManagedSchools(updated);
    try {
      localStorage.setItem('SIGUR_SD_MANAGED_SCHOOLS', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Initialize starter data for new school
    saveSchoolData(newSchool.id, {
      settings: {
        ...INITIAL_SETTINGS,
        schoolName: newSchool.name,
        npsn: newSchool.npsn,
        address: newSchool.address || 'Kecamatan Tosari, Kabupaten Pasuruan',
        principalName: currentUser?.name || INITIAL_SETTINGS.principalName,
        principalNip: currentUser?.nip || INITIAL_SETTINGS.principalNip,
        principalTitle: `${newSchool.statusLabel} ${newSchool.shortName}`
      },
      teachers: [],
      observations: [],
      adminAudits: []
    });

    handleSwitchSchool(newSchool.id);
  };

  // Save Settings & Sync Managed School Profile
  const handleSaveSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    setManagedSchools(prev => {
      const updated = prev.map(s => {
        if (s.id === currentSchoolId) {
          return {
            ...s,
            name: newSettings.schoolName,
            npsn: newSettings.npsn,
            address: newSettings.address
          };
        }
        return s;
      });
      try {
        localStorage.setItem('SIGUR_SD_MANAGED_SCHOOLS', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast(`Identitas lembaga ${newSettings.schoolName} berhasil disimpan!`, 'success');
  };

  const handleUpdateAdminAudit = (updatedAudit: TeacherAdminAudit) => {
    setAdminAudits(prev => {
      const updated = prev.map(a => a.id === updatedAudit.id ? updatedAudit : a);
      try {
        localStorage.setItem(`${STORAGE_KEY}_ADMIN_AUDITS`, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving admin audits', e);
      }
      return updated;
    });
    showToast(`Dokumen administrasi ${updatedAudit.teacherName} berhasil diperbarui!`, 'success');
  };

  // Notifications
  const [notifications] = useState<AppNotification[]>([
    {
      id: 'N1',
      title: 'Jadwal Observasi Kelas Mendatang',
      description: 'Bambang Wijaya, S.Pd (Matematika Kelas 5) - Tahap Pra Observasi',
      time: 'Hari ini',
      type: 'warning'
    },
    {
      id: 'N2',
      title: 'GROW Coaching Selesai',
      description: 'Siti Rahma, S.Pd (IPAS Kelas 4) - Nilai 93 (Sangat Baik)',
      time: 'Kemarin',
      type: 'success'
    }
  ]);

  // Google Drive state
  const [driveUser, setDriveUser] = useState<any>(() => {
    return getSavedDriveUser();
  });
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(() => {
    return Boolean(getSavedDriveUser());
  });
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setDriveUser(user);
        setIsDriveConnected(true);
        setIsDriveLoading(false);
      },
      () => {
        const saved = getSavedDriveUser();
        if (saved) {
          setDriveUser(saved);
          setIsDriveConnected(true);
        } else {
          setDriveUser(null);
          setIsDriveConnected(false);
        }
        setIsDriveLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignInDrive = () => {
    setIsDriveModalOpen(true);
  };

  const handleDriveConnectedSuccess = (user: any) => {
    setDriveUser(user);
    setIsDriveConnected(true);
    showToast(`Google Drive terhubung (${user.email || user.displayName})!`, 'success');
  };

  const handleSignOutDrive = async () => {
    await logout();
    setDriveUser(null);
    setIsDriveConnected(false);
    showToast('Sambungan Google Drive diputuskan.', 'info');
  };

  // Toast state
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Modals state
  const [isNewObsModalOpen, setIsNewObsModalOpen] = useState(false);
  const [teacherModalState, setTeacherModalState] = useState<{ isOpen: boolean; teacher: Teacher | null }>({
    isOpen: false,
    teacher: null
  });
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [officialModalState, setOfficialModalState] = useState<{ isOpen: boolean; type: 'ks' | 'pengawas' }>({
    isOpen: false,
    type: 'ks'
  });
  const [printModalState, setPrintModalState] = useState<{ 
    isOpen: boolean; 
    type: 'individual' | 'rekap';
    defaultFormat?: 'all' | 'pmm' | 'deep-learning';
  }>({
    isOpen: false,
    type: 'individual',
    defaultFormat: 'all'
  });
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restorePreviewData, setRestorePreviewData] = useState<BackupDataPayload | null>(null);
  const [isTeacherImportModalOpen, setIsTeacherImportModalOpen] = useState(false);
  const [teacherImportData, setTeacherImportData] = useState<{
    teachers: Teacher[];
    skippedCount: number;
    fileName: string;
  } | null>(null);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${currentStoragePrefix}_SETTINGS`, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, currentStoragePrefix]);

  useEffect(() => {
    try {
      localStorage.setItem(`${currentStoragePrefix}_TEACHERS`, JSON.stringify(teachers));
    } catch (e) {
      console.error(e);
    }
  }, [teachers, currentStoragePrefix]);

  useEffect(() => {
    try {
      localStorage.setItem(`${currentStoragePrefix}_OBSERVATIONS`, JSON.stringify(observations));
    } catch (e) {
      console.error(e);
    }
  }, [observations, currentStoragePrefix]);

  useEffect(() => {
    try {
      localStorage.setItem(`${currentStoragePrefix}_ADMIN_AUDITS`, JSON.stringify(adminAudits));
    } catch (e) {
      console.error(e);
    }
  }, [adminAudits, currentStoragePrefix]);

  // ==========================================
  // REAL-TIME CLOUD SYNCHRONIZATION (FIRESTORE)
  // ==========================================
  const lastCloudSaveTimestamp = useRef<number>(0);
  const isApplyingRemoteCloudUpdate = useRef<boolean>(false);
  const cloudSaveTimerRef = useRef<any>(null);

  // 1. Subscribe to Cloud Firestore real-time updates for active school
  useEffect(() => {
    const currentBundle: SchoolBundleData = {
      settings,
      teachers,
      observations,
      adminAudits
    };

    const unsubscribe = subscribeToSchoolCloud(
      currentSchoolId,
      currentBundle,
      (remoteBundle, remoteTimestamp) => {
        // Only apply if remote update is newer than our local save
        if (remoteTimestamp && remoteTimestamp > lastCloudSaveTimestamp.current) {
          isApplyingRemoteCloudUpdate.current = true;
          setSettings(remoteBundle.settings);
          setTeachers(remoteBundle.teachers);
          setObservations(remoteBundle.observations);
          setAdminAudits(remoteBundle.adminAudits);
          saveSchoolData(currentSchoolId, remoteBundle);
          setTimeout(() => {
            isApplyingRemoteCloudUpdate.current = false;
          }, 600);
        }
      },
      currentUser?.name || currentUser?.email || 'Kepala Sekolah'
    );

    return () => unsubscribe();
  }, [currentSchoolId]);

  // 2. Debounced save to Cloud Firestore on any local state changes
  useEffect(() => {
    if (isApplyingRemoteCloudUpdate.current) return;

    if (cloudSaveTimerRef.current) {
      clearTimeout(cloudSaveTimerRef.current);
    }

    cloudSaveTimerRef.current = setTimeout(() => {
      const bundle: SchoolBundleData = {
        settings,
        teachers,
        observations,
        adminAudits
      };
      saveSchoolToCloud(currentSchoolId, bundle, currentUser?.name || currentUser?.email)
        .then(res => {
          if (res.success) {
            lastCloudSaveTimestamp.current = res.updatedAt;
          }
        });
    }, 1200);

    return () => {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    };
  }, [settings, teachers, observations, adminAudits, currentSchoolId, currentUser]);

  // 3. Manual Cloud Sync handler
  const handleManualCloudSync = async () => {
    const bundle: SchoolBundleData = {
      settings,
      teachers,
      observations,
      adminAudits
    };
    const res = await saveSchoolToCloud(currentSchoolId, bundle, currentUser?.name || currentUser?.email);
    if (res.success) {
      lastCloudSaveTimestamp.current = res.updatedAt;
      showToast(`Data ${settings.schoolName} tersinkron ke Cloud secara real-time!`, 'success');
    } else {
      showToast('Mode offline: Data tersimpan aman di browser Anda.', 'info');
    }
  };

  // Active observation object
  const activeObservation = observations.find(o => o.id === activeObsId) || observations[0] || null;

  // Handlers
  const handleOpenObsDetail = (obsId: string) => {
    setActiveObsId(obsId);
    setCurrentView('obs-detail');
  };

  const handleCreateObservation = (data: {
    teacherId: string;
    subject: string;
    classTarget: string;
    date: string;
    observer: string;
  }) => {
    const teacher = teachers.find(t => t.id === data.teacherId);
    if (!teacher) return;

    const newId = `OBS-${new Date().getFullYear()}-${String(observations.length + 1).padStart(3, '0')}`;
    const newObs: ObservationData = {
      id: newId,
      teacherId: teacher.id,
      teacherName: teacher.name,
      nip: teacher.nip,
      subject: data.subject,
      classTarget: data.classTarget,
      date: data.date,
      observer: data.observer,
      status: 'Pra Observasi',
      score: 0,
      category: 'Belum Dinilai',
      pra: {
        materi: '',
        waktu: '2 JP (2 x 35 Menit)',
        goal1: '',
        goal2: '',
        reality: '',
        options: '',
        will: ''
      },
      scores: {},
      evidence: {},
      deepLearning: {
        scores: { ...DEFAULT_DEEP_LEARNING_SCORES },
        notes: {},
        rekomendasiObserver: ''
      },
      timelineNotes: [],
      kekuatan: '',
      rekomendasi: '',
      pasca: {
        refleksiGuru: '',
        options: '',
        will: '',
        feedbackKs: ''
      },
      followups: []
    };

    setObservations(prev => [newObs, ...prev]);
    setActiveObsId(newId);
    setIsNewObsModalOpen(false);
    setCurrentView('obs-detail');
    showToast(`Jadwal supervisi ${newId} untuk ${teacher.name} berhasil dibuat!`);
  };

  const handleUpdateObservation = (updated: ObservationData) => {
    setObservations(prev => prev.map(o => (o.id === updated.id ? updated : o)));

    // Auto-sync Modul Ajar uploaded/attached in observation with doc-05 of teacher's admin audit
    if (updated.modulAjar) {
      setAdminAudits(prevAudits => {
        const audit = findAuditForTeacher(updated, prevAudits);
        if (audit) {
          const syncedAudit = syncObservationModulAjarWithAudit(updated, audit);
          const updatedAudits = prevAudits.map(a => a.id === syncedAudit.id ? syncedAudit : a);
          try {
            localStorage.setItem(`${STORAGE_KEY}_ADMIN_AUDITS`, JSON.stringify(updatedAudits));
          } catch (e) {
            console.error(e);
          }
          return updatedAudits;
        }
        return prevAudits;
      });
    }

    showToast(`Data supervisi ${updated.id} berhasil diperbarui.`);
  };

  const handleDeleteObservation = (obs: ObservationData) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Hapus Berkas Supervisi',
      description: `Apakah Anda yakin ingin menghapus catatan supervisi ${obs.id} (${obs.teacherName})? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        setObservations(prev => prev.filter(o => o.id !== obs.id));
        setConfirmModalState(prev => ({ ...prev, isOpen: false }));
        showToast(`Supervisi ${obs.id} berhasil dihapus.`);
      }
    });
  };

  const handleSaveTeacher = (teacherData: Partial<Teacher>) => {
    if (teacherData.id) {
      setTeachers(prev =>
        prev.map(t => (t.id === teacherData.id ? ({ ...t, ...teacherData } as Teacher) : t))
      );
      showToast(`Data guru ${teacherData.name} berhasil diperbarui.`);
    } else {
      const newTeacher: Teacher = {
        id: 'T' + Date.now(),
        name: teacherData.name || '',
        nip: teacherData.nip || '',
        type: teacherData.type || 'Guru Kelas',
        classSubject: teacherData.classSubject || '',
        status: teacherData.status || 'Aktif',
        phone: teacherData.phone,
        email: teacherData.email
      };
      setTeachers(prev => [...prev, newTeacher]);
      showToast(`Guru baru ${newTeacher.name} berhasil ditambahkan.`);
    }
    setTeacherModalState({ isOpen: false, teacher: null });
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Hapus Tenaga Pendidik',
      description: `Apakah Anda yakin ingin menghapus data ${teacher.name} (NIP: ${teacher.nip}) dari sistem?`,
      onConfirm: () => {
        setTeachers(prev => prev.filter(t => t.id !== teacher.id));
        setConfirmModalState(prev => ({ ...prev, isOpen: false }));
        showToast(`Data guru ${teacher.name} dihapus.`);
      }
    });
  };

  const handleExportTeachersXlsx = () => {
    try {
      exportTeachersToXlsx(teachers);
      showToast(`Master data ${teachers.length} guru berhasil diekspor ke Excel (.xlsx)!`, 'success');
    } catch (err: any) {
      showToast(`Gagal mengunduh Excel: ${err.message}`, 'error');
    }
  };

  const handleDownloadTeacherTemplateXlsx = () => {
    try {
      downloadTeacherTemplateXlsx();
      showToast('Template Excel (.xlsx) siap isi berhasil diunduh!', 'success');
    } catch (err: any) {
      showToast(`Gagal mengunduh template Excel: ${err.message}`, 'error');
    }
  };

  const handleExportTeachersCsv = () => {
    try {
      exportTeachersToCsv(teachers);
      showToast(`Master data ${teachers.length} guru berhasil diunduh (.csv)!`, 'success');
    } catch (err: any) {
      showToast(`Gagal mengunduh data guru CSV: ${err.message}`, 'error');
    }
  };

  const handleImportTeacherFile = async (file: File) => {
    try {
      const result = await parseTeacherImportFile(file);
      if (result.validTeachers.length === 0) {
        showToast('Tidak ditemukan data guru yang valid dalam berkas yang diunggah.', 'error');
        return;
      }
      setTeacherImportData({
        teachers: result.validTeachers,
        skippedCount: result.skippedCount,
        fileName: file.name
      });
      setIsTeacherImportModalOpen(true);
    } catch (err: any) {
      showToast(`Gagal membaca berkas guru: ${err.message}`, 'error');
    }
  };

  const handleConfirmTeacherImport = (imported: Teacher[], mode: 'merge' | 'replace') => {
    try {
      const updated = mergeTeachers(teachers, imported, mode);
      setTeachers(updated);
      localStorage.setItem(`${STORAGE_KEY}_TEACHERS`, JSON.stringify(updated));
      setIsTeacherImportModalOpen(false);
      setTeacherImportData(null);
      showToast(
        `Berhasil mengimpor ${imported.length} tenaga pendidik (${mode === 'merge' ? 'Data Digabungkan' : 'Data Digantikan'})!`,
        'success'
      );
    } catch (err: any) {
      showToast(`Gagal mengimpor data guru: ${err.message}`, 'error');
    }
  };

  const handleAddFollowUpToActiveObs = (data: {
    program: string;
    focus: string;
    target: string;
    status: 'Direncanakan' | 'Proses' | 'Selesai';
  }) => {
    if (!activeObservation) return;

    const newFollowUp = {
      id: 'F' + Date.now(),
      program: data.program,
      focus: data.focus,
      target: data.target,
      status: data.status,
      pic: 'Kepala Sekolah',
      obsId: activeObservation.id,
      teacherName: activeObservation.teacherName
    };

    const updated = {
      ...activeObservation,
      followups: [...(activeObservation.followups || []), newFollowUp]
    };

    handleUpdateObservation(updated);
    setIsFollowUpModalOpen(false);
    showToast('Rencana tindak lanjut berhasil ditambahkan!');
  };

  const handleSaveOfficial = (updatedSettings: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
    setOfficialModalState(prev => ({ ...prev, isOpen: false }));
    showToast('Data pejabat penilai berhasil diperbarui!');
  };

  const handleResetDemoData = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Reset Pengaturan & Data Demo',
      description: 'Apakah Anda yakin ingin mengembalikan seluruh data supervisi, guru, dan kop sekolah ke data awal bawaan?',
      onConfirm: () => {
        localStorage.removeItem(`${STORAGE_KEY}_SETTINGS`);
        localStorage.removeItem(`${STORAGE_KEY}_TEACHERS`);
        localStorage.removeItem(`${STORAGE_KEY}_OBSERVATIONS`);
        localStorage.removeItem(`${STORAGE_KEY}_ADMIN_AUDITS`);
        setSettings(INITIAL_SETTINGS);
        setTeachers(INITIAL_TEACHERS);
        setObservations(INITIAL_OBSERVATIONS);
        setAdminAudits(INITIAL_TEACHER_ADMIN_AUDITS);
        setActiveObsId(INITIAL_OBSERVATIONS[0].id);
        setCurrentView('dashboard');
        setConfirmModalState(prev => ({ ...prev, isOpen: false }));
        showToast('Data berhasil direset ke pengaturan awal demo.');
      }
    });
  };

  const handleExportBackup = () => {
    try {
      let avatars: Record<string, string> = {};
      try {
        const savedAvatars = localStorage.getItem('SIGUR_SD_USER_AVATARS');
        if (savedAvatars) avatars = JSON.parse(savedAvatars);
      } catch (e) {
        console.error('Error loading avatars for backup', e);
      }

      exportDataBackup({
        settings,
        teachers,
        observations,
        adminAudits,
        userAvatars: avatars
      });
      showToast('Cadangan data berhasil diunduh ke komputer Anda!', 'success');
    } catch (err: any) {
      showToast(`Gagal mengunduh cadangan: ${err.message || 'Terjadi kesalahan'}`, 'error');
    }
  };

  const handleRequestRestore = async (file: File) => {
    try {
      const payload = await readBackupFile(file);
      setRestorePreviewData(payload);
      setIsRestoreModalOpen(true);
    } catch (err: any) {
      showToast(`Berkas tidak valid: ${err.message}`, 'error');
    }
  };

  const handleConfirmRestore = (payload: BackupDataPayload) => {
    try {
      // 1. Update State
      setSettings(payload.data.settings);
      setTeachers(payload.data.teachers);
      setObservations(payload.data.observations);
      if (payload.data.adminAudits) {
        setAdminAudits(payload.data.adminAudits);
      }

      // 2. Persist immediately to localStorage
      localStorage.setItem(`${STORAGE_KEY}_SETTINGS`, JSON.stringify(payload.data.settings));
      localStorage.setItem(`${STORAGE_KEY}_TEACHERS`, JSON.stringify(payload.data.teachers));
      localStorage.setItem(`${STORAGE_KEY}_OBSERVATIONS`, JSON.stringify(payload.data.observations));
      if (payload.data.adminAudits) {
        localStorage.setItem(`${STORAGE_KEY}_ADMIN_AUDITS`, JSON.stringify(payload.data.adminAudits));
      }
      if (payload.data.userAvatars && Object.keys(payload.data.userAvatars).length > 0) {
        localStorage.setItem('SIGUR_SD_USER_AVATARS', JSON.stringify(payload.data.userAvatars));
      }

      // 3. Ensure valid active observation
      if (payload.data.observations.length > 0) {
        const exists = payload.data.observations.some(o => o.id === activeObsId);
        if (!exists) {
          setActiveObsId(payload.data.observations[0].id);
        }
      }

      setIsRestoreModalOpen(false);
      setRestorePreviewData(null);
      showToast(`Data sekolah ${payload.data.settings.schoolName || ''} berhasil dipulihkan!`, 'success');
    } catch (err: any) {
      showToast(`Gagal memulihkan data: ${err.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* 1. Top Role Switcher */}
      <RoleSwitcher
        currentRole={currentRole}
        currentUser={currentUser}
        currentSchool={currentSchool}
        managedSchools={managedSchools}
        onRoleChange={(role) => {
          setCurrentRole(role);
          showToast(`Beralih simulasi peran: ${role.replace('_', ' ').toUpperCase()}`, 'info');
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenSchoolSwitcher={() => setIsSchoolSwitcherModalOpen(true)}
        onSelectSchool={handleSwitchSchool}
      />

      {/* 2. Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          currentRole={currentRole}
          settings={settings}
          currentUser={currentUser}
          currentSchool={currentSchool}
          managedSchools={managedSchools}
          onNavigate={(view) => {
            if (view !== 'admin-docs') setSelectedAdminTeacherId(null);
            setCurrentView(view);
          }}
          onOpenNewObs={() => setIsNewObsModalOpen(true)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenSchoolSwitcher={() => setIsSchoolSwitcherModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 bg-slate-50/70 p-4 md:p-6 overflow-y-auto">
          {/* Header */}
          <Header
            currentView={currentView}
            settings={settings}
            notifications={notifications}
            currentUser={currentUser}
            isDriveConnected={isDriveConnected}
            driveUser={driveUser}
            isDriveLoading={isDriveLoading}
            onSignInDrive={handleSignInDrive}
            onSignOutDrive={handleSignOutDrive}
            onOpenPrintPreview={() => setPrintModalState({ isOpen: true, type: 'rekap' })}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onManualCloudSync={handleManualCloudSync}
          />

          {/* Dynamic Views */}
          {currentView === 'dashboard' && (
            <DashboardView
              teachers={teachers}
              observations={observations}
              schoolName={settings.schoolName}
              onNavigate={(view) => setCurrentView(view)}
              onOpenObsDetail={handleOpenObsDetail}
              onOpenNewObs={() => setIsNewObsModalOpen(true)}
            />
          )}

          {currentView === 'observations' && (
            <ObservationListView
              observations={observations}
              adminAudits={adminAudits}
              settings={settings}
              onOpenDetail={handleOpenObsDetail}
              onOpenNewModal={() => setIsNewObsModalOpen(true)}
              onDeleteObs={handleDeleteObservation}
              onOpenAdminDocsForTeacher={(teacherId) => {
                setSelectedAdminTeacherId(teacherId);
                setCurrentView('admin-docs');
              }}
            />
          )}

          {currentView === 'modul-ajar' && (
            <ModulAjarView
              observations={observations}
              isDriveConnected={isDriveConnected}
              driveUser={driveUser}
              isDriveLoading={isDriveLoading}
              onSignInDrive={handleSignInDrive}
              onSignOutDrive={handleSignOutDrive}
              onOpenObsDetail={handleOpenObsDetail}
              onUpdateObservation={handleUpdateObservation}
              onShowToast={showToast}
              onConfirmDelete={(title, description, onConfirm) =>
                setConfirmModalState({ isOpen: true, title, description, onConfirm })
              }
            />
          )}

          {currentView === 'admin-docs' && (
            <AdminDocsView
              audits={adminAudits}
              settings={settings}
              currentRole={currentRole}
              selectedTeacherId={selectedAdminTeacherId}
              onClearSelectedTeacher={() => setSelectedAdminTeacherId(null)}
              onUpdateAudit={handleUpdateAdminAudit}
            />
          )}

          {currentView === 'obs-detail' && activeObservation && (
            <ObservationDetailView
              observation={activeObservation}
              settings={settings}
              adminAudits={adminAudits}
              onUpdateAdminAudit={handleUpdateAdminAudit}
              isDriveConnected={isDriveConnected}
              onConnectDrive={handleSignInDrive}
              onBack={() => setCurrentView('observations')}
              onUpdateObservation={handleUpdateObservation}
              onOpenPrintPreview={(format) => setPrintModalState({ isOpen: true, type: 'individual', defaultFormat: format || 'all' })}
              onOpenFollowUpModal={() => setIsFollowUpModalOpen(true)}
              onShowToast={showToast}
              onConfirmDelete={(title, description, onConfirm) =>
                setConfirmModalState({ isOpen: true, title, description, onConfirm })
              }
              onNavigateToAdminDocs={(teacherId) => {
                setSelectedAdminTeacherId(teacherId || activeObservation.teacherId);
                setCurrentView('admin-docs');
              }}
            />
          )}

          {currentView === 'followup' && (
            <FollowUpView
              observations={observations}
              onOpenObsDetail={handleOpenObsDetail}
              onUpdateObservation={handleUpdateObservation}
            />
          )}

          {currentView === 'teachers' && (
            <TeachersView
              teachers={teachers}
              currentRole={currentRole}
              schoolName={settings.schoolName}
              onAddTeacher={() => setTeacherModalState({ isOpen: true, teacher: null })}
              onEditTeacher={(teacher) => setTeacherModalState({ isOpen: true, teacher })}
              onDeleteTeacher={handleDeleteTeacher}
              onExportTeachersXlsx={handleExportTeachersXlsx}
              onDownloadTemplateXlsx={handleDownloadTeacherTemplateXlsx}
              onExportTeachersCsv={handleExportTeachersCsv}
              onImportFile={handleImportTeacherFile}
            />
          )}

          {currentView === 'supervisors' && (
            <SupervisorsView
              settings={settings}
              currentRole={currentRole}
              onEditOfficial={(type) => setOfficialModalState({ isOpen: true, type })}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              observations={observations}
              settings={settings}
              onOpenPrintModal={(type) => setPrintModalState({ isOpen: true, type })}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              teachers={teachers}
              observations={observations}
              adminAudits={adminAudits}
              currentSchoolId={currentSchoolId}
              managedSchools={managedSchools}
              onSaveSettings={handleSaveSettings}
              onResetDemo={handleResetDemoData}
              onExportBackup={handleExportBackup}
              onRequestRestore={handleRequestRestore}
              onShowToast={showToast}
              onOpenSchoolSwitcher={() => setIsSchoolSwitcherModalOpen(true)}
              onSwitchSchool={handleSwitchSchool}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. New Observation Modal */}
      <NewObservationModal
        isOpen={isNewObsModalOpen}
        teachers={teachers}
        defaultObserver={settings.principalName}
        onClose={() => setIsNewObsModalOpen(false)}
        onSubmit={handleCreateObservation}
      />

      {/* 2. Teacher Add/Edit Modal */}
      <TeacherModal
        isOpen={teacherModalState.isOpen}
        teacherToEdit={teacherModalState.teacher}
        onClose={() => setTeacherModalState({ isOpen: false, teacher: null })}
        onSave={handleSaveTeacher}
      />

      {/* 3. Follow-Up Add Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSubmit={handleAddFollowUpToActiveObs}
      />

      {/* 4. Official Profile Modal */}
      <OfficialModal
        isOpen={officialModalState.isOpen}
        type={officialModalState.type}
        settings={settings}
        onClose={() => setOfficialModalState(prev => ({ ...prev, isOpen: false }))}
        onSave={handleSaveOfficial}
      />

      {/* 5. A4 Document Preview Modal */}
      <A4PrintModal
        isOpen={printModalState.isOpen}
        type={printModalState.type}
        observation={activeObservation}
        allObservations={observations}
        settings={settings}
        defaultFormat={printModalState.defaultFormat}
        onClose={() => setPrintModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 6. Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        description={confirmModalState.description}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 7. Login Sesuai Email Terdaftar Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        settings={settings}
        teachers={teachers}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* 8. Google Drive Connection Modal */}
      <DriveConnectionModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        settings={settings}
        teachers={teachers}
        currentRole={currentRole}
        onConnectSuccess={handleDriveConnectedSuccess}
      />

      {/* 9. Restore Data Confirmation Modal */}
      <RestoreModal
        isOpen={isRestoreModalOpen}
        backupData={restorePreviewData}
        onClose={() => {
          setIsRestoreModalOpen(false);
          setRestorePreviewData(null);
        }}
        onConfirmRestore={handleConfirmRestore}
      />

      {/* 10. Teacher Master Data Import Modal */}
      <TeacherImportModal
        isOpen={isTeacherImportModalOpen}
        importedTeachers={teacherImportData?.teachers || []}
        skippedCount={teacherImportData?.skippedCount}
        fileName={teacherImportData?.fileName || 'Berkas Guru'}
        existingTeachersCount={teachers.length}
        onClose={() => {
          setIsTeacherImportModalOpen(false);
          setTeacherImportData(null);
        }}
        onConfirmImport={handleConfirmTeacherImport}
      />

      {/* 11. School Switcher / Multi-Institution Modal */}
      <SchoolSwitcherModal
        isOpen={isSchoolSwitcherModalOpen}
        currentSchoolId={currentSchoolId}
        managedSchools={managedSchools}
        onClose={() => setIsSchoolSwitcherModalOpen(false)}
        onSelectSchool={handleSwitchSchool}
        onAddSchool={handleAddManagedSchool}
      />

      {/* 12. Non-blocking Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
