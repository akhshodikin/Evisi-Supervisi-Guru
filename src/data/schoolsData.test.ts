import { describe, it, expect, beforeEach } from 'bun:test';
import { 
  DEFAULT_MANAGED_SCHOOLS, 
  SCHOOL_2_SETTINGS,
  SCHOOL_2_TEACHERS,
  SCHOOL_2_OBSERVATIONS,
  getSchoolStoragePrefix, 
  loadSchoolData, 
  saveSchoolData,
  getSchoolQuickStats,
  STORAGE_BASE_KEY
} from './schoolsData';
import { INITIAL_SETTINGS, INITIAL_TEACHERS, INITIAL_OBSERVATIONS } from './initialData';

describe('Multi-School Management & Isolation', () => {
  it('should have 2 default managed schools led by the same Principal', () => {
    expect(DEFAULT_MANAGED_SCHOOLS.length).toBe(2);
    
    const [school1, school2] = DEFAULT_MANAGED_SCHOOLS;
    expect(school1.id).toBe('kandangan-1');
    expect(school1.name).toBe('SDN KANDANGAN I TOSARI');
    expect(school1.npsn).toBe('205219711');

    expect(school2.id).toBe('kandangan-2');
    expect(school2.name).toBe('SDN KANDANGAN II TOSARI');
    expect(school2.npsn).toBe('205219712');

    // Both schools led by Akhmad Shodikin
    expect(INITIAL_SETTINGS.principalName).toBe('AKHMAD SHODIKIN, M.Pd');
    expect(SCHOOL_2_SETTINGS.principalName).toBe('AKHMAD SHODIKIN, M.Pd');
    expect(SCHOOL_2_SETTINGS.principalTitle).toContain('Plt. Kepala Sekolah');
  });

  it('should have completely different teachers for School 1 and School 2', () => {
    expect(INITIAL_TEACHERS.length).toBeGreaterThan(0);
    expect(SCHOOL_2_TEACHERS.length).toBeGreaterThan(0);

    const school1TeacherNames = INITIAL_TEACHERS.map(t => t.name.toLowerCase());
    const school2TeacherNames = SCHOOL_2_TEACHERS.map(t => t.name.toLowerCase());

    // No teacher overlap
    for (const name of school2TeacherNames) {
      expect(school1TeacherNames).not.toContain(name);
    }

    const school1Nips = INITIAL_TEACHERS.map(t => t.nip);
    const school2Nips = SCHOOL_2_TEACHERS.map(t => t.nip);
    for (const nip of school2Nips) {
      expect(school1Nips).not.toContain(nip);
    }
  });

  it('should have isolated observations for School 1 and School 2', () => {
    const school1ObsIds = INITIAL_OBSERVATIONS.map(o => o.id);
    const school2ObsIds = SCHOOL_2_OBSERVATIONS.map(o => o.id);

    for (const id of school2ObsIds) {
      expect(school1ObsIds).not.toContain(id);
    }
  });

  it('should generate backward-compatible storage prefix for school 1 and namespaced for other schools', () => {
    // School 1 must use original key for full backward compatibility
    expect(getSchoolStoragePrefix('kandangan-1')).toBe(STORAGE_BASE_KEY);
    expect(getSchoolStoragePrefix('sch-kandangan-1')).toBe(STORAGE_BASE_KEY);

    // School 2 and beyond use isolated prefixes
    expect(getSchoolStoragePrefix('kandangan-2')).toBe(`${STORAGE_BASE_KEY}_kandangan-2`);
    expect(getSchoolStoragePrefix('sch-custom')).toBe(`${STORAGE_BASE_KEY}_sch-custom`);
  });

  it('should load distinct school bundles correctly', () => {
    const bundle1 = loadSchoolData('kandangan-1');
    const bundle2 = loadSchoolData('kandangan-2');

    expect(bundle1.settings.schoolName).toBe('SDN KANDANGAN I TOSARI');
    expect(bundle2.settings.schoolName).toBe('SDN KANDANGAN II TOSARI');

    expect(bundle1.teachers[0].name).not.toBe(bundle2.teachers[0].name);
    expect(bundle1.observations.length).toBeGreaterThan(0);
    expect(bundle2.observations.length).toBeGreaterThan(0);
  });

  it('should return accurate quick stats per school', () => {
    const stats1 = getSchoolQuickStats('kandangan-1');
    expect(stats1.totalTeachers).toBe(INITIAL_TEACHERS.length);
    expect(stats1.totalObservations).toBe(INITIAL_OBSERVATIONS.length);

    const stats2 = getSchoolQuickStats('kandangan-2');
    expect(stats2.totalTeachers).toBe(SCHOOL_2_TEACHERS.length);
    expect(stats2.totalObservations).toBe(SCHOOL_2_OBSERVATIONS.length);
  });

  it('should completely synchronize all school metadata, teachers, and audits when switching to School 2', () => {
    const school2 = loadSchoolData('kandangan-2');

    // 1. Identity & Profile Synchronization
    expect(school2.settings.schoolName).toBe('SDN KANDANGAN II TOSARI');
    expect(school2.settings.npsn).toBe('205219712');
    expect(school2.settings.address).toContain('Tosari');
    expect(school2.settings.principalName).toBe('AKHMAD SHODIKIN, M.Pd');
    expect(school2.settings.principalTitle).toBe('Plt. Kepala Sekolah SDN Kandangan II Tosari');

    // 2. Teachers Synchronization (7 teachers in School 2 vs 6 in School 1)
    expect(school2.teachers.length).toBe(7);
    const teacherNames = school2.teachers.map(t => t.name);
    expect(teacherNames).toContain('Agus Santoso, S.Pd');
    expect(teacherNames).toContain('Nurul Hidayati, S.Pd.SD');
    expect(teacherNames).not.toContain('Ireliya Austina Prahesti');

    // 3. Admin Audits Synchronization (every teacher has an audit matching school 2)
    expect(school2.adminAudits.length).toBe(7);
    for (const audit of school2.adminAudits) {
      expect(teacherNames).toContain(audit.teacherName);
      expect(audit.items.length).toBe(14);
    }
  });
});
