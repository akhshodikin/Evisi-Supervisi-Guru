import { AdminDocItem, TeacherAdminAudit, Teacher, SchoolSettings, ObservationData } from '../types';

export const STANDARD_SD_ADMIN_DOCS: Omit<AdminDocItem, 'status' | 'score' | 'notes'>[] = [
  {
    id: 'doc-01',
    no: 1,
    name: 'Kalender Pendidikan (Kaldik)',
    category: 'Perencanaan',
    standard: 'Memuat analisis minggu efektif, alokasi waktu pembelajaran, hari libur nasional/keagamaan, dan agenda kegiatan sekolah tahun ajaran berjalan.'
  },
  {
    id: 'doc-02',
    no: 2,
    name: 'Program Tahunan (Prota)',
    category: 'Perencanaan',
    standard: 'Distribusi alokasi waktu seluruh elemen/tujuan pembelajaran (TP) selama satu tahun ajaran secara sistematis.'
  },
  {
    id: 'doc-03',
    no: 3,
    name: 'Program Semester (Promes)',
    category: 'Perencanaan',
    standard: 'Penjabaran detail alokasi waktu pokok materi/tujuan pembelajaran per minggu efektif pada semester berjalan.'
  },
  {
    id: 'doc-04',
    no: 4,
    name: 'Capaian Pembelajaran (CP) & Alur Tujuan Pembelajaran (ATP)',
    category: 'Perencanaan',
    standard: 'Dokumen analisis CP per fase dan urutan alur tujuan pembelajaran yang logis, terukur, dan kontekstual.'
  },
  {
    id: 'doc-05',
    no: 5,
    name: 'Modul Ajar / RPP Kurikulum Merdeka',
    category: 'Perencanaan',
    standard: 'Memuat tujuan, pemahaman bermakna, pertanyaan pemantik, diferensiasi pembelajaran, langkah pembelajaran, dan asesmen awal/proses/akhir.'
  },
  {
    id: 'doc-06',
    no: 6,
    name: 'Jadwal Pelajaran & Alokasi Jam Tatap Muka',
    category: 'Perencanaan',
    standard: 'Kesesuaian jadwal tatap muka reguler mingguan dan alokasi waktu kokurikuler/P5 sesuai struktur Kurikulum Merdeka SD.'
  },
  {
    id: 'doc-07',
    no: 7,
    name: 'Daftar Presensi / Kehadiran Peserta Didik',
    category: 'Pelaksanaan',
    standard: 'Pencatatan kehadiran murid setiap hari secara tertib, rapi, dan memuat rekapitulasi ketidakhadiran (S/I/A).'
  },
  {
    id: 'doc-08',
    no: 8,
    name: 'Jurnal / Agenda Harian Mengajar Guru',
    category: 'Pelaksanaan',
    standard: 'Catatan nyata kegiatan mengajar tiap tatap muka (materi, ketercapaian tujuan, kendala kelas, dan refleksi harian).'
  },
  {
    id: 'doc-09',
    no: 9,
    name: 'Rekapitulasi Daftar Nilai Asesmen (Formatif & Sumatif)',
    category: 'Penilaian',
    standard: 'Dokumentasi nilai asesmen formatif (proses/tugas harian) dan asesmen sumatif (lingkup materi & akhir semester).'
  },
  {
    id: 'doc-10',
    no: 10,
    name: 'Instrumen, Rubrik Penilaian, dan Kisi-kisi Soal',
    category: 'Penilaian',
    standard: 'Lembar observasi performa murid, rubrik asesmen otentik, kisi-kisi asesmen, serta naskah butir penilaian.'
  },
  {
    id: 'doc-11',
    no: 11,
    name: 'Buku Bimbingan & Catatan Khusus Siswa (BK)',
    category: 'Penunjang',
    standard: 'Catatan anekdot perkembangan karakter murid, hambatan belajar, serta tindak lanjut pembinaan bersama wali murid.'
  },
  {
    id: 'doc-12',
    no: 12,
    name: 'Program & Rekap Remedial dan Pengayaan',
    category: 'Penilaian',
    standard: 'Bukti pelaksanaan perbaikan belajar bagi murid yang belum mencapai tujuan dan materi pengayaan bagi murid mahir.'
  },
  {
    id: 'doc-13',
    no: 13,
    name: 'Buku Pedoman Guru & Buku Teks Peserta Didik',
    category: 'Penunjang',
    standard: 'Ketersediaan dan pemanfaatan buku panduan guru Kemendikbudristek serta buku teks bacaan murid yang relevan.'
  },
  {
    id: 'doc-14',
    no: 14,
    name: 'Modul Ajar Kokurikuler',
    category: 'Penunjang',
    standard: 'Rancangan modul pelaksanaan kegiatan kokurikuler / Projek P5 sesuai tema sekolah (tujuan, dimensi profil, alur aktivitas, dan rubrik asesmen).'
  }
];

export const calculateAuditScore = (items: AdminDocItem[]) => {
  const totalScore = items.reduce((sum, item) => sum + item.score, 0);
  const maxScore = items.length * 2;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  let predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan' = 'Perlu Pembinaan';
  if (percentage >= 86) predicate = 'Sangat Baik';
  else if (percentage >= 71) predicate = 'Baik';
  else if (percentage >= 56) predicate = 'Cukup';

  return { totalScore, maxScore, percentage, predicate };
};

/**
 * Creates a default standard audit record for a teacher
 */
export const createDefaultTeacherAudit = (
  teacher: Teacher,
  settings: SchoolSettings
): TeacherAdminAudit => {
  const items: AdminDocItem[] = STANDARD_SD_ADMIN_DOCS.map((doc) => ({
    ...doc,
    status: 'lengkap' as const,
    score: 2,
    notes: 'Tersedia dan telah diverifikasi Kepala Sekolah.',
    lastUpdated: new Date().toISOString().split('T')[0]
  }));

  const { totalScore, maxScore, percentage, predicate } = calculateAuditScore(items);

  return {
    id: `AUDIT-${teacher.id || Date.now()}`,
    teacherId: teacher.id,
    teacherName: teacher.name,
    nip: teacher.nip || '-',
    classSubject: teacher.classSubject || '',
    semester: settings.semester || 'Ganjil',
    schoolYear: settings.schoolYear || '2025/2026',
    auditDate: new Date().toISOString().split('T')[0],
    auditor: settings.principalName || 'Kepala Sekolah',
    items,
    totalScore,
    maxScore,
    percentage,
    predicate,
    catatanKepsek: 'Perangkat administrasi pembelajaran Kurikulum Merdeka telah disiapkan secara tertib.',
    tindakLanjut: 'Lakukan tindak lanjut dan integrasikan dengan modul supervisi kelas.',
    isVerified: true
  };
};

/**
 * Finds an audit record for a teacher or observation
 */
export const findAuditForTeacher = (
  teacherOrObs: { id?: string; teacherId?: string; name?: string; teacherName?: string; nip?: string } | null | undefined,
  audits: TeacherAdminAudit[]
): TeacherAdminAudit | undefined => {
  if (!teacherOrObs || !audits || audits.length === 0) return undefined;

  const targetId = teacherOrObs.teacherId || teacherOrObs.id;
  const targetNip = teacherOrObs.nip && teacherOrObs.nip !== '-' ? teacherOrObs.nip.replace(/\s+/g, '') : '';
  const targetName = (teacherOrObs.teacherName || teacherOrObs.name || '').toLowerCase().trim();

  return audits.find((a) => {
    if (targetId && a.teacherId && a.teacherId === targetId) return true;
    if (targetNip && a.nip && a.nip !== '-' && a.nip.replace(/\s+/g, '') === targetNip) return true;
    if (targetName && a.teacherName.toLowerCase().trim() === targetName) return true;
    return false;
  });
};

/**
 * Ensures all teachers have an audit record, updating names and preserving scores
 */
export const syncTeacherAudits = (
  teachers: Teacher[],
  existingAudits: TeacherAdminAudit[],
  settings: SchoolSettings
): TeacherAdminAudit[] => {
  if (!teachers || teachers.length === 0) return existingAudits || [];

  const result: TeacherAdminAudit[] = [];

  teachers.forEach((teacher) => {
    const existing = findAuditForTeacher(teacher, existingAudits);

    if (existing) {
      // Ensure all 14 standard documents exist
      const updatedItems: AdminDocItem[] = STANDARD_SD_ADMIN_DOCS.map((stdDoc) => {
        const found = existing.items.find(i => i.id === stdDoc.id);
        if (found) {
          return {
            ...found,
            name: stdDoc.name,
            standard: stdDoc.standard,
            category: stdDoc.category
          };
        }
        return {
          ...stdDoc,
          status: 'lengkap' as const,
          score: 2,
          notes: 'Tersedia dan telah diverifikasi Kepala Sekolah.',
          lastUpdated: existing.auditDate || new Date().toISOString().split('T')[0]
        };
      });

      const { totalScore, maxScore, percentage, predicate } = calculateAuditScore(updatedItems);

      result.push({
        ...existing,
        teacherId: teacher.id || existing.teacherId,
        teacherName: teacher.name,
        nip: teacher.nip || existing.nip,
        classSubject: teacher.classSubject || existing.classSubject,
        items: updatedItems,
        totalScore,
        maxScore,
        percentage,
        predicate
      });
    } else {
      // Create new audit for new teacher
      result.push(createDefaultTeacherAudit(teacher, settings));
    }
  });

  return result;
};

/**
 * Automatically synchronizes an observation's Modul Ajar with doc-05 of the teacher's audit
 */
export const syncObservationModulAjarWithAudit = (
  observation: ObservationData,
  audit: TeacherAdminAudit
): TeacherAdminAudit => {
  if (!observation.modulAjar) return audit;

  const today = new Date().toISOString().split('T')[0];
  const fileUrl = observation.modulAjar.driveViewLink || observation.modulAjar.localUrl;
  const fileName = observation.modulAjar.name;

  const updatedItems = audit.items.map((item) => {
    if (item.id === 'doc-05') {
      return {
        ...item,
        status: 'lengkap' as const,
        score: 2,
        notes: `Modul Ajar (${observation.subject}) telah divalidasi pada observasi ${observation.id}.`,
        fileUrl: fileUrl || item.fileUrl,
        fileName: fileName || item.fileName,
        lastUpdated: today
      };
    }
    return item;
  });

  const { totalScore, maxScore, percentage, predicate } = calculateAuditScore(updatedItems);

  return {
    ...audit,
    items: updatedItems,
    totalScore,
    maxScore,
    percentage,
    predicate
  };
};

// Initial audits for registered SD teachers
export const INITIAL_TEACHER_ADMIN_AUDITS: TeacherAdminAudit[] = [
  {
    id: 'AUDIT-T1',
    teacherId: 'T1',
    teacherName: 'Ireliya Austina Prahesti',
    nip: '199906092024212038',
    classSubject: 'Kelas 6',
    semester: 'Ganjil',
    schoolYear: '2025/2026',
    auditDate: '2026-08-20',
    auditor: 'AKHMAD SHODIKIN, M.Pd',
    items: STANDARD_SD_ADMIN_DOCS.map((doc, idx) => {
      // 13 Lengkap, 1 Kurang Lengkap
      if (doc.id === 'doc-12') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Daftar remedial sudah ada, namun kisi-kisi soal perbaikan perlu dilengkapi.',
          lastUpdated: '2026-08-18'
        };
      }
      return {
        ...doc,
        status: 'lengkap' as const,
        score: 2,
        notes: idx === 4 ? 'Modul Ajar Kelas 6 sangat kontekstual dengan persiapan asesmen dan lingkungan pegunungan Tosari.' : 'Tersedia lengkap dan telah divalidasi Kepala Sekolah.',
        lastUpdated: '2026-08-19'
      };
    }),
    totalScore: 27,
    maxScore: 28,
    percentage: 96,
    predicate: 'Sangat Baik',
    catatanKepsek: 'Administrasi perencanaan dan asesmen sangat tertib, rapi, dan inovatif sesuai panduan Kurikulum Merdeka.',
    tindakLanjut: 'Pertahankan kualitas dokumentasi dan dapat dijadikan contoh praktik baik bagi rekan sejawat di Gugus Tosari.',
    isVerified: true
  },
  {
    id: 'AUDIT-T2',
    teacherId: 'T2',
    teacherName: 'Lestari Handayani',
    nip: '198412212022212013',
    classSubject: 'Kelas 4',
    semester: 'Ganjil',
    schoolYear: '2025/2026',
    auditDate: '2026-08-22',
    auditor: 'AKHMAD SHODIKIN, M.Pd',
    items: STANDARD_SD_ADMIN_DOCS.map((doc) => {
      if (doc.id === 'doc-11') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Catatan bimbingan siswa perlu lebih rutin dicatat per kasus belajar.',
          lastUpdated: '2026-08-20'
        };
      }
      if (doc.id === 'doc-12') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Program pengayaan materi matematika dan IPAS perlu bukti hasil tugas siswa.',
          lastUpdated: '2026-08-21'
        };
      }
      return {
        ...doc,
        status: 'lengkap' as const,
        score: 2,
        notes: 'Dokumen telah disahkan dan siap digunakan dalam kegiatan belajar.',
        lastUpdated: '2026-08-22'
      };
    }),
    totalScore: 26,
    maxScore: 28,
    percentage: 93,
    predicate: 'Sangat Baik',
    catatanKepsek: 'Perangkat pembelajaran Kelas 4 lengkap. Buku bimbingan siswa agar dioptimalkan.',
    tindakLanjut: 'Lakukan tindak lanjut pengayaan dan dokumentasikan karya siswa berprestasi.',
    isVerified: true
  },
  {
    id: 'AUDIT-T3',
    teacherId: 'T3',
    teacherName: 'LULUK MUNZIYAH',
    nip: '199511242020122009',
    classSubject: 'Pendidikan Agama Islam',
    semester: 'Ganjil',
    schoolYear: '2025/2026',
    auditDate: '2026-08-25',
    auditor: 'AKHMAD SHODIKIN, M.Pd',
    items: STANDARD_SD_ADMIN_DOCS.map((doc) => {
      if (doc.id === 'doc-10') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Rubrik asesmen observasi praktik ibadah dan hafalan perlu ditambahkan kriteria tartil.',
          lastUpdated: '2026-08-24'
        };
      }
      return {
        ...doc,
        status: 'lengkap' as const,
        score: 2,
        notes: 'Sangat baik untuk penanaman nilai budi pekerti dan akidah akhlak.',
        lastUpdated: '2026-08-25'
      };
    }),
    totalScore: 27,
    maxScore: 28,
    percentage: 96,
    predicate: 'Sangat Baik',
    catatanKepsek: 'Modul ajar PAI dan Budi Pekerti tersusun rapi untuk seluruh rombel.',
    tindakLanjut: 'Lengkapi portofolio asesmen praktik ibadah murid.',
    isVerified: true
  },
  {
    id: 'AUDIT-T4',
    teacherId: 'T4',
    teacherName: 'MARTHA DIMAS LELY OKTA WIDHANA',
    nip: '199603052020121011',
    classSubject: 'Kelas 5',
    semester: 'Ganjil',
    schoolYear: '2025/2026',
    auditDate: '2026-08-28',
    auditor: 'AKHMAD SHODIKIN, M.Pd',
    items: STANDARD_SD_ADMIN_DOCS.map((doc) => {
      if (doc.id === 'doc-14') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Modul Ajar kokurikuler P5 masih tahap penyempurnaan rubrik dimensi.',
          lastUpdated: '2026-08-26'
        };
      }
      return {
        ...doc,
        status: 'lengkap' as const,
        score: 2,
        notes: 'Materi pembelajaran dan asesmen sumatif Kelas 5 terstruktur rapi.',
        lastUpdated: '2026-08-27'
      };
    }),
    totalScore: 27,
    maxScore: 28,
    percentage: 96,
    predicate: 'Sangat Baik',
    catatanKepsek: 'Perangkat pembelajaran Kelas 5 tersusun rapi dan siap implementasi.',
    tindakLanjut: 'Finalisasi rubrik asesmen P5 tema kearifan lokal.',
    isVerified: true
  },
  {
    id: 'AUDIT-T5',
    teacherId: 'T5',
    teacherName: 'Nevilia Yunitasari',
    nip: '199006042024212051',
    classSubject: 'Kelas 1',
    semester: 'Ganjil',
    schoolYear: '2025/2026',
    auditDate: '2026-08-29',
    auditor: 'AKHMAD SHODIKIN, M.Pd',
    items: STANDARD_SD_ADMIN_DOCS.map((doc) => {
      if (doc.id === 'doc-08') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Jurnal harian pembelajaran kelas 1 belum diisi untuk 2 pertemuan awal.',
          lastUpdated: '2026-08-28'
        };
      }
      if (doc.id === 'doc-11') {
        return {
          ...doc,
          status: 'kurang' as const,
          score: 1,
          notes: 'Catatan transisi PAUD ke SD perlu didokumentasikan lebih intensif.',
          lastUpdated: '2026-08-29'
        };
      }
      return {
        ...doc,
        status: 'lengkap' as const,
        score: 2,
        notes: 'Perangkat pembelajaran membaca permulaan dan numerasi awal sangat baik.',
        lastUpdated: '2026-08-28'
      };
    }),
    totalScore: 26,
    maxScore: 28,
    percentage: 93,
    predicate: 'Sangat Baik',
    catatanKepsek: 'Perangkat pembelajaran Kelas 1 ramah anak dan kontekstual. Lengkapi catatan transisi siswa.',
    tindakLanjut: 'Lengkapi jurnal harian kelas dan portofolio asesmen awal literasi.',
    isVerified: true
  },
  {
    id: 'AUDIT-T6',
    teacherId: 'T6',
    teacherName: 'Nurul Afifah',
    nip: '198903122020122013',
    classSubject: 'Kelas 3',
    semester: 'Ganjil',
    schoolYear: '2025/2026',
    auditDate: '2026-08-30',
    auditor: 'AKHMAD SHODIKIN, M.Pd',
    items: STANDARD_SD_ADMIN_DOCS.map((doc) => {
      return {
        ...doc,
        status: 'lengkap' as const,
        score: 2,
        notes: 'Dokumen kelas 3 lengkap, perencanaan diferensiasi proses dan produk terprogram baik.',
        lastUpdated: '2026-08-30'
      };
    }),
    totalScore: 28,
    maxScore: 28,
    percentage: 100,
    predicate: 'Sangat Baik',
    catatanKepsek: 'Perangkat pembelajaran Kelas 3 sangat lengkap, rapi, dan inovatif.',
    tindakLanjut: 'Jadikan rujukan pengelolaan arsip pembelajaran bagi kelas lainnya.',
    isVerified: true
  }
];
