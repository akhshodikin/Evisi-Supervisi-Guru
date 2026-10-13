import React, { useState } from 'react';
import { ObservationData, SchoolSettings } from '../../types';
import { exportElementToA4Pdf } from '../../utils/pdfExport';
import { exportObservationsToCsv, exportObservationsToExcelHtml } from '../../utils/excelExport';
import { Printer, Download, Eye, FileText, Loader2, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface ReportsViewProps {
  observations: ObservationData[];
  settings: SchoolSettings;
  onOpenPrintModal: (type: 'rekap' | 'individual') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  observations,
  settings,
  onOpenPrintModal
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handlePrint = () => {
    onOpenPrintModal('rekap');
  };

  const handleDownload = async () => {
    const element = document.getElementById('printable-area-rekap');
    if (!element) return;

    setIsExporting(true);
    setExportNotice(null);
    try {
      const filename = `Rekapitulasi_Supervisi_A4_${settings.schoolYear.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      await exportElementToA4Pdf(element, filename);
      setExportNotice('Berkas PDF Rekapitulasi berhasil diunduh.');
    } catch (err) {
      console.warn('PDF export notification:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = () => {
    exportObservationsToCsv(observations, settings);
    setExportNotice('Rekapitulasi data supervisi guru berhasil diekspor ke format CSV (Excel-ready).');
    setTimeout(() => setExportNotice(null), 5000);
  };

  const handleExportExcel = () => {
    exportObservationsToExcelHtml(observations, settings);
    setExportNotice('Rekapitulasi data supervisi guru berhasil diekspor ke format Excel (.xls).');
    setTimeout(() => setExportNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Actions Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Rekapitulasi Hasil Supervisi Akademik</h3>
            <p className="text-xs text-slate-500">
              Dokumen Cetak Format Resmi Pasuruan &amp; Ekspor Data Administratif
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Tombol Ekspor Excel & CSV */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleExportExcel}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
              title="Ekspor seluruh rekapitulasi guru ke Microsoft Excel (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ekspor Excel (.xls)</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Ekspor data ke file CSV dengan format UTF-8 BOM"
            >
              <span>CSV</span>
            </button>
          </div>

          <button
            onClick={() => onOpenPrintModal('rekap')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Layar A4</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF A4</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Export notification alert */}
      {exportNotice && (
        <div className="no-print bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold px-2 py-0.5"
          >
            Tutup
          </button>
        </div>
      )}

      {/* PREVIEW PRINTABLE REPORT CARD (Directly rendered on page & also print target) */}
      <div
        id="printable-area-rekap"
        className="print-card a4-page-sheet bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-md max-w-4xl mx-auto space-y-6 text-slate-900"
      >
        {/* KOP SURAT RESMI */}
        <div className="border-b-4 border-double border-black pb-3 text-center flex items-center justify-between">
          <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
            <img src={settings.logoLeft} alt="Logo Pemda" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex-1 px-4 text-center">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-tight">
              PEMERINTAH KABUPATEN PASURUAN
            </h2>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide leading-tight">
              DINAS PENDIDIKAN DAN KEBUDAYAAN
            </h3>
            <h1 className="text-base sm:text-lg font-black uppercase text-emerald-800 leading-tight">
              {settings.schoolName}
            </h1>
            <p className="text-[11px] italic mt-0.5 text-slate-700 leading-tight">
              Alamat: {settings.address}
            </p>
            <p className="text-[10px] font-semibold text-slate-800">
              NPSN: {settings.npsn} | Kode Pos: 67177 | Wilayah Binaan: {settings.supervisorArea}
            </p>
          </div>
          <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
            <img src={settings.logoRight} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-0.5">
          <h3 className="text-sm sm:text-base font-bold uppercase underline tracking-wider">
            REKAPITULASI LAPORAN SUPERVISI AKADEMIK
          </h3>
          <p className="text-xs font-medium text-slate-700">
            Tahun Pelajaran {settings.schoolYear} - Semester {settings.semester}
          </p>
        </div>

        {/* Table Summary */}
        <table className="w-full text-xs border-collapse border border-slate-400">
          <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-center">
            <tr>
              <th className="border border-slate-400 p-2 w-8">No</th>
              <th className="border border-slate-400 p-2 text-left">Nama Guru / NIP</th>
              <th className="border border-slate-400 p-2 text-left">Mata Pelajaran &amp; Kelas</th>
              <th className="border border-slate-400 p-2 w-24">Tgl Observasi</th>
              <th className="border border-slate-400 p-2 w-14">Skor</th>
              <th className="border border-slate-400 p-2 w-24">Predikat</th>
              <th className="border border-slate-400 p-2 text-left">Rencana Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((o, idx) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="border border-slate-400 p-2 text-center font-bold">{idx + 1}</td>
                <td className="border border-slate-400 p-2">
                  <p className="font-bold leading-tight text-slate-900">{o.teacherName}</p>
                  <p className="font-mono text-[10px] text-slate-500 leading-tight">NIP: {o.nip}</p>
                </td>
                <td className="border border-slate-400 p-2">
                  <p className="font-medium text-slate-800">{o.subject}</p>
                  <span className="text-[10px] text-slate-500">{o.classTarget}</span>
                </td>
                <td className="border border-slate-400 p-2 text-center font-mono">{o.date}</td>
                <td className="border border-slate-400 p-2 text-center font-extrabold text-emerald-800">
                  {o.score}
                </td>
                <td className="border border-slate-400 p-2 text-center font-semibold text-slate-800">
                  {o.category}
                </td>
                <td className="border border-slate-400 p-2 text-[10px] text-slate-700 leading-snug">
                  {o.pasca?.will ||
                    (o.followups?.length
                      ? `${o.followups[0].program} (${o.followups[0].focus})`
                      : `Komunitas Belajar (Kombel) Guru ${settings.schoolName}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3-Way Official Signatures */}
        <div style={{ pageBreakInside: 'avoid', marginTop: '20px' }} className="signature-block border-t border-slate-300 pt-4">
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-slate-900">
            {/* Pengawas Pembina */}
            <div className="flex flex-col justify-between border border-slate-200 rounded-xl p-3 bg-slate-50/50 min-h-[135px]">
              <div>
                <p className="m-0 text-slate-500 font-medium">Mengetahui,</p>
                <p className="m-0 font-bold text-slate-900 leading-tight">Pengawas Pembina SD</p>
                <p className="m-0 text-[9px] text-slate-500">Wilayah Binaan Kec. Tosari</p>
              </div>
              <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                {/* Ruang Tanda Tangan & Cap Dinas */}
              </div>
              <div>
                <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.supervisorName}</p>
                <p className="m-0 text-[9px] text-slate-600 font-mono">NIP. {settings.supervisorNip}</p>
              </div>
            </div>

            {/* Kepala Sekolah */}
            <div className="flex flex-col justify-between border border-slate-200 rounded-xl p-3 bg-slate-50/50 min-h-[135px]">
              <div>
                <p className="m-0 text-slate-500 font-medium">
                  Tosari, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="m-0 font-bold text-slate-900 leading-tight">{settings.principalTitle || 'Kepala Sekolah / Observer'}</p>
                <p className="m-0 text-[9px] text-slate-500">{settings.schoolName}</p>
              </div>
              <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                {/* Ruang Tanda Tangan & Cap Sekolah */}
              </div>
              <div>
                <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.principalName}</p>
                <p className="m-0 text-[9px] text-slate-600 font-mono">NIP. {settings.principalNip}</p>
              </div>
            </div>

            {/* Perwakilan Guru */}
            <div className="flex flex-col justify-between border border-slate-200 rounded-xl p-3 bg-slate-50/50 min-h-[135px]">
              <div>
                <p className="m-0 text-slate-500 font-medium">&nbsp;</p>
                <p className="m-0 font-bold text-slate-900 leading-tight">Perwakilan Guru</p>
                <p className="m-0 text-[9px] text-slate-500">{settings.schoolName}</p>
              </div>
              <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                {/* Ruang Tanda Tangan Guru */}
              </div>
              <div>
                <p className="m-0 font-bold underline text-slate-900 leading-tight">{observations[0]?.teacherName || 'Siti Rahma, S.Pd'}</p>
                <p className="m-0 text-[9px] text-slate-600 font-mono">NIP. {observations[0]?.nip || '199005152015022001'}</p>
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-center text-[8px] italic text-slate-500">
            * Laporan rekapitulasi supervisi akademik semester ini disahkan untuk arsip evaluasi kinerja guru dan pembinaan pengawas sekolah.
          </p>
        </div>
      </div>
    </div>
  );
};
