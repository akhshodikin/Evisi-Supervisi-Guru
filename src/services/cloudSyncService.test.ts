import { describe, it, expect } from 'bun:test';
import { 
  getCloudFirestore, 
  updateCloudStatus, 
  subscribeCloudStatus, 
  getCurrentCloudStatus,
  saveSchoolToCloud,
  subscribeToSchoolCloud,
  CloudStatusInfo
} from './cloudSyncService';
import { INITIAL_SETTINGS, INITIAL_TEACHERS, INITIAL_OBSERVATIONS } from '../data/initialData';
import { INITIAL_TEACHER_ADMIN_AUDITS } from '../data/adminDocsData';

describe('cloudSyncService', () => {
  it('should initialize or get Cloud Firestore instance', () => {
    // In node/bun test environment without full browser window, it safely returns instance or null without crashing
    const db = getCloudFirestore();
    expect(db === null || typeof db === 'object').toBe(true);
  });

  it('should notify subscribers when cloud status changes', () => {
    let receivedStatus: CloudStatusInfo | null = null;
    const unsub = subscribeCloudStatus((info) => {
      receivedStatus = info;
    });

    expect(receivedStatus).toBeDefined();

    updateCloudStatus({
      status: 'connected',
      message: 'Cloud Firestore aktif'
    });

    expect(receivedStatus?.status).toBe('connected');
    expect(receivedStatus?.message).toBe('Cloud Firestore aktif');
    expect(getCurrentCloudStatus().status).toBe('connected');

    unsub();
  });

  it('should safely execute saveSchoolToCloud and return valid metadata', async () => {
    const bundle = {
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS,
      adminAudits: INITIAL_TEACHER_ADMIN_AUDITS
    };

    const res = await saveSchoolToCloud('kandangan-1', bundle, 'AKHMAD SHODIKIN, M.Pd');
    expect(res).toBeDefined();
    expect(typeof res.updatedAt).toBe('number');
    expect(res.updatedAt).toBeGreaterThan(0);
  });

  it('should return a valid unsubscribe function when subscribing to school cloud changes', () => {
    const bundle = {
      settings: INITIAL_SETTINGS,
      teachers: INITIAL_TEACHERS,
      observations: INITIAL_OBSERVATIONS,
      adminAudits: INITIAL_TEACHER_ADMIN_AUDITS
    };

    const unsub = subscribeToSchoolCloud(
      'kandangan-1',
      bundle,
      () => {},
      'AKHMAD SHODIKIN, M.Pd'
    );

    expect(typeof unsub).toBe('function');
    unsub();
  });
});
