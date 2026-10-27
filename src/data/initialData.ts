import { SchoolSettings, Teacher, ObservationData } from '../types';
import { DEFAULT_DEEP_LEARNING_SCORES, DEFAULT_DEEP_LEARNING_NOTES } from './deepLearningData';

export const DEFAULT_LOGO_PASURUAN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115"><path d="M50 5 L90 20 L90 70 C90 95 50 110 50 110 C50 110 10 95 10 70 L10 20 Z" fill="%230284c7" stroke="%23f59e0b" stroke-width="3"/><path d="M50 12 L83 24 L83 67 C83 88 50 101 50 101 C50 101 17 88 17 67 L17 24 Z" fill="%230369a1"/><polygon points="50,26 62,60 50,55 38,60" fill="%23f8fafc"/><polygon points="50,45 75,75 25,75" fill="%2315803d"/><circle cx="50" cy="36" r="6" fill="%23fbbf24"/><path d="M22 75 Q50 92 78 75" stroke="%23fbbf24" stroke-width="4" fill="none"/><rect x="25" y="80" width="50" height="12" rx="3" fill="%23f59e0b"/><text x="50" y="89" font-size="6.5" font-weight="bold" fill="%231e293b" text-anchor="middle" font-family="sans-serif">PASURUAN</text></svg>`;

export const DEFAULT_LOGO_TUTWURI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 92,30 80,82 20,82 8,30" fill="%230284c7" stroke="%23f59e0b" stroke-width="3"/><path d="M50 20 C54 28 62 30 62 38 C62 46 54 48 50 54 C46 48 38 46 38 38 C38 30 46 28 50 20 Z" fill="%23f59e0b"/><path d="M26 62 Q50 52 74 62 Q50 70 26 62 Z" fill="%23ffffff"/><path d="M30 65 L50 78 L70 65" stroke="%23f59e0b" stroke-width="3" fill="none"/><circle cx="50" cy="38" r="4" fill="%23ef4444"/><text x="50" y="93" font-size="7" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">TUT WURI</text></svg>`;

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'SDN KANDANGAN I TOSARI',
  npsn: '205219711',
  address: 'Dusun Kalitejo, Desa Tosari, Kecamatan Tosari, Kabupaten Pasuruan',
  principalName: 'AKHMAD SHODIKIN, M.Pd',
  principalNip: '198503182009031009',
  principalTitle: 'Kepala Sekolah SDN Kandangan I Tosari',
  supervisorName: 'SYAMSUL HADI, S.Pd.',
  supervisorNip: '196703211992021001',
  supervisorArea: 'Kecamatan Tosari, Kab. Pasuruan',
  supervisorPhone: '0852-3344-6039',
  schoolYear: '2025/2026',
  semester: 'Ganjil',
  logoLeft: DEFAULT_LOGO_PASURUAN,
  logoRight: DEFAULT_LOGO_TUTWURI,
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'T1',
    name: 'Ireliya Austina Prahesti',
    nip: '199906092024212038',
    type: 'Guru Kelas',
    classSubject: 'Kelas 6',
    status: 'Aktif',
    phone: '088989540295',
    email: 'pireliya9@gmail.com'
  },
  {
    id: 'T2',
    name: 'Lestari Handayani',
    nip: '198412212022212013',
    type: 'Guru Kelas',
    classSubject: 'Kelas 4',
    status: 'Aktif',
    phone: '082257180688',
    email: 'handayanilestari842@gmail.com'
  },
  {
    id: 'T3',
    name: 'LULUK MUNZIYAH',
    nip: '199511242020122009',
    type: 'Guru Mata Pelajaran',
    classSubject: 'Pendidikan Agama Islam',
    status: 'Aktif',
    phone: '085895739248',
    email: 'munziyah7@gmail.com'
  },
  {
    id: 'T4',
    name: 'MARTHA DIMAS LELY OKTA WIDHANA',
    nip: '199603052020121011',
    type: 'Guru Kelas',
    classSubject: 'Kelas 5',
    status: 'Aktif',
    phone: '082336467927',
    email: 'marthadimas778@gmail.com'
  },
  {
    id: 'T5',
    name: 'Nevilia Yunitasari',
    nip: '199006042024212051',
    type: 'Guru Kelas',
    classSubject: 'Kelas 1',
    status: 'Aktif',
    phone: '085755739160',
    email: 'safanita00@gmail.com'
  },
  {
    id: 'T6',
    name: 'Nurul Afifah',
    nip: '198903122020122013',
    type: 'Guru Kelas',
    classSubject: 'Kelas 3',
    status: 'Aktif',
    phone: '082131403050',
    email: 'fifadaipa@gmail.com'
  }
];

export const INITIAL_OBSERVATIONS: ObservationData[] = [
  {
    id: 'OBS-2026-001',
    teacherId: 'T2',
    teacherName: 'Lestari Handayani',
    nip: '198412212022212013',
    subject: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    classTarget: 'Kelas 4',
    date: '2026-10-02',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Selesai',
    score: 93,
    category: 'Sangat Baik',
    pra: {
      materi: 'Rantai Makanan dalam Ekosistem Pertanian Lereng Bromo',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Peserta didik mampu mengidentifikasi rantai makanan dan mengklasifikasikan peran organisme dalam ekosistem pertanian lokal.',
      goal2: 'Penguatan pembelajaran berdiferensiasi konten dan proses berdasarkan gaya belajar visual dan kinestetik siswa.',
      reality: 'Siswa aktif namun terkadang beberapa anak kurang percaya diri mengemukakan pendapat di depan kelompok kelas.',
      options: 'Menggunakan kartu simulasi peran ekosistem konkret, video kontekstual desa Tosari, dan lembar kerja berjenjang.',
      will: 'Observer diharapkan fokus mengamati keaktifan kolaborasi antar siswa dan strategi scaffolding guru saat diskusi kelompok.'
    },
    scores: {
      'A1': 4,
      'A2': 4,
      'A3': 3,
      'B1': 4,
      'B2': 4,
      'B3': 3,
      'B4': 4,
      'B5': 4,
      'C1': 3,
      'C2': 4,
      'C3': 4
    },
    evidence: {
      'A1': 'Guru menyapa murid dengan hangat dalam dialek lokal yang sopan, memimpin doa, dan mengaitkan video pertanian sayur Tosari.',
      'A2': 'Tujuan dan alur 4 pos pembelajaran kelompok ditampilkan di slide infografis dengan jelas.',
      'A3': 'Mengaitkan gotong royong dan kesadaran menjaga keseimbangan alam Tengger.',
      'B1': 'Diskusi 4 kelompok berjalan sangat hidup menggunakan kartu peran rantai makanan.',
      'B2': 'Tersedia LKPD bergambar untuk siswa visual dan simulasi gerak peran untuk siswa kinestetik.',
      'B3': 'Pertanyaan pemantik: "Apa yang akan terjadi pada ladang kentang jika elang dan ular habis diburu?"',
      'B4': 'Guru mengingatkan kesepakatan kelas dengan teknik hand-signal saat suasana mulai terlalu gaduh.',
      'B5': 'Slide presentasi Canva dan spesimen kartu rantai makanan konkret buatan sendiri.',
      'C1': 'Murid antusias menyimpulkan peran produsen dan konsumen dengan bahasa mereka sendiri.',
      'C2': 'Pemberian apresiasi tepuk jempol dan umpan balik langsung pada presentasi karya kelompok.',
      'C3': 'Menyampaikan kuis formatif cepat menggunakan 3 kartu pilihan dan pengantar modul ekosistem hutan.'
    },
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: DEFAULT_DEEP_LEARNING_NOTES,
      rekomendasiObserver: 'Praktik pembelajaran mendalam (deep learning) sangat tampak, khususnya pada prinsip berkesadaran dan pengalaman belajar memahami yang berbasis kearifan lokal pertanian sayur Tosari. Disarankan untuk terus memperkuat kemitraan dengan praktisi perkebunan lokal.'
    },
    timelineNotes: [
      { id: 'TL-1', time: '07:30', event: 'Guru membuka kelas dengan salam, doa bersama, cek kehadiran, dan lagu nasional.' },
      { id: 'TL-2', time: '07:42', event: 'Apersepsi kontekstual: tebak gambar hewan pemakan tanaman sayur di Tosari.' },
      { id: 'TL-3', time: '08:00', event: 'Pembentukan 4 kelompok heterogen dengan pembagian peran terstruktur.' },
      { id: 'TL-4', time: '08:25', event: 'Presentasi jaring-jaring makanan dan sesi tanya jawab antar kelompok murid.' }
    ],
    kekuatan: 'Suasana kelas sangat partisipatif, pembelajaran student-centered berjalan alami, hubungan guru-murid harmonis, dan media ajar sangat kontekstual.',
    rekomendasi: 'Pertanyaan pemantik tingkat tinggi (HOTS) perlu terus dieksplorasi untuk menstimulasi nalar analitis murid lebih mendalam.',
    pasca: {
      refleksiGuru: 'Saya merasa sangat puas karena seluruh siswa berpartisipasi aktif dalam simulasi rantai makanan, namun manajemen waktu pada pos terakhir sempat meleset 5 menit.',
      options: 'Menggunakan visual timer di layar proyektor agar murid dapat memantau sisa waktu diskusi kelompok secara mandiri.',
      will: 'Membagikan rubrik asesmen teman sebaya pada modul ekosistem pekan depan dan membagikan modul ajar di Kombel sekolah.',
      feedbackKs: 'Praktik baik yang sangat menginspirasi. Manajemen kelas dan penanaman disiplin positif tanpa hukuman sudah membudaya dengan sangat baik.'
    },
    followups: [
      {
        id: 'F1',
        program: 'Komunitas Belajar (Kombel) Guru SDN Kandangan I',
        focus: 'Penyusunan Rubrik HOTS & Asesmen Rekan Sejawat',
        target: '2026-10-25',
        status: 'Selesai',
        pic: 'Kepala Sekolah',
        obsId: 'OBS-2026-001',
        teacherName: 'Lestari Handayani'
      }
    ],
    modulAjar: {
      id: 'MOD-2026-001',
      name: 'Modul_Ajar_IPAS_Kelas4_Ekosistem_Bromo.pdf',
      size: 1425800,
      mimeType: 'application/pdf',
      uploadDate: '2 Oktober 2026',
      driveFileId: '1A2b3C4d5E6F_SampleDriveId',
      driveViewLink: 'https://drive.google.com/file/d/1A2b3C4d5E6F_SampleDriveId/view?usp=sharing',
      uploadedBy: 'Lestari Handayani',
      notes: 'Modul ajar lengkap dengan rubrik asesmen diferensiasi dan LKPD'
    }
  },
  {
    id: 'OBS-2026-002',
    teacherId: 'T4',
    teacherName: 'MARTHA DIMAS LELY OKTA WIDHANA',
    nip: '199603052020121011',
    subject: 'Matematika',
    classTarget: 'Kelas 5',
    date: '2026-10-08',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Pra Observasi',
    score: 0,
    category: 'Belum Dinilai',
    pra: {
      materi: 'Operasi Hitung Penjumlahan Pecahan Berbeda Penyebut',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Siswa dapat menyelesaikan permasalahan penjumlahan pecahan berpenyebut berbeda dengan bantuan garis bilangan manipulatif dan lipatan kertas.',
      goal2: 'Optimalisasi umpan balik konstruktif langsung saat latihan terbimbing kelompok.',
      reality: 'Sebagian siswa masih sering keliru menyamakan KPK penyebut dan merasa cemas dengan operasi pecahan.',
      options: 'Menggunakan potongan kertas origami lipat berwarna dan garis bilangan interaktif.',
      will: 'Observer diminta mencatat respon siswa kelompok bawah saat menerima scaffolding dari guru.'
    },
    scores: {},
    evidence: {},
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: {},
      rekomendasiObserver: ''
    },
    timelineNotes: [
      { id: 'TL-B1', time: '08:00', event: 'Pra-observasi disepakati dan jadwal ditetapkan di ruang kepala sekolah.' }
    ],
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
    id: 'OBS-2026-003',
    teacherId: 'T5',
    teacherName: 'Nevilia Yunitasari',
    nip: '199006042024212051',
    subject: 'Bahasa Indonesia',
    classTarget: 'Kelas 1',
    date: '2026-09-26',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Selesai',
    score: 89,
    category: 'Baik',
    pra: {
      materi: 'Mengenal Bunyi Huruf dan Fonem Suku Kata "Ba, Bi, Bu, Be, Bo"',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Murid mampu melafalkan bunyi huruf b dan merangkainya menjadi suku kata serta kata bermakna dengan tepat.',
      goal2: 'Diferensiasi pendampingan membaca permulaan bagi anak yang belum mengenal alfabet.',
      reality: 'Kemampuan membaca awal murid kelas 1 bervariasi antara yang sudah TK dan yang belum.',
      options: 'Permainan kartu kata bergambar dan lagu fonik ceria.',
      will: 'Fokus observasi pada pendekatan individual bagi 4 murid yang memerlukan bimbingan khusus.'
    },
    scores: {
      'A1': 4, 'A2': 3, 'A3': 3,
      'B1': 4, 'B2': 4, 'B3': 3, 'B4': 4, 'B5': 4,
      'C1': 3, 'C2': 4, 'C3': 3
    },
    evidence: {
      'A1': 'Menyanyikan lagu fonik alfabet dengan gerakan tangan yang ceria bersama murid.',
      'A2': 'Tujuan belajar disampaikan dengan bahasa sederhana dan boneka tangan.',
      'A3': 'Mengaitkan kata "Buku", "Batu", "Bunga" dengan benda-benda di kelas.',
      'B1': 'Anak-anak berebut menyusun kartu huruf membentuk kata di karpet belajar.',
      'B2': 'Tersedia pojok baca mini dengan buku cerita bergambar besar untuk kelompok mahir.',
      'B3': 'Menanyakan: "Benda apa saja di tas kalian yang berawalan bunyi B?"',
      'B4': 'Sangat sabar dan penuh senyum menenangkan anak yang sempat menangis.',
      'B5': 'Flash card huruf tebal berwarna-warni dan kartu kata bergambar realistis.',
      'C1': 'Murid bersama-sama membaca suku kata rangkuman di papan tulis.',
      'C2': 'Memberi stempel bintang tersenyum pada buku tulis masing-masing siswa.',
      'C3': 'Mengajak siswa berlatih membaca 5 kata sederhana bersama orang tua di rumah.'
    },
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: {
        'DL1_1': 'Asesmen awal kesiapan membaca suku kata dilakukan dengan kartu bergambar.',
        'DL1_7': 'Komunikasi interaktif sangat hangat dengan boneka tangan.',
        'DL1_9': 'Ice breaker tepuk huruf dan senam jari fonik membangkitkan keceriaan murid kelas 1.',
        'DL2_4': 'Alat peraga kartu kata bergambar realistis sangat menarik minat anak.',
        'DL3_6': 'Ruang kelas didesain ramah anak dengan karpet melingkar yang nyaman.'
      },
      rekomendasiObserver: 'Penerapan prinsip joyful (menggembirakan) dan mindful (berkesadaran) sangat istimewa pada murid kelas 1. Disarankan memperkaya sudut baca sensori pasir dan kain flanel untuk stimulasi motorik halus.'
    },
    timelineNotes: [
      { id: 'TL-D1', time: '07:30', event: 'Pembukaan kelas ceria dengan senam tangan dan lagu fonik.' },
      { id: 'TL-D2', time: '07:50', event: 'Bimbingan kelompok membaca berjenjang di karpet ruang kelas.' }
    ],
    kekuatan: 'Keterikatan emosional guru dengan murid kelas 1 luar biasa hangat, media kartu fonik sangat interaktif.',
    rekomendasi: 'Dapat menambahkan sudut literasi sensori untuk melatih motorik halus menulis huruf.',
    pasca: {
      refleksiGuru: 'Anak-anak sangat gembira, namun membutuhkan waktu ekstra untuk mendampingi 2 siswa yang masih malu.',
      options: 'Membuat pojok kartu huruf raba (sensori pasir/kain flanel) di belakang kelas.',
      will: 'Mengikuti pelatihan mandiri PMM topik Literasi Menyenangkan untuk SD Awal.',
      feedbackKs: 'Dedikasi luar biasa. Guru sangat sabar dan menguasai teknik fonik ramah anak.'
    },
    followups: [
      {
        id: 'F2',
        program: 'Pelatihan Mandiri PMM',
        focus: 'Topik Literasi: Membaca Permulaan Kelas Awal',
        target: '2026-10-30',
        status: 'Proses',
        pic: 'Kepala Sekolah',
        obsId: 'OBS-2026-003',
        teacherName: 'Nevilia Yunitasari'
      }
    ]
  },
  {
    id: 'OBS-2026-004',
    teacherId: 'T3',
    teacherName: 'LULUK MUNZIYAH',
    nip: '199511242020122009',
    subject: 'Pendidikan Agama Islam',
    classTarget: 'Kelas 4',
    date: '2026-09-18',
    observer: 'AKHMAD SHODIKIN, M.Pd',
    status: 'Selesai',
    score: 86,
    category: 'Baik',
    pra: {
      materi: 'Perilaku Terpuji: Menghargai Keragaman Suku dan Agama di Lingkungan Sekitar',
      waktu: '2 JP (2 x 35 Menit)',
      goal1: 'Murid memahami hikmah keragaman manusia dan mempraktikkan sikap toleran dalam kehidupan bermasyarakat di Tengger.',
      goal2: 'Penguatan metode role play (bermain peran) toleransi antar umat beragama.',
      reality: 'Murid terbiasa hidup rukun di lingkungan heterogen Tengger, namun perlu penguatan konsep toleransi formal.',
      options: 'Skenario bermain peran interaksi sehari-hari warga desa.',
      will: 'Observer mengamati kedalaman penghayatan nilai moral murid.'
    },
    scores: {
      'A1': 4, 'A2': 3, 'A3': 4,
      'B1': 4, 'B2': 3, 'B3': 3, 'B4': 4, 'B5': 3,
      'C1': 3, 'C2': 4, 'C3': 3
    },
    evidence: {
      'A1': 'Membuka dengan salam, tadarus surat pendek, dan sapaan nilai kerukunan.',
      'A2': 'Menyampaikan tujuan menghargai perbedaan tetangga beragama lain di Tosari.',
      'A3': 'Menghubungkan nilai Pancasila dan kearifan rukun guyub Tengger.',
      'B1': 'Simulasi bermain peran menolong tetangga yang sedang mengadakan hajatan.',
      'B2': 'Tugas bercerita lisan atau tulisan sesuai minat siswa.',
      'B3': 'Pertanyaan: "Bagaimana cara kita menghormati teman yang sedang beribadah?"',
      'B4': 'Mengatur ruang kelas agar siswa leluasa memeragakan peran.',
      'B5': 'Gambar rumah ibadah dan cerita bergambar kerukunan umat beragama.',
      'C1': 'Siswa menyimpulkan pentingnya saling menghargai tanpa membedakan.',
      'C2': 'Apresiasi kepada seluruh kelompok pemeran drama.',
      'C3': 'Menugaskan jurnal kebaikan kecil di rumah.'
    },
    deepLearning: {
      scores: DEFAULT_DEEP_LEARNING_SCORES,
      notes: {
        'DL1_4': 'Materi dikaitkan langsung dengan praktik kerukunan warga desa Tengger Tosari.',
        'DL1_5': 'Belajar melalui simulasi nyata bermain peran saling tolong-menolong.',
        'DL2_11': 'Peserta didik mempraktikkan langsung sikap toleransi dalam skenario drama.',
        'DL3_5': 'Membangun budaya belajar saling menghargai perbedaan agama dan latar belakang.',
        'DL3_9': 'Memanfaatkan proyektor visual untuk menampilkan ragam budaya Nusantara.'
      },
      rekomendasiObserver: 'Unsur pembelajaran bermakna (meaningful) dan kontekstual sangat kuat terasa. Peserta didik mengalami pembelajaran yang berakar pada kearifan lokal kerukunan hidup di Tosari.'
    },
    timelineNotes: [],
    kekuatan: 'Penanaman nilai budi pekerti sangat berakar pada kearifan budaya toleransi lokal Tosari.',
    rekomendasi: 'Dapat memanfaatkan proyektor multimedia untuk memutar video dokumenter inspiratif kerukunan pemuda.',
    pasca: {
      refleksiGuru: 'Pembelajaran hidup dan murid sangat menghayati peran.',
      options: 'Menyiapkan modul proyek P5 bertema Bhinneka Tunggal Ika.',
      will: 'Mengusulkan kolaborasi proyek lintas agama dengan tokoh masyarakat.',
      feedbackKs: 'Sangat relevan dengan kondisi sosiokultural lingkungan sekolah kita.'
    },
    followups: [
      {
        id: 'F3',
        program: 'Proyek Penguatan Profil Pelajar Pancasila (P5)',
        focus: 'Tema Bhinneka Tunggal Ika: Harmoni Masyarakat Bromo',
        target: '2026-11-15',
        status: 'Direncanakan',
        pic: 'Kepala Sekolah',
        obsId: 'OBS-2026-004',
        teacherName: 'LULUK MUNZIYAH'
      }
    ]
  }
];
