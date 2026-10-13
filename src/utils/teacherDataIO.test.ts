import { describe, it, expect } from 'bun:test';
import * as XLSX from 'xlsx';
import { 
  exportTeachersToXlsx, 
  downloadTeacherTemplateXlsx, 
  exportTeachersToCsv, 
  downloadTeacherTemplateCsv, 
  parseTeacherImportFile, 
  mergeTeachers 
} from './teacherDataIO';
import { Teacher } from '../types';
import { INITIAL_TEACHERS } from '../data/initialData';

describe('teacherDataIO utility', () => {
  it('should export teachers to XLSX and trigger download', () => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return 'blob:http://localhost:3000/mock-teachers.xlsx';
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
      exportTeachersToXlsx(INITIAL_TEACHERS, 'test_teachers.xlsx');
      expect(capturedFilename).toBe('test_teachers.xlsx');
      expect(capturedBlob).not.toBeNull();
      expect(capturedBlob?.type).toContain('spreadsheetml.sheet');
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });

  it('should download teacher template XLSX with multiple sheets', () => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return 'blob:http://localhost:3000/mock-template.xlsx';
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
      downloadTeacherTemplateXlsx('Template_Test.xlsx');
      expect(capturedFilename).toBe('Template_Test.xlsx');
      expect(capturedBlob).not.toBeNull();
      expect(capturedBlob?.type).toContain('spreadsheetml.sheet');
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });

  it('should parse XLSX file correctly using parseTeacherImportFile', async () => {
    // Generate valid XLSX buffer in memory
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['FORMAT IMPOR MASTER DATA GURU - SDN KANDANGAN I'],
      ['PANDUAN: Isi data guru'],
      ['No', 'Nama Lengkap Guru', 'NIP / NUPTK', 'Jenis Guru', 'Tugas Mengajar / Kelas', 'Status', 'No. WhatsApp / HP', 'Email'],
      [1, 'BAMBANG WIJAYA, S.Pd', '198705122011011008', 'Guru Kelas', 'Kelas 5', 'Aktif', '081234567890', 'bambang@gmail.com'],
      [2, 'SITI RAHMA, S.Pd', '199008242015032004', 'Guru Mata Pelajaran', 'Pendidikan Agama Islam', 'Aktif', '081398765432', 'siti@gmail.com']
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Data Guru');
    const u8 = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const mockFile = {
      name: 'guru_input.xlsx',
      arrayBuffer: async () => new Uint8Array(u8).buffer
    } as unknown as File;

    const result = await parseTeacherImportFile(mockFile);
    expect(result.validTeachers.length).toBe(2);
    expect(result.validTeachers[0].name).toBe('BAMBANG WIJAYA, S.Pd');
    expect(result.validTeachers[0].nip).toBe('198705122011011008');
    expect(result.validTeachers[0].type).toBe('Guru Kelas');
    expect(result.validTeachers[0].classSubject).toBe('Kelas 5');
    expect(result.validTeachers[1].name).toBe('SITI RAHMA, S.Pd');
    expect(result.validTeachers[1].type).toBe('Guru Mata Pelajaran');
  });

  it('should export teachers to CSV and trigger download', () => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return 'blob:http://localhost:3000/mock-teachers.csv';
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
      exportTeachersToCsv(INITIAL_TEACHERS, 'test_teachers.csv');
      expect(capturedFilename).toBe('test_teachers.csv');
      expect(capturedBlob).not.toBeNull();
      expect(capturedBlob?.type).toContain('text/csv');
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });

  it('should download teacher template CSV', () => {
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: () => 'blob:http://localhost:3000/mock-template',
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
      downloadTeacherTemplateCsv('Template_Test.csv');
      expect(capturedFilename).toBe('Template_Test.csv');
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });

  it('should parse CSV file with semicolon delimiter correctly', async () => {
    const csvContent = [
      'No;Nama Guru;NIP / NUPTK;Jenis Guru;Tugas Mengajar / Mata Pelajaran;Status;No WhatsApp;Email',
      '1;BAMBANG WIJAYA, S.Pd;198705122011011008;Guru Kelas;Kelas 5;Aktif;081234567890;bambang@gmail.com',
      '2;SITI RAHMA, S.Pd;199008242015032004;Guru Mata Pelajaran;Pendidikan Agama Islam;Aktif;081398765432;siti@gmail.com'
    ].join('\r\n');

    const mockFile = {
      name: 'guru.csv',
      type: 'text/csv'
    } as unknown as File;

    const originalFileReader = globalThis.FileReader;

    // @ts-ignore
    globalThis.FileReader = class {
      onload: any = null;
      onerror: any = null;
      readAsText() {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: csvContent } });
          }
        }, 10);
      }
    };

    try {
      const result = await parseTeacherImportFile(mockFile);
      expect(result.validTeachers.length).toBe(2);
      expect(result.validTeachers[0].name).toBe('BAMBANG WIJAYA, S.Pd');
      expect(result.validTeachers[0].nip).toBe('198705122011011008');
      expect(result.validTeachers[0].type).toBe('Guru Kelas');
      expect(result.validTeachers[0].classSubject).toBe('Kelas 5');
      expect(result.validTeachers[1].name).toBe('SITI RAHMA, S.Pd');
      expect(result.validTeachers[1].type).toBe('Guru Mata Pelajaran');
    } finally {
      globalThis.FileReader = originalFileReader;
    }
  });

  it('should parse JSON file containing teacher array correctly', async () => {
    const jsonContent = JSON.stringify([
      {
        name: 'GURU BARU, S.Pd',
        nip: '199501012022031001',
        type: 'Guru Kelas',
        classSubject: 'Kelas 3',
        status: 'Aktif',
        email: 'gurubaru@gmail.com'
      }
    ]);

    const mockFile = {
      name: 'guru.json',
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
            this.onload({ target: { result: jsonContent } });
          }
        }, 10);
      }
    };

    try {
      const result = await parseTeacherImportFile(mockFile);
      expect(result.validTeachers.length).toBe(1);
      expect(result.validTeachers[0].name).toBe('GURU BARU, S.Pd');
      expect(result.validTeachers[0].nip).toBe('199501012022031001');
      expect(result.validTeachers[0].email).toBe('gurubaru@gmail.com');
    } finally {
      globalThis.FileReader = originalFileReader;
    }
  });

  it('should merge teachers by updating existing and appending new ones', () => {
    const existing: Teacher[] = [
      {
        id: 'T1',
        name: 'Bambang Wijaya',
        nip: '198705122011011008',
        type: 'Guru Kelas',
        classSubject: 'Kelas 5',
        status: 'Aktif'
      }
    ];

    const imported: Teacher[] = [
      {
        id: 'T-TEMP-1',
        name: 'Bambang Wijaya, S.Pd',
        nip: '198705122011011008',
        type: 'Guru Kelas',
        classSubject: 'Kelas 6',
        status: 'Aktif',
        phone: '081234567890'
      },
      {
        id: 'T-TEMP-2',
        name: 'Guru Anyar, S.Pd',
        nip: '199301012020011001',
        type: 'Guru Mata Pelajaran',
        classSubject: 'PJOK',
        status: 'Aktif'
      }
    ];

    const merged = mergeTeachers(existing, imported, 'merge');
    expect(merged.length).toBe(2);
    // T1 ID should be preserved
    expect(merged[0].id).toBe('T1');
    expect(merged[0].name).toBe('Bambang Wijaya, S.Pd');
    expect(merged[0].classSubject).toBe('Kelas 6');
    expect(merged[0].phone).toBe('081234567890');
    // New teacher added
    expect(merged[1].name).toBe('Guru Anyar, S.Pd');
  });

  it('should replace all teachers when mode is replace', () => {
    const existing: Teacher[] = [
      {
        id: 'T1',
        name: 'Bambang Wijaya',
        nip: '198705122011011008',
        type: 'Guru Kelas',
        classSubject: 'Kelas 5',
        status: 'Aktif'
      }
    ];

    const imported: Teacher[] = [
      {
        id: 'T2',
        name: 'Guru Baru, S.Pd',
        nip: '199505052021012002',
        type: 'Guru Kelas',
        classSubject: 'Kelas 2',
        status: 'Aktif'
      }
    ];

    const replaced = mergeTeachers(existing, imported, 'replace');
    expect(replaced.length).toBe(1);
    expect(replaced[0].name).toBe('Guru Baru, S.Pd');
  });
});
