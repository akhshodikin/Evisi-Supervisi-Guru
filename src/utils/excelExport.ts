import { ObservationData, SchoolSettings } from '../types';

/**
 * Escapes a cell value for standard CSV (RFC 4180)
 */
function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  // Format long numeric strings like NIP so Excel doesn't convert to scientific notation
  if (/^\d{10,}$/.test(String(val).trim())) {
    return `="${str}"`;
  }
  return `"${str}"`;
}

/**
 * Exports observations data to an Excel-compatible CSV file with UTF-8 BOM
 */
export function exportObservationsToCsv(
  observations: ObservationData[],
  settings: SchoolSettings,
  customFilename?: string
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Rekap_Supervisi_Guru_${settings.schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;

  // CSV Metadata Header Rows
  const rows: string[][] = [
    ['REKAPITULASI LAPORAN HASIL SUPERVISI GURU SD'],
    ['PEMERINTAH KABUPATEN PASURUAN - DINAS PENDIDIKAN DAN KEBUDAYAAN'],
    [`Sekolah: ${settings.schoolName}`, `NPSN: ${settings.npsn}`],
    [`Tahun Pelajaran: ${settings.schoolYear}`, `Semester: ${settings.semester}`],
    [`Kepala Sekolah: ${settings.principalName}`, `NIP KS: ${settings.principalNip}`],
    [`Pengawas Pembina: ${settings.supervisorName}`, `Wilayah Binaan: ${settings.supervisorArea}`],
    [`Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
    [], // Blank separator row
    // Column Headers
    [
      'No',
      'No. Registrasi Observasi',
      'Nama Guru',
      'NIP',
      'Mata Pelajaran',
      'Kelas Sasaran',
      'Tanggal Observasi',
      'Observer / Penilai',
      'Status Supervisi',
      'Skor Akhir (0-100)',
      'Predikat Mutu',
      'Target Capaian Pembelajaran (Goal)',
      'Kekuatan / Praktik Baik',
      'Rekomendasi Peningkatan',
      'Refleksi Mandiri Guru',
      'Rencana Tindak Lanjut (Will)',
      'Umpan Balik Kepala Sekolah',
      'Program Tindak Lanjut Prioritas',
      'Fokus Tindak Lanjut',
      'Target Waktu',
      'Status Tindak Lanjut',
      'Modul Ajar Tersimpan (Drive)',
      'Tautan Modul Ajar'
    ]
  ];

  // Data Rows
  observations.forEach((o, idx) => {
    const followup = o.followups && o.followups.length > 0 ? o.followups[0] : null;

    rows.push([
      String(idx + 1),
      o.id,
      o.teacherName,
      o.nip,
      o.subject,
      o.classTarget,
      o.date,
      o.observer,
      o.status,
      String(o.score),
      o.category,
      o.pra?.goal1 || '-',
      o.kekuatan || '-',
      o.rekomendasi || '-',
      o.pasca?.refleksiGuru || '-',
      o.pasca?.will || followup?.program || '-',
      o.pasca?.feedbackKs || '-',
      followup?.program || '-',
      followup?.focus || '-',
      followup?.target || '-',
      followup?.status || '-',
      o.modulAjar?.name || 'Belum diunggah',
      o.modulAjar?.driveViewLink || '-'
    ]);
  });

  // Calculate summary stats row
  const graded = observations.filter(o => o.score > 0);
  const avgScore = graded.length > 0
    ? (graded.reduce((sum, o) => sum + o.score, 0) / graded.length).toFixed(1)
    : '0';

  rows.push([]);
  rows.push([
    '',
    'RINGKASAN STATISTIK',
    `Total Guru: ${observations.length}`,
    '',
    '',
    '',
    '',
    '',
    `Selesai: ${observations.filter(o => o.status === 'Selesai').length}`,
    `Rata-rata: ${avgScore}`,
    `Sangat Baik: ${observations.filter(o => o.score >= 90).length}`,
    `Baik: ${observations.filter(o => o.score >= 80 && o.score < 90).length}`,
    `Cukup: ${observations.filter(o => o.score >= 70 && o.score < 80).length}`
  ]);

  // Convert array of rows into CSV string with BOM
  const csvContent = rows
    .map(row => row.map(escapeCsvCell).join(';')) // Semicolon delimiter works best for Indonesian/European Excel default
    .join('\r\n');

  // Prepend UTF-8 BOM so Excel opens accented and foreign characters properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
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
 * Exports observations data as an Excel Spreadsheet XML / HTML (.xls) file with styles
 */
export function exportObservationsToExcelHtml(
  observations: ObservationData[],
  settings: SchoolSettings,
  customFilename?: string
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = customFilename || `Rekap_Supervisi_Excel_${settings.schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.xls`;

  const graded = observations.filter(o => o.score > 0);
  const avgScore = graded.length > 0
    ? (graded.reduce((sum, o) => sum + o.score, 0) / graded.length).toFixed(1)
    : '0';

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Rekap Supervisi Guru</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        body { font-family: Calibri, Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #065f46; color: #ffffff; font-weight: bold; border: 1px solid #047857; padding: 8px; text-align: left; }
        td { border: 1px solid #cbd5e1; padding: 6px; font-size: 11pt; vertical-align: top; }
        .header-title { font-size: 14pt; font-weight: bold; text-align: center; color: #064e3b; }
        .header-sub { font-size: 11pt; text-align: center; color: #334155; }
        .meta-label { font-weight: bold; color: #1e293b; background-color: #f1f5f9; }
        .score-sb { font-weight: bold; color: #15803d; text-align: center; }
        .score-b { font-weight: bold; color: #0284c7; text-align: center; }
        .score-c { font-weight: bold; color: #b45309; text-align: center; }
        .text-center { text-align: center; }
        .nip-format { mso-number-format:"\\@"; }
      </style>
    </head>
    <body>
      <table>
        <tr><td colspan="12" class="header-title">PEMERINTAH KABUPATEN PASURUAN - DINAS PENDIDIKAN DAN KEBUDAYAAN</td></tr>
        <tr><td colspan="12" class="header-title">${settings.schoolName}</td></tr>
        <tr><td colspan="12" class="header-sub">REKAPITULASI HASIL SUPERVISI AKADEMIK GURU ALUR GROW & KURIKULUM MERDEKA</td></tr>
        <tr><td colspan="12" class="header-sub">Tahun Pelajaran: ${settings.schoolYear} | Semester: ${settings.semester} | Wilayah Binaan: ${settings.supervisorArea}</td></tr>
        <tr><td colspan="12">&nbsp;</td></tr>

        <tr>
          <td class="meta-label">Kepala Sekolah:</td>
          <td colspan="3">${settings.principalName} (NIP. ${settings.principalNip})</td>
          <td class="meta-label">Pengawas Pembina:</td>
          <td colspan="4">${settings.supervisorName} (NIP. ${settings.supervisorNip})</td>
          <td class="meta-label">Rata-rata Nilai:</td>
          <td colspan="2" class="score-sb" style="font-size: 12pt;">${avgScore} / 100</td>
        </tr>
        <tr><td colspan="12">&nbsp;</td></tr>

        <thead>
          <tr>
            <th>No</th>
            <th>No. ID</th>
            <th>Nama Guru</th>
            <th>NIP</th>
            <th>Mata Pelajaran</th>
            <th>Kelas</th>
            <th>Tgl Observasi</th>
            <th>Penilai / Observer</th>
            <th>Status</th>
            <th>Skor</th>
            <th>Predikat</th>
            <th>Rencana Tindak Lanjut</th>
          </tr>
        </thead>
        <tbody>
          ${observations.map((o, idx) => `
            <tr>
              <td class="text-center">${idx + 1}</td>
              <td class="text-center">${o.id}</td>
              <td><b>${o.teacherName}</b></td>
              <td class="nip-format">'${o.nip}</td>
              <td>${o.subject}</td>
              <td class="text-center">${o.classTarget}</td>
              <td class="text-center">${o.date}</td>
              <td>${o.observer}</td>
              <td class="text-center">${o.status}</td>
              <td class="score-sb">${o.score}</td>
              <td class="text-center">${o.category}</td>
              <td>${o.pasca?.will || o.followups?.[0]?.program || 'Komunitas Belajar (Kombel) Guru'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
