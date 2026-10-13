import { describe, it, expect } from 'bun:test';
import { exportObservationsToCsv, exportObservationsToExcelHtml } from './excelExport';
import { INITIAL_SETTINGS, INITIAL_OBSERVATIONS } from '../data/initialData';

describe('excelExport', () => {
  it('should generate valid CSV and trigger download without throwing', () => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return 'blob:http://localhost:3000/mock-download';
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
      exportObservationsToCsv(INITIAL_OBSERVATIONS, INITIAL_SETTINGS, 'test_rekap.csv');
      expect(capturedFilename).toBe('test_rekap.csv');
      expect(capturedBlob).not.toBeNull();
      expect(capturedBlob?.type).toContain('text/csv');
      expect(capturedBlob?.size).toBeGreaterThan(0);
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });

  it('should generate valid Excel XML/HTML and trigger download without throwing', () => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    const originalDocument = globalThis.document;
    const originalUrl = globalThis.URL;

    // @ts-ignore
    globalThis.URL = {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return 'blob:http://localhost:3000/mock-download';
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
      exportObservationsToExcelHtml(INITIAL_OBSERVATIONS, INITIAL_SETTINGS, 'test_rekap.xls');
      expect(capturedFilename).toBe('test_rekap.xls');
      expect(capturedBlob).not.toBeNull();
      expect(capturedBlob?.type).toContain('vnd.ms-excel');
      expect(capturedBlob?.size).toBeGreaterThan(0);
    } finally {
      globalThis.document = originalDocument;
      globalThis.URL = originalUrl;
    }
  });
});
