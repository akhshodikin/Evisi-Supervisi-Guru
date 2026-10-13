import { AuthUser, SchoolSettings, Teacher, UserRole } from '../types';

export const getRegisteredUsers = (settings: SchoolSettings, teachers: Teacher[]): AuthUser[] => {
  const users: AuthUser[] = [
    // 1. Kepala Sekolah (Akun Resmi & Email Utama)
    {
      email: 'akh.shodikin@gmail.com',
      name: settings.principalName || 'AKHMAD SHODIKIN, M.Pd',
      role: 'kepala_sekolah' as UserRole,
      nip: settings.principalNip || '198503182009031009',
      title: 'Kepala Sekolah (Penilai Utama)',
      loginMethod: 'email'
    },
    {
      email: 'akh.shodikin@admin.belajar.id',
      name: settings.principalName || 'AKHMAD SHODIKIN, M.Pd',
      role: 'kepala_sekolah' as UserRole,
      nip: settings.principalNip || '198503182009031009',
      title: settings.principalTitle ? `${settings.principalTitle} (Akun Belajar.id)` : 'Kepala Sekolah (Akun Belajar.id)',
      loginMethod: 'email'
    },
    // 2. Administrator Sistem
    {
      email: 'admin@sdnkandangan1.sch.id',
      name: 'Administrator SIGUR SD',
      role: 'admin' as UserRole,
      title: 'Admin Sistem & Data Supervisi',
      loginMethod: 'email'
    },
    {
      email: 'admin@sigur-sd.id',
      name: 'Administrator SIGUR SD',
      role: 'admin' as UserRole,
      title: 'Admin Sistem & Data Supervisi',
      loginMethod: 'email'
    },
    // 3. Pengawas Pembina SD
    {
      email: 'syamsul.hadi@pengawas.belajar.id',
      name: settings.supervisorName || 'SYAMSUL HADI, S.Pd.',
      role: 'pengawas' as UserRole,
      nip: settings.supervisorNip || '196703211992021001',
      title: 'Pengawas Pembina SD Kec. Tosari',
      loginMethod: 'email'
    },
  ];

  // 4. Dewan Guru dari Master Data Guru
  teachers.forEach(teacher => {
    if (teacher.email && teacher.email.trim()) {
      users.push({
        email: teacher.email.trim().toLowerCase(),
        name: teacher.name,
        role: 'guru' as UserRole,
        nip: teacher.nip,
        teacherId: teacher.id,
        title: `${teacher.type} - ${teacher.classSubject}`,
        loginMethod: 'email'
      });
    }
  });

  return users;
};

export const findRegisteredUserByEmail = (
  email: string,
  settings: SchoolSettings,
  teachers: Teacher[]
): AuthUser | null => {
  const cleanEmail = email.trim().toLowerCase();
  const allUsers = getRegisteredUsers(settings, teachers);
  const found = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
  return found || null;
};
