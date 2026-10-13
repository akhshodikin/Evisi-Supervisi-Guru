import { describe, it, expect } from 'bun:test';
import { 
  createBackupPayload, 
  validateBackupData, 
  exportDataBackup, 
  readBackupFile,
  BackupDataPayload 
} from './backupRestore';
import { INITIAL_SETTINGS, INITIAL_TEACHERS, INITIAL_OBSERVATIONS } from '../data/initialData';
import { INITIAL_TEACHER_ADMIN_AUDITS } from '../data/adminDocsData';

describe('backupRestore utility', () => {
  it('should create a valid structured BackupDataPayload', () => {
    const payload = createBackupPayload({
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS,
      adminAudits: INITIAL_TEACHER_ADMIN_AUDITS,
      userAvatars: { 'akh.shodikin@gmail.com': 'data:image/png;base64,mock' }
    });

    expect(payload.app).toBe('SIGUR SD');
    expect(payload.appVersion).toBe('3.0.0');
    expect(payload.schoolInfo.name).toBe(INITIAL_SETTINGS.schoolName);
    expect(payload.summary.totalTeachers).toBe(INITIAL_TEACHERS.length);
    expect(payload.summary.totalObservations).toBe(INITIAL_OBSERVATIONS.length);
    expect(payload.summary.totalAdminAudits).toBe(INITIAL_TEACHER_ADMIN_AUDITS.length);
    expect(payload.summary.hasAvatars).toBe(true);
    expect(payload.data.teachers.length).toBe(INITIAL_TEACHERS.length);
    expect(payload.data.observations.length).toBe(INITIAL_OBSERVATIONS.length);
    expect(payload.data.adminAudits?.length).toBe(INITIAL_TEACHER_ADMIN_AUDITS.length);
  });

  it('should validate successfully for a well-formed structured payload', () => {
    const payload = createBackupPayload({
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS
    });

    const result = validateBackupData(payload);
    expect(result.isValid).toBe(true);
    if (result.isValid) {
      expect(result.payload.schoolInfo.name).toBe(INITIAL_SETTINGS.schoolName);
      expect(result.payload.summary.totalTeachers).toBe(INITIAL_TEACHERS.length);
    }
  });

  it('should validate successfully for a legacy/flat payload', () => {
    const flatPayload = {
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS,
      adminAudits: INITIAL_TEACHER_ADMIN_AUDITS
    };

    const result = validateBackupData(flatPayload);
    expect(result.isValid).toBe(true);
    if (result.isValid) {
      expect(result.payload.schoolInfo.name).toBe(INITIAL_SETTINGS.schoolName);
      expect(result.payload.data.teachers.length).toBe(INITIAL_TEACHERS.length);
      expect(result.payload.data.observations.length).toBe(INITIAL_OBSERVATIONS.length);
    }
  });

  it('should fail validation when payload is not an object', () => {
    const result1 = validateBackupData(null);
    expect(result1.isValid).toBe(false);
    expect(result1.errorMessage).toContain('Format berkas tidak valid');

    const result2 = validateBackupData('string');
    expect(result2.isValid).toBe(false);

    const result3 = validateBackupData([1, 2, 3]);
    expect(result3.isValid).toBe(false);
  });

  it('should fail validation when settings or schoolName is missing', () => {
    const invalidPayload = {
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS
    };
    const result = validateBackupData(invalidPayload);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('settings');

    const invalidSettings = {
      settings: { schoolName: '   ' },
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS
    };
    const result2 = validateBackupData(invalidSettings);
    expect(result2.isValid).toBe(false);
    expect(result2.errorMessage).toContain('nama satuan pendidikan');
  });

  it('should fail validation when teachers or observations are not arrays', () => {
    const noTeachers = {
      settings: INITIAL_SETTINGS,
      teachers: 'not-an-array',
      observations: INITIAL_OBSERVATIONS
    };
    const result1 = validateBackupData(noTeachers);
    expect(result1.isValid).toBe(false);
    expect(result1.errorMessage).toContain('teachers');

    const noObs = {
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: null
    };
    const result2 = validateBackupData(noObs);
    expect(result2.isValid).toBe(false);
    expect(result2.errorMessage).toContain('observations');
  });

  it('should export backup JSON and trigger download without throwing', () => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return 'blob:http://localhost:3000/mock-backup';
      },
      revokeObjectURL: () => {}
    };

    // @ts-ignore
    globalThis.document = {
      createElement: (tag: string) => {
        if (tag === 'a') {
          return {
            setAttribute: (attr: string, val: string) => {
              if (attr === 'download') capturedFilename = val;
            },
            click: () => {},
            style: {}
          };
        }
        return {};
      },
      body: {
        appendChild: () => {},
        removeChild: () => {}
      }
    };

    try {
      exportDataBackup({
        settings: INITIAL_SETTINGS,
        teachers: INITIAL_TEACHERS,
        observations: INITIAL_OBSERVATIONS,
        adminAudits: INITIAL_TEACHER_ADMIN_AUDITS,
        customFilename: 'custom_backup.json'
      });

      expect(capturedFilename).toBe('custom_backup.json');
      expect(capturedBlob).not.toBeNull();
      expect(capturedBlob?.type).toContain('application/json');
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });

  it('should read and parse valid File object using readBackupFile', async () => {
    const payload = createBackupPayload({
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS
    });
    const jsonString = JSON.stringify(payload);

    // Mock File and FileReader
    const mockFile = {
      name: 'backup_test.json',
      type: 'application/json'
    } as unknown as File;

    const originalFileReader = globalThis.FileReader;

    // @ts-ignore
    globalThis.FileReader = class {
      onload: any = null;
      onerror: any = null;
      readAsText() {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: jsonString } });
          }
        }, 10);
      }
    };

    try {
      const parsed = await readBackupFile(mockFile);
      expect(parsed.app).toBe('SIGUR SD');
      expect(parsed.schoolInfo.name).toBe(INITIAL_SETTINGS.schoolName);
      expect(parsed.summary.totalTeachers).toBe(INITIAL_TEACHERS.length);
    } finally {
      globalThis.FileReader = originalFileReader;
    }
  });
});
