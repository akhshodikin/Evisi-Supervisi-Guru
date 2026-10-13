import { describe, it, expect } from 'bun:test';
import { getRegisteredUsers, findRegisteredUserByEmail } from './authService';
import { INITIAL_SETTINGS, INITIAL_TEACHERS } from '../data/initialData';

describe('authService', () => {
  it('should return all registered official users and teachers', () => {
    const users = getRegisteredUsers(INITIAL_SETTINGS, INITIAL_TEACHERS);
    expect(users.length).toBeGreaterThan(0);

    // Check Kepala Sekolah
    const ks = users.find(u => u.role === 'kepala_sekolah' && u.email === 'akh.shodikin@gmail.com');
    expect(ks).toBeDefined();
    expect(ks?.name).toBe(INITIAL_SETTINGS.principalName);
    expect(ks?.nip).toBe(INITIAL_SETTINGS.principalNip);

    // Check Admin
    const admin = users.find(u => u.role === 'admin');
    expect(admin).toBeDefined();
    expect(admin?.email).toBe('admin@sdnkandangan1.sch.id');

    // Check Pengawas
    const pengawas = users.find(u => u.role === 'pengawas');
    expect(pengawas).toBeDefined();
    expect(pengawas?.name).toBe(INITIAL_SETTINGS.supervisorName);

    // Check Teachers
    const teachersWithEmail = INITIAL_TEACHERS.filter(t => t.email);
    for (const teacher of teachersWithEmail) {
      const match = users.find(u => u.email === teacher.email?.toLowerCase());
      expect(match).toBeDefined();
      expect(match?.name).toBe(teacher.name);
      expect(match?.role).toBe('guru');
    }
  });

  it('should find registered user by email regardless of case or spaces', () => {
    // Normal email
    const user1 = findRegisteredUserByEmail('akh.shodikin@gmail.com', INITIAL_SETTINGS, INITIAL_TEACHERS);
    expect(user1).not.toBeNull();
    expect(user1?.role).toBe('kepala_sekolah');

    // Uppercase email
    const user2 = findRegisteredUserByEmail('AKH.SHODIKIN@GMAIL.COM', INITIAL_SETTINGS, INITIAL_TEACHERS);
    expect(user2).not.toBeNull();
    expect(user2?.email).toBe('akh.shodikin@gmail.com');

    // Email with whitespace
    const user3 = findRegisteredUserByEmail('  siti.rahma@guru.sd.belajar.id  ', INITIAL_SETTINGS, INITIAL_TEACHERS);
    expect(user3).not.toBeNull();
    expect(user3?.name).toBe('Siti Rahma, S.Pd');
  });

  it('should return null for unregistered email', () => {
    const user = findRegisteredUserByEmail('unknown.user@example.com', INITIAL_SETTINGS, INITIAL_TEACHERS);
    expect(user).toBeNull();
  });
});
