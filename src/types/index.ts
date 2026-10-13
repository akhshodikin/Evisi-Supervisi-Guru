export type UserRole = 'admin' | 'kepala_sekolah' | 'pengawas' | 'guru';

export type NavView = 
  | 'dashboard' 
  | 'observations' 
  | 'obs-detail' 
  | 'modul-ajar'
  | 'admin-docs'
  | 'followup' 
  | 'teachers' 
  | 'supervisors' 
  | 'reports' 
  | 'settings';

export type ObsStatus = 
  | 'Pra Observasi' 
  | 'Observasi' 
  | 'Pasca Observasi' 
  | 'Tindak Lanjut' 
  | 'Selesai';

export type ObsCategory = 
  | 'Sangat Baik' 
  | 'Baik' 
  | 'Cukup' 
  | 'Perlu Pembinaan' 
  | 'Belum Dinilai';

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  type: 'Guru Kelas' | 'Guru Mata Pelajaran' | string;
  classSubject: string;
  status: 'Aktif' | 'Cuti' | 'Pindah';
  phone?: string;
  email?: string;
}

export interface RubricItem {
  no: number;
  id: string;
  name: string;
  focusPoint?: string;
}

export interface RubricCategory {
  category: string;
  phase: string;
  items: RubricItem[];
}

export interface TimelineNote {
  id: string;
  time: string;
  event: string;
}

export interface FollowUpItem {
  id: string;
  program: string;
  focus: string;
  target: string;
  status: 'Direncanakan' | 'Proses' | 'Selesai';
  pic?: string;
  obsId?: string;
  teacherName?: string;
}

export interface ModulAjarFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  driveFileId?: string;
  driveViewLink?: string;
  driveWebContentLink?: string;
  localUrl?: string; // Data URL or object URL for local PDF preview
  uploadedBy?: string;
  notes?: string;
}

export interface DeepLearningRubricItem {
  id: string;
  no: number;
  aspect: string;
  desc: string;
  dimensionId: 'prinsip' | 'pengalaman' | 'kerangka';
  dimensionTitle: string;
}

export interface DeepLearningDimension {
  id: 'prinsip' | 'pengalaman' | 'kerangka';
  title: string;
  totalItems: number;
  subAspects: {
    name: string;
    items: DeepLearningRubricItem[];
  }[];
}

export interface DeepLearningObservation {
  scores: Record<string, number>; // Rentang Skor 1 - 4
  notes: Record<string, string>;
  rekomendasiObserver?: string;
}

export interface ObservationData {
  id: string;
  teacherId: string;
  teacherName: string;
  nip: string;
  subject: string;
  classTarget: string;
  date: string;
  observer: string;
  status: ObsStatus;
  score: number;
  category: ObsCategory;
  pra: {
    materi: string;
    waktu: string;
    goal1: string;
    goal2: string;
    reality: string;
    options: string;
    will: string;
  };
  scores: Record<string, number>; // 1-4
  evidence: Record<string, string>;
  deepLearning?: DeepLearningObservation;
  timelineNotes: TimelineNote[];
  kekuatan: string;
  rekomendasi: string;
  pasca: {
    refleksiGuru: string;
    options: string;
    will: string;
    feedbackKs: string;
  };
  followups: FollowUpItem[];
  modulAjar?: ModulAjarFile;
}

export interface SchoolSettings {
  schoolName: string;
  npsn: string;
  address: string;
  schoolYear: string;
  semester: 'Ganjil' | 'Genap';
  principalName: string;
  principalNip: string;
  principalTitle: string;
  supervisorName: string;
  supervisorNip: string;
  supervisorArea: string;
  supervisorPhone: string;
  logoLeft: string;
  logoRight: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read?: boolean;
}

export type AdminDocCategory = 'Perencanaan' | 'Pelaksanaan' | 'Penilaian' | 'Penunjang';
export type AdminDocStatus = 'lengkap' | 'kurang' | 'tidak_ada';

export interface AdminDocItem {
  id: string;
  no: number;
  name: string;
  category: AdminDocCategory;
  standard: string;
  status: AdminDocStatus;
  score: number; // 2: Lengkap (100%), 1: Kurang Lengkap (50%), 0: Tidak Ada (0%)
  notes?: string;
  fileUrl?: string;
  fileName?: string;
  lastUpdated?: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  nip?: string;
  avatarUrl?: string;
  teacherId?: string;
  title?: string;
  loginMethod?: 'google' | 'email';
}

export interface TeacherAdminAudit {
  id: string;
  teacherId: string;
  teacherName: string;
  nip: string;
  classSubject: string;
  semester: 'Ganjil' | 'Genap';
  schoolYear: string;
  auditDate: string;
  auditor: string;
  items: AdminDocItem[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan';
  catatanKepsek: string;
  tindakLanjut: string;
  isVerified?: boolean;
}

export interface ManagedSchool {
  id: string; // Unique school identifier, e.g. 'kandangan-1', 'kandangan-2'
  name: string; // e.g. 'SDN KANDANGAN I TOSARI'
  npsn: string; // e.g. '205219711'
  shortName: string; // e.g. 'SDN Kandangan 1'
  statusLabel: string; // e.g. 'Lembaga Induk (Definitif)' or 'Lembaga Binaan (Plt. KS)'
  badgeColor?: 'emerald' | 'blue' | 'amber' | 'purple' | 'teal';
  address?: string;
}

