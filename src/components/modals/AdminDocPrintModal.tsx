import React, { useState } from 'react';
import { TeacherAdminAudit, SchoolSettings } from '../../types';
import { STANDARD_SD_ADMIN_DOCS } from '../../data/adminDocsData';
import { exportElementToA4Pdf } from '../../utils/pdfExport';
import { FileText, Printer, Download, X, Loader2, CheckCircle2, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface AdminDocPrintModalProps {
  isOpen: boolean;
  type: 'individual' | 'rekap';
  audit: TeacherAdminAudit | null;
  allAudits?: TeacherAdminAudit[];
  settings: SchoolSettings;
  onClose: () => void;
}

export const AdminDocPrintModal: React.FC<AdminDocPrintModalProps> = ({
  isOpen,
  type,
  audit,
  allAudits = [],
  settings,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printAlert, setPrintAlert] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  if (!isOpen) return null;

  const currentAudit = audit || allAudits[0];

  const handlePrint = async () => {
    const element = document.getElementById('a4-admin-document-container');
    if (!element) return;

    setIsPrinting(true);
    setPrintAlert(null);
    document.body.classList.add('printing-modal');

    try {
      let nativePrintTriggered = false;
      try {
        window.print();
        nativePrintTriggered = true;
      } catch (printErr) {
        console.warn('Native window.print() dibatasi lingkungan sandbox:', printErr);
      }

      // Download standard A4 PDF to guarantee printability even in iframe environments
      const filename = type === 'individual' && currentAudit
        ? `Instrumen_Administrasi_${currentAudit.teacherName.replace(/[^a-zA-Z0-9]/g, '_')}_${currentAudit.schoolYear.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
        : `Rekapitulasi_Administrasi_Guru_SD_${settings.schoolYear.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

      await exportElementToA4Pdf(element, filename);

      setPrintAlert({
        message: nativePrintTriggered
          ? 'Dialog printer dibuka dan berkas PDF standar A4 berhasil diunduh.'
          : 'Dokumen A4 siap cetak berhasil diproses dan diunduh (PDF). Anda dapat langsung membuka file untuk dicetak.',
        type: 'success'
      });
    } catch (err) {
      console.error('Error saat proses cetak dokumen:', err);
      setPrintAlert({
        message: 'Gagal memproses dokumen cetak otomatis. Silakan gunakan tombol "Unduh File PDF (A4)".',
        type: 'info'
      });
    } finally {
      document.body.classList.remove('printing-modal');
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('a4-admin-document-container');
    if (!element) return;

    setIsExporting(true);
    setPrintAlert(null);
    try {
      const filename = type === 'individual' && currentAudit
        ? `Instrumen_Administrasi_A4_${currentAudit.teacherName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        : `Rekapitulasi_Administrasi_Guru_A4_${settings.schoolYear.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

      await exportElementToA4Pdf(element, filename);
      setPrintAlert({
        message: 'Berkas PDF standar A4 berhasil diunduh ke perangkat Anda.',
        type: 'success'
      });
    } catch (err) {
      console.warn('PDF export notification:', err);
      try {
        window.print();
      } catch (e) {
        console.warn('Fallback print failed:', e);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'No',
      'Nama Guru',
      'NIP',
      'Tugas/Kelas',
      'Skor Total',
      'Maksimal',
      'Persentase',
      'Predikat',
      ...STANDARD_SD_ADMIN_DOCS.map(d => d.name)
    ];

    const rows = allAudits.map((a, idx) => {
      const docStatuses = STANDARD_SD_ADMIN_DOCS.map(std => {
        const found = a.items.find(i => i.id === std.id);
        if (!found) return 'Tidak Ada';
        return found.status === 'lengkap' ? 'Lengkap (2)' : found.status === 'kurang' ? 'Kurang (1)' : 'Tidak Ada (0)';
      });

      return [
        idx + 1,
        `"${a.teacherName}"`,
        `'${a.nip}`,
        `"${a.classSubject}"`,
        a.totalScore,
        a.maxScore,
        `${a.percentage}%`,
        `"${a.predicate}"`,
        ...docStatuses.map(s => `"${s}"`)
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Supervisi_Administrasi_SD_${settings.schoolYear.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setPrintAlert({
      message: 'Rekapitulasi supervisi administrasi berhasil diekspor ke format CSV.',
      type: 'success'
    });
  };

  return (
    <div id="modal-print-a4" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[60] animate-fade-in">
      <div id="modal-print-a4-card" className="bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full h-[94vh] flex flex-col overflow-hidden border border-slate-700">
        
        {/* Header toolbar */}
        <div className="no-print p-3.5 bg-slate-850 text-white flex flex-wrap justify-between items-center gap-2 border-b border-slate-700/80 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-auto min-w-[65px] px-1.5 py-0.5 bg-white rounded-lg border border-slate-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <img src="/logo.png" alt="e-Visi Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {type === 'individual'
                  ? `Pratinjau Cetak Instrumen Administrasi - ${currentAudit?.teacherName || 'Guru'}`
                  : 'Pratinjau Cetak Rekapitulasi 14 Dokumen Administrasi'}
              </h3>
              <p className="text-[10px] text-slate-400">
                Format Standar Cetak Resmi A4 Portrait (210 x 297 mm) Kurikulum Merdeka Kab. Pasuruan
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {type === 'rekap' && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                title="Ekspor rekapitulasi ke berkas CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Ekspor CSV</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting || isPrinting}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="Unduh Berkas PDF Standar A4"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File PDF (A4)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting || isExporting}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="Cetak Dokumen Langsung atau Buka Dialog Printer"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mempersiapkan Cetak...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback notification banner */}
        {printAlert && (
          <div className="no-print px-4 py-2.5 bg-emerald-950/90 text-emerald-200 border-b border-emerald-800 text-xs flex items-center justify-between animate-fade-in flex-shrink-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{printAlert.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setPrintAlert(null)}
              className="text-emerald-400 hover:text-white p-0.5 ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Viewport for A4 paper preview */}
        <div id="modal-print-a4-viewport" className="flex-1 overflow-y-auto bg-slate-800/80 p-3 sm:p-6 flex justify-center">
          <div id="a4-admin-document-container" className="flex flex-col items-center space-y-6">
            
            {/* MODE 1: INDIVIDUAL TEACHER ADMIN DOC AUDIT SHEET (2-PAGE STANDARDS) */}
            {type === 'individual' && currentAudit && (
              <>
                {/* LEMBAR 1: INSTRUMEN PENILAIAN 14 DOKUMEN ADMINISTRASI */}
                <div
                  className="a4-page-sheet"
                  style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
                >
                  <div className="a4-content font-sans space-y-2.5" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                    
                    {/* KOP SURAT RESMI PEMKAB PASURUAN */}
                    <div style={{ borderBottom: '3px double #000000', paddingBottom: '6px', marginBottom: '8px' }} className="flex items-center justify-between text-center">
                      <div className="w-13 h-13 flex items-center justify-center flex-shrink-0">
                        <img src={settings.logoLeft} alt="Logo Pemda" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 px-3">
                        <h3 className="m-0 text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: '#0f172a' }}>PEMERINTAH KABUPATEN PASURUAN</h3>
                        <h4 className="m-0 text-sm font-extrabold uppercase tracking-wide leading-tight" style={{ color: '#0f172a' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
                        <h2 className="m-0 text-base font-black uppercase leading-tight" style={{ color: '#166534' }}>{settings.schoolName}</h2>
                        <p className="m-0 text-[8.5px] italic leading-tight" style={{ color: '#334155' }}>{settings.address}</p>
                        <p className="m-0 text-[8px] font-semibold" style={{ color: '#0f172a' }}>NPSN: {settings.npsn} | Wilayah Binaan: {settings.supervisorArea}</p>
                      </div>
                      <div className="w-13 h-13 flex items-center justify-center flex-shrink-0">
                        <img src={settings.logoRight} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>

                    {/* JUDUL INSTRUMEN */}
                    <div className="text-center space-y-0.5 mb-1.5">
                      <h3 className="text-xs font-black uppercase tracking-wider underline" style={{ color: '#0f172a' }}>
                        INSTRUMEN PENGAWASAN KELENGKAPAN ADMINISTRASI GURU SD
                      </h3>
                      <p className="text-[9px] text-slate-600 font-medium">
                        Tahun Ajaran {currentAudit.schoolYear} • Semester {currentAudit.semester}
                      </p>
                    </div>

                    {/* IDENTITAS GURU & PELAKSANAAN */}
                    <div className="border border-slate-300 p-2 rounded-lg text-[9px] bg-slate-50/50">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="w-24 font-semibold py-0.5 text-slate-700">Nama Guru</td>
                            <td className="w-2">:</td>
                            <td className="font-bold text-slate-900">{currentAudit.teacherName}</td>
                            <td className="w-28 font-semibold py-0.5 text-slate-700">Tanggal Supervisi</td>
                            <td className="w-2">:</td>
                            <td className="font-medium text-slate-800">{currentAudit.auditDate}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold py-0.5 text-slate-700">NIP</td>
                            <td>:</td>
                            <td className="font-mono text-slate-800">{currentAudit.nip}</td>
                            <td className="font-semibold py-0.5 text-slate-700">Auditor / Penilai</td>
                            <td>:</td>
                            <td className="font-medium text-slate-800">{currentAudit.auditor}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold py-0.5 text-slate-700">Tugas / Mata Pelajaran</td>
                            <td>:</td>
                            <td className="font-semibold text-slate-800">{currentAudit.classSubject}</td>
                            <td className="font-semibold py-0.5 text-slate-700">Status Verifikasi</td>
                            <td>:</td>
                            <td className="font-semibold text-emerald-800">
                              {currentAudit.isVerified ? 'Telah Divalidasi Kepala Sekolah' : 'Dalam Proses Telaah'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* TABEL 14 DOKUMEN ADMINISTRASI */}
                    <div className="mt-1.5">
                      <table className="w-full text-left border-collapse text-[8px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-center border border-slate-400">
                            <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-6">No</th>
                            <th style={{ border: '1px solid #94a3b8' }} className="p-1 min-w-[120px] text-left">Nama Dokumen Administrasi</th>
                            <th style={{ border: '1px solid #94a3b8' }} className="p-1 text-left">Kriteria Standar Kelengkapan</th>
                            <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-16">Kondisi</th>
                            <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-8">Skor</th>
                            <th style={{ border: '1px solid #94a3b8' }} className="p-1 min-w-[110px] text-left">Catatan Pemeriksaan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAudit.items.map((item) => (
                            <tr key={item.id} className="border border-slate-300">
                              <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-slate-700">
                                {item.no}
                              </td>
                              <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 font-semibold text-slate-900 leading-tight">
                                {item.name}
                                <span className="text-[7px] font-normal text-slate-500 ml-1">({item.category})</span>
                              </td>
                              <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-slate-600 leading-tight">
                                {item.standard}
                              </td>
                              <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-semibold">
                                {item.status === 'lengkap' ? (
                                  <span className="text-emerald-700 font-bold">Lengkap</span>
                                ) : item.status === 'kurang' ? (
                                  <span className="text-amber-700 font-bold">Kurang</span>
                                ) : (
                                  <span className="text-rose-600 font-bold">Tidak Ada</span>
                                )}
                              </td>
                              <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-slate-800">
                                {item.score}
                              </td>
                              <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-slate-700 italic text-[7.5px] leading-tight">
                                {item.notes || '-'}
                              </td>
                            </tr>
                          ))}
                          {/* TOTAL ROW */}
                          <tr className="bg-slate-100/90 font-bold text-slate-900 border border-slate-400">
                            <td style={{ border: '1px solid #94a3b8' }} colSpan={4} className="p-1 text-right uppercase text-[8.5px]">
                              Jumlah Perolehan Skor (Maksimal: 28)
                            </td>
                            <td style={{ border: '1px solid #94a3b8' }} className="p-1 text-center text-teal-800 text-[9.5px]">
                              {currentAudit.totalScore}
                            </td>
                            <td style={{ border: '1px solid #94a3b8' }} className="p-1">
                              <span className="font-semibold text-slate-800 text-[8.5px]">
                                Nilai: {currentAudit.percentage}% ({currentAudit.predicate})
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* KETERANGAN SKOR & PREDIKAT */}
                    <div className="p-1.5 border border-slate-200 rounded-lg bg-slate-50 text-[7.5px] space-y-0.5">
                      <p className="font-semibold text-slate-700">
                        Kriteria Penskoran: Lengkap (2) = Dokumen ada &amp; sesuai standar | Kurang Lengkap (1) = Ada sebagian / perlu revisi | Tidak Ada (0) = Belum disusun.
                      </p>
                      <p className="text-slate-600">
                        Rentang Nilai Predikat: 86% - 100% (Sangat Baik) | 71% - 85% (Baik) | 56% - 70% (Cukup) | &lt; 56% (Perlu Pembinaan).
                      </p>
                    </div>

                    {/* FOOTER LEMBAR 1 */}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                      <span>Instrumen Pengawasan Administrasi Guru SD • {settings.schoolName}</span>
                      <span>Halaman 1 dari 2 (Bersambung ke Lembar Refleksi &amp; Pengesahan)</span>
                    </div>

                  </div>
                </div>

                {/* LEMBAR 2: REFLEKSI, TINDAK LANJUT & LEMBAR PENGESAHAN RESMI */}
                <div
                  className="a4-page-sheet"
                  style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
                >
                  <div className="a4-content font-sans space-y-2.5" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                    
                    {/* HEADER LEMBAR 2 */}
                    <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '5px', marginBottom: '6px' }} className="flex justify-between items-center text-[9px]">
                      <div>
                        <h4 className="m-0 font-bold uppercase tracking-wide leading-tight" style={{ color: '#0f172a' }}>
                          {settings.schoolName} - WILAYAH KECAMATAN TOSARI
                        </h4>
                        <p className="m-0 text-[8px] text-slate-500">
                          Lampiran Evaluasi, Rekomendasi Tindak Lanjut &amp; Lembar Pengesahan Administrasi Guru
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="m-0 font-bold text-slate-900">{currentAudit.teacherName}</p>
                        <p className="m-0 text-[8px] text-slate-500 font-mono">NIP: {currentAudit.nip} • {currentAudit.classSubject}</p>
                      </div>
                    </div>

                    {/* JUDUL LEMBAR 2 */}
                    <div className="text-center space-y-0.5">
                      <h3 className="text-xs font-black uppercase tracking-wider underline" style={{ color: '#0f172a' }}>
                        LEMBAR EVALUASI, TINDAK LANJUT &amp; PENGESAHAN HASIL SUPERVISI
                      </h3>
                      <p className="text-[8.5px] text-slate-600 font-medium">
                        Tahun Ajaran {currentAudit.schoolYear} • Semester {currentAudit.semester}
                      </p>
                    </div>

                    {/* RINGKASAN CAPAIAN NILAI */}
                    <div className="p-2 border border-emerald-300 rounded-lg bg-emerald-50/50 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-800">
                          Rekapitulasi Skor Keterpenuhan Administrasi:
                        </span>
                        <p className="text-[11px] text-slate-700">
                          Total Skor Perolehan: <strong className="text-slate-900">{currentAudit.totalScore}</strong> dari {currentAudit.maxScore} poin maksimal
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-emerald-800 block leading-tight">
                          {currentAudit.percentage}%
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-md">
                          Predikat: {currentAudit.predicate}
                        </span>
                      </div>
                    </div>

                    {/* CATATAN KEPALA SEKOLAH */}
                    <div className="p-2 border border-slate-300 rounded-lg bg-slate-50/50 space-y-1 text-[8.5px]">
                      <span className="font-bold text-slate-900 block text-[9px]">
                        A. Catatan Evaluasi Kepala Sekolah:
                      </span>
                      <p className="italic text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-200">
                        "{currentAudit.catatanKepsek || 'Perangkat administrasi guru tersusun dengan tertib, rapi, dan mencerminkan kesiapan pembelajaran berorientasi pada peserta didik sesuai panduan Kurikulum Merdeka.'}"
                      </p>
                    </div>

                    {/* REKOMENDASI TINDAK LANJUT */}
                    <div className="p-2 border border-slate-300 rounded-lg bg-slate-50/50 space-y-1 text-[8.5px]">
                      <span className="font-bold text-slate-900 block text-[9px]">
                        B. Rekomendasi Rencana Tindak Lanjut:
                      </span>
                      <p className="text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-200">
                        {currentAudit.tindakLanjut || 'Tingkatkan konsistensi pengisian jurnal mengajar harian serta kelengkapan dokumentasi asesmen formatif dan tindak lanjut remedial secara berkala.'}
                      </p>
                    </div>

                    {/* CATATAN PENGAWAS PEMBINA */}
                    <div className="p-2 border border-slate-300 rounded-lg bg-slate-50/50 space-y-1 text-[8.5px]">
                      <span className="font-bold text-slate-900 block text-[9px]">
                        C. Catatan / Arahan Pengawas Pembina SD:
                      </span>
                      <p className="text-slate-600 leading-relaxed bg-white p-2 rounded border border-slate-200 italic">
                        "Administrasi guru telah diperiksa dan dinyatakan memenuhi standar kelengkapan dokumen pengajaran Sekolah Dasar pada Gugus Wilayah Kecamatan Tosari."
                      </p>
                    </div>

                    {/* TANDA TANGAN BERPASANGAN RESMI DENGAN PENGAWAS */}
                    <div className="pt-2 signature-block" style={{ pageBreakInside: 'avoid' }}>
                      <p className="text-right text-[8.5px] text-slate-600 mb-1.5 pr-2">Tosari Pasuruan, {currentAudit.auditDate}</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-[8.5px]">
                        <div className="px-1">
                          <p className="text-slate-600 mb-11">Guru yang Dinilai,</p>
                          <p className="font-bold text-slate-900 underline leading-tight">{currentAudit.teacherName}</p>
                          <p className="text-slate-600 font-mono text-[7.5px] mt-0.5">NIP. {currentAudit.nip}</p>
                        </div>

                        <div className="px-1">
                          <p className="text-slate-600 mb-11">Kepala Sekolah / Penilai,</p>
                          <p className="font-bold text-slate-900 underline leading-tight">{settings.principalName}</p>
                          <p className="text-slate-600 font-mono text-[7.5px] mt-0.5">NIP. {settings.principalNip}</p>
                        </div>

                        <div className="px-1">
                          <p className="text-slate-600 mb-11">Mengetahui,<br />Pengawas Pembina SD,</p>
                          <p className="font-bold text-slate-900 underline leading-tight">{settings.supervisorName}</p>
                          <p className="text-slate-600 font-mono text-[7.5px] mt-0.5">NIP. {settings.supervisorNip}</p>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER LEMBAR 2 */}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                      <span>Dokumen Sah Pengawasan Administrasi Guru SD - Format Resmi Kabupaten Pasuruan</span>
                      <span>Halaman 2 dari 2</span>
                    </div>

                  </div>
                </div>
              </>
            )}

            {/* MODE 2: REKAPITULASI MATRIKS 14 DOKUMEN SELURUH GURU */}
            {type === 'rekap' && (
              <div
                className="a4-page-sheet"
                style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
              >
                <div className="a4-content font-sans space-y-3" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                  
                  {/* KOP SURAT */}
                  <div style={{ borderBottom: '3px double #000000', paddingBottom: '8px', marginBottom: '10px' }} className="flex items-center justify-between text-center">
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <img src={settings.logoLeft} alt="Logo Pemda" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 px-3">
                      <h3 className="m-0 text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: '#0f172a' }}>PEMERINTAH KABUPATEN PASURUAN</h3>
                      <h4 className="m-0 text-sm font-extrabold uppercase tracking-wide leading-tight" style={{ color: '#0f172a' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
                      <h2 className="m-0 text-base font-black uppercase leading-tight" style={{ color: '#166534' }}>{settings.schoolName}</h2>
                      <p className="m-0 text-[9px] italic leading-tight" style={{ color: '#334155' }}>{settings.address}</p>
                      <p className="m-0 text-[8.5px] font-semibold" style={{ color: '#0f172a' }}>NPSN: {settings.npsn} | Wilayah Binaan: {settings.supervisorArea}</p>
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <img src={settings.logoRight} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>

                  {/* JUDUL REKAPITULASI */}
                  <div className="text-center space-y-0.5 mb-2">
                    <h3 className="text-xs font-black uppercase tracking-wider underline" style={{ color: '#0f172a' }}>
                      REKAPITULASI HASIL SUPERVISI 14 DOKUMEN ADMINISTRASI GURU
                    </h3>
                    <p className="text-[9.5px] text-slate-600 font-medium">
                      Tahun Ajaran {settings.schoolYear} • Wilayah Kerja Kecamatan Tosari
                    </p>
                  </div>

                  {/* TABEL REKAPITULASI MATRIKS */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[8px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-center border border-slate-400">
                          <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-6">No</th>
                          <th style={{ border: '1px solid #94a3b8' }} className="p-1 min-w-[110px] text-left">Nama Guru</th>
                          <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-16 text-left">Kelas/Mapel</th>
                          {STANDARD_SD_ADMIN_DOCS.map((doc) => (
                            <th 
                              key={doc.id} 
                              style={{ border: '1px solid #94a3b8' }} 
                              className="p-1 text-center w-6"
                              title={`${doc.no}. ${doc.name}`}
                            >
                              D{doc.no}
                            </th>
                          ))}
                          <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-10 text-center">Skor</th>
                          <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-12 text-center">Nilai (%)</th>
                          <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-18 text-center">Predikat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allAudits.map((a, idx) => (
                          <tr key={a.id} className="border border-slate-300">
                            <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center font-bold text-slate-600">
                              {idx + 1}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1' }} className="p-1 font-bold text-slate-900">
                              {a.teacherName}
                              <div className="text-[7px] text-slate-500 font-mono">{a.nip}</div>
                            </td>
                            <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-slate-700">
                              {a.classSubject}
                            </td>
                            {STANDARD_SD_ADMIN_DOCS.map((doc) => {
                              const found = a.items.find(i => i.id === doc.id);
                              const status = found?.status || 'tidak_ada';
                              return (
                                <td 
                                  key={doc.id} 
                                  style={{ border: '1px solid #cbd5e1' }} 
                                  className="p-0.5 text-center font-bold text-[8.5px]"
                                >
                                  {status === 'lengkap' ? (
                                    <span className="text-emerald-700">2</span>
                                  ) : status === 'kurang' ? (
                                    <span className="text-amber-700">1</span>
                                  ) : (
                                    <span className="text-rose-600">0</span>
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center font-bold text-slate-800">
                              {a.totalScore}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center font-extrabold text-teal-800">
                              {a.percentage}%
                            </td>
                            <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center font-semibold text-slate-800">
                              {a.predicate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* KETERANGAN KODE DOKUMEN */}
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-[7.5px] leading-tight">
                    <span className="font-bold text-slate-800 block mb-0.5">Keterangan Dokumen (D1 s.d D14):</span>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-600">
                      {STANDARD_SD_ADMIN_DOCS.map(d => (
                        <span key={d.id}>
                          <strong>D{d.no}:</strong> {d.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* TANDA TANGAN BERPASANGAN */}
                  <div className="pt-3 text-[9px] signature-block">
                    <div className="flex justify-between items-start px-6">
                      <div className="text-center w-56">
                        <p className="text-slate-600 mb-12">Pengawas Pembina SD,</p>
                        <p className="font-bold text-slate-900 underline leading-tight">{settings.supervisorName}</p>
                        <p className="text-slate-600 font-mono text-[8px]">NIP. {settings.supervisorNip}</p>
                      </div>
                      <div className="text-center w-56">
                        <p className="text-slate-600 mb-1">Tosari Pasuruan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-slate-600 mb-12">Kepala Sekolah,</p>
                        <p className="font-bold text-slate-900 underline leading-tight">{settings.principalName}</p>
                        <p className="text-slate-600 font-mono text-[8px]">NIP. {settings.principalNip}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
