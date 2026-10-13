import { describe, it, expect, beforeEach } from 'bun:test';
import { 
  connectSchoolDriveUser, 
  getSavedDriveUser, 
  getAccessToken, 
  logout, 
  uploadPdfToDrive,
  deleteFileFromDrive
} from './googleDriveService';

// Ensure localStorage mock exists if run in headless runtime
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] || null,
    get length() { return store.size; }
  } as Storage;
}

// Ensure URL.createObjectURL exists for headless tests
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = () => 'blob:http://localhost:3000/mock-pdf-uuid';
}

describe('googleDriveService', () => {
  beforeEach(async () => {
    await logout();
  });

  it('should connect school drive user and persist session', async () => {
    const user = {
      displayName: 'AKHMAD SHODIKIN, M.Pd',
      email: 'akh.shodikin@gmail.com',
      photoURL: 'https://example.com/photo.jpg'
    };

    const connected = connectSchoolDriveUser(user);
    expect(connected.email).toBe('akh.shodikin@gmail.com');

    const saved = getSavedDriveUser();
    expect(saved).not.toBeNull();
    expect(saved.displayName).toBe('AKHMAD SHODIKIN, M.Pd');

    const token = await getAccessToken();
    expect(token).toBe('LOCAL_SCHOOL_DRIVE_TOKEN');
  });

  it('should upload PDF in School Drive Mode and return valid Drive result', async () => {
    connectSchoolDriveUser({
      displayName: 'Siti Rahma, S.Pd',
      email: 'siti.rahma@guru.sd.belajar.id'
    });

    const file = new File(['%PDF-1.4 mock content'], 'Modul_Ajar_IPAS.pdf', { type: 'application/pdf' });
    const result = await uploadPdfToDrive(file, 'Modul_Ajar_IPAS_Kelas4.pdf', 'Modul Ajar IPAS');

    expect(result.id).toBeTruthy();
    expect(result.id.startsWith('DRV-SDN-')).toBe(true);
    expect(result.name).toBe('Modul_Ajar_IPAS_Kelas4.pdf');
    expect(result.size).toBeGreaterThan(0);
    expect(result.webViewLink).toBeTruthy();
    expect(result.webContentLink).toBeTruthy();
  });

  it('should delete file successfully in School Drive Mode', async () => {
    connectSchoolDriveUser({
      displayName: 'AKHMAD SHODIKIN, M.Pd',
      email: 'akh.shodikin@gmail.com'
    });

    const success = await deleteFileFromDrive('DRV-SDN-TEST-12345');
    expect(success).toBe(true);
  });

  it('should clear user session on logout', async () => {
    connectSchoolDriveUser({
      displayName: 'AKHMAD SHODIKIN, M.Pd',
      email: 'akh.shodikin@gmail.com'
    });

    expect(getSavedDriveUser()).not.toBeNull();
    await logout();
    expect(getSavedDriveUser()).toBeNull();
    const token = await getAccessToken();
    expect(token).toBeNull();
  });
});
