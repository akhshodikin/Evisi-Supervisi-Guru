import { SchoolSettings, Teacher, ObservationData, TeacherAdminAudit } from '../types';

export interface BackupDataPayload {
  app: 'SIGUR SD';
  appVersion: string;
  exportDate: string; // ISO string
  exportTimestamp: number;
  schoolInfo: {
    name: string;
    npsn: string;
    schoolYear: string;
    semester: string;
  };
  summary: {
    totalTeachers: number;
    totalObservations: number;
    totalAdminAudits: number;
    hasAvatars: boolean;
  };
  data: {
    settings: SchoolSettings;
    teachers: Teacher[];
    observations: ObservationData[];
    adminAudits?: TeacherAdminAudit[];
    userAvatars?: Record<string, string>;
  };
}

export interface ValidationSuccess {
  isValid: true;
  payload: BackupDataPayload;
}

export interface ValidationFailure {
  isValid: false;
  errorMessage: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Creates a structured BackupDataPayload from the application state
 */
export function createBackupPayload(params: {
  settings: SchoolSettings;
  teachers: Teacher[];
  observations: ObservationData[];
  adminAudits?: TeacherAdminAudit[];
  userAvatars?: Record<string, string>;
}): BackupDataPayload {
  const { settings, teachers, observations, adminAudits = [], userAvatars = {} } = params;
  const now = new Date();

  return {
    app: 'SIGUR SD',
    appVersion: '3.0.0',
    exportDate: now.toISOString(),
    exportTimestamp: now.getTime(),
    schoolInfo: {
      name: settings.schoolName || 'SD',
      npsn: settings.npsn || '',
      schoolYear: settings.schoolYear || '',
      semester: settings.semester || 'Ganjil'
    },
    summary: {
      totalTeachers: teachers.length,
      totalObservations: observations.length,
      totalAdminAudits: adminAudits.length,
      hasAvatars: Object.keys(userAvatars).length > 0
    },
    data: {
      settings,
      teachers,
      observations,
      adminAudits,
      userAvatars
    }
  };
}

/**
 * Exports data to a JSON backup file and triggers browser download
 */
export function exportDataBackup(params: {
  settings: SchoolSettings;
  teachers: Teacher[];
  observations: ObservationData[];
  adminAudits?: TeacherAdminAudit[];
  userAvatars?: Record<string, string>;
  customFilename?: string;
}): void {
  const payload = createBackupPayload(params);
  const jsonContent = JSON.stringify(payload, null, 2);

  const schoolSafeName = (params.settings.schoolName || 'Sekolah')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');
  const dateSafe = new Date().toISOString().split('T')[0];
  const filename = params.customFilename || `Backup_SIGUR_SD_${schoolSafeName}_${dateSafe}.json`;

  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates any parsed JSON object to ensure it conforms to backup payload requirements.
 * Accepts both standard structured payloads and legacy flat payloads.
 */
export function validateBackupData(parsedJson: any): ValidationResult {
  if (!parsedJson || typeof parsedJson !== 'object' || Array.isArray(parsedJson)) {
    return {
      isValid: false,
      errorMessage: 'Format berkas tidak valid: Isi berkas cadangan harus berupa objek JSON.'
    };
  }

  // Detect payload structure (structured with .data or direct flat object)
  let rawData: any = parsedJson;
  if (parsedJson.data && typeof parsedJson.data === 'object' && !Array.isArray(parsedJson.data)) {
    rawData = parsedJson.data;
  }

  // 1. Validate settings
  if (!rawData.settings || typeof rawData.settings !== 'object' || Array.isArray(rawData.settings)) {
    return {
      isValid: false,
      errorMessage: 'Berkas cadangan tidak memiliki data pengaturan sekolah (settings).'
    };
  }

  if (typeof rawData.settings.schoolName !== 'string' || !rawData.settings.schoolName.trim()) {
    return {
      isValid: false,
      errorMessage: 'Pengaturan sekolah tidak memiliki nama satuan pendidikan yang valid.'
    };
  }

  // 2. Validate teachers
  if (!Array.isArray(rawData.teachers)) {
    return {
      isValid: false,
      errorMessage: 'Berkas cadangan tidak memiliki daftar guru (teachers) yang valid.'
    };
  }

  // 3. Validate observations
  if (!Array.isArray(rawData.observations)) {
    return {
      isValid: false,
      errorMessage: 'Berkas cadangan tidak memiliki data supervisi observasi (observations) yang valid.'
    };
  }

  // 4. Validate adminAudits if present
  let adminAudits: TeacherAdminAudit[] = [];
  if (rawData.adminAudits) {
    if (!Array.isArray(rawData.adminAudits)) {
      return {
        isValid: false,
        errorMessage: 'Data audit administrasi (adminAudits) tidak valid (harus berupa array).'
      };
    }
    adminAudits = rawData.adminAudits;
  }

  // 5. Validate userAvatars if present
  let userAvatars: Record<string, string> = {};
  if (rawData.userAvatars) {
    if (typeof rawData.userAvatars !== 'object' || Array.isArray(rawData.userAvatars)) {
      return {
        isValid: false,
        errorMessage: 'Data foto profil (userAvatars) tidak valid.'
      };
    }
    userAvatars = rawData.userAvatars;
  }

  // Build normalized payload
  const normalizedPayload: BackupDataPayload = {
    app: 'SIGUR SD',
    appVersion: parsedJson.appVersion || '3.0.0',
    exportDate: parsedJson.exportDate || new Date().toISOString(),
    exportTimestamp: parsedJson.exportTimestamp || Date.now(),
    schoolInfo: {
      name: rawData.settings.schoolName,
      npsn: rawData.settings.npsn || '',
      schoolYear: rawData.settings.schoolYear || '',
      semester: rawData.settings.semester || 'Ganjil'
    },
    summary: {
      totalTeachers: rawData.teachers.length,
      totalObservations: rawData.observations.length,
      totalAdminAudits: adminAudits.length,
      hasAvatars: Object.keys(userAvatars).length > 0
    },
    data: {
      settings: rawData.settings,
      teachers: rawData.teachers,
      observations: rawData.observations,
      adminAudits,
      userAvatars
    }
  };

  return {
    isValid: true,
    payload: normalizedPayload
  };
}

/**
 * Reads a File object and validates its content as a BackupDataPayload
 */
export async function readBackupFile(file: File): Promise<BackupDataPayload> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Berkas tidak ditemukan.'));
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      reject(new Error('Format berkas harus berformat JSON (.json).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          reject(new Error('Berkas cadangan kosong.'));
          return;
        }

        const parsed = JSON.parse(text);
        const result = validateBackupData(parsed);

        if (!result.isValid) {
          reject(new Error(result.errorMessage));
          return;
        }

        resolve(result.payload);
      } catch (err: any) {
        reject(new Error(`Gagal membaca berkas JSON: ${err.message || 'Format JSON rusak.'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas dari sistem komputer.'));
    };

    reader.readAsText(file);
  });
}
