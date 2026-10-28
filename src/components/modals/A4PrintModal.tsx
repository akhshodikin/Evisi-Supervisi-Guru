import React, { useState } from 'react';
import { ObservationData, SchoolSettings } from '../../types';
import { EVALUATION_RUBRIC } from '../../data/rubrics';
import { 
  DEEP_LEARNING_DIMENSIONS, 
  calculateDeepLearningStats, 
  DEFAULT_DEEP_LEARNING_SCORES, 
  DEFAULT_DEEP_LEARNING_NOTES,
  parseDlScore
} from '../../data/deepLearningData';
import { exportElementToA4Pdf } from '../../utils/pdfExport';
import { exportObservationsToExcelHtml, exportObservationsToCsv } from '../../utils/excelExport';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  Loader2, 
  CheckCircle2, 
  FileSpreadsheet,
  Sparkles,
  Layers,
  Target,
  Check
} from 'lucide-react';

interface A4PrintModalProps {
  isOpen: boolean;
  type: 'individual' | 'rekap';
  observation: ObservationData | null;
  allObservations?: ObservationData[];
  settings: SchoolSettings;
  onClose: () => void;
  defaultFormat?: 'all' | 'pmm' | 'deep-learning';
}

export const A4PrintModal: React.FC<A4PrintModalProps> = ({
  isOpen,
  type,
  observation,
  allObservations = [],
  settings,
  onClose,
  defaultFormat = 'all'
}) => {
  const [docFormat, setDocFormat] = useState<'all' | 'pmm' | 'deep-learning'>(defaultFormat);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printAlert, setPrintAlert] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  if (!isOpen) return null;

  const obs = observation || allObservations[0];

  // Deep Learning stats calculation
  const dlScores = obs?.deepLearning?.scores || DEFAULT_DEEP_LEARNING_SCORES;
  const dlNotes = obs?.deepLearning?.notes || DEFAULT_DEEP_LEARNING_NOTES;
  const dlRekomendasi = obs?.deepLearning?.rekomendasiObserver || 
    'Praktik pembelajaran mendalam (deep learning) sangat tampak, khususnya pada prinsip berkesadaran dan pengalaman belajar memahami yang berbasis kearifan lokal. Disarankan untuk terus memperkuat kemitraan dengan lingkungan sekitar.';
  const dlStats = calculateDeepLearningStats(dlScores);

  const getExportFilename = () => {
    if (type === 'rekap') {
      return `Cetak_Rekapitulasi_Supervisi_${settings.schoolYear.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    }
    const safeTeacher = (obs?.teacherName || 'Guru').replace(/[^a-zA-Z0-9]/g, '_');
    const safeDate = obs?.date || '2026';
    if (docFormat === 'deep-learning') {
      return `Instrumen_Pembelajaran_Mendalam_${safeTeacher}_${safeDate}.pdf`;
    }
    if (docFormat === 'pmm') {
      return `Instrumen_Rubrik_PMM_${safeTeacher}_${safeDate}.pdf`;
    }
    return `Instrumen_Lengkap_Supervisi_${safeTeacher}_${safeDate}.pdf`;
  };

  const handlePrint = async () => {
    const element = document.getElementById('a4-document-container');
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
        console.warn('Native window.print() dibatasi lingkungan iframe sandbox:', printErr);
      }

      const filename = getExportFilename();
      await exportElementToA4Pdf(element, filename);

      setPrintAlert({
        message: nativePrintTriggered
          ? 'Dialog cetak printer dibuka dan berkas PDF siap cetak (A4) berhasil diunduh.'
          : 'Dokumen A4 siap cetak berhasil diproses dan diunduh. Anda dapat langsung membuka berkas PDF ini untuk dicetak ke mesin printer.',
        type: 'success'
      });
    } catch (err) {
      console.error('Error saat proses cetak dokumen:', err);
      setPrintAlert({
        message: 'Gagal memproses dokumen cetak. Silakan gunakan tombol "Unduh File PDF".',
        type: 'info'
      });
    } finally {
      document.body.classList.remove('printing-modal');
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('a4-document-container');
    if (!element) return;

    setIsExporting(true);
    setPrintAlert(null);
    try {
      const filename = getExportFilename();
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
        console.warn('Fallback window.print also failed:', e);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="modal-print-a4" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <div id="modal-print-a4-card" className="bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full h-[94vh] flex flex-col overflow-hidden border border-slate-700">
        
        {/* Header toolbar */}
        <div className="no-print p-3.5 bg-slate-850 text-white flex flex-wrap justify-between items-center gap-2 border-b border-slate-700/80 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-auto min-w-[65px] px-1.5 py-0.5 bg-white rounded-lg border border-slate-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <img src="/logo.png" alt="e-Visi Logo" className="h-full w-auto object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <span>
                  {type === 'individual'
                    ? `Pratinjau Lembar Supervisi A4 - ${obs?.teacherName || 'Guru'}`
                    : 'Pratinjau Rekapitulasi Supervisi A4'}
                </span>
                {type === 'individual' && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold">
                    {docFormat === 'all' ? 'Lengkap (4 Hal)' : docFormat === 'deep-learning' ? 'Pembelajaran Mendalam (2 Hal)' : 'Rubrik PMM (2 Hal)'}
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-slate-400">
                Standar Format A4 Portrait (210 x 297 mm) Kurikulum Merdeka Kab. Pasuruan
              </p>
            </div>
          </div>

          {/* Switcher Format untuk Lembar Individual */}
          {type === 'individual' && (
            <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setDocFormat('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                  docFormat === 'all'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Cetak Seluruh Lembar: Rubrik PMM & Pembelajaran Mendalam"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Semua Lembar</span>
                <span className="text-[10px] opacity-80">(Lengkap)</span>
              </button>

              <button
                type="button"
                onClick={() => setDocFormat('deep-learning')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                  docFormat === 'deep-learning'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Cetak Lembar Unsur Pembelajaran Mendalam (Deep Learning - 33 Butir)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pembelajaran Mendalam</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black">
                  33
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDocFormat('pmm')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                  docFormat === 'pmm'
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Cetak Lembar Rubrik GROW PMM (11 Butir)"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Rubrik PMM</span>
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {type === 'rekap' && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    exportObservationsToExcelHtml(allObservations, settings);
                    setPrintAlert({
                      message: 'Data rekapitulasi supervisi guru berhasil diekspor ke Microsoft Excel (.xls).',
                      type: 'success'
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                  title="Ekspor seluruh data supervisi ke file Excel (.xls)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden sm:inline">Ekspor Excel</span>
                </button>
                <button
                  onClick={() => {
                    exportObservationsToCsv(allObservations, settings);
                    setPrintAlert({
                      message: 'Data rekapitulasi supervisi guru berhasil diekspor ke file CSV.',
                      type: 'success'
                    });
                  }}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                  title="Ekspor data ke file CSV UTF-8"
                >
                  <span>CSV</span>
                </button>
              </div>
            )}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting || isPrinting}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="Unduh Berkas PDF Standar A4"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses PDF A4...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File PDF (A4)</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              disabled={isPrinting || isExporting}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="Cetak Dokumen Langsung atau Siapkan PDF Siap Cetak"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses Cetak...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Cetak PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print & Export feedback notification */}
        {printAlert && (
          <div className="no-print px-4 py-2 bg-emerald-950/90 text-emerald-200 border-b border-emerald-800 text-xs flex items-center justify-between animate-fade-in flex-shrink-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{printAlert.message}</span>
            </div>
            <button
              onClick={() => setPrintAlert(null)}
              className="text-emerald-400 hover:text-white p-0.5 ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Viewport for A4 paper preview */}
        <div id="modal-print-a4-viewport" className="flex-1 overflow-y-auto bg-slate-800/80 p-3 sm:p-6 flex justify-center">
          <div id="a4-document-container" className="flex flex-col items-center space-y-6">
            {type === 'individual' && obs ? (
              <>
                {/* ======================================================== */}
                {/* LEMBAR 1 & 2: RUBRIK GROW PMM (DITAMPILKAN JIKA ALL / PMM) */}
                {/* ======================================================== */}
                {(docFormat === 'all' || docFormat === 'pmm') && (
                  <>
                    {/* LEMBAR 1: IDENTITAS & OBSERVASI KINERJA KELAS */}
                    <div
                      className="a4-page-sheet"
                      style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
                    >
                      <div className="a4-content font-sans space-y-2.5" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {/* KOP SURAT RESMI PEMKAB PASURUAN */}
                        <div style={{ borderBottom: '3px double #000000', paddingBottom: '6px', marginBottom: '8px' }} className="flex items-center justify-between text-center">
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

                        {/* JUDUL */}
                        <div className="text-center space-y-0.5 mb-1.5">
                          <h3 className="text-sm font-bold uppercase underline tracking-wider" style={{ color: '#0f172a' }}>INSTRUMEN OBSERVASI KINERJA GURU</h3>
                          <p className="text-[9.5px] font-semibold" style={{ color: '#334155' }}>KURIKULUM MERDEKA &amp; RUBRIK PENGELOLAAN KINERJA PMM (ALUR GROW)</p>
                        </div>

                        {/* TABEL IDENTITAS */}
                        <table className="w-full text-[9.5px] border-collapse mb-1.5" style={{ color: '#0f172a' }}>
                          <tbody>
                            <tr>
                              <td className="w-24 font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Nama Guru</td>
                              <td className="w-2 p-0.5 border-0">:</td>
                              <td className="font-bold p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.teacherName}</td>
                              <td className="w-24 font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Hari / Tanggal</td>
                              <td className="w-2 p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.date}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>NIP / NUPTK</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="font-mono p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.nip}</td>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Mata Pelajaran</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.subject} ({obs.classTarget})</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Observer / KS</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.observer}</td>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Skor Supervisi</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0 font-bold" style={{ color: '#166534' }}>{obs.score} / 100 ({obs.category})</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* TAHAP 1: PRA OBSERVASI (GOAL) */}
                        <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #16a34a', color: '#0f172a' }} className="px-2.5 py-1 font-bold text-[9.5px]">
                          I. PRA OBSERVASI (G - GOAL &amp; PERSIAPAN)
                        </div>
                        <table className="w-full text-[9px] border-collapse mb-1" style={{ color: '#0f172a' }}>
                          <tbody>
                            <tr>
                              <td className="w-40 font-semibold p-0.5 align-top border-0" style={{ color: '#334155' }}>Tujuan Pembelajaran Murid</td>
                              <td className="w-2 p-0.5 align-top border-0">:</td>
                              <td className="p-0.5 align-top border-0" style={{ color: '#0f172a' }}>{obs.pra?.goal1 || '-'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-0.5 align-top border-0" style={{ color: '#334155' }}>Kompetensi yang Dikembangkan</td>
                              <td className="w-2 p-0.5 align-top border-0">:</td>
                              <td className="p-0.5 align-top border-0" style={{ color: '#0f172a' }}>{obs.pra?.goal2 || '-'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-0.5 align-top border-0" style={{ color: '#334155' }}>Strategi &amp; Media Konkret</td>
                              <td className="w-2 p-0.5 align-top border-0">:</td>
                              <td className="p-0.5 align-top border-0" style={{ color: '#0f172a' }}>{obs.pra?.options || '-'}</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* TAHAP 2: PELAKSANAAN OBSERVASI (REALITY) */}
                        <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #0284c7', color: '#0f172a' }} className="px-2.5 py-1 font-bold text-[9.5px] flex justify-between items-center">
                          <span>II. PELAKSANAAN OBSERVASI KELAS (R - REALITY &amp; RUBRIK PMM)</span>
                          <span className="text-[8px] font-normal" style={{ color: '#475569' }}>*Rentang Skor 1: Belum Dilakukan, 2: Cukup, 3: Efektif, 4: Sangat Efektif</span>
                        </div>

                        <table className="w-full text-[8.5px] border-collapse" style={{ border: '1px solid #cbd5e1', color: '#0f172a' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }} className="font-bold text-center">
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-6">No</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-left">Fokus Perilaku &amp; Indikator Observasi Kinerja</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-24">Skor (1-4)</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-48 text-left">Catatan / Bukti Konkret</th>
                            </tr>
                          </thead>
                          <tbody>
                            {EVALUATION_RUBRIC.map((cat, cIdx) => (
                              <React.Fragment key={cIdx}>
                                <tr style={{ backgroundColor: '#f8fafc', color: '#0f172a' }} className="font-bold">
                                  <td colSpan={4} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 uppercase text-[8px] tracking-wide">
                                    {cat.category}
                                  </td>
                                </tr>
                                {cat.items.map((it) => {
                                  const sc = obs.scores?.[it.id] ?? 0;
                                  const ev = obs.evidence?.[it.id] || '-';
                                  let labelSc = '-';
                                  if (sc === 4) labelSc = '4 (Sangat Efektif)';
                                  else if (sc === 3) labelSc = '3 (Efektif)';
                                  else if (sc === 2) labelSc = '2 (Cukup)';
                                  else if (sc === 1) labelSc = '1 (Kurang)';

                                  return (
                                    <tr key={it.id}>
                                      <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold">{it.no}</td>
                                      <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 leading-snug">{it.name}</td>
                                      <td style={{ border: '1px solid #cbd5e1', color: sc >= 3 ? '#166534' : sc === 2 ? '#b45309' : '#dc2626' }} className="p-0.5 text-center font-bold text-[8px]">
                                        {labelSc}
                                      </td>
                                      <td style={{ border: '1px solid #cbd5e1', color: '#334155' }} className="p-0.5 italic leading-snug text-[8px]">{ev}</td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>

                        {/* FOOTER LEMBAR 1 */}
                        <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                          <span>Instrumen Supervisi Guru SD - Alur GROW &amp; Rubrik PMM {settings.schoolName}</span>
                          <span>{docFormat === 'all' ? 'Halaman 1 dari 4' : 'Halaman 1 dari 2'}</span>
                        </div>
                      </div>
                    </div>

                    {/* LEMBAR 2: REFLEKSI, TINDAK LANJUT & TANDA TANGAN LENGKAP */}
                    <div
                      className="a4-page-sheet"
                      style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
                    >
                      <div className="a4-content font-sans space-y-3" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {/* HEADER LEMBAR 2 */}
                        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '6px', marginBottom: '10px' }} className="flex justify-between items-center text-[9px]">
                          <div>
                            <h4 className="m-0 font-bold uppercase tracking-wide leading-tight" style={{ color: '#0f172a' }}>{settings.schoolName.toUpperCase()} - WILAYAH KECAMATAN TOSARI</h4>
                            <p className="m-0 text-[8px] text-slate-500">Lampiran Refleksi, Rencana Tindak Lanjut &amp; Lembar Pengesahan Supervisi Guru</p>
                          </div>
                          <div className="text-right">
                            <p className="m-0 font-bold text-slate-900">{obs.teacherName}</p>
                            <p className="m-0 text-[8px] text-slate-500 font-mono">NIP: {obs.nip} | {obs.date}</p>
                          </div>
                        </div>

                        {/* KEKUATAN & REKOMENDASI */}
                        <div className="grid grid-cols-2 gap-2 text-[9px]">
                          <div style={{ border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a' }} className="rounded p-2">
                            <span className="font-bold block mb-0.5 text-emerald-800" style={{ color: '#166534' }}>Catatan Kekuatan / Praktik Baik:</span>
                            <p className="leading-snug" style={{ color: '#334155' }}>{obs.kekuatan || 'Pembelajaran student-centered sangat baik, partisipasi aktif murid tinggi, dan interaksi pembelajaran berjalan kondusif.'}</p>
                          </div>
                          <div style={{ border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a' }} className="rounded p-2">
                            <span className="font-bold block mb-0.5 text-amber-800" style={{ color: '#b45309' }}>Rekomendasi Area Peningkatan:</span>
                            <p className="leading-snug" style={{ color: '#334155' }}>{obs.rekomendasi || 'Tingkatkan pertanyaan pemantik level HOTS dan penguatan asesmen formatif berkelanjutan.'}</p>
                          </div>
                        </div>

                        {/* TAHAP 3 & 4: PASCA & TINDAK LANJUT */}
                        <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #7c3aed', color: '#0f172a' }} className="px-2.5 py-1 font-bold text-[9.5px]">
                          III. PASCA OBSERVASI &amp; TINDAK LANJUT (O - OPTIONS &amp; W - WILL)
                        </div>
                        <table className="w-full text-[9px] border-collapse mb-1" style={{ color: '#0f172a' }}>
                          <tbody>
                            <tr>
                              <td className="w-44 font-semibold p-1 align-top border-0" style={{ color: '#334155' }}>Refleksi Mandiri Guru</td>
                              <td className="w-2 p-1 align-top border-0">:</td>
                              <td className="p-1 align-top border-0" style={{ color: '#0f172a' }}>{obs.pasca?.refleksiGuru || 'Guru merasa pelaksanaan target pembelajaran tercapai dan berkomitmen meningkatkan diferensiasi proses belajar murid.'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-1 align-top border-0" style={{ color: '#334155' }}>Rencana Tindak Lanjut Kinerja</td>
                              <td className="p-1 align-top border-0">:</td>
                              <td className="p-1 align-top border-0" style={{ color: '#0f172a' }}>
                                {obs.pasca?.will ||
                                  (obs.followups?.length
                                    ? `${obs.followups[0].program} (${obs.followups[0].focus})`
                                    : `Mengikuti Komunitas Belajar (Kombel) Guru ${settings.schoolName} & Pelatihan Mandiri PMM`)}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-1 align-top border-0" style={{ color: '#334155' }}>Umpan Balik &amp; Dukungan KS</td>
                              <td className="p-1 align-top border-0">:</td>
                              <td className="p-1 align-top border-0" style={{ color: '#0f172a' }}>{obs.pasca?.feedbackKs || 'Kepala Sekolah memberikan pendampingan intensif dan memfasilitasi kebutuhan modul serta media ajar berbasis teknologi.'}</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* TANDA TANGAN 3 PIHAK LENGKAP */}
                        <div style={{ pageBreakInside: 'avoid', marginTop: '16px' }} className="signature-block border-t border-slate-300 pt-3">
                          <div className="grid grid-cols-3 gap-3 text-center text-[9px]" style={{ color: '#0f172a' }}>
                            {/* Pengawas Pembina */}
                            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2.5 bg-slate-50/60 min-h-[135px]">
                              <div>
                                <p className="m-0 text-[8.5px] text-slate-600 font-medium">Mengetahui,</p>
                                <p className="m-0 font-bold text-slate-900 leading-tight">Pengawas Pembina SD</p>
                                <p className="m-0 text-[8px] text-slate-500">Wilayah Binaan Kec. Tosari</p>
                              </div>
                              <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                                {/* Ruang Tanda Tangan & Cap Dinas */}
                              </div>
                              <div>
                                <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.supervisorName}</p>
                                <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {settings.supervisorNip}</p>
                              </div>
                            </div>

                            {/* Kepala Sekolah / Observer */}
                            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2.5 bg-slate-50/60 min-h-[135px]">
                              <div>
                                <p className="m-0 text-[8.5px] text-slate-600 font-medium">Tosari, {obs.date}</p>
                                <p className="m-0 font-bold text-slate-900 leading-tight">{settings.principalTitle || 'Observer / Kepala Sekolah'}</p>
                                <p className="m-0 text-[8px] text-slate-500">{settings.schoolName}</p>
                              </div>
                              <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                                {/* Ruang Tanda Tangan & Cap Sekolah */}
                              </div>
                              <div>
                                <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.principalName}</p>
                                <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {settings.principalNip}</p>
                              </div>
                            </div>

                            {/* Guru yang Diobservasi */}
                            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2.5 bg-slate-50/60 min-h-[135px]">
                              <div>
                                <p className="m-0 text-[8.5px] text-slate-600 font-medium">&nbsp;</p>
                                <p className="m-0 font-bold text-slate-900 leading-tight">Guru yang Diobservasi</p>
                                <p className="m-0 text-[8px] text-slate-500">{obs.subject} ({obs.classTarget})</p>
                              </div>
                              <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                                {/* Ruang Tanda Tangan Guru */}
                              </div>
                              <div>
                                <p className="m-0 font-bold underline text-slate-900 leading-tight">{obs.teacherName}</p>
                                <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {obs.nip}</p>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2.5 text-center text-[7.5px] italic text-slate-500">
                            * Dokumen resmi hasil observasi kinerja guru ini disahkan secara sah oleh Pengawas Pembina SD, Kepala Sekolah, dan Guru bersangkutan sesuai regulasi PMM &amp; Kurikulum Merdeka.
                          </p>
                        </div>

                        {/* FOOTER LEMBAR 2 */}
                        <div className="pt-2 mt-4 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                          <span>Dokumen Pengesahan Resmi - {settings.schoolName}</span>
                          <span>{docFormat === 'all' ? 'Halaman 2 dari 4' : 'Halaman 2 dari 2'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ============================================================================== */}
                {/* LEMBAR 3 & 4: UNSUR PEMBELAJARAN MENDALAM (DITAMPILKAN JIKA ALL / DEEP-LEARNING) */}
                {/* ============================================================================== */}
                {(docFormat === 'all' || docFormat === 'deep-learning') && (
                  <>
                    {/* LEMBAR 1 PEMBELAJARAN MENDALAM: DIMENSI 1 (PRINSIP) & DIMENSI 2 (PENGALAMAN BELAJAR) */}
                    <div
                      className="a4-page-sheet"
                      style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
                    >
                      <div className="a4-content font-sans space-y-2.5" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {/* KOP SURAT RESMI */}
                        <div style={{ borderBottom: '3px double #000000', paddingBottom: '6px', marginBottom: '8px' }} className="flex items-center justify-between text-center">
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

                        {/* JUDUL RESMI PEMBELAJARAN MENDALAM */}
                        <div className="text-center space-y-0.5 mb-1.5">
                          <h3 className="text-sm font-bold uppercase underline tracking-wider" style={{ color: '#0f172a' }}>
                            INSTRUMEN OBSERVASI KINERJA GURU: LEMBAR UNSUR PEMBELAJARAN MENDALAM
                          </h3>
                          <p className="text-[9.5px] font-semibold" style={{ color: '#166534' }}>
                            PENDEKATAN DEEP LEARNING (MINDFUL, MEANINGFUL, JOYFUL) - KURIKULUM MERDEKA
                          </p>
                        </div>

                        {/* TABEL IDENTITAS & SKOR DEEP LEARNING */}
                        <table className="w-full text-[9px] border-collapse mb-1" style={{ color: '#0f172a' }}>
                          <tbody>
                            <tr>
                              <td className="w-24 font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Nama Guru</td>
                              <td className="w-2 p-0.5 border-0">:</td>
                              <td className="font-bold p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.teacherName}</td>
                              <td className="w-24 font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Hari / Tanggal</td>
                              <td className="w-2 p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.date}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>NIP / NUPTK</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="font-mono p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.nip}</td>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Mata Pelajaran</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.subject} ({obs.classTarget})</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Observer / KS</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0" style={{ color: '#0f172a' }}>{obs.observer}</td>
                              <td className="font-semibold p-0.5 border-0" style={{ color: '#334155' }}>Skor DL (1-4)</td>
                              <td className="p-0.5 border-0">:</td>
                              <td className="p-0.5 border-0 font-bold" style={{ color: '#166534' }}>
                                {dlStats.overall.totalScore} / {dlStats.overall.maxScore} ({dlStats.overall.percentage}% - Rata-rata {dlStats.overall.averageScore}/4.00 - {dlStats.overall.category})
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* KOTAK PETUNJUK REFERENSI */}
                        <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a', color: '#0f172a' }} className="px-2 py-1 text-[8.5px] rounded-r">
                          <span className="font-bold text-emerald-900">Petunjuk Rentang Penilaian: </span>
                          Lembar observasi ini menggunakan rentang nilai <strong>1 - 4</strong> (<strong>1</strong>: Belum Dilakukan, <strong>2</strong>: Belum Efektif, <strong>3</strong>: Dilakukan &amp; Efektif, <strong>4</strong>: Sangat Efektif Membudaya) beserta catatan bukti konkret pengamatan.
                        </div>

                        {/* TABEL DIMENSI 1 & 2 */}
                        <table className="w-full text-[8px] border-collapse" style={{ border: '1px solid #cbd5e1', color: '#0f172a' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }} className="font-bold text-center">
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-6">No</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-left">Aspek &amp; Indikator Unsur Pembelajaran Mendalam</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="1 - Belum Dilakukan">1</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="2 - Belum Efektif">2</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="3 - Dilakukan & Efektif">3</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="4 - Sangat Efektif">4</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-44 text-left">Bukti / Catatan Konkret Pengamatan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* DIMENSI 1: PRINSIP PEMBELAJARAN (9 BUTIR) */}
                            {DEEP_LEARNING_DIMENSIONS.filter(d => d.id === 'prinsip').map(dim => (
                              <React.Fragment key={dim.id}>
                                <tr style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }} className="font-bold">
                                  <td colSpan={7} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 uppercase text-[8px] tracking-wide">
                                    {dim.title} (Skor: {dlStats.dimensions.prinsip.totalScore}/{dlStats.dimensions.prinsip.maxScore} - {dlStats.dimensions.prinsip.percentage}% - {dlStats.dimensions.prinsip.category})
                                  </td>
                                </tr>
                                {dim.subAspects.map((sub, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <tr style={{ backgroundColor: '#f8fafc', color: '#334155' }} className="font-semibold italic">
                                      <td colSpan={7} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-[7.5px]">
                                        {sub.name}
                                      </td>
                                    </tr>
                                    {sub.items.map(item => {
                                      const sc = parseDlScore(dlScores[item.id]);
                                      const note = dlNotes[item.id] || '-';
                                      return (
                                        <tr key={item.id}>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold">{item.no}</td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 leading-snug">{item.desc}</td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-rose-600">
                                            {sc === 1 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-amber-600">
                                            {sc === 2 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-sky-600">
                                            {sc === 3 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-emerald-700">
                                            {sc === 4 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1', color: '#334155' }} className="p-0.5 italic leading-snug text-[7.5px]">{note}</td>
                                        </tr>
                                      );
                                    })}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ))}

                            {/* DIMENSI 2: PENGALAMAN BELAJAR (14 BUTIR) */}
                            {DEEP_LEARNING_DIMENSIONS.filter(d => d.id === 'pengalaman').map(dim => (
                              <React.Fragment key={dim.id}>
                                <tr style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }} className="font-bold">
                                  <td colSpan={7} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 uppercase text-[8px] tracking-wide">
                                    {dim.title} (Skor: {dlStats.dimensions.pengalaman.totalScore}/{dlStats.dimensions.pengalaman.maxScore} - {dlStats.dimensions.pengalaman.percentage}% - {dlStats.dimensions.pengalaman.category})
                                  </td>
                                </tr>
                                {dim.subAspects.map((sub, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <tr style={{ backgroundColor: '#f8fafc', color: '#334155' }} className="font-semibold italic">
                                      <td colSpan={7} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-[7.5px]">
                                        {sub.name}
                                      </td>
                                    </tr>
                                    {sub.items.map(item => {
                                      const sc = parseDlScore(dlScores[item.id]);
                                      const note = dlNotes[item.id] || '-';
                                      return (
                                        <tr key={item.id}>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold">{item.no}</td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 leading-snug">{item.desc}</td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-rose-600">
                                            {sc === 1 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-amber-600">
                                            {sc === 2 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-sky-600">
                                            {sc === 3 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-emerald-700">
                                            {sc === 4 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1', color: '#334155' }} className="p-0.5 italic leading-snug text-[7.5px]">{note}</td>
                                        </tr>
                                      );
                                    })}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>

                        {/* FOOTER LEMBAR 1 PEMBELAJARAN MENDALAM */}
                        <div className="pt-1.5 mt-1 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                          <span>Instrumen Unsur Pembelajaran Mendalam (Deep Learning) - {settings.schoolName}</span>
                          <span>{docFormat === 'all' ? 'Halaman 3 dari 4' : 'Halaman 1 dari 2'}</span>
                        </div>
                      </div>
                    </div>

                    {/* LEMBAR 2 PEMBELAJARAN MENDALAM: DIMENSI 3 (KERANGKA PEMBELAJARAN), REKAPITULASI, CATATAN & PENGESAHAN */}
                    <div
                      className="a4-page-sheet"
                      style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
                    >
                      <div className="a4-content font-sans space-y-2.5" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {/* HEADER LEMBAR 2 DL */}
                        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '5px', marginBottom: '8px' }} className="flex justify-between items-center text-[9px]">
                          <div>
                            <h4 className="m-0 font-bold uppercase tracking-wide leading-tight" style={{ color: '#0f172a' }}>{settings.schoolName.toUpperCase()} - WILAYAH KECAMATAN TOSARI</h4>
                            <p className="m-0 text-[8px] text-slate-500">Lampiran Lanjutan: Kerangka Pembelajaran Mendalam, Rekapitulasi Skor &amp; Lembar Pengesahan</p>
                          </div>
                          <div className="text-right">
                            <p className="m-0 font-bold text-slate-900">{obs.teacherName}</p>
                            <p className="m-0 text-[8px] text-slate-500 font-mono">NIP: {obs.nip} | {obs.date}</p>
                          </div>
                        </div>

                        {/* TABEL DIMENSI 3: KERANGKA PEMBELAJARAN (10 BUTIR) */}
                        <table className="w-full text-[8px] border-collapse" style={{ border: '1px solid #cbd5e1', color: '#0f172a' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }} className="font-bold text-center">
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-6">No</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-left">Dimensi 3: Kerangka Pembelajaran (Learning Framework)</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="1 - Belum Dilakukan">1</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="2 - Belum Efektif">2</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="3 - Dilakukan & Efektif">3</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-5 text-center" title="4 - Sangat Efektif">4</th>
                              <th style={{ border: '1px solid #cbd5e1' }} className="p-0.5 w-44 text-left">Bukti / Catatan Konkret Pengamatan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {DEEP_LEARNING_DIMENSIONS.filter(d => d.id === 'kerangka').map(dim => (
                              <React.Fragment key={dim.id}>
                                <tr style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }} className="font-bold">
                                  <td colSpan={7} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 uppercase text-[8px] tracking-wide">
                                    {dim.title} (Skor: {dlStats.dimensions.kerangka.totalScore}/{dlStats.dimensions.kerangka.maxScore} - {dlStats.dimensions.kerangka.percentage}% - {dlStats.dimensions.kerangka.category})
                                  </td>
                                </tr>
                                {dim.subAspects.map((sub, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <tr style={{ backgroundColor: '#f8fafc', color: '#334155' }} className="font-semibold italic">
                                      <td colSpan={7} style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-[7.5px]">
                                        {sub.name}
                                      </td>
                                    </tr>
                                    {sub.items.map(item => {
                                      const sc = parseDlScore(dlScores[item.id]);
                                      const note = dlNotes[item.id] || '-';
                                      return (
                                        <tr key={item.id}>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold">{item.no}</td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 leading-snug">{item.desc}</td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-rose-600">
                                            {sc === 1 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-amber-600">
                                            {sc === 2 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-sky-600">
                                            {sc === 3 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1' }} className="p-0.5 text-center font-bold text-emerald-700">
                                            {sc === 4 ? '✓' : ''}
                                          </td>
                                          <td style={{ border: '1px solid #cbd5e1', color: '#334155' }} className="p-0.5 italic leading-snug text-[7.5px]">{note}</td>
                                        </tr>
                                      );
                                    })}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>

                        {/* REKAPITULASI SKOR 3 DIMENSI */}
                        <div style={{ border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }} className="p-2 rounded">
                          <h5 className="font-bold text-[9px] uppercase tracking-wide text-slate-900 mb-1">
                            REKAPITULASI KETERLAKSANAAN PEMBELAJARAN MENDALAM (DEEP LEARNING - RENTANG SKOR 1 - 4)
                          </h5>
                          <div className="grid grid-cols-4 gap-2 text-center text-[8.5px]">
                            <div className="p-1 bg-white border border-slate-200 rounded">
                              <span className="text-slate-500 block text-[7.5px]">1. Prinsip Pembelajaran</span>
                              <strong className="text-slate-900">{dlStats.dimensions.prinsip.totalScore}/{dlStats.dimensions.prinsip.maxScore}</strong>
                              <span className="text-emerald-700 block text-[7px]">({dlStats.dimensions.prinsip.percentage}% • Rerata {dlStats.dimensions.prinsip.averageScore})</span>
                            </div>
                            <div className="p-1 bg-white border border-slate-200 rounded">
                              <span className="text-slate-500 block text-[7.5px]">2. Pengalaman Belajar</span>
                              <strong className="text-slate-900">{dlStats.dimensions.pengalaman.totalScore}/{dlStats.dimensions.pengalaman.maxScore}</strong>
                              <span className="text-emerald-700 block text-[7px]">({dlStats.dimensions.pengalaman.percentage}% • Rerata {dlStats.dimensions.pengalaman.averageScore})</span>
                            </div>
                            <div className="p-1 bg-white border border-slate-200 rounded">
                              <span className="text-slate-500 block text-[7.5px]">3. Kerangka Pembelajaran</span>
                              <strong className="text-slate-900">{dlStats.dimensions.kerangka.totalScore}/{dlStats.dimensions.kerangka.maxScore}</strong>
                              <span className="text-emerald-700 block text-[7px]">({dlStats.dimensions.kerangka.percentage}% • Rerata {dlStats.dimensions.kerangka.averageScore})</span>
                            </div>
                            <div className="p-1 bg-emerald-50 border border-emerald-300 rounded">
                              <span className="text-emerald-800 font-bold block text-[7.5px]">Total Skor / Predikat</span>
                              <strong className="text-emerald-900 text-[10px]">{dlStats.overall.totalScore}/{dlStats.overall.maxScore} ({dlStats.overall.percentage}%)</strong>
                              <span className="text-emerald-800 font-extrabold block text-[7.5px]">Rerata {dlStats.overall.averageScore}/4.00 ({dlStats.overall.category})</span>
                            </div>
                          </div>
                        </div>

                        {/* CATATAN / SARAN / REKOMENDASI OBSERVER PEMBELAJARAN MENDALAM */}
                        <div style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }} className="p-2 rounded text-[8.5px]">
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Catatan, Saran &amp; Rekomendasi Observer (Pembelajaran Mendalam):
                          </span>
                          <p className="leading-relaxed text-slate-700 italic">
                            &quot;{dlRekomendasi}&quot;
                          </p>
                        </div>

                        {/* TANDA TANGAN 3 PIHAK LENGKAP */}
                        <div style={{ pageBreakInside: 'avoid', marginTop: '12px' }} className="signature-block border-t border-slate-300 pt-2.5">
                          <div className="grid grid-cols-3 gap-3 text-center text-[9px]" style={{ color: '#0f172a' }}>
                            {/* Pengawas Pembina */}
                            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2 bg-slate-50/60 min-h-[125px]">
                              <div>
                                <p className="m-0 text-[8.5px] text-slate-600 font-medium">Mengetahui,</p>
                                <p className="m-0 font-bold text-slate-900 leading-tight">Pengawas Pembina SD</p>
                                <p className="m-0 text-[8px] text-slate-500">Wilayah Binaan Kec. Tosari</p>
                              </div>
                              <div className="my-1.5 h-12 flex items-center justify-center">
                                {/* Ruang Tanda Tangan & Cap Dinas */}
                              </div>
                              <div>
                                <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.supervisorName}</p>
                                <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {settings.supervisorNip}</p>
                              </div>
                            </div>

                            {/* Kepala Sekolah / Observer */}
                            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2 bg-slate-50/60 min-h-[125px]">
                              <div>
                                <p className="m-0 text-[8.5px] text-slate-600 font-medium">Tosari, {obs.date}</p>
                                <p className="m-0 font-bold text-slate-900 leading-tight">{settings.principalTitle || 'Observer / Kepala Sekolah'}</p>
                                <p className="m-0 text-[8px] text-slate-500">{settings.schoolName}</p>
                              </div>
                              <div className="my-1.5 h-12 flex items-center justify-center">
                                {/* Ruang Tanda Tangan & Cap Sekolah */}
                              </div>
                              <div>
                                <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.principalName}</p>
                                <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {settings.principalNip}</p>
                              </div>
                            </div>

                            {/* Guru yang Diobservasi */}
                            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2 bg-slate-50/60 min-h-[125px]">
                              <div>
                                <p className="m-0 text-[8.5px] text-slate-600 font-medium">&nbsp;</p>
                                <p className="m-0 font-bold text-slate-900 leading-tight">Guru yang Diobservasi</p>
                                <p className="m-0 text-[8px] text-slate-500">{obs.subject} ({obs.classTarget})</p>
                              </div>
                              <div className="my-1.5 h-12 flex items-center justify-center">
                                {/* Ruang Tanda Tangan Guru */}
                              </div>
                              <div>
                                <p className="m-0 font-bold underline text-slate-900 leading-tight">{obs.teacherName}</p>
                                <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {obs.nip}</p>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-center text-[7px] italic text-slate-500">
                            * Instrumen Observasi Unsur Pembelajaran Mendalam (Deep Learning) ini disahkan resmi sebagai bagian integral evaluasi kinerja guru Kurikulum Merdeka di {settings.schoolName} Kab. Pasuruan.
                          </p>
                        </div>

                        {/* FOOTER LEMBAR 2 PEMBELAJARAN MENDALAM */}
                        <div className="pt-1.5 mt-2 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                          <span>Dokumen Pengesahan Resmi Pembelajaran Mendalam - {settings.schoolName}</span>
                          <span>{docFormat === 'all' ? 'Halaman 4 dari 4' : 'Halaman 2 dari 2'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* REKAPITULASI LAPORAN A4 */
              <div
                className="a4-page-sheet"
                style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a' }}
              >
                <div className="a4-content font-sans space-y-3.5" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                  {/* KOP SURAT RESMI */}
                  <div style={{ borderBottom: '3px double #000000', paddingBottom: '8px', marginBottom: '10px' }} className="flex items-center justify-between text-center">
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <img src={settings.logoLeft} alt="Logo Pemda" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 px-3">
                      <h3 className="m-0 text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: '#0f172a' }}>PEMERINTAH KABUPATEN PASURUAN</h3>
                      <h4 className="m-0 text-sm font-extrabold uppercase tracking-wide leading-tight" style={{ color: '#0f172a' }}>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
                      <h2 className="m-0 text-base font-black uppercase leading-tight" style={{ color: '#166534' }}>{settings.schoolName}</h2>
                      <p className="m-0 text-[9px] italic leading-tight" style={{ color: '#334155' }}>{settings.address}</p>
                      <p className="m-0 text-[8.5px] font-semibold" style={{ color: '#0f172a' }}>NPSN: {settings.npsn} | Kode Pos: 67177 | Wilayah Binaan: {settings.supervisorArea}</p>
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <img src={settings.logoRight} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>

                  {/* JUDUL */}
                  <div className="text-center space-y-0.5 mb-2">
                    <h3 className="text-sm font-bold uppercase underline tracking-wider" style={{ color: '#0f172a' }}>REKAPITULASI LAPORAN HASIL SUPERVISI AKADEMIK</h3>
                    <p className="text-[10px] font-medium" style={{ color: '#334155' }}>
                      Tahun Pelajaran {settings.schoolYear} - Semester {settings.semester}
                    </p>
                  </div>

                  {/* TABEL REKAP */}
                  <table className="w-full text-[9px] border-collapse" style={{ border: '1px solid #94a3b8', color: '#0f172a' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }} className="uppercase font-bold text-center">
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-6">No</th>
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 text-left">Nama Guru / NIP</th>
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 text-left">Mata Pelajaran &amp; Kelas</th>
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-20">Tgl Observasi</th>
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-12">Skor</th>
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 w-20">Predikat</th>
                        <th style={{ border: '1px solid #94a3b8' }} className="p-1 text-left">Rencana Tindak Lanjut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allObservations.map((o, idx) => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                          <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center font-bold">{idx + 1}</td>
                          <td style={{ border: '1px solid #cbd5e1' }} className="p-1">
                            <p className="font-bold leading-tight" style={{ color: '#0f172a' }}>{o.teacherName}</p>
                            <p className="font-mono text-[8px] leading-tight" style={{ color: '#64748b' }}>NIP: {o.nip}</p>
                          </td>
                          <td style={{ border: '1px solid #cbd5e1' }} className="p-1">{o.subject} ({o.classTarget})</td>
                          <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center">{o.date}</td>
                          <td style={{ border: '1px solid #cbd5e1', color: '#166534' }} className="p-1 text-center font-extrabold">{o.score}</td>
                          <td style={{ border: '1px solid #cbd5e1' }} className="p-1 text-center font-semibold">{o.category}</td>
                          <td style={{ border: '1px solid #cbd5e1', color: '#334155' }} className="p-1 text-[8px] italic">
                            {o.pasca?.will ||
                              (o.followups?.length
                                ? `${o.followups[0].program} (${o.followups[0].focus})`
                                : `Kombel ${settings.schoolName}`)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* TANDA TANGAN 3 PIHAK LENGKAP */}
                  <div style={{ pageBreakInside: 'avoid', marginTop: '16px' }} className="signature-block border-t border-slate-300 pt-3">
                    <div className="grid grid-cols-3 gap-3 text-center text-[9px]" style={{ color: '#0f172a' }}>
                      {/* Pengawas Pembina */}
                      <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2.5 bg-slate-50/60 min-h-[135px]">
                        <div>
                          <p className="m-0 text-[8.5px] text-slate-600 font-medium">Mengetahui,</p>
                          <p className="m-0 font-bold text-slate-900 leading-tight">Pengawas Pembina SD</p>
                          <p className="m-0 text-[8px] text-slate-500">Wilayah Binaan Kec. Tosari</p>
                        </div>
                        <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                          {/* Ruang Tanda Tangan & Cap Dinas */}
                        </div>
                        <div>
                          <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.supervisorName}</p>
                          <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {settings.supervisorNip}</p>
                        </div>
                      </div>

                      {/* Kepala Sekolah */}
                      <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2.5 bg-slate-50/60 min-h-[135px]">
                        <div>
                          <p className="m-0 text-[8.5px] text-slate-600 font-medium">
                            Tosari, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="m-0 font-bold text-slate-900 leading-tight">{settings.principalTitle || 'Kepala Sekolah / Observer'}</p>
                          <p className="m-0 text-[8px] text-slate-500">{settings.schoolName}</p>
                        </div>
                        <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                          {/* Ruang Tanda Tangan & Cap Sekolah */}
                        </div>
                        <div>
                          <p className="m-0 font-bold underline text-slate-900 leading-tight">{settings.principalName}</p>
                          <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {settings.principalNip}</p>
                        </div>
                      </div>

                      {/* Perwakilan Guru */}
                      <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-2.5 bg-slate-50/60 min-h-[135px]">
                        <div>
                          <p className="m-0 text-[8.5px] text-slate-600 font-medium">&nbsp;</p>
                          <p className="m-0 font-bold text-slate-900 leading-tight">Perwakilan Guru</p>
                          <p className="m-0 text-[8px] text-slate-500">{settings.schoolName}</p>
                        </div>
                        <div className="my-2 h-14 sm:h-16 flex items-center justify-center">
                          {/* Ruang Tanda Tangan Guru */}
                        </div>
                        <div>
                          <p className="m-0 font-bold underline text-slate-900 leading-tight">{allObservations[0]?.teacherName || 'Siti Rahma, S.Pd'}</p>
                          <p className="m-0 text-[8px] text-slate-600 font-mono">NIP. {allObservations[0]?.nip || '199005152015022001'}</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2.5 text-center text-[7.5px] italic text-slate-500">
                      * Laporan rekapitulasi supervisi akademik semester ini disahkan untuk arsip evaluasi kinerja guru dan pembinaan pengawas sekolah.
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="pt-2 mt-4 border-t border-slate-200 flex justify-between items-center text-[7.5px] text-slate-400">
                    <span>SIGUR SD - Rekapitulasi Supervisi Akademik {settings.schoolName}</span>
                    <span>Tahun Ajaran {settings.schoolYear} - Semester {settings.semester}</span>
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
