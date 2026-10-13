import { SchoolSettings, Teacher, ObservationData, TeacherAdminAudit, ManagedSchool } from '../types';
import { 
  DEFAULT_LOGO_PASURUAN, 
  DEFAULT_LOGO_TUTWURI, 
  INITIAL_SETTINGS, 
  INITIAL_TEACHERS, 
  INITIAL_OBSERVATIONS 
} from './initialData';
import { INITIAL_TEACHER_ADMIN_AUDITS, syncTeacherAudits } from './adminDocsData';
import { DEFAULT_DEEP_LEARNING_SCORES, DEFAULT_DEEP_LEARNING_NOTES } from './deepLearningData';

export const STORAGE_BASE_KEY = 'SIGUR_SD_KANDANGAN_STATE_V3';

/**
 * Daftar Lembaga Sekolah Binaan Kepala Sekolah
 * Default: 2 Lembaga (SDN Kandangan I dan SDN Kandangan II Tosari)
 */
export const DEFAULT_MANAGED_SCHOOLS: ManagedSchool[] = [
  {
    id: 'kandangan-1',
    name: 'SDN KANDANGAN I TOSARI',
    npsn: '205219711',
    shortName: 'SDN Kandangan 1',
    statusLabel: 'Lembaga Induk (Definitif)',
    badgeColor: 'emerald',
    address: 'Dusun Kalitejo, Desa Tosari, Kecamatan Tosari, Kabupaten Pasuruan'
  },
  {
    id: 'kandangan-2',
    name: 'SDN KANDANGAN II TOSARI',
    npsn: '205219712',
    shortName: 'SDN Kandangan 2',
    statusLabel: 'Lembaga Binaan (Plt. KS)',
    badgeColor: 'blue',
    address: 'Jl. Raya Bromo No. 15, Desa Tosari, Kecamatan Tosari, Kabupaten Pasuruan'
  }
];

// ==========================================
// DATA PRESET LEMBAGA 2 (SDN KANDANGAN II)
// ==========================================

export const SCHOOL_2_SETTINGS: SchoolSettings = {
  schoolName: 'SDN KANDANGAN II TOSARI',
  npsn: '205219712',
  address: 'Jl. Raya Bromo No. 15, Desa Tosari, Kecamatan Tosari, Kabupaten Pasuruan',
  principalName: 'AKHMAD SHODIKIN, M.Pd',
  principalNip: '198503182009031009',
  principalTitle: 'Plt. Kepala Sekolah SDN Kandangan II Tosari',
  supervisorName: 'SYAMSUL HADI, S.Pd.',
  supervisorNip: '196703211992021001',
  supervisorArea: 'Kecamatan Tosari, Kab. Pasuruan',
  supervisorPhone: '0852-3344-6039',
  schoolYear: '2025/2026',
  semester: 'Ganjil',
  logoLeft: DEFAULT_LOGO_PASURUAN,
  logoRight: DEFAULT_LOGO_TUTWURI
};

export const SCHOOL_2_TEACHERS: Teacher[] = [
  {
    id: 'T2-01',
    name: 'Agus Santoso, S.Pd',
    nip: '198904122016031002',
    type: 'Guru Kelas',
    classSubject: 'Kelas 1',
    status: 'Aktif',
    phone: '0812-4567-8901',
    email: 'agus.santoso@guru.sd.belajar.id'
  },
  {
    id: 'T2-02',
    name: 'Nurul Hidayati, S.Pd.SD',
    nip: '199307252019032004',
    type: 'Guru Kelas',
    classSubject: 'Kelas 2',
    status: 'Aktif',
    phone: '0856-7890-1234',
    email: 'nurul.hidayati@guru.sd.belajar.id'
  },
  {
    id: 'T2-03',
    name: 'Drs. Slamet Riyadi',
    nip: '196805101994031008',
    type: 'Guru Kelas',
    classSubject: 'Kelas 3',
    status: 'Aktif',
    phone: '0813-1122-3344',
    email: 'slamet.riyadi@guru.sd.belajar.id'
  },
  {
    id: 'T2-04',
    name: 'Tri Wahyuni, S.Pd',
    nip: '199102142017082001',
    type: 'Guru Kelas',
    classSubject: 'Kelas 4',
    status: 'Aktif',
    phone: '0822-3344-5566',
    email: 'tri.wahyuni@guru.sd.belajar.id'
  },
  {
    id: 'T2-05',
    name: 'Hendra Saputra, S.Pd',
    nip: '199403212020121006',
    type: 'Guru Kelas',
    classSubject: 'Kelas 5',
    status: 'Aktif',
    phone: '0812-9988-7766',
    email: 'hendra.saputra@guru.sd.belajar.id'
  },
  {
    id: 'T2-06',
    name: 'Budi Setiawan, S.Pd.I',
    nip: '198711032011011003',
    type: 'Guru Mata Pelajaran',
    classSubject: 'Pendidikan Agama Islam',
    status: 'Aktif',
    phone: '0857-4433-2211',
    email: 'budi.setiawan@guru.sd.belajar.id'
  },
  {
    id: 'T2-07',
    name: 'Fitri Handayani, S.Pd',
    nip: '199608192022032005',
    type: 'Guru Mata Pelajaran',
    classSubject: 'PJOK',
    status: 'Aktif',
    phone: '0895-6677-8899',
    email: 'fitri.handayani@guru.sd.belajar.id'
  }
];

export const SCHOOL_2_OBSERVATIONS: ObservationData[] = [
  {
    id: 'OBS-K2-001',
    teacherId: 'T2-01',
    teacherName: 'Agus Santoso, S.Pd',
    nip: '198904122016031002',
    subject: 'Bahasa Indonesia (Membaca Permulaan)',
    classTarget: 'Kelas 1',
    date: '2026-10-05',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Selesai',
    score: 92,
    category: 'Sangat Baik',
    pra: {
      materi: 'Mengenal Bunyi Huruf dan Suku Kata Bermakna',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Murid kelas 1 fase A mampu merangkai suku kata menjadi kata sederhana dengan kartu bergambar kontekstual flora fauna Tengger.',
      goal2: 'Penerapan diferensiasi proses bagi murid yang sudah lancar membaca dan yang masih membutuhkan bimbingan fonik.',
      reality: 'Beberapa murid masih terbata-bata saat membedakan huruf b dan d.',
      options: 'Menggunakan plastisin sensorik dan permainan tebak kartu suku kata interaktif.',
      will: 'Fokus observer: bagaimana interaksi scaffolding guru mendampingi anak dengan kecepatan belajar berbeda.'
    },
    scores: {
      'A1': 4, 'A2': 4, 'A3': 3, 'B1': 4, 'B2': 4, 'B3': 4, 'B4': 3, 'B5': 4, 'C1': 4, 'C2': 4, 'C3': 4
    },
    evidence: {
      'A1': 'Apersepsi menyanyikan lagu fonik abjad dengan gerakan riang gembira.',
      'A2': 'Tujuan pembelajaran disampaikan dengan bahasa anak yang mudah dipahami.',
      'A3': 'Pemberian apresiasi bintang kebaikan bagi anak yang saling membantu teman sebangku.',
      'B1': 'Permainan menata kartu suku kata berjalan sangat tertib dan menyenangkan.',
      'B2': 'Kelompok mandiri membaca buku cerita berjenjang, kelompok bimbingan didampingi guru dengan kartu raba.',
      'B3': 'Pertanyaan pemantik: "Kata apa yang berawalan dari bunyi Bo?"',
      'B4': 'Kontrak belajar 3 jari saat guru ingin meminta atensi kelas.',
      'B5': 'Media kartu bergambar laminasi rapi dan kartu kata besar di papan flanel.',
      'C1': 'Siswa mampu membaca lantang 5 kata yang disusun secara bergantian.',
      'C2': 'Pujian spesifik: "Bagus sekali Agus, sudah bisa membedakan bunyi ba dan da!"',
      'C3': 'Pemberian stiker senyum sebagai asesmen formatif akhir sesi.'
    },
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: DEFAULT_DEEP_LEARNING_NOTES,
      rekomendasiObserver: 'Sangat inspiratif dalam mempraktikkan joyful learning untuk kelas rendah. Diferensiasi proses berjalan efektif.'
    },
    timelineNotes: [
      { id: 'TL-1', time: '07:15', event: 'Pembiasaan pagi: berbaris di depan kelas, menyapa salam Tosari.' },
      { id: 'TL-2', time: '07:30', event: 'Ice breaking senam otak fonik abjad bergembira.' },
      { id: 'TL-3', time: '07:55', event: 'Aktivitas eksplorasi kelompok susun kata bergambar.' }
    ],
    kekuatan: 'Keterampilan pengelolaan kelas rendah sangat sabar, media ajar kreatif, dan atmosfer belajar penuh kegembiraan.',
    rekomendasi: 'Dapat menambahkan sudut baca mini (reading corner) di pojok kelas untuk kegiatan literasi transisi.',
    pasca: {
      refleksiGuru: 'Anak-anak sangat senang belajar dengan kartu raba suku kata. Target pengenalan bunyi huruf tercapai 90%.',
      options: 'Membuat kotak literasi mini untuk dibawa pulang secara bergilir.',
      will: 'Membagikan materi ajar kartu suku kata kepada guru TK mitra di gugus sekolah.',
      feedbackKs: 'Luar biasa, fondasi literasi kelas 1 sangat kuat. Terus pertahankan pendekatan diferensiasi yang hangat ini.'
    },
    followups: [
      {
        id: 'F-K2-1',
        program: 'Penguatan Sudut Baca Kelas 1 SDN Kandangan II',
        focus: 'Penyediaan 10 Buku Cerita Bergambar Berjenjang',
        target: '2026-10-30',
        status: 'Selesai',
        pic: 'Agus Santoso, S.Pd',
        obsId: 'OBS-K2-001',
        teacherName: 'Agus Santoso, S.Pd'
      }
    ],
    modulAjar: {
      id: 'MOD-K2-001',
      name: 'Modul_Ajar_B_Indonesia_Kelas1_Fonik_Tosari.pdf',
      size: 1540000,
      mimeType: 'application/pdf',
      uploadDate: '5 Oktober 2026',
      uploadedBy: 'Agus Santoso, S.Pd',
      notes: 'Modul ajar kurikulum merdeka membaca permulaan kelas 1'
    }
  },
  {
    id: 'OBS-K2-002',
    teacherId: 'T2-02',
    teacherName: 'Nurul Hidayati, S.Pd.SD',
    nip: '199307252019032004',
    subject: 'Matematika (Pengukuran Panjang Kontekstual)',
    classTarget: 'Kelas 2',
    date: '2026-10-08',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Pasca Observasi',
    score: 88,
    category: 'Baik',
    pra: {
      materi: 'Pengukuran Panjang Benda Sekitar dengan Satuan Baku (cm & m)',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Murid mampu mengukur panjang benda kelas menggunakan penggaris dan pita ukur serta membandingkannya.',
      goal2: 'Menumbuhkan kecermatan dan kerja sama dalam aktivitas hands-on measurement.',
      reality: 'Sebagian murid masih mengukur mulai dari angka 1 bukan angka 0 pada penggaris.',
      options: 'Demonstrasi benda konkret dan video animasi garis bilangan.',
      will: 'Observer mengamati bagaimana guru meluruskan miskonsepsi pengukuran pada siswa.'
    },
    scores: {
      'A1': 4, 'A2': 4, 'A3': 3, 'B1': 4, 'B2': 3, 'B3': 4, 'B4': 3, 'B5': 4, 'C1': 3, 'C2': 4, 'C3': 3
    },
    evidence: {
      'A1': 'Apersepsi mengukur tinggi badan dan panjang meja dengan jengkal tangan.',
      'A2': 'Menjelaskan fungsi penggaris cm dan pita meteran.',
      'A3': 'Kerja sama antar rekan saat menarik pita ukur.',
      'B1': 'Murid berkelompok mengukur 5 benda di sekitar kelas (buku, pensil, tas, meja).',
      'B2': 'Guru membimbing siswa yang lupa memulai dari titik 0.',
      'B3': 'Pertanyaan: "Mengapa panjang meja jika diukur jengkal berbeda, tapi penggaris sama?"',
      'B4': 'Mengatur antrean saat mengukur papan tulis agar tidak berebut.',
      'B5': 'LKPD tabel ukuran dan lembar stempel apresiasi.',
      'C1': 'Perwakilan kelompok mempresentasikan hasil tabel ukuran benda.',
      'C2': 'Konfirmasi dan refleksi bahwa satuan baku menghasilkan nilai ukur yang konsisten.',
      'C3': 'Tugas eksplorasi mandiri mengukur benda di rumah bersama orang tua.'
    },
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: DEFAULT_DEEP_LEARNING_NOTES,
      rekomendasiObserver: 'Aktivitas pengukuran langsung sangat konkret. Disarankan untuk memadukan estimasi sebelum pengukuran nyata.'
    },
    timelineNotes: [
      { id: 'TL-1', time: '08:00', event: 'Pembukaan dan apersepsi jengkal tangan vs penggaris.' },
      { id: 'TL-2', time: '08:20', event: 'Praktik kelompok mengukur benda di dalam kelas.' },
      { id: 'TL-3', time: '08:50', event: 'Pembahasan tabel ukuran dan refleksi kelas.' }
    ],
    kekuatan: 'Aktivitas hands-on mengaktifkan motorik murid, LKPD terstruktur rapi, instruksi jelas.',
    rekomendasi: 'Berikan tantangan tebak estimasi sebelum mengukur agar intuisi matematika anak terasah.',
    pasca: {
      refleksiGuru: 'Siswa sangat bersemangat mengukur meja dan pintu kelas. Miskonsepsi titik 0 berhasil diluruskan.',
      options: 'Menambahkan permainan tebak panjang (estimasi) pada modul pekan depan.',
      will: 'Melaksanakan tindak lanjut pada asesmen sumatif lingkup materi pengukuran.',
      feedbackKs: 'Bagus sekali Bu Nurul. Pembelajaran konkret matematika membuat konsep abstrak menjadi mudah dipahami.'
    },
    followups: []
  },
  {
    id: 'OBS-K2-003',
    teacherId: 'T2-04',
    teacherName: 'Tri Wahyuni, S.Pd',
    nip: '199102142017082001',
    subject: 'IPAS (Bagian Tubuh Tumbuhan & Fungsinya)',
    classTarget: 'Kelas 4',
    date: '2026-10-14',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Pra Observasi',
    score: 0,
    category: 'Belum Dinilai',
    pra: {
      materi: 'Morfologi dan Fungsi Akar, Batang, dan Daun Tanaman Sayur Tosari',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Peserta didik mampu mengidentifikasi bagian morfologi tumbuhan sayuran lokal (wortel, kentang, kubis) dan fungsinya bagi fotosintesis.',
      goal2: 'Penguatan profil pelajar Pancasila gotong royong dan bernalar kritis.',
      reality: 'Murid sering melihat tanaman di ladang tetapi belum memahami fungsi biologis bagian akar yang termodifikasi menjadi umbi.',
      options: 'Membawa spesimen tanaman sayur asli dari pekarangan sekitar sekolah ke dalam kelas.',
      will: 'Observer diharapkan mengamati bagaimana siswa berinteraksi dengan spesimen asli saat investigasi kelompok.'
    },
    scores: {},
    evidence: {},
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: DEFAULT_DEEP_LEARNING_NOTES,
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
  },
  {
    id: 'OBS-K2-004',
    teacherId: 'T2-06',
    teacherName: 'Budi Setiawan, S.Pd.I',
    nip: '198711032011011003',
    subject: 'Pendidikan Agama Islam (Kisah Keteladanan Nabi)',
    classTarget: 'Kelas 5',
    date: '2026-10-10',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Observasi',
    score: 86,
    category: 'Baik',
    pra: {
      materi: 'Nilai Kejujuran dan Amanah dalam Kisah Nabi Muhammad SAW',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Murid mampu meneladani sifat Ash-Shiddiq dan Al-Amanah dalam kehidupan sehari-hari di sekolah dan keluarga.',
      goal2: 'Refleksi komitmen jujur saat ulangan dan berkata benar kepada orang tua.',
      reality: 'Siswa hafal cerita namun perlu pendalaman implementasi perilaku nyata di kelas.',
      options: 'Studi kasus dilema moral dan role playing situasi kejujuran.',
      will: 'Observer mengamati bagaimana murid mendiskusikan dilema moral di kelompok.'
    },
    scores: {
      'A1': 4, 'A2': 4, 'A3': 4, 'B1': 3, 'B2': 4, 'B3': 4, 'B4': 3, 'B5': 3, 'C1': 3, 'C2': 4, 'C3': 3
    },
    evidence: {
      'A1': 'Tadarus surat pendek dan doa dipimpin ketua kelas.',
      'A2': 'Video kisah teladan Al-Amin ditampilkan di proyektor.',
      'A3': 'Pemberian apresiasi anak yang menemukan pensil teman dan menyerahkannya.',
      'B1': 'Diskusi kasus: "Menemukan uang saku di halaman sekolah."',
      'B2': 'Tiap anak menulis komitmen jujur di pohon kejujuran kertas warna.',
      'B3': 'Tanya jawab reflektif mengenai dampak ketidakjujuran.',
      'B4': 'Suasana kelas kondusif dan khidmat.',
      'B5': 'Pohon kejujuran di dinding belakang kelas.',
      'C1': 'Siswa menyimpulkan pentingnya menjaga amanah.',
      'C2': 'Umpan balik positif guru pada pohon kejujuran.',
      'C3': 'Refleksi doa penutup dan evaluasi harian.'
    },
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: DEFAULT_DEEP_LEARNING_NOTES,
      rekomendasiObserver: 'Pohon kejujuran adalah media reflektif yang sangat bermakna bagi penanaman karakter moral murid.'
    },
    timelineNotes: [
      { id: 'TL-1', time: '09:00', event: 'Pembukaan, tadarus bersama, penayangan video inspiratif.' },
      { id: 'TL-2', time: '09:25', event: 'Simulasi dilema moral kejujuran di kelompok.' },
      { id: 'TL-3', time: '09:50', event: 'Menempelkan komitmen di pohon kejujuran kelas.' }
    ],
    kekuatan: 'Penanaman akhlak mulia sangat kontekstual, media pohon kejujuran menarik dan menyentuh emosi murid.',
    rekomendasi: 'Bisa dipadukan dengan jurnal harian kejujuran yang diisi bersama orang tua di rumah.',
    pasca: {
      refleksiGuru: '',
      options: '',
      will: '',
      feedbackKs: ''
    },
    followups: []
  }
];

export const SCHOOL_2_ADMIN_AUDITS: TeacherAdminAudit[] = syncTeacherAudits(
  SCHOOL_2_TEACHERS,
  [],
  SCHOOL_2_SETTINGS
);

// ==========================================
// MULTI-SCHOOL STORAGE & DATA HELPERS
// ==========================================

/**
 * Returns the storage key prefix for a given school ID.
 * For 'kandangan-1', maintains original legacy keys for 100% backward compatibility.
 */
export function getSchoolStoragePrefix(schoolId: string): string {
  if (schoolId === 'kandangan-1' || schoolId === 'sch-kandangan-1') {
    return STORAGE_BASE_KEY;
  }
  return `${STORAGE_BASE_KEY}_${schoolId}`;
}

export interface SchoolBundleData {
  settings: SchoolSettings;
  teachers: Teacher[];
  observations: ObservationData[];
  adminAudits: TeacherAdminAudit[];
}

/**
 * Loads the complete data bundle for a specific school institution.
 * Checks localStorage first; if not found, falls back to default initial presets.
 */
export function loadSchoolData(schoolId: string): SchoolBundleData {
  const prefix = getSchoolStoragePrefix(schoolId);
  const hasStorage = typeof localStorage !== 'undefined';

  // 1. Settings
  let settings: SchoolSettings;
  try {
    const savedSettings = hasStorage ? localStorage.getItem(`${prefix}_SETTINGS`) : null;
    if (savedSettings) {
      settings = JSON.parse(savedSettings);
    } else {
      settings = schoolId === 'kandangan-2' ? { ...SCHOOL_2_SETTINGS } : { ...INITIAL_SETTINGS };
    }
  } catch (e) {
    settings = schoolId === 'kandangan-2' ? { ...SCHOOL_2_SETTINGS } : { ...INITIAL_SETTINGS };
  }

  // 2. Teachers
  let teachers: Teacher[];
  try {
    const savedTeachers = hasStorage ? localStorage.getItem(`${prefix}_TEACHERS`) : null;
    if (savedTeachers) {
      teachers = JSON.parse(savedTeachers);
    } else {
      teachers = schoolId === 'kandangan-2' ? [...SCHOOL_2_TEACHERS] : [...INITIAL_TEACHERS];
    }
  } catch (e) {
    teachers = schoolId === 'kandangan-2' ? [...SCHOOL_2_TEACHERS] : [...INITIAL_TEACHERS];
  }

  // 3. Observations
  let observations: ObservationData[];
  try {
    const savedObservations = hasStorage ? localStorage.getItem(`${prefix}_OBSERVATIONS`) : null;
    if (savedObservations) {
      observations = JSON.parse(savedObservations);
    } else {
      observations = schoolId === 'kandangan-2' ? [...SCHOOL_2_OBSERVATIONS] : [...INITIAL_OBSERVATIONS];
    }
  } catch (e) {
    observations = schoolId === 'kandangan-2' ? [...SCHOOL_2_OBSERVATIONS] : [...INITIAL_OBSERVATIONS];
  }

  // 4. Admin Audits
  let adminAudits: TeacherAdminAudit[];
  try {
    const savedAudits = hasStorage ? localStorage.getItem(`${prefix}_ADMIN_AUDITS`) : null;
    if (savedAudits) {
      const parsed: TeacherAdminAudit[] = JSON.parse(savedAudits);
      adminAudits = syncTeacherAudits(teachers, parsed, settings);
    } else {
      adminAudits = schoolId === 'kandangan-2' 
        ? syncTeacherAudits(teachers, SCHOOL_2_ADMIN_AUDITS, settings)
        : syncTeacherAudits(teachers, INITIAL_TEACHER_ADMIN_AUDITS, settings);
    }
  } catch (e) {
    adminAudits = syncTeacherAudits(teachers, [], settings);
  }

  return {
    settings,
    teachers,
    observations,
    adminAudits
  };
}

/**
 * Persists a school's complete data bundle to localStorage.
 */
export function saveSchoolData(schoolId: string, data: SchoolBundleData): void {
  if (typeof localStorage === 'undefined') return;
  const prefix = getSchoolStoragePrefix(schoolId);
  try {
    localStorage.setItem(`${prefix}_SETTINGS`, JSON.stringify(data.settings));
    localStorage.setItem(`${prefix}_TEACHERS`, JSON.stringify(data.teachers));
    localStorage.setItem(`${prefix}_OBSERVATIONS`, JSON.stringify(data.observations));
    localStorage.setItem(`${prefix}_ADMIN_AUDITS`, JSON.stringify(data.adminAudits));
  } catch (e) {
    console.error(`Failed to save school data for ${schoolId}`, e);
  }
}

/**
 * Returns quick stats (teachers and observations count) for a school.
 */
export function getSchoolQuickStats(schoolId: string): { totalTeachers: number; totalObservations: number } {
  const data = loadSchoolData(schoolId);
  return {
    totalTeachers: data.teachers.length,
    totalObservations: data.observations.length
  };
}
