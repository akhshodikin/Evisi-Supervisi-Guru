import { RubricCategory } from '../types';

export const EVALUATION_RUBRIC: RubricCategory[] = [
  {
    category: 'A. KEGIATAN PENDAHULUAN',
    phase: 'Pendahuluan (Apersepsi & Kesiapan Belajar)',
    items: [
      { 
        no: 1, 
        id: 'A1', 
        name: 'Guru melakukan komunikasi positif untuk membangun suasana kelas yang aman, nyaman, dan kondusif (Apersepsi, Sapaan & Motivasi).',
        focusPoint: 'Memanggil nama murid dengan ramah, menghargai kehadiran, dan mengaitkan pengetahuan awal'
      },
      { 
        no: 2, 
        id: 'A2', 
        name: 'Guru menyampaikan tujuan pembelajaran, materi pokok, serta alur skenario kegiatan pembelajaran yang akan dilaksanakan bersama.',
        focusPoint: 'Menjelaskan apa yang ingin dicapai dan bagaimana murid akan mencapainya secara jelas'
      },
      { 
        no: 3, 
        id: 'A3', 
        name: 'Guru mengaitkan materi ajar dengan Profil Pelajar Pancasila (8 Dimensi Lulusan) atau konteks kehidupan kontekstual lingkungan siswa.',
        focusPoint: 'Menghubungkan tema materi dengan kearifan lokal lereng Bromo / lingkungan sekitar'
      }
    ]
  },
  {
    category: 'B. KEGIATAN INTI (Pembelajaran Berdiferensiasi & Interaktif)',
    phase: 'Inti (Eksplorasi, Kolaborasi & Penalaran Kritis)',
    items: [
      { 
        no: 4, 
        id: 'B1', 
        name: 'Guru memfasilitasi aktivitas pembelajaran kolaboratif yang memberi ruang leluasa bagi murid untuk terlibat aktif, berdiskusi, dan berpendapat.',
        focusPoint: 'Kelompok kerja heterogen aktif, pembagian peran murid merata'
      },
      { 
        no: 5, 
        id: 'B2', 
        name: 'Guru menerapkan pembelajaran berdiferensiasi (konten, proses, atau produk) berdasarkan asesmen awal kesiapan dan gaya belajar murid.',
        focusPoint: 'Variasi media visual/audio/kinestetik dan LKPD berjenjang'
      },
      { 
        no: 6, 
        id: 'B3', 
        name: 'Guru mengajukan pertanyaan pemantik menantang (probing questions) yang memicu kemampuan berpikir tingkat tinggi (HOTS) dan nalar kritis.',
        focusPoint: 'Pertanyaan mengapa, bagaimana jika, dan analisis pemecahan masalah nyata'
      },
      { 
        no: 7, 
        id: 'B4', 
        name: 'Guru mengelola dinamika kelas secara positif, konsisten menerapkan kesepakatan kelas, dan merespon perilaku mengganggu secara konstruktif.',
        focusPoint: 'Disiplin positif tanpa kekerasan atau kata-kata merendahkan'
      },
      { 
        no: 8, 
        id: 'B5', 
        name: 'Guru memanfaatkan media pembelajaran konkret, teknologi informasi (TIK/Canva/Chromebook), atau sumber belajar alam sekitar.',
        focusPoint: 'Media ajar relevan, manipulatif, atau multimedia interaktif'
      }
    ]
  },
  {
    category: 'C. KEGIATAN PENUTUP',
    phase: 'Penutup (Refleksi, Umpan Balik & Asesmen Formatif)',
    items: [
      { 
        no: 9, 
        id: 'C1', 
        name: 'Guru bersama murid merangkum intisari materi dan melakukan refleksi terbimbing terhadap proses serta kebermaknaan pembelajaran.',
        focusPoint: 'Murid menyimpulkan pengalaman belajarnya dengan bahasa sendiri'
      },
      { 
        no: 10, 
        id: 'C2', 
        name: 'Guru memberikan apresiasi dan umpan balik (feedback) deskriptif yang konstruktif terhadap usaha, proses, dan hasil belajar murid.',
        focusPoint: 'Apresiasi spesifik terhadap kerja keras murid dan motivasi penguatan'
      },
      { 
        no: 11, 
        id: 'C3', 
        name: 'Guru melaksanakan asesmen formatif akhir (asesmen cepat/kuis) dan menyampaikan tindak lanjut atau pengantar pertemuan berikutnya.',
        focusPoint: 'Mengecek pemahaman capaian hari ini serta arahan tugas bermakna'
      }
    ]
  }
];

export const RUBRIC_SCORE_LABELS: Record<number, { text: string; desc: string; color: string; bg: string }> = {
  1: {
    text: '1 - Belum Dilakukan (Kurang)',
    desc: 'Perilaku belum tampak / belum dilaksanakan selama proses pembelajaran',
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200'
  },
  2: {
    text: '2 - Cukup (Belum Efektif)',
    desc: 'Mulai dicoba atau diterapkan namun belum berdampak optimal bagi seluruh murid',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200'
  },
  3: {
    text: '3 - Efektif (Dilakukan & Efektif)',
    desc: 'Dilaksanakan dengan baik, tujuan tercapai, dan murid berpartisipasi aktif',
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200'
  },
  4: {
    text: '4 - Sangat Efektif (Membudaya)',
    desc: 'Sangat menginspirasi, konsisten, berpusat pada murid, dan berkelanjutan',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200'
  }
};
