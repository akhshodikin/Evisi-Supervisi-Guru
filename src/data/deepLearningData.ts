import { DeepLearningDimension, DeepLearningRubricItem } from '../types';

export const DEEP_LEARNING_DIMENSIONS: DeepLearningDimension[] = [
  {
    id: 'prinsip',
    title: '1. Penerapan Prinsip Pembelajaran (Deep Learning)',
    totalItems: 9,
    subAspects: [
      {
        name: 'A. Berkesadaran (Mindful)',
        items: [
          {
            id: 'DL1_1',
            no: 1,
            aspect: 'A. Berkesadaran (mindful)',
            desc: 'Guru melakukan asesmen awal untuk mengetahui kondisi awal dan kebutuhan belajar peserta didik.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          },
          {
            id: 'DL1_2',
            no: 2,
            aspect: 'A. Berkesadaran (mindful)',
            desc: 'Guru mengarahkan dan memotivasi peserta didik untuk belajar secara antusias dan aktif.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          },
          {
            id: 'DL1_3',
            no: 3,
            aspect: 'A. Berkesadaran (mindful)',
            desc: 'Guru menggunakan variasi strategi dan metode mengajar agar peserta didik bisa memahami materi dan mencapai tujuan pembelajaran.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          }
        ]
      },
      {
        name: 'B. Bermakna (Meaningful)',
        items: [
          {
            id: 'DL1_4',
            no: 4,
            aspect: 'B. Bermakna (meaningful)',
            desc: 'Guru menyampaikan materi disertai dengan contoh kontekstual yang sesuai dengan kehidupan dan lingkungan peserta didik.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          },
          {
            id: 'DL1_5',
            no: 5,
            aspect: 'B. Bermakna (meaningful)',
            desc: 'Guru mengarahkan peserta didik untuk belajar melalui pengalaman nyata.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          },
          {
            id: 'DL1_6',
            no: 6,
            aspect: 'B. Bermakna (meaningful)',
            desc: 'Peserta didik merefleksikan makna dari materi yang dipelajari dalam bentuk lisan, tulisan, gambar, atau simbol.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          }
        ]
      },
      {
        name: 'C. Menggembirakan (Joyful)',
        items: [
          {
            id: 'DL1_7',
            no: 7,
            aspect: 'C. Menggembirakan (joyful)',
            desc: 'Guru membangun komunikasi pembelajaran yang interaktif dengan peserta didik.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          },
          {
            id: 'DL1_8',
            no: 8,
            aspect: 'C. Menggembirakan (joyful)',
            desc: 'Guru menggunakan strategi pembelajaran yang membuat peserta didik antusias dan gembira.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          },
          {
            id: 'DL1_9',
            no: 9,
            aspect: 'C. Menggembirakan (joyful)',
            desc: 'Sewaktu-waktu guru menggunakan ice breaker, game, atau kuis untuk meningkatkan motivasi, konsentrasi, atau membangun suasana pembelajaran yang menyenangkan.',
            dimensionId: 'prinsip',
            dimensionTitle: '1. Penerapan Prinsip Pembelajaran'
          }
        ]
      }
    ]
  },
  {
    id: 'pengalaman',
    title: '2. Pengalaman Belajar (Learning Experiences)',
    totalItems: 14,
    subAspects: [
      {
        name: 'A. Memahami',
        items: [
          {
            id: 'DL2_1',
            no: 1,
            aspect: 'A. Memahami',
            desc: 'Guru menyampaikan tujuan pembelajaran dengan jelas dan runtut.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_2',
            no: 2,
            aspect: 'A. Memahami',
            desc: 'Guru menjelaskan materi pelajaran secara sistematis dari mudah ke sulit, sederhana ke kompleks, konkrit ke abstrak.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_3',
            no: 3,
            aspect: 'A. Memahami',
            desc: 'Guru menggunakan beragam sumber belajar dan mendorong peserta didik untuk belajar dari beragam sumber.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_4',
            no: 4,
            aspect: 'A. Memahami',
            desc: 'Guru menggunakan alat peraga/media pembelajaran yang relevan dengan materi yang diajarkan.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_5',
            no: 5,
            aspect: 'A. Memahami',
            desc: 'Guru menerapkan pendekatan konstruktivisme, menyajikan materi melalui strategi/pendekatan kontekstual / contoh atau pengalaman belajar yang nyata dan bermakna bagi peserta didik.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_6',
            no: 6,
            aspect: 'A. Memahami',
            desc: 'Guru mendorong peserta didik untuk berpikir kritis melalui aktif bertanya, menyampaikan pendapat, diskusi, dan bekerja dalam kelompok dalam menyelesaikan masalah.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_7',
            no: 7,
            aspect: 'A. Memahami',
            desc: 'Guru memberikan kesempatan kepada murid untuk mengungkapkan atau mengekspresikan pemahamannya terkait materi yang dipelajarinya melalui beragam cara (lisan, tulisan, gambar, video, dll.).',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_8',
            no: 8,
            aspect: 'A. Memahami',
            desc: 'Guru melakukan asesmen formatif dalam proses pembelajaran.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_9',
            no: 9,
            aspect: 'A. Memahami',
            desc: 'Guru membangun suasana belajar yang menyenangkan dan bermakna bagi murid.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_10',
            no: 10,
            aspect: 'A. Memahami',
            desc: 'Guru memberikan kesempatan kepada peserta didik untuk belajar melalui observasi, eksperimen, atau praktik langsung dalam menyelesaikan masalah.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          }
        ]
      },
      {
        name: 'B. Mengaplikasikan',
        items: [
          {
            id: 'DL2_11',
            no: 11,
            aspect: 'B. Mengaplikasikan',
            desc: 'Guru memberikan kesempatan kepada Peserta Didik untuk menerapkan materi secara kontekstual / sesuai dengan kehidupan nyata.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_12',
            no: 12,
            aspect: 'B. Mengaplikasikan',
            desc: 'Guru memberikan kesempatan kepada Peserta Didik untuk menunjukkan kemampuannya melalui demonstrasi, simulasi, proyek, atau produk.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          }
        ]
      },
      {
        name: 'C. Merefleksikan',
        items: [
          {
            id: 'DL2_13',
            no: 13,
            aspect: 'C. Merefleksikan',
            desc: 'Guru memberikan kesempatan kepada peserta didik untuk menyampaikan kesan dan perasaan selama mengikuti pembelajaran.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          },
          {
            id: 'DL2_14',
            no: 14,
            aspect: 'C. Merefleksikan',
            desc: 'Guru memberikan kesempatan kepada peserta didik untuk merefleksikan materi yang telah dipelajarinya, seperti hal yang telah dikuasai, hal yang belum dikuasai, dan hal yang ingin lebih dalam ditingkatkan penguasaannya.',
            dimensionId: 'pengalaman',
            dimensionTitle: '2. Pengalaman Belajar'
          }
        ]
      }
    ]
  },
  {
    id: 'kerangka',
    title: '3. Kerangka Pembelajaran (Learning Framework)',
    totalItems: 10,
    subAspects: [
      {
        name: 'A. Praktik Pedagogik',
        items: [
          {
            id: 'DL3_1',
            no: 1,
            aspect: 'A. Praktik Pedagogik',
            desc: 'Guru menerapkan kegiatan Pembelajaran yang mendorong berpikir kritis, berpikir tingkat tinggi, dan praktik nyata.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          },
          {
            id: 'DL3_2',
            no: 2,
            aspect: 'A. Praktik Pedagogik',
            desc: 'Guru menerapkan beragam strategi pembelajaran yang mendorong peserta didik menyelesaikan masalah secara kreatif (PBL, PjBL, inquiry, discovery, STEM, dll).',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          }
        ]
      },
      {
        name: 'B. Kemitraan Pembelajaran',
        items: [
          {
            id: 'DL3_3',
            no: 3,
            aspect: 'B. Kemitraan Pembelajaran',
            desc: 'Guru melibatkan peserta didik selain sebagai subjek belajar juga sebagai rekan belajar.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          },
          {
            id: 'DL3_4',
            no: 4,
            aspect: 'B. Kemitraan Pembelajaran',
            desc: 'Guru melibatkan rekan kerja (team teaching), ahli, atau praktisi dalam menunjang penyampaian materi pelajaran.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          }
        ]
      },
      {
        name: 'C. Lingkungan Belajar',
        items: [
          {
            id: 'DL3_5',
            no: 5,
            aspect: 'C. Lingkungan Belajar',
            desc: 'Guru membangun budaya belajar yang positif dalam rangka mencapai tujuan pembelajaran dan profil lulusan.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          },
          {
            id: 'DL3_6',
            no: 6,
            aspect: 'C. Lingkungan Belajar',
            desc: 'Guru mendesain ruang belajar yang aman dan nyaman untuk belajar peserta didik.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          },
          {
            id: 'DL3_7',
            no: 7,
            aspect: 'C. Lingkungan Belajar',
            desc: 'Guru memanfaatkan lingkungan sekitar sebagai sumber belajar peserta didik.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          },
          {
            id: 'DL3_8',
            no: 8,
            aspect: 'C. Lingkungan Belajar',
            desc: 'Guru memanfaatkan ruang kelas fisik (luring), ruang kelas digital (LMS, daring), dan memadukan ruang belajar luring dan daring.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          }
        ]
      },
      {
        name: 'D. Pemanfaatan Digital',
        items: [
          {
            id: 'DL3_9',
            no: 9,
            aspect: 'D. Pemanfaatan Digital',
            desc: 'Guru memanfaatkan perangkat digital untuk menunjang pembelajaran agar lebih efektif, interaktif, kolaboratif, dan menarik bagi murid.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          },
          {
            id: 'DL3_10',
            no: 10,
            aspect: 'D. Pemanfaatan Digital',
            desc: 'Guru terampil/cakap dalam menggunakan perangkat digital dalam menunjang pembelajaran.',
            dimensionId: 'kerangka',
            dimensionTitle: '3. Kerangka Pembelajaran'
          }
        ]
      }
    ]
  }
];

export const ALL_DEEP_LEARNING_ITEMS: DeepLearningRubricItem[] = DEEP_LEARNING_DIMENSIONS.flatMap(
  dim => dim.subAspects.flatMap(sub => sub.items)
);

export const parseDlScore = (val: unknown): number => {
  if (val === 4 || val === 3 || val === 2 || val === 1) return val;
  if (val === 'ya' || val === true) return 4;
  if (val === 'tidak' || val === false) return 1;
  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 4) return Math.round(num);
  return 4; // default optimal score
};

export const DEEP_LEARNING_SCALE_DESCRIPTIONS: Record<number, {
  score: number;
  label: string;
  shortLabel: string;
  description: string;
  badge: string;
  badgeColor: string;
  textColor: string;
  bgActive: string;
  borderActive: string;
}> = {
  4: {
    score: 4,
    label: '4 - Sangat Efektif (Membudaya)',
    shortLabel: '4 - Sangat Efektif',
    description: 'Indikator terlaksana secara konsisten, alami, berpusat pada murid, dan menginspirasi iklim belajar positif.',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeColor: '#166534',
    textColor: 'text-emerald-700',
    bgActive: 'bg-emerald-600 text-white shadow-xs',
    borderActive: 'border-emerald-600'
  },
  3: {
    score: 3,
    label: '3 - Dilakukan & Efektif (Baik)',
    shortLabel: '3 - Efektif',
    description: 'Indikator terlaksana dengan baik, tujuan pembelajaran tercapai, dan ada keterlibatan aktif peserta didik.',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    badgeColor: '#0284c7',
    textColor: 'text-sky-700',
    bgActive: 'bg-sky-600 text-white shadow-xs',
    borderActive: 'border-sky-600'
  },
  2: {
    score: 2,
    label: '2 - Dilakukan tapi Belum Efektif (Cukup)',
    shortLabel: '2 - Belum Efektif',
    description: 'Indikator mulai dicoba/diterapkan namun belum maksimal atau belum mencakup seluruh peserta didik.',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    badgeColor: '#b45309',
    textColor: 'text-amber-700',
    bgActive: 'bg-amber-600 text-white shadow-xs',
    borderActive: 'border-amber-600'
  },
  1: {
    score: 1,
    label: '1 - Belum Dilakukan / Belum Terlihat (Kurang)',
    shortLabel: '1 - Belum Dilakukan',
    description: 'Indikator belum muncul atau belum diterapkan sama sekali dalam proses pembelajaran yang diamati.',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeColor: '#dc2626',
    textColor: 'text-rose-700',
    bgActive: 'bg-rose-600 text-white shadow-xs',
    borderActive: 'border-rose-600'
  }
};

export interface DeepLearningDimensionScore {
  dimensionId: 'prinsip' | 'pengalaman' | 'kerangka';
  title: string;
  totalItems: number;
  totalScore: number;
  maxScore: number;
  averageScore: number;
  percentage: number;
  category: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  badgeColor: string;
  distribution: {
    score4: number;
    score3: number;
    score2: number;
    score1: number;
  };
}

export const getDeepLearningPredicate = (percentage: number): {
  label: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  color: string;
  badge: string;
} => {
  if (percentage >= 86) {
    return { label: 'Sangat Baik', color: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }
  if (percentage >= 76) {
    return { label: 'Baik', color: 'text-teal-700', badge: 'bg-teal-100 text-teal-800 border-teal-300' };
  }
  if (percentage >= 60) {
    return { label: 'Cukup', color: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
  }
  return { label: 'Kurang', color: 'text-rose-700', badge: 'bg-rose-100 text-rose-800 border-rose-300' };
};

export const calculateDeepLearningStats = (
  scores: Record<string, boolean | 'ya' | 'tidak' | number> = {}
) => {
  const dimensionStats: Record<string, DeepLearningDimensionScore> = {};

  let grandTotalScore = 0;
  const grandDistribution = { score4: 0, score3: 0, score2: 0, score1: 0 };

  DEEP_LEARNING_DIMENSIONS.forEach(dim => {
    const dimItems = dim.subAspects.flatMap(s => s.items);
    let dimTotalScore = 0;
    const dimDist = { score4: 0, score3: 0, score2: 0, score1: 0 };

    dimItems.forEach(it => {
      const numericVal = parseDlScore(scores[it.id]);
      dimTotalScore += numericVal;
      grandTotalScore += numericVal;

      if (numericVal === 4) { dimDist.score4++; grandDistribution.score4++; }
      else if (numericVal === 3) { dimDist.score3++; grandDistribution.score3++; }
      else if (numericVal === 2) { dimDist.score2++; grandDistribution.score2++; }
      else { dimDist.score1++; grandDistribution.score1++; }
    });

    const maxScore = dimItems.length * 4;
    const percentage = maxScore > 0 ? Math.round((dimTotalScore / maxScore) * 100) : 0;
    const averageScore = dimItems.length > 0 ? Number((dimTotalScore / dimItems.length).toFixed(2)) : 0;
    const pred = getDeepLearningPredicate(percentage);

    dimensionStats[dim.id] = {
      dimensionId: dim.id,
      title: dim.title,
      totalItems: dimItems.length,
      totalScore: dimTotalScore,
      maxScore,
      averageScore,
      percentage,
      category: pred.label,
      badgeColor: pred.badge,
      distribution: dimDist
    };
  });

  const totalItems = ALL_DEEP_LEARNING_ITEMS.length; // 33 items
  const grandMaxScore = totalItems * 4; // 132 points
  const overallPercentage = grandMaxScore > 0 ? Math.round((grandTotalScore / grandMaxScore) * 100) : 0;
  const overallAverage = totalItems > 0 ? Number((grandTotalScore / totalItems).toFixed(2)) : 0;
  const overallPred = getDeepLearningPredicate(overallPercentage);

  return {
    dimensions: dimensionStats,
    overall: {
      totalItems,
      totalScore: grandTotalScore,
      maxScore: grandMaxScore,
      averageScore: overallAverage,
      percentage: overallPercentage,
      category: overallPred.label,
      badgeColor: overallPred.badge,
      textColor: overallPred.color,
      distribution: grandDistribution
    }
  };
};

export const DEFAULT_DEEP_LEARNING_SCORES: Record<string, number> = {
  // Prinsip (9 butir) - Total max 36
  'DL1_1': 4, 'DL1_2': 4, 'DL1_3': 3,
  'DL1_4': 4, 'DL1_5': 4, 'DL1_6': 4,
  'DL1_7': 4, 'DL1_8': 4, 'DL1_9': 4,
  // Pengalaman (14 butir) - Total max 56
  'DL2_1': 4, 'DL2_2': 4, 'DL2_3': 3, 'DL2_4': 4, 'DL2_5': 4,
  'DL2_6': 4, 'DL2_7': 3, 'DL2_8': 4, 'DL2_9': 4, 'DL2_10': 3,
  'DL2_11': 4, 'DL2_12': 4, 'DL2_13': 3, 'DL2_14': 4,
  // Kerangka (10 butir) - Total max 40
  'DL3_1': 4, 'DL3_2': 3, 'DL3_3': 4, 'DL3_4': 3,
  'DL3_5': 4, 'DL3_6': 4, 'DL3_7': 4, 'DL3_8': 3,
  'DL3_9': 4, 'DL3_10': 4,
};

export const DEFAULT_DEEP_LEARNING_NOTES: Record<string, string> = {
  'DL1_1': 'Asesmen diagnostik non-kognitif dan pemetaan gaya belajar siswa dilakukan di awal tema.',
  'DL1_4': 'Mengaitkan ekosistem sayur kentang di lereng Tosari Pasuruan secara kontekstual.',
  'DL1_9': 'Ice breaker tepuk konsentrasi Tengger membangkitkan semangat dan keceriaan belajar.',
  'DL2_4': 'Media konkret kartu rantai makanan dan slide interaktif Canva digunakan efektif.',
  'DL2_6': 'Siswa berdiskusi aktif dalam 4 kelompok heterogen memecahkan studi kasus nyata.',
  'DL3_1': 'Mendorong nalar analitis melalui pertanyaan pemantik sebab-akibat level HOTS.',
  'DL3_9': 'Pemanfaatan proyektor interaktif dan Chromebook sekolah berjalan lancar.'
};
