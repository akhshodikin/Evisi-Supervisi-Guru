import { describe, it, expect } from 'bun:test';
import { INITIAL_SETTINGS, INITIAL_TEACHERS, INITIAL_OBSERVATIONS } from './initialData';

describe('initialData integrity', () => {
  it('should have valid school settings', () => {
    expect(INITIAL_SETTINGS.schoolName).toBe('SDN KANDANGAN I TOSARI');
    expect(INITIAL_SETTINGS.npsn).toBe('205219711');
    expect(INITIAL_SETTINGS.principalName).toBe('AKHMAD SHODIKIN, M.Pd');
    expect(INITIAL_SETTINGS.supervisorName).toBe('SYAMSUL HADI, S.Pd.');
    expect(INITIAL_SETTINGS.schoolYear).toBe('2025/2026');
    expect(INITIAL_SETTINGS.semester).toBe('Ganjil');
  });

  it('should have valid initial teachers with required fields', () => {
    expect(INITIAL_TEACHERS.length).toBeGreaterThan(0);
    for (const teacher of INITIAL_TEACHERS) {
      expect(teacher.id).toBeTruthy();
      expect(teacher.name).toBeTruthy();
      expect(teacher.nip).toBeTruthy();
      expect(teacher.type).toBeTruthy();
      expect(teacher.classSubject).toBeTruthy();
      expect(teacher.status).toBe('Aktif');
    }
  });

  it('should have observations with valid GROW stages and rubric scoring', () => {
    expect(INITIAL_OBSERVATIONS.length).toBeGreaterThan(0);
    for (const obs of INITIAL_OBSERVATIONS) {
      expect(obs.id).toBeTruthy();
      expect(obs.teacherId).toBeTruthy();
      expect(obs.teacherName).toBeTruthy();
      expect(obs.score).toBeGreaterThanOrEqual(0);
      expect(obs.score).toBeLessThanOrEqual(100);
      expect(['Sangat Baik', 'Baik', 'Cukup', 'Perlu Pembinaan', 'Belum Dinilai']).toContain(obs.category);

      // Check GROW coaching data structure
      expect(obs.pra).toBeDefined();
      expect(obs.pasca).toBeDefined();

      // For completed/post-observation stages, reflection should be populated
      if (obs.status === 'Pasca Observasi' || obs.status === 'Selesai') {
        expect(obs.pasca.refleksiGuru).toBeTruthy();
      }
    }
  });
});
