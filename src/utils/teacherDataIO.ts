import * as XLSX from 'xlsx';
import { Teacher } from '../types';

/**
 * Downloads a pre-formatted, easy-to-fill XLSX template with sample data and a guidance sheet
 */
export function downloadTeacherTemplateXlsx(customFilename?: string): void {
  const filename = customFilename || 'Template_Import_Master_Data_Guru_SD.xlsx';

  // SHEET 1: Data Guru (Tabel Utama yang Diisi Sekolah)
  const sheet1Data: (string | number)[][] = [
    ['FORMAT IMPOR MASTER DATA GURU - SDN KANDANGAN I TOSARI'],
    ['PANDUAN: Isi data guru pada baris ke-4 ke bawah. Anda dapat mengedit data contoh di bawah ini atau menambahkan baris baru.'],
    [
      'No',
      'Nama Lengkap Guru (dengan Gelar)',
      'NIP / NUPTK',
      'Jenis Guru',
      'Tugas Mengajar / Kelas',
      'Status',
      'No. WhatsApp / HP',
      'Email Akun'
    ],
    // Contoh 1: Guru Kelas
    [
      1,
      'BAMBANG WIJAYA, S.Pd',
      '198705122011011008',
      'Guru Kelas',
      'Kelas 5',
      'Aktif',
      '081234567890',
      'bambang.wijaya@gmail.com'
    ],
    // Contoh 2: Guru Mata Pelajaran Agama
    [
      2,
      'SITI RAHMA, S.Pd',
      '199008242015032004',
      'Guru Mata Pelajaran',
      'Pendidikan Agama Islam',
      'Aktif',
      '081398765432',
      'siti.rahma@gmail.com'
    ],
    // Contoh 3: Guru Mata Pelajaran PJOK
    [
      3,
      'ACHMAD FAUZI, S.Pd',
      '199211052020121005',
      'Guru Mata Pelajaran',
      'PJOK',
      'Aktif',
      '082155667788',
      'achmad.fauzi@gmail.com'
    ],
    // Contoh 4: Guru Kelas (Non-PNS / Honorer NIP tanda '-')
    [
      4,
      'NURUL HIDAYATI, S.Pd',
      '-',
      'Guru Kelas',
      'Kelas 1',
      'Aktif',
      '085233445566',
      'nurul.hidayati@gmail.com'
    ],
    // Contoh 5: Guru Mapel Bahasa Inggris
    [
      5,
      'DIAN PERMATA, S.Pd',
      '-',
      'Guru Mata Pelajaran',
      'Bahasa Inggris',
      'Aktif',
      '087711223344',
      'dian.permata@gmail.com'
    ],
    // Baris Kosong Siap Isi
    [6, '', '', 'Guru Kelas', 'Kelas 2', 'Aktif', '', ''],
    [7, '', '', 'Guru Kelas', 'Kelas 3', 'Aktif', '', ''],
    [8, '', '', 'Guru Kelas', 'Kelas 4', 'Aktif', '', ''],
    [9, '', '', 'Guru Kelas', 'Kelas 6', 'Aktif', '', ''],
    [10, '', '', 'Guru Mata Pelajaran', 'Bahasa Daerah', 'Aktif', '', '']
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  // Atur lebar kolom agar lega dan sangat mudah dibaca di Excel
  ws1['!cols'] = [
    { wch: 6 },  // No
    { wch: 34 }, // Nama Guru
    { wch: 24 }, // NIP
    { wch: 24 }, // Jenis Guru
    { wch: 28 }, // Tugas Mengajar
    { wch: 14 }, // Status
    { wch: 20 }, // No HP
    { wch: 32 }  // Email
  ];

  // SHEET 2: Petunjuk & Referensi Kurikulum Merdeka SD
  const sheet2Data: (string | number)[][] = [
    ['PANDUAN & DAFTAR REFERENSI TUGAS MENGAJAR KURIKULUM MERDEKA SD'],
    ['Gunakan tabel referensi berikut sebagai panduan nilai pada kolom "Jenis Guru" dan "Tugas Mengajar / Kelas":'],
    [],
    ['A. KETENTUAN PENGISIAN KOLOM:'],
    ['1. Nama Guru', 'Nama lengkap disertai gelar (Contoh: BAMBANG WIJAYA, S.Pd)'],
    ['2. NIP / NUPTK', '18 digit angka NIP atau NUPTK. Jika belum memiliki NIP (GTT/Honorer), isi tanda strip (-)'],
    ['3. Jenis Guru', 'Pilih antara "Guru Kelas" atau "Guru Mata Pelajaran"'],
    ['4. Tugas Mengajar', 'Diisi kelas atau nama mata pelajaran sesuai Kurikulum Merdeka (lihat daftar di bawah)'],
    ['5. Status', 'Pilih: "Aktif", "Cuti", atau "Pindah"'],
    ['6. No. WhatsApp / HP', 'Nomor telepon/WA aktif untuk koordinasi supervisi'],
    ['7. Email Akun', 'Alamat email aktif (Gmail / belajar.id) untuk login akun guru'],
    [],
    ['B. REFERENSI PILIHAN GURU KELAS (SD):'],
    ['Pilihan Tugas Mengajar', 'Keterangan Fase'],
    ['Kelas 1', 'Fase A (Kelas 1 SD)'],
    ['Kelas 2', 'Fase A (Kelas 2 SD)'],
    ['Kelas 3', 'Fase B (Kelas 3 SD)'],
    ['Kelas 4', 'Fase B (Kelas 4 SD)'],
    ['Kelas 5', 'Fase C (Kelas 5 SD)'],
    ['Kelas 6', 'Fase C (Kelas 6 SD)'],
    [],
    ['C. REFERENSI PILIHAN GURU MATA PELAJARAN (SD):'],
    ['Pilihan Tugas Mengajar', 'Nama Mata Pelajaran'],
    ['Pendidikan Agama Islam', 'Pendidikan Agama Islam & Budi Pekerti (PAI)'],
    ['PJOK', 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)'],
    ['Bahasa Inggris', 'Bahasa Inggris SD'],
    ['Bahasa Daerah', 'Muatan Lokal / Bahasa Jawa'],
    ['Seni Rupa', 'Seni Rupa SD'],
    ['Seni Musik', 'Seni Musik SD'],
    ['Seni Tari', 'Seni Tari SD'],
    ['Seni Teater', 'Seni Teater SD'],
    ['Pendidikan Pancasila', 'Pendidikan Pancasila (PPKn)'],
    ['Matematika', 'Matematika SD'],
    ['IPAS', 'Ilmu Pengetahuan Alam dan Sosial (IPAS)'],
    ['Bahasa Indonesia', 'Bahasa Indonesia SD'],
    ['Pendidikan Agama Kristen', 'Pendidikan Agama Kristen & Budi Pekerti'],
    ['Pendidikan Agama Katolik', 'Pendidikan Agama Katolik & Budi Pekerti'],
    ['Pendidikan Agama Hindu', 'Pendidikan Agama Hindu & Budi Pekerti']
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  ws2['!cols'] = [
    { wch: 32 },
    { wch: 55 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, 'Data Guru');
  XLSX.utils.book_append_sheet(wb, ws2, 'Petunjuk & Referensi');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  triggerFileDownload(blob, filename);
}

/**
 * Exports current teacher data to a formatted XLSX workbook
 */
export function exportTeachersToXlsx(teachers: Teacher[], customFilename?: string): void {
  const dateSafe = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Master_Data_Guru_SDN_Kandangan_I_${dateSafe}.xlsx`;

  const sheetData: (string | number)[][] = [
    ['MASTER DATA TENAGA PENDIDIK (GURU)'],
    ['SDN KANDANGAN I KECAMATAN TOSARI - KABUPATEN PASURUAN'],
    [
      `Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      '',
      `Total Guru: ${teachers.length} Orang`
    ],
    [],
    [
      'No',
      'Nama Lengkap Guru',
      'NIP / NUPTK',
      'Jenis Guru',
      'Tugas Mengajar / Kelas',
      'Status',
      'No. WhatsApp / HP',
      'Email'
    ]
  ];

  teachers.forEach((t, idx) => {
    sheetData.push([
      idx + 1,
      t.name,
      t.nip,
      t.type,
      t.classSubject,
      t.status,
      t.phone || '-',
      t.email || '-'
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 34 }, // Nama Guru
    { wch: 24 }, // NIP
    { wch: 24 }, // Jenis Guru
    { wch: 28 }, // Tugas Mengajar
    { wch: 14 }, // Status
    { wch: 20 }, // No HP
    { wch: 32 }  // Email
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Master Data Guru');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  triggerFileDownload(blob, filename);
}

/**
 * Escapes a cell value for standard CSV format (RFC 4180)
 */
function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  if (/^\d{10,}$/.test(String(val).trim())) {
    return `="${str}"`;
  }
  return `"${str}"`;
}

/**
 * Exports the list of teachers to a CSV file
 */
export function exportTeachersToCsv(teachers: Teacher[], customFilename?: string): void {
  const dateSafe = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Master_Data_Guru_SDN_Kandangan_I_${dateSafe}.csv`;

  const rows: string[][] = [
    ['MASTER DATA TENAGA PENDIDIK (GURU)'],
    ['SDN KANDANGAN I KECAMATAN TOSARI - KABUPATEN PASURUAN'],
    [`Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
    [`Total Guru: ${teachers.length} Orang`],
    [],
    [
      'No',
      'Nama Guru',
      'NIP / NUPTK',
      'Jenis Guru',
      'Tugas Mengajar / Mata Pelajaran',
      'Status',
      'No WhatsApp / HP',
      'Email'
    ]
  ];

  teachers.forEach((t, idx) => {
    rows.push([
      String(idx + 1),
      t.name,
      t.nip,
      t.type,
      t.classSubject,
      t.status,
      t.phone || '-',
      t.email || '-'
    ]);
  });

  const csvContent = rows
    .map(row => row.map(escapeCsvCell).join(';'))
    .join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerFileDownload(blob, filename);
}

/**
 * Downloads a sample template CSV
 */
export function downloadTeacherTemplateCsv(customFilename?: string): void {
  const filename = customFilename || 'Template_Import_Master_Data_Guru_SD.csv';

  const rows: string[][] = [
    ['Petunjuk: Isi data guru di bawah kolom header baris ke-3. Jangan ubah urutan kolom header.'],
    [],
    [
      'Nama Guru',
      'NIP',
      'Jenis Guru',
      'Tugas Mengajar / Kelas',
      'Status',
      'No HP',
      'Email'
    ],
    [
      'BAMBANG WIJAYA, S.Pd',
      '198705122011011008',
      'Guru Kelas',
      'Kelas 5',
      'Aktif',
      '081234567890',
      'bambang.wijaya@gmail.com'
    ],
    [
      'SITI RAHMA, S.Pd',
      '199008242015032004',
      'Guru Mata Pelajaran',
      'Pendidikan Agama Islam',
      'Aktif',
      '081398765432',
      'siti.rahma@gmail.com'
    ],
    [
      'ACHMAD FAUZI, S.Pd',
      '199211052020121005',
      'Guru Mata Pelajaran',
      'PJOK',
      'Aktif',
      '082155667788',
      'achmad.fauzi@gmail.com'
    ]
  ];

  const csvContent = rows
    .map(row => row.map(escapeCsvCell).join(';'))
    .join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerFileDownload(blob, filename);
}

function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ParsedTeacherImportResult {
  validTeachers: Teacher[];
  skippedCount: number;
  errors: string[];
}

/**
 * Normalizes cell content by stripping leading `="` or trailing `"`
 */
function cleanCellValue(val: any): string {
  if (val === null || val === undefined) return '';
  let cleaned = String(val).trim();
  if (cleaned.startsWith('="') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(2, cleaned.length - 1);
  } else if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  return cleaned.trim();
}

/**
 * Parses an uploaded XLSX, XLS, CSV, or JSON file into a list of Teacher objects
 */
export async function parseTeacherImportFile(file: File): Promise<ParsedTeacherImportResult> {
  if (!file) {
    throw new Error('Berkas tidak ditemukan.');
  }

  const fileNameLower = file.name.toLowerCase();
  const isXlsxOrXls = fileNameLower.endsWith('.xlsx') || fileNameLower.endsWith('.xls');

  if (isXlsxOrXls) {
    return parseXlsxFile(file);
  }

  // Handle CSV and JSON
  return parseTextOrJsonFile(file);
}

/**
 * Parses XLSX / XLS file using SheetJS
 */
async function parseXlsxFile(file: File): Promise<ParsedTeacherImportResult> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const workbook = XLSX.read(data, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Berkas Excel tidak memiliki lembar kerja (worksheet).');
  }

  // Pilih sheet 'Data Guru' jika ada, atau gunakan sheet pertama
  const targetSheetName = workbook.SheetNames.includes('Data Guru')
    ? 'Data Guru'
    : workbook.SheetNames.includes('Master Data Guru')
    ? 'Master Data Guru'
    : workbook.SheetNames[0];

  const worksheet = workbook.Sheets[targetSheetName];
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (rawRows.length === 0) {
    return { validTeachers: [], skippedCount: 0, errors: ['Lembar kerja Excel kosong.'] };
  }

  // Cari baris header
  let headerIndex = -1;
  const colMap: Record<string, number> = {};

  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const row = rawRows[i].map((c: any) => cleanCellValue(c).toLowerCase());
    const hasName = row.some((c: string) => c.includes('nama') || c === 'name');
    const hasNip = row.some((c: string) => c.includes('nip') || c.includes('nuptk'));
    const hasType = row.some((c: string) => c.includes('jenis') || c.includes('tipe') || c === 'type');
    const hasSubject = row.some((c: string) => c.includes('tugas') || c.includes('mapel') || c.includes('mata pelajaran') || c.includes('kelas'));

    if (hasName && (hasNip || hasType || hasSubject)) {
      headerIndex = i;
      row.forEach((col: string, idx: number) => {
        if (col.includes('nama') || col === 'name') colMap['name'] = idx;
        else if (col.includes('nip') || col.includes('nuptk')) colMap['nip'] = idx;
        else if (col.includes('jenis') || col.includes('tipe') || col === 'type') colMap['type'] = idx;
        else if (col.includes('tugas') || col.includes('mata pelajaran') || col.includes('mapel') || col.includes('kelas') || col.includes('subject')) colMap['classSubject'] = idx;
        else if (col.includes('status')) colMap['status'] = idx;
        else if (col.includes('hp') || col.includes('telepon') || col.includes('wa') || col.includes('phone') || col.includes('whatsapp')) colMap['phone'] = idx;
        else if (col.includes('email') || col.includes('surel')) colMap['email'] = idx;
      });
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0;
    colMap['name'] = 1;
    colMap['nip'] = 2;
    colMap['type'] = 3;
    colMap['classSubject'] = 4;
    colMap['status'] = 5;
    colMap['phone'] = 6;
    colMap['email'] = 7;
  }

  const validTeachers: Teacher[] = [];
  const errors: string[] = [];
  let skippedCount = 0;

  for (let i = headerIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const nameCol = colMap['name'] !== undefined ? colMap['name'] : 1;
    const name = cleanCellValue(row[nameCol]);

    // Abaikan baris kosong, instruksi, atau baris petunjuk
    if (
      !name ||
      name.toLowerCase().startsWith('no') ||
      name.toLowerCase().includes('total') ||
      name.toLowerCase().includes('panduan') ||
      name.toLowerCase().includes('petunjuk')
    ) {
      skippedCount++;
      continue;
    }

    const nip = colMap['nip'] !== undefined ? cleanCellValue(row[colMap['nip']]) : '-';
    const rawType = colMap['type'] !== undefined ? cleanCellValue(row[colMap['type']]) : '';
    const rawSubject = colMap['classSubject'] !== undefined ? cleanCellValue(row[colMap['classSubject']]) : 'Kelas 1';
    const rawStatus = colMap['status'] !== undefined ? cleanCellValue(row[colMap['status']]) : 'Aktif';
    const phone = colMap['phone'] !== undefined ? cleanCellValue(row[colMap['phone']]) : undefined;
    const email = colMap['email'] !== undefined ? cleanCellValue(row[colMap['email']]) : undefined;

    // Normalisasi jenis guru
    let normalizedType = 'Guru Kelas';
    if (
      rawType.toLowerCase().includes('mata pelajaran') ||
      rawType.toLowerCase().includes('mapel') ||
      rawSubject.toLowerCase().includes('agama') ||
      rawSubject.toLowerCase().includes('pjok') ||
      rawSubject.toLowerCase().includes('inggris') ||
      rawSubject.toLowerCase().includes('seni')
    ) {
      normalizedType = 'Guru Mata Pelajaran';
    }

    // Normalisasi status
    let normalizedStatus: 'Aktif' | 'Cuti' | 'Pindah' = 'Aktif';
    if (rawStatus.toLowerCase().includes('cuti')) normalizedStatus = 'Cuti';
    else if (rawStatus.toLowerCase().includes('pindah')) normalizedStatus = 'Pindah';

    const newTeacher: Teacher = {
      id: `T-IMP-${Date.now()}-${validTeachers.length + 1}`,
      name,
      nip: nip || '-',
      type: normalizedType,
      classSubject: rawSubject || (normalizedType === 'Guru Kelas' ? 'Kelas 1' : 'Pendidikan Agama Islam'),
      status: normalizedStatus,
      phone: phone && phone !== '-' ? phone : undefined,
      email: email && email !== '-' ? email : undefined
    };

    validTeachers.push(newTeacher);
  }

  return { validTeachers, skippedCount, errors };
}

/**
 * Fallback parser for CSV and JSON files
 */
async function parseTextOrJsonFile(file: File): Promise<ParsedTeacherImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = (e.target?.result as string) || '';
        if (!text.trim()) {
          resolve({ validTeachers: [], skippedCount: 0, errors: ['Berkas kosong.'] });
          return;
        }

        const isJson = file.name.toLowerCase().endsWith('.json') || text.trim().startsWith('{') || text.trim().startsWith('[');

        if (isJson) {
          const parsed = JSON.parse(text);
          let rawList: any[] = [];
          if (Array.isArray(parsed)) {
            rawList = parsed;
          } else if (parsed.teachers && Array.isArray(parsed.teachers)) {
            rawList = parsed.teachers;
          } else if (parsed.data && Array.isArray(parsed.data.teachers)) {
            rawList = parsed.data.teachers;
          }

          const validTeachers: Teacher[] = [];
          const errors: string[] = [];
          let skippedCount = 0;

          rawList.forEach((item, index) => {
            if (item && typeof item === 'object' && item.name && String(item.name).trim()) {
              validTeachers.push({
                id: item.id || `T-IMP-${Date.now()}-${index + 1}`,
                name: String(item.name).trim(),
                nip: String(item.nip || '').trim() || '-',
                type: item.type === 'Guru Mata Pelajaran' ? 'Guru Mata Pelajaran' : 'Guru Kelas',
                classSubject: String(item.classSubject || item.subject || 'Kelas 1').trim(),
                status: (['Aktif', 'Cuti', 'Pindah'].includes(item.status) ? item.status : 'Aktif') as any,
                phone: item.phone ? String(item.phone).trim() : undefined,
                email: item.email ? String(item.email).trim() : undefined
              });
            } else {
              skippedCount++;
              errors.push(`Baris ${index + 1}: Nama guru tidak boleh kosong.`);
            }
          });

          resolve({ validTeachers, skippedCount, errors });
          return;
        }

        // CSV parsing
        const firstFewLines = text.split(/\r?\n/).slice(0, 5).join('\n');
        const semicolonCount = (firstFewLines.match(/;/g) || []).length;
        const commaCount = (firstFewLines.match(/,/g) || []).length;
        const delimiter = semicolonCount >= commaCount ? ';' : ',';

        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

        let headerIndex = -1;
        const colMap: Record<string, number> = {};

        for (let i = 0; i < Math.min(lines.length, 10); i++) {
          const cols = lines[i].split(delimiter).map(c => cleanCellValue(c).toLowerCase());
          const hasName = cols.some(c => c.includes('nama') || c === 'name' || c === 'guru');
          const hasNip = cols.some(c => c.includes('nip') || c.includes('nuptk'));
          if (hasName || hasNip) {
            headerIndex = i;
            cols.forEach((col, idx) => {
              if (col.includes('nama') || col === 'name' || col === 'guru') colMap['name'] = idx;
              else if (col.includes('nip') || col.includes('nuptk')) colMap['nip'] = idx;
              else if (col.includes('jenis') || col.includes('tipe') || col === 'type') colMap['type'] = idx;
              else if (col.includes('tugas') || col.includes('mata pelajaran') || col.includes('mapel') || col.includes('kelas') || col.includes('subject')) colMap['classSubject'] = idx;
              else if (col.includes('status')) colMap['status'] = idx;
              else if (col.includes('hp') || col.includes('telepon') || col.includes('wa') || col.includes('phone') || col.includes('whatsapp')) colMap['phone'] = idx;
              else if (col.includes('email') || col.includes('surel')) colMap['email'] = idx;
            });
            break;
          }
        }

        if (headerIndex === -1) {
          headerIndex = -1;
          colMap['name'] = 1;
          colMap['nip'] = 2;
          colMap['type'] = 3;
          colMap['classSubject'] = 4;
          colMap['status'] = 5;
          colMap['phone'] = 6;
          colMap['email'] = 7;
        }

        const validTeachers: Teacher[] = [];
        const errors: string[] = [];
        let skippedCount = 0;

        for (let i = headerIndex + 1; i < lines.length; i++) {
          const rawRow = lines[i].split(delimiter);
          const nameCol = colMap['name'] !== undefined ? colMap['name'] : 0;
          const name = cleanCellValue(rawRow[nameCol] || '');

          if (!name || name.toLowerCase().startsWith('no') || name.toLowerCase().includes('total')) {
            skippedCount++;
            continue;
          }

          const nip = colMap['nip'] !== undefined ? cleanCellValue(rawRow[colMap['nip']] || '') : '-';
          const rawType = colMap['type'] !== undefined ? cleanCellValue(rawRow[colMap['type']] || '') : '';
          const rawSubject = colMap['classSubject'] !== undefined ? cleanCellValue(rawRow[colMap['classSubject']] || '') : 'Kelas 1';
          const rawStatus = colMap['status'] !== undefined ? cleanCellValue(rawRow[colMap['status']] || '') : 'Aktif';
          const phone = colMap['phone'] !== undefined ? cleanCellValue(rawRow[colMap['phone']] || '') : undefined;
          const email = colMap['email'] !== undefined ? cleanCellValue(rawRow[colMap['email']] || '') : undefined;

          let normalizedType = 'Guru Kelas';
          if (
            rawType.toLowerCase().includes('mata pelajaran') ||
            rawType.toLowerCase().includes('mapel') ||
            rawSubject.toLowerCase().includes('agama') ||
            rawSubject.toLowerCase().includes('pjok') ||
            rawSubject.toLowerCase().includes('inggris') ||
            rawSubject.toLowerCase().includes('seni')
          ) {
            normalizedType = 'Guru Mata Pelajaran';
          }

          let normalizedStatus: 'Aktif' | 'Cuti' | 'Pindah' = 'Aktif';
          if (rawStatus.toLowerCase().includes('cuti')) normalizedStatus = 'Cuti';
          else if (rawStatus.toLowerCase().includes('pindah')) normalizedStatus = 'Pindah';

          const newTeacher: Teacher = {
            id: `T-IMP-${Date.now()}-${validTeachers.length + 1}`,
            name,
            nip: nip || '-',
            type: normalizedType,
            classSubject: rawSubject || (normalizedType === 'Guru Kelas' ? 'Kelas 1' : 'Pendidikan Agama Islam'),
            status: normalizedStatus,
            phone: phone && phone !== '-' ? phone : undefined,
            email: email && email !== '-' ? email : undefined
          };

          validTeachers.push(newTeacher);
        }

        resolve({ validTeachers, skippedCount, errors });
      } catch (err: any) {
        reject(new Error(`Gagal memproses berkas: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas dari sistem komputer.'));
    };

    reader.readAsText(file);
  });
}

/**
 * Merges imported teachers with existing teachers according to selected mode:
 * - 'merge': matches by NIP or name to update, appends new ones (preserves observation links).
 * - 'replace': replaces all teachers with imported list.
 */
export function mergeTeachers(
  existing: Teacher[],
  imported: Teacher[],
  mode: 'merge' | 'replace'
): Teacher[] {
  if (mode === 'replace') {
    return imported.map((t, idx) => ({
      ...t,
      id: t.id || `T-${Date.now()}-${idx + 1}`
    }));
  }

  // 'merge' mode
  const result: Teacher[] = [...existing];

  for (const imp of imported) {
    const matchIndex = result.findIndex(t => {
      if (imp.nip && imp.nip !== '-' && t.nip && t.nip !== '-') {
        return t.nip.replace(/\s+/g, '') === imp.nip.replace(/\s+/g, '');
      }
      return t.name.toLowerCase().trim() === imp.name.toLowerCase().trim();
    });

    if (matchIndex >= 0) {
      result[matchIndex] = {
        ...result[matchIndex],
        name: imp.name,
        nip: imp.nip !== '-' ? imp.nip : result[matchIndex].nip,
        type: imp.type,
        classSubject: imp.classSubject,
        status: imp.status,
        phone: imp.phone || result[matchIndex].phone,
        email: imp.email || result[matchIndex].email
      };
    } else {
      result.push({
        ...imp,
        id: imp.id || `T-${Date.now()}-${result.length + 1}`
      });
    }
  }

  return result;
}
