import { describe, it, expect } from 'bun:test';
import { 
  STANDARD_SD_ADMIN_DOCS, 
  INITIAL_TEACHER_ADMIN_AUDITS,
  calculateAuditScore,
  createDefaultTeacherAudit,
  findAuditForTeacher,
  syncTeacherAudits,
  syncObservationModulAjarWithAudit
} from './adminDocsData';
import { INITIAL_TEACHERS, INITIAL_SETTINGS, INITIAL_OBSERVATIONS } from './initialData';
import { Teacher, ObservationData } from '../types';

describe('Admin Docs Synchronization & Audit Logic', () => {
  it('should have 14 standard Kurikulum Merdeka documents', () => {
    expect(STANDARD_SD_ADMIN_DOCS.length).toBe(14);
    for (const doc of STANDARD_SD_ADMIN_DOCS) {
      expect(doc.id).toBeTruthy();
      expect(doc.no).toBeGreaterThanOrEqual(1);
      expect(doc.no).toBeLessThanOrEqual(14);
      expect(doc.name).toBeTruthy();
      expect(doc.category).toBeTruthy();
      expect(doc.standard).toBeTruthy();
    }
  });

  it('should calculate audit scores, percentages, and predicates correctly', () => {
    // 14 items with score 2 each = 28 / 28 = 100% (Sangat Baik)
    const itemsAllComplete = STANDARD_SD_ADMIN_DOCS.map(d => ({
      ...d,
      status: 'lengkap' as const,
      score: 2
    }));
    const score1 = calculateAuditScore(itemsAllComplete);
    expect(score1.totalScore).toBe(28);
    expect(score1.maxScore).toBe(28);
    expect(score1.percentage).toBe(100);
    expect(score1.predicate).toBe('Sangat Baik');

    // 14 items with score 1 each = 14 / 28 = 50% (Perlu Pembinaan)
    const itemsPartial = STANDARD_SD_ADMIN_DOCS.map(d => ({
      ...d,
      status: 'kurang' as const,
      score: 1
    }));
    const score2 = calculateAuditScore(itemsPartial);
    expect(score2.totalScore).toBe(14);
    expect(score2.percentage).toBe(50);
    expect(score2.predicate).toBe('Perlu Pembinaan');

    // 11 lengkap (22) + 3 tidak ada (0) = 22 / 28 = 79% (Baik)
    const itemsGood = STANDARD_SD_ADMIN_DOCS.map((d, idx) => ({
      ...d,
      status: idx < 11 ? ('lengkap' as const) : ('tidak_ada' as const),
      score: idx < 11 ? 2 : 0
    }));
    const score3 = calculateAuditScore(itemsGood);
    expect(score3.totalScore).toBe(22);
    expect(score3.percentage).toBe(79);
    expect(score3.predicate).toBe('Baik');
  });

  it('should find audit for teacher by teacherId, nip, or name', () => {
    const teacher = INITIAL_TEACHERS[0]; // Bambang Wijaya (T1)
    
    // Match by ID
    const byId = findAuditForTeacher({ teacherId: teacher.id }, INITIAL_TEACHER_ADMIN_AUDITS);
    expect(byId).toBeDefined();
    expect(byId?.teacherName).toBe(teacher.name);

    // Match by NIP
    const byNip = findAuditForTeacher({ nip: teacher.nip }, INITIAL_TEACHER_ADMIN_AUDITS);
    expect(byNip).toBeDefined();
    expect(byNip?.teacherId).toBe(teacher.id);

    // Match by Name
    const byName = findAuditForTeacher({ teacherName: teacher.name.toLowerCase() }, INITIAL_TEACHER_ADMIN_AUDITS);
    expect(byName).toBeDefined();
    expect(byName?.teacherId).toBe(teacher.id);

    // Match by Observation object
    const obs = INITIAL_OBSERVATIONS[0];
    const byObs = findAuditForTeacher(obs, INITIAL_TEACHER_ADMIN_AUDITS);
    expect(byObs).toBeDefined();
    expect(byObs?.teacherName).toBe(obs.teacherName);
  });

  it('should create a complete 14-document default audit for a new teacher', () => {
    const newTeacher: Teacher = {
      id: 'T-NEW-99',
      name: 'Rahmat Hidayat, S.Pd',
      nip: '199501012022011001',
      type: 'Guru Kelas',
      classSubject: 'Kelas 3',
      status: 'Aktif'
    };

    const newAudit = createDefaultTeacherAudit(newTeacher, INITIAL_SETTINGS);
    expect(newAudit.teacherId).toBe('T-NEW-99');
    expect(newAudit.teacherName).toBe('Rahmat Hidayat, S.Pd');
    expect(newAudit.items.length).toBe(14);
    expect(newAudit.totalScore).toBe(28);
    expect(newAudit.percentage).toBe(100);
    expect(newAudit.predicate).toBe('Sangat Baik');
  });

  it('should synchronize teacher list ensuring every teacher has an audit without losing existing data', () => {
    // Take initial teachers plus a newly added teacher
    const newTeacher: Teacher = {
      id: 'T-GURU-BARU',
      name: 'Dewi Lestari, S.Pd',
      nip: '199308122020122005',
      type: 'Guru Mata Pelajaran',
      classSubject: 'Bahasa Inggris',
      status: 'Aktif'
    };
    const allTeachers = [...INITIAL_TEACHERS, newTeacher];

    const synced = syncTeacherAudits(allTeachers, INITIAL_TEACHER_ADMIN_AUDITS, INITIAL_SETTINGS);

    // All teachers must have an audit entry
    expect(synced.length).toBe(allTeachers.length);
    for (const t of allTeachers) {
      const audit = findAuditForTeacher(t, synced);
      expect(audit).toBeDefined();
      expect(audit?.items.length).toBe(14);
      expect(audit?.teacherName).toBe(t.name);
    }

    // Existing audit for T1 (Bambang Wijaya) should preserve custom scores / notes
    const existingT1 = INITIAL_TEACHER_ADMIN_AUDITS.find(a => a.teacherId === 'T1');
    const syncedT1 = synced.find(a => a.teacherId === 'T1');
    expect(syncedT1?.percentage).toBe(existingT1?.percentage);
  });

  it('should automatically sync observation Modul Ajar with audit doc-05', () => {
    const teacher = INITIAL_TEACHERS[0];
    const audit = createDefaultTeacherAudit(teacher, INITIAL_SETTINGS);

    // Reset doc-05 to 'tidak_ada'
    audit.items = audit.items.map(item => item.id === 'doc-05' ? { ...item, status: 'tidak_ada' as const, score: 0 } : item);

    const obsWithModul: ObservationData = {
      ...INITIAL_OBSERVATIONS[0],
      teacherId: teacher.id,
      subject: 'Matematika - FPB & KPK',
      modulAjar: {
        id: 'MA-001',
        name: 'Modul_Ajar_Matematika_Kelas_5.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        uploadedAt: '2026-10-10',
        driveFileId: 'DRIVE-FILE-123',
        driveViewLink: 'https://drive.google.com/file/d/123/view'
      }
    };

    const syncedAudit = syncObservationModulAjarWithAudit(obsWithModul, audit);
    const doc05 = syncedAudit.items.find(i => i.id === 'doc-05');

    expect(doc05).toBeDefined();
    expect(doc05?.status).toBe('lengkap');
    expect(doc05?.score).toBe(2);
    expect(doc05?.fileUrl).toBe('https://drive.google.com/file/d/123/view');
    expect(doc05?.fileName).toBe('Modul_Ajar_Matematika_Kelas_5.pdf');
    expect(doc05?.notes).toContain('Modul Ajar (Matematika - FPB & KPK) telah divalidasi');
  });
});
