import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';
import { SchoolBundleData, ManagedSchool } from '../data/schoolsData';

let dbInstance: Firestore | null = null;

/**
 * Initializes and returns the Cloud Firestore database instance.
 * Gracefully falls back to null if offline or config is missing.
 */
export function getCloudFirestore(): Firestore | null {
  if (typeof window === 'undefined') return null;
  if (!dbInstance) {
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      // Attempt connecting with specific databaseId if defined, otherwise default
      if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
        try {
          dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        } catch {
          dbInstance = getFirestore(app);
        }
      } else {
        dbInstance = getFirestore(app);
      }
    } catch (err) {
      console.warn('Firestore initialization failed, running in local-only mode:', err);
      return null;
    }
  }
  return dbInstance;
}

export type CloudStatus = 'connected' | 'syncing' | 'offline' | 'error';

export interface CloudStatusInfo {
  status: CloudStatus;
  lastSyncedAt: Date | null;
  message: string;
}

// Global status listener callbacks
const statusListeners = new Set<(info: CloudStatusInfo) => void>();
let currentCloudStatus: CloudStatusInfo = {
  status: 'offline',
  lastSyncedAt: null,
  message: 'Menghubungkan ke Cloud Firestore...'
};

export function updateCloudStatus(info: Partial<CloudStatusInfo>) {
  currentCloudStatus = {
    ...currentCloudStatus,
    ...info
  };
  statusListeners.forEach(listener => {
    try {
      listener(currentCloudStatus);
    } catch (e) {
      console.error('Error in cloud status listener:', e);
    }
  });
}

export function subscribeCloudStatus(listener: (info: CloudStatusInfo) => void): () => void {
  statusListeners.add(listener);
  listener(currentCloudStatus);
  return () => {
    statusListeners.delete(listener);
  };
}

export function getCurrentCloudStatus(): CloudStatusInfo {
  return currentCloudStatus;
}

/**
 * Subscribes to real-time changes for a specific school in Cloud Firestore.
 * When any other device updates data, the onData callback receives the new bundle.
 * If the document does not exist yet on cloud, seeds initialBundle to cloud.
 */
export function subscribeToSchoolCloud(
  schoolId: string,
  initialBundle: SchoolBundleData,
  onData: (bundle: SchoolBundleData, remoteUpdatedAt: number) => void,
  userEmailOrName?: string
): Unsubscribe {
  const db = getCloudFirestore();
  if (!db) {
    updateCloudStatus({
      status: 'offline',
      message: 'Mode offline: Firestore tidak terhubung, data tersimpan di browser.'
    });
    return () => {};
  }

  updateCloudStatus({
    status: 'syncing',
    message: `Menghubungkan data real-time sekolah ${schoolId}...`
  });

  const schoolRef = doc(db, 'schools', schoolId);

  const unsubscribe = onSnapshot(
    schoolRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        if (raw && raw.settings && Array.isArray(raw.teachers)) {
          const bundle: SchoolBundleData = {
            settings: raw.settings,
            teachers: raw.teachers || [],
            observations: raw.observations || [],
            adminAudits: raw.adminAudits || []
          };
          const remoteTime = Number(raw.updatedAt) || Date.now();
          updateCloudStatus({
            status: 'connected',
            lastSyncedAt: new Date(remoteTime),
            message: `Real-time Cloud Aktif (${new Date(remoteTime).toLocaleTimeString('id-ID')})`
          });
          onData(bundle, remoteTime);
        }
      } else {
        // Document does not exist in Cloud yet: automatically seed current initialBundle
        saveSchoolToCloud(schoolId, initialBundle, userEmailOrName)
          .then(() => {
            updateCloudStatus({
              status: 'connected',
              lastSyncedAt: new Date(),
              message: 'Data awal sekolah berhasil diunggah ke Cloud Firestore.'
            });
          })
          .catch((err) => {
            console.warn('Gagal mengunggah seed awal ke Firestore:', err);
          });
      }
    },
    (error) => {
      console.warn('Real-time snapshot error (fallback ke lokal):', error);
      updateCloudStatus({
        status: 'offline',
        message: 'Koneksi cloud terputus. Data tetap tersimpan aman di browser Anda.'
      });
    }
  );

  return unsubscribe;
}

/**
 * Saves a school data bundle to Cloud Firestore.
 * Adds timestamp and author metadata.
 */
export async function saveSchoolToCloud(
  schoolId: string,
  bundle: SchoolBundleData,
  userEmailOrName?: string
): Promise<{ success: boolean; updatedAt: number }> {
  const db = getCloudFirestore();
  if (!db) {
    return { success: false, updatedAt: Date.now() };
  }

  updateCloudStatus({
    status: 'syncing',
    message: 'Menyimpan perubahan ke Cloud...'
  });

  const updatedAt = Date.now();
  const schoolRef = doc(db, 'schools', schoolId);

  try {
    await setDoc(
      schoolRef,
      {
        id: schoolId,
        settings: bundle.settings,
        teachers: bundle.teachers,
        observations: bundle.observations,
        adminAudits: bundle.adminAudits,
        updatedAt,
        updatedBy: userEmailOrName || 'Sistem SIGUR'
      },
      { merge: true }
    );

    updateCloudStatus({
      status: 'connected',
      lastSyncedAt: new Date(updatedAt),
      message: `Tersimpan di Cloud (${new Date(updatedAt).toLocaleTimeString('id-ID')})`
    });

    return { success: true, updatedAt };
  } catch (err: any) {
    console.error('Error saving school to Firestore:', err);
    updateCloudStatus({
      status: 'offline',
      message: 'Gagal sinkron ke Cloud, data aman di penyimpanan lokal.'
    });
    return { success: false, updatedAt };
  }
}

/**
 * Subscribes to the list of managed schools in Cloud Firestore.
 */
export function subscribeToManagedSchoolsCloud(
  initialSchools: ManagedSchool[],
  onData: (schools: ManagedSchool[]) => void
): Unsubscribe {
  const db = getCloudFirestore();
  if (!db) return () => {};

  const ref = doc(db, 'config', 'managed_schools');
  return onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data?.schools) && data.schools.length > 0) {
          onData(data.schools);
        }
      } else {
        // Seed if missing
        setDoc(ref, { schools: initialSchools, updatedAt: Date.now() }, { merge: true }).catch(() => {});
      }
    },
    (err) => {
      console.warn('Error reading managed schools from Cloud:', err);
    }
  );
}

/**
 * Saves the managed schools list to Cloud Firestore.
 */
export async function saveManagedSchoolsCloud(schools: ManagedSchool[]): Promise<boolean> {
  const db = getCloudFirestore();
  if (!db) return false;

  const ref = doc(db, 'config', 'managed_schools');
  try {
    await setDoc(ref, { schools, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving managed schools to Cloud:', err);
    return false;
  }
}
