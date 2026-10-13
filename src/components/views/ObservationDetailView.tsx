import React, { useState } from 'react';
import { ObservationData, FollowUpItem, TeacherAdminAudit, SchoolSettings, AdminDocStatus } from '../../types';
import { EVALUATION_RUBRIC, RUBRIC_SCORE_LABELS } from '../../data/rubrics';
import { 
  DEEP_LEARNING_DIMENSIONS, 
  calculateDeepLearningStats,
  DEFAULT_DEEP_LEARNING_SCORES,
  DEFAULT_DEEP_LEARNING_NOTES,
  DEEP_LEARNING_SCALE_DESCRIPTIONS,
  parseDlScore,
  ALL_DEEP_LEARNING_ITEMS
} from '../../data/deepLearningData';
import { findAuditForTeacher, calculateAuditScore } from '../../data/adminDocsData';
import { INITIAL_SETTINGS } from '../../data/initialData';
import { ModulAjarUploader } from '../ModulAjarUploader';
import { 
  ArrowLeft, 
  FileDown, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Calculator, 
  Target, 
  Compass, 
  Lightbulb, 
  Sparkles,
  Timer,
  RotateCw,
  HardDrive,
  FileCheck2,
  ArrowRight,
  BookOpen,
  Award,
  Check,
  X,
  FileText,
  Printer
} from 'lucide-react';
import { DeepLearningReferenceModal } from '../modals/DeepLearningReferenceModal';
import { AdminDocAuditModal } from '../modals/AdminDocAuditModal';

interface ObservationDetailViewProps {
  observation: ObservationData;
  settings?: SchoolSettings;
  adminAudits?: TeacherAdminAudit[];
  onUpdateAdminAudit?: (updated: TeacherAdminAudit) => void;
  isDriveConnected: boolean;
  onConnectDrive: () => void;
  onBack: () => void;
  onUpdateObservation: (updated: ObservationData) => void;
  onOpenPrintPreview: (format?: 'all' | 'pmm' | 'deep-learning') => void;
  onOpenFollowUpModal: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onConfirmDelete: (title: string, desc: string, action: () => void) => void;
  onNavigateToAdminDocs?: (teacherId?: string) => void;
}

export const ObservationDetailView: React.FC<ObservationDetailViewProps> = ({
  observation,
  settings = INITIAL_SETTINGS,
  adminAudits = [],
  onUpdateAdminAudit,
  isDriveConnected,
  onConnectDrive,
  onBack,
  onUpdateObservation,
  onOpenPrintPreview,
  onOpenFollowUpModal,
  onShowToast,
  onConfirmDelete,
  onNavigateToAdminDocs
}) => {
  const [activeTab, setActiveTab] = useState<'pra' | 'pelaksanaan' | 'pasca' | 'tindaklanjut'>('pra');
  const [isDlRefModalOpen, setIsDlRefModalOpen] = useState(false);
  const [isAdminAuditModalOpen, setIsAdminAuditModalOpen] = useState(false);

  // Administrative Document Audit state & sync
  const currentAudit = findAuditForTeacher(observation, adminAudits);
  const auditPercentage = currentAudit ? currentAudit.percentage : 0;
  const auditPredicate = currentAudit ? currentAudit.predicate : 'Belum Ada';
  const lengkapCount = currentAudit ? currentAudit.items.filter(i => i.status === 'lengkap').length : 0;
  const kurangCount = currentAudit ? currentAudit.items.filter(i => i.status === 'kurang').length : 0;
  const tidakAdaCount = currentAudit ? currentAudit.items.filter(i => i.status === 'tidak_ada').length : 0;

  const handleQuickStatusChange = (itemId: string, newStatus: AdminDocStatus) => {
    if (!currentAudit || !onUpdateAdminAudit) return;
    const newItems = currentAudit.items.map(item => {
      if (item.id === itemId) {
        const score = newStatus === 'lengkap' ? 2 : newStatus === 'kurang' ? 1 : 0;
        return {
          ...item,
          status: newStatus,
          score,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    const { totalScore, maxScore, percentage, predicate } = calculateAuditScore(newItems);
    const updated: TeacherAdminAudit = {
      ...currentAudit,
      items: newItems,
      totalScore,
      maxScore,
      percentage,
      predicate
    };
    onUpdateAdminAudit(updated);
    onShowToast(
      `Status dokumen diperbarui: ${newStatus === 'lengkap' ? 'Lengkap' : newStatus === 'kurang' ? 'Kurang Lengkap' : 'Belum Ada'}`,
      'info'
    );
  };

  // Local state for Pra
  const [praMateri, setPraMateri] = useState(observation.pra?.materi || '');
  const [praWaktu, setPraWaktu] = useState(observation.pra?.waktu || '2 JP (2 x 35 Menit)');
  const [praGoal1, setPraGoal1] = useState(observation.pra?.goal1 || '');
  const [praGoal2, setPraGoal2] = useState(observation.pra?.goal2 || '');
  const [praReality, setPraReality] = useState(observation.pra?.reality || '');
  const [praOptions, setPraOptions] = useState(observation.pra?.options || '');
  const [praWill, setPraWill] = useState(observation.pra?.will || '');

  // Local state for Pelaksanaan (Rubric scoring & Evidence)
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    EVALUATION_RUBRIC.forEach(cat => {
      cat.items.forEach(it => {
        initial[it.id] = observation.scores?.[it.id] ?? 3;
      });
    });
    return initial;
  });

  const [evidence, setEvidence] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    EVALUATION_RUBRIC.forEach(cat => {
      cat.items.forEach(it => {
        initial[it.id] = observation.evidence?.[it.id] || '';
      });
    });
    return initial;
  });

  const [timelineNotes, setTimelineNotes] = useState(observation.timelineNotes || []);
  const [kekuatan, setKekuatan] = useState(observation.kekuatan || '');
  const [rekomendasi, setRekomendasi] = useState(observation.rekomendasi || '');

  // Local state for Deep Learning Observation (33 Indikator Resmi Rentang 1-4)
  const [dlScores, setDlScores] = useState<Record<string, number>>(() => {
    if (observation.deepLearning?.scores) {
      const converted: Record<string, number> = {};
      Object.entries(observation.deepLearning.scores).forEach(([k, v]) => {
        converted[k] = parseDlScore(v);
      });
      return converted;
    }
    return { ...DEFAULT_DEEP_LEARNING_SCORES };
  });

  const [dlNotes, setDlNotes] = useState<Record<string, string>>(() => {
    return observation.deepLearning?.notes || DEFAULT_DEEP_LEARNING_NOTES;
  });

  const [dlRekomendasi, setDlRekomendasi] = useState<string>(() => {
    return observation.deepLearning?.rekomendasiObserver || '';
  });

  // Mode Instrumen Pelaksanaan: 'deep-learning' (default) | 'grow-rubric'
  const [rubricViewMode, setRubricViewMode] = useState<'deep-learning' | 'grow-rubric'>('deep-learning');

  // Filter Dimensi Deep Learning: 'all' | 'prinsip' | 'pengalaman' | 'kerangka'
  const [activeDlDimension, setActiveDlDimension] = useState<'all' | 'prinsip' | 'pengalaman' | 'kerangka'>('all');

  const dlStats = calculateDeepLearningStats(dlScores);

  const handleDlScoreChange = (id: string, value: number) => {
    setDlScores(prev => ({ ...prev, [id]: value }));
  };

  const handleDlNoteChange = (id: string, text: string) => {
    setDlNotes(prev => ({ ...prev, [id]: text }));
  };

  const handleSetAllDlScore = (score: number, dimensionId?: 'prinsip' | 'pengalaman' | 'kerangka') => {
    setDlScores(prev => {
      const updated = { ...prev };
      if (!dimensionId) {
        ALL_DEEP_LEARNING_ITEMS.forEach(it => {
          updated[it.id] = score;
        });
      } else {
        const dim = DEEP_LEARNING_DIMENSIONS.find(d => d.id === dimensionId);
        if (dim) {
          dim.subAspects.flatMap(s => s.items).forEach(it => {
            updated[it.id] = score;
          });
        }
      }
      return updated;
    });
  };

  // Local state for Pasca
  const [pascaRefleksi, setPascaRefleksi] = useState(observation.pasca?.refleksiGuru || '');
  const [pascaOptions, setPascaOptions] = useState(observation.pasca?.options || '');
  const [pascaWill, setPascaWill] = useState(observation.pasca?.will || '');
  const [pascaFeedback, setPascaFeedback] = useState(observation.pasca?.feedbackKs || '');

  // Calculate live score for GROW Rubric
  const totalScorePoints = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const totalItems = Object.keys(scores).length || 11;
  const maxPossible = totalItems * 4;
  const calculatedPercentage = Math.round((totalScorePoints / maxPossible) * 100);

  let calculatedCategory: any = 'Perlu Pembinaan';
  if (calculatedPercentage >= 90) calculatedCategory = 'Sangat Baik';
  else if (calculatedPercentage >= 80) calculatedCategory = 'Baik';
  else if (calculatedPercentage >= 70) calculatedCategory = 'Cukup';

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const handleSetAllGrowScore = (val: number) => {
    setScores(prev => {
      const updated = { ...prev };
      EVALUATION_RUBRIC.forEach(cat => {
        cat.items.forEach(it => {
          updated[it.id] = val;
        });
      });
      return updated;
    });
  };

  const handleEvidenceChange = (id: string, text: string) => {
    setEvidence(prev => ({ ...prev, [id]: text }));
  };

  const addTimelineItem = () => {
    setTimelineNotes(prev => [
      ...prev,
      { id: 'TL-' + Date.now(), time: '08:00', event: '' }
    ]);
  };

  const removeTimelineItem = (id: string) => {
    setTimelineNotes(prev => prev.filter(t => t.id !== id));
  };

  const updateTimelineItem = (id: string, field: 'time' | 'event', val: string) => {
    setTimelineNotes(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  // Save Pra Observasi
  const handleSavePra = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ObservationData = {
      ...observation,
      status: observation.status === 'Pra Observasi' ? 'Observasi' : observation.status,
      pra: {
        materi: praMateri,
        waktu: praWaktu,
        goal1: praGoal1,
        goal2: praGoal2,
        reality: praReality,
        options: praOptions,
        will: praWill
      }
    };
    onUpdateObservation(updated);
    setActiveTab('pelaksanaan');
  };

  // Save Pelaksanaan Observasi
  const handleSavePelaksanaan = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = rubricViewMode === 'deep-learning' ? dlStats.overall.percentage : calculatedPercentage;
    const finalCategory = rubricViewMode === 'deep-learning' ? dlStats.overall.category : calculatedCategory;

    const updated: ObservationData = {
      ...observation,
      score: finalScore,
      category: finalCategory,
      scores,
      evidence,
      deepLearning: {
        scores: dlScores,
        notes: dlNotes,
        rekomendasiObserver: dlRekomendasi
      },
      timelineNotes,
      kekuatan,
      rekomendasi: dlRekomendasi || rekomendasi,
      status: (observation.status === 'Pra Observasi' || observation.status === 'Observasi')
        ? 'Pasca Observasi'
        : observation.status
    };
    onUpdateObservation(updated);
    onShowToast('Hasil observasi kinerja berhasil disimpan!', 'success');
    setActiveTab('pasca');
  };

  // Save Pasca Observasi
  const handleSavePasca = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ObservationData = {
      ...observation,
      pasca: {
        refleksiGuru: pascaRefleksi,
        options: pascaOptions,
        will: pascaWill,
        feedbackKs: pascaFeedback
      },
      status: 'Selesai'
    };
    onUpdateObservation(updated);
    setActiveTab('tindaklanjut');
  };

  // Toggle status of a follow-up item
  const toggleFollowUpStatus = (itemId: string) => {
    const list = [...(observation.followups || [])];
    const item = list.find(f => f.id === itemId);
    if (!item) return;

    const order: FollowUpItem['status'][] = ['Direncanakan', 'Proses', 'Selesai'];
    const nextIdx = (order.indexOf(item.status) + 1) % order.length;
    item.status = order[nextIdx];

    onUpdateObservation({
      ...observation,
      followups: list
    });
  };

  const removeFollowUp = (itemId: string) => {
    const list = (observation.followups || []).filter(f => f.id !== itemId);
    onUpdateObservation({
      ...observation,
      followups: list
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center space-x-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Observasi</span>
      </button>

      {/* Stepper Header Box */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3.5 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {observation.id}
              </span>
              <span className="text-xs text-slate-500 font-medium">Tanggal: {observation.date}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {observation.teacherName}
            </h3>
            <p className="text-xs text-slate-500">
              {observation.classTarget} • {observation.subject} • NIP: {observation.nip}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
            {observation.modulAjar && (
              <span className="px-2.5 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl font-bold text-xs flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-sky-600" />
                <span>Modul Ajar PDF: {observation.modulAjar.driveFileId ? 'Drive' : 'Lokal'}</span>
              </span>
            )}
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs">
              Skor PMM: {observation.score > 0 ? `${observation.score} / 100` : 'Belum Dinilai'} ({observation.category})
            </span>
            <span className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>DL: {dlStats.overall.percentage}% ({dlStats.overall.category})</span>
            </span>
            <button
              onClick={() => setIsDlRefModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
              title="Buka Lembar Panduan & Referensi Pembelajaran Mendalam"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Referensi DL</span>
            </button>
            <button
              onClick={() => onOpenPrintPreview(rubricViewMode === 'deep-learning' ? 'deep-learning' : 'all')}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Cetak Lembar A4</span>
            </button>
          </div>
        </div>

        {/* 4 GROW Step Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('pra')}
            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
              activeTab === 'pra'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/40 text-emerald-900 font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>TAHAP 1 (G)</span>
            </span>
            <span className="text-xs font-semibold mt-0.5">Pra Observasi</span>
          </button>

          <button
            onClick={() => setActiveTab('pelaksanaan')}
            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
              activeTab === 'pelaksanaan'
                ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/40 text-sky-900 font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-sky-600 flex items-center space-x-1">
              <Compass className="w-3 h-3" />
              <span>TAHAP 2 (R)</span>
            </span>
            <span className="text-xs font-semibold mt-0.5">Pelaksanaan Kelas</span>
          </button>

          <button
            onClick={() => setActiveTab('pasca')}
            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
              activeTab === 'pasca'
                ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/40 text-amber-900 font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-600 flex items-center space-x-1">
              <Lightbulb className="w-3 h-3" />
              <span>TAHAP 3 (O)</span>
            </span>
            <span className="text-xs font-semibold mt-0.5">Pasca &amp; Coaching</span>
          </button>

          <button
            onClick={() => setActiveTab('tindaklanjut')}
            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
              activeTab === 'tindaklanjut'
                ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-400/40 text-purple-900 font-bold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-purple-600 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>TAHAP 4 (W)</span>
            </span>
            <span className="text-xs font-semibold mt-0.5">Tindak Lanjut</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PRA OBSERVASI (GOAL) */}
      {activeTab === 'pra' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Formulir Pra Observasi (G - GOAL &amp; PERSIAPAN KELAS)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Dialog persiapan kemitraan antara Guru dan Kepala Sekolah/Observer sebelum observasi di kelas.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-semibold text-xs">
              Fokus Tujuan
            </span>
          </div>

          <form onSubmit={handleSavePra} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Materi / Topik Pembelajaran</label>
                <input
                  type="text"
                  value={praMateri}
                  onChange={(e) => setPraMateri(e.target.value)}
                  placeholder="Contoh: Rantai Makanan pada Ekosistem Pertanian Lokal Tosari"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu Pembelajaran</label>
                <input
                  type="text"
                  value={praWaktu}
                  onChange={(e) => setPraWaktu(e.target.value)}
                  placeholder="Contoh: 2 JP (2 x 35 Menit)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
              <h5 className="font-bold text-emerald-950 flex items-center">
                <Target className="w-4 h-4 mr-1.5 text-emerald-600" />
                <span>G - GOAL (Tujuan Pembelajaran &amp; Sasaran Guru)</span>
              </h5>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  1. Apa tujuan pembelajaran utama yang ingin dicapai oleh siswa hari ini?
                </label>
                <textarea
                  rows={2}
                  value={praGoal1}
                  onChange={(e) => setPraGoal1(e.target.value)}
                  placeholder="Siswa mampu menganalisis peran produsen, konsumen, dan pengurai dalam ekosistem..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  2. Area kompetensi pedagogik guru yang ingin secara khusus dikembangkan?
                </label>
                <textarea
                  rows={2}
                  value={praGoal2}
                  onChange={(e) => setPraGoal2(e.target.value)}
                  placeholder="Penerapan diferensiasi konten & proses berdasarkan kesiapan belajar siswa..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200/80 space-y-3">
              <h5 className="font-bold text-sky-950 flex items-center">
                <Compass className="w-4 h-4 mr-1.5 text-sky-600" />
                <span>R - REALITY (Kondisi Awal Kelas &amp; Kesiapan Murid)</span>
              </h5>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Bagaimana kesiapan belajar murid dan tantangan apa yang dihadapi guru saat ini?
                </label>
                <textarea
                  rows={2}
                  value={praReality}
                  onChange={(e) => setPraReality(e.target.value)}
                  placeholder="Beberapa murid kinestetik cenderung mudah kehilangan fokus jika diskusi terlalu lama..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
              <h5 className="font-bold text-amber-950 flex items-center">
                <Lightbulb className="w-4 h-4 mr-1.5 text-amber-600" />
                <span>O - OPTIONS (Strategi &amp; Media Konkret yang Dipersiapkan)</span>
              </h5>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Strategi pembelajaran, metode, dan media konkret apa yang akan digunakan?
                </label>
                <textarea
                  rows={2}
                  value={praOptions}
                  onChange={(e) => setPraOptions(e.target.value)}
                  placeholder="Simulasi peran rantai makanan, media kartu konkret, dan LKPD bertingkat..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-3">
              <h5 className="font-bold text-purple-950 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-purple-600" />
                <span>W - WILL (Fokus Pengamatan Observer)</span>
              </h5>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Bagian mana yang secara khusus dimohon diamati oleh observer di ruang kelas?
                </label>
                <textarea
                  rows={2}
                  value={praWill}
                  onChange={(e) => setPraWill(e.target.value)}
                  placeholder="Mohon perhatikan bagaimana respon siswa kelompok mandiri saat proses diskusi..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* UPLOAD MODUL AJAR (PDF) - TERHUBUNG GOOGLE DRIVE */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <h5 className="font-bold text-slate-900 text-xs">
                    Dokumen Modul Ajar / RPP Guru (Format PDF - Google Drive)
                  </h5>
                </div>
                <span className="text-[10px] text-slate-500">
                  Wajib ditelaah pada tahap Pra-Observasi
                </span>
              </div>

              <ModulAjarUploader
                modulAjar={observation.modulAjar}
                teacherName={observation.teacherName}
                subject={observation.subject}
                classTarget={observation.classTarget}
                isDriveConnected={isDriveConnected}
                onConnectDrive={onConnectDrive}
                onModulAjarChange={(modul) => onUpdateObservation({ ...observation, modulAjar: modul })}
                onShowToast={onShowToast}
                onConfirmDelete={onConfirmDelete}
              />
            </div>

            {/* DOKUMEN PENDUKUNG ADMINISTRASI GURU (KURIKULUM MERDEKA SD) */}
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/80 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200/60 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h5 className="font-bold text-slate-900 text-sm">
                        Kelengkapan Dokumen Administrasi Guru
                      </h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                        <span>Tersinkron Otomatis</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      14 Standar Dokumen Perangkat &amp; Administrasi Kurikulum Merdeka SD (Terhubung dengan Supervisi)
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsAdminAuditModalOpen(true)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Audit Lengkap &amp; Cetak</span>
                  </button>
                  {onNavigateToAdminDocs && (
                    <button
                      type="button"
                      onClick={() => onNavigateToAdminDocs(currentAudit?.teacherId || observation.teacherId)}
                      className="px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Matriks Sekolah</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Summary Stats Row */}
              {currentAudit ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Ketercapaian</p>
                      <p className="font-black text-slate-800 text-sm">{auditPercentage}%</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      auditPercentage >= 86 ? 'bg-emerald-100 text-emerald-800' :
                      auditPercentage >= 71 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {auditPredicate}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Dokumen Lengkap</p>
                      <p className="font-black text-emerald-700 text-sm">{lengkapCount} <span className="text-[10px] text-slate-400 font-normal">/ 14</span></p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Kurang Lengkap</p>
                      <p className="font-black text-amber-600 text-sm">{kurangCount} <span className="text-[10px] text-slate-400 font-normal">berkas</span></p>
                    </div>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Belum Ada</p>
                      <p className="font-black text-rose-600 text-sm">{tidakAdaCount} <span className="text-[10px] text-slate-400 font-normal">berkas</span></p>
                    </div>
                    <XCircle className="w-4 h-4 text-rose-500" />
                  </div>
                </div>
              ) : null}

              {/* 14 Documents Interactive Checklist */}
              {currentAudit ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  {currentAudit.items.map((item) => {
                    const isModulAjarSync = item.id === 'doc-05' && Boolean(observation.modulAjar);

                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 bg-white rounded-xl border transition ${
                          item.status === 'lengkap'
                            ? 'border-emerald-200/90 shadow-2xs'
                            : item.status === 'kurang'
                            ? 'border-amber-200/90 shadow-2xs'
                            : 'border-slate-200'
                        } flex flex-col justify-between space-y-2`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 text-xs">
                                {item.no}. {item.name}
                              </span>
                              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                {item.category}
                              </span>
                            </div>
                            {isModulAjarSync && (
                              <p className="text-[10px] text-teal-700 font-medium mt-0.5 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                <span>Tersinkron dengan berkas Modul Ajar di atas</span>
                              </p>
                            )}
                          </div>

                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            item.status === 'lengkap'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : item.status === 'kurang'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {item.status === 'lengkap' ? '✓ Lengkap' : item.status === 'kurang' ? '▲ Kurang' : '✕ Belum Ada'}
                          </span>
                        </div>

                        {/* Interactive toggle buttons */}
                        <div className="flex items-center space-x-1 pt-1 border-t border-slate-100">
                          <span className="text-[9.5px] text-slate-400 mr-1">Status:</span>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(item.id, 'lengkap')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                              item.status === 'lengkap'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                            }`}
                          >
                            ✓ Lengkap
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(item.id, 'kurang')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                              item.status === 'kurang'
                                ? 'bg-amber-500 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700'
                            }`}
                          >
                            ▲ Kurang
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(item.id, 'tidak_ada')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                              item.status === 'tidak_ada'
                                ? 'bg-rose-500 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
                            }`}
                          >
                            ✕ Belum Ada
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl text-center space-y-2 border border-teal-100">
                  <p className="text-xs text-slate-600">
                    Data instrumen administrasi guru ini belum diinisialisasi.
                  </p>
                  {onNavigateToAdminDocs && (
                    <button
                      type="button"
                      onClick={() => onNavigateToAdminDocs(observation.teacherId)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                    >
                      Buka Kelengkapan Administrasi
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pra Observasi &amp; Lanjut Observasi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 2: PELAKSANAAN OBSERVASI (PEMBELAJARAN MENDALAM & RUBRIK PMM) */}
      {activeTab === 'pelaksanaan' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
          
          {/* MODE TOGGLE: Pembelajaran Mendalam (Deep Learning) vs Rubrik GROW PMM */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-3.5 rounded-2xl text-white shadow-sm border border-slate-700/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
                <BookOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold text-[10px] uppercase tracking-wider border border-emerald-500/30">
                    R - REALITY
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    Instrumen Observasi Kinerja Guru
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Tersedia format Pembelajaran Mendalam (Deep Learning) 33 Indikator &amp; Rubrik GROW PMM.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-700/80 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setRubricViewMode('deep-learning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  rubricViewMode === 'deep-learning'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pembelajaran Mendalam (Deep Learning)</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black">
                  33
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRubricViewMode('grow-rubric')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  rubricViewMode === 'grow-rubric'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Rubrik GROW (11 Butir)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSavePelaksanaan} className="space-y-6 text-xs">
            {/* VIEW MODE 1: PEMBELAJARAN MENDALAM (DEEP LEARNING) */}
            {rubricViewMode === 'deep-learning' ? (
              <div className="space-y-5">
                {/* Ringkasan Skor Pembelajaran Mendalam */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">Total Deep Learning (1-4)</span>
                      <p className="text-base font-black text-emerald-900 mt-0.5">
                        {dlStats.overall.percentage}% ({dlStats.overall.totalScore}/{dlStats.overall.maxScore} Poin)
                      </p>
                      <p className="text-[10.5px] text-emerald-700 font-semibold mt-0.5">
                        Rata-rata: {dlStats.overall.averageScore} / 4.00
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${dlStats.overall.badgeColor}`}>
                      {dlStats.overall.category}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">1. Prinsip Pembelajaran</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <div>
                        <span className="text-sm font-extrabold text-slate-900">
                          {dlStats.dimensions.prinsip.percentage}% ({dlStats.dimensions.prinsip.totalScore}/{dlStats.dimensions.prinsip.maxScore})
                        </span>
                        <p className="text-[10px] text-slate-500">Rerata: {dlStats.dimensions.prinsip.averageScore}/4.00</p>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${dlStats.dimensions.prinsip.badgeColor}`}>
                        {dlStats.dimensions.prinsip.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">2. Pengalaman Belajar</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <div>
                        <span className="text-sm font-extrabold text-slate-900">
                          {dlStats.dimensions.pengalaman.percentage}% ({dlStats.dimensions.pengalaman.totalScore}/{dlStats.dimensions.pengalaman.maxScore})
                        </span>
                        <p className="text-[10px] text-slate-500">Rerata: {dlStats.dimensions.pengalaman.averageScore}/4.00</p>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${dlStats.dimensions.pengalaman.badgeColor}`}>
                        {dlStats.dimensions.pengalaman.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">3. Kerangka Pembelajaran</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <div>
                        <span className="text-sm font-extrabold text-slate-900">
                          {dlStats.dimensions.kerangka.percentage}% ({dlStats.dimensions.kerangka.totalScore}/{dlStats.dimensions.kerangka.maxScore})
                        </span>
                        <p className="text-[10px] text-slate-500">Rerata: {dlStats.dimensions.kerangka.averageScore}/4.00</p>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${dlStats.dimensions.kerangka.badgeColor}`}>
                        {dlStats.dimensions.kerangka.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-toolbar: Filter Dimensi & Aksi Cepat */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-100 rounded-xl">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-600 mr-1 hidden sm:inline">Pilih Dimensi:</span>
                    <button
                      type="button"
                      onClick={() => setActiveDlDimension('all')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                        activeDlDimension === 'all'
                          ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua (33)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDlDimension('prinsip')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                        activeDlDimension === 'prinsip'
                          ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      1. Prinsip (9)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDlDimension('pengalaman')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                        activeDlDimension === 'pengalaman'
                          ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      2. Pengalaman (14)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDlDimension('kerangka')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
                        activeDlDimension === 'kerangka'
                          ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      3. Kerangka (10)
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setIsDlRefModalOpen(true)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                      title="Lihat Lembar Referensi Indikator Pembelajaran Mendalam"
                    >
                      <BookOpen className="w-3 h-3 text-amber-700" />
                      <span>Lembar Referensi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenPrintPreview('deep-learning')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                      title="Cetak khusus Lembar Instrumen Pembelajaran Mendalam (A4)"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Cetak Lembar DL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllDlScore(4, activeDlDimension === 'all' ? undefined : activeDlDimension)}
                      className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                      title="Set semua butir pada dimensi ini menjadi Skor 4 (Sangat Efektif)"
                    >
                      <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                      <span>Set Semua 4</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllDlScore(3, activeDlDimension === 'all' ? undefined : activeDlDimension)}
                      className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                      title="Set semua butir pada dimensi ini menjadi Skor 3 (Efektif)"
                    >
                      <span>Set Semua 3</span>
                    </button>
                  </div>
                </div>

                {/* Deep Learning Dimension Sections */}
                <div className="space-y-6">
                  {DEEP_LEARNING_DIMENSIONS
                    .filter(dim => activeDlDimension === 'all' || activeDlDimension === dim.id)
                    .map((dim) => (
                      <div key={dim.id} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                          <div>
                            <h5 className="font-extrabold text-slate-900 text-sm">
                              {dim.title}
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              Berdasarkan hasil pengamatan di kelas, tentukan skor rentang 1 - 4 (1: Belum Dilakukan, 2: Cukup, 3: Efektif, 4: Sangat Efektif).
                            </p>
                          </div>
                          <div className="text-right flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-700">
                              Skor: {dlStats.dimensions[dim.id]?.totalScore}/{dlStats.dimensions[dim.id]?.maxScore} ({dlStats.dimensions[dim.id]?.percentage}%)
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${dlStats.dimensions[dim.id]?.badgeColor}`}>
                              {dlStats.dimensions[dim.id]?.category}
                            </span>
                          </div>
                        </div>

                        {/* Subaspects */}
                        <div className="space-y-4">
                          {dim.subAspects.map((sub, sIdx) => (
                            <div key={sIdx} className="space-y-2">
                              <h6 className="font-bold text-slate-800 text-xs px-2 py-1 bg-slate-200/70 rounded-md inline-block">
                                {sub.name}
                              </h6>

                              <div className="space-y-2.5">
                                {sub.items.map((item) => {
                                  const currentScore = parseDlScore(dlScores[item.id]);

                                  return (
                                    <div
                                      key={item.id}
                                      className="p-3 rounded-xl border bg-white border-slate-200 shadow-2xs hover:border-emerald-300 transition space-y-2.5"
                                    >
                                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                        <div className="flex items-start flex-1">
                                          <span className="font-bold text-emerald-800 mr-2.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] flex-shrink-0 mt-0.5">
                                            No. {item.no}
                                          </span>
                                          <div>
                                            <p className="font-semibold text-slate-900 text-xs leading-relaxed">
                                              {item.desc}
                                            </p>
                                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                                              <span className="text-slate-400">
                                                Aspek: {item.aspect}
                                              </span>
                                              <span>•</span>
                                              <span className={`px-2 py-0.5 rounded font-bold border ${DEEP_LEARNING_SCALE_DESCRIPTIONS[currentScore]?.badge}`}>
                                                {DEEP_LEARNING_SCALE_DESCRIPTIONS[currentScore]?.label}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Rentang Penilaian Skor 1 - 4 */}
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0 self-end md:self-start">
                                          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                            {[1, 2, 3, 4].map((s) => {
                                              const isSelected = currentScore === s;
                                              const desc = DEEP_LEARNING_SCALE_DESCRIPTIONS[s];
                                              return (
                                                <button
                                                  key={s}
                                                  type="button"
                                                  onClick={() => handleDlScoreChange(item.id, s)}
                                                  title={`${desc.label}: ${desc.description}`}
                                                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center space-x-1 cursor-pointer ${
                                                    isSelected
                                                      ? desc.bgActive
                                                      : 'bg-white text-slate-700 hover:bg-slate-200 shadow-2xs'
                                                  }`}
                                                >
                                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                  <span>{s}</span>
                                                  <span className="hidden lg:inline text-[9.5px] font-bold">
                                                    {s === 4 ? 'Sangat Efektif' : s === 3 ? 'Efektif' : s === 2 ? 'Cukup' : 'Kurang'}
                                                  </span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Note / evidence input */}
                                      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                                        <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">
                                          Keterangan / Catatan:
                                        </span>
                                        <input
                                          type="text"
                                          value={dlNotes[item.id] || ''}
                                          onChange={(e) => handleDlNoteChange(item.id, e.target.value)}
                                          placeholder="Catatan fakta atau observasi spesifik guru/murid di kelas..."
                                          className="flex-1 text-[11px] p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Bagian C: Catatan/Saran/Rekomendasi Observer */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800 text-xs">
                    C. Catatan / Saran / Rekomendasi Observer (Pembelajaran Mendalam)
                  </label>
                  <textarea
                    rows={3}
                    value={dlRekomendasi}
                    onChange={(e) => setDlRekomendasi(e.target.value)}
                    placeholder="Tuliskan catatan, saran pengembangan, dan rekomendasi tindak lanjut bagi guru sesuai hasil observasi pembelajaran mendalam..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            ) : (
              /* VIEW MODE 2: RUBRIK GROW (11 BUTIR PMM) */
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Rubrik Observasi GROW (Pengelolaan Kinerja PMM)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rentang Skor 1 - 4: 1 (Belum Dilakukan/Kurang) | 2 (Cukup/Belum Efektif) | 3 (Dilakukan &amp; Efektif/Baik) | 4 (Sangat Efektif/Membudaya)
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetAllGrowScore(4)}
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                        title="Set semua butir indikator menjadi Skor 4 (Sangat Efektif)"
                      >
                        <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                        <span>Set Semua 4</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetAllGrowScore(3)}
                        className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                        title="Set semua butir indikator menjadi Skor 3 (Efektif)"
                      >
                        <span>Set Semua 3</span>
                      </button>
                    </div>
                    <div className="text-right sm:border-l sm:pl-3 border-slate-200 flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="text-base font-extrabold text-emerald-700 font-mono">
                        Skor: {calculatedPercentage} / 100 ({totalScorePoints}/{maxPossible})
                      </span>
                      <p className="text-[11px] text-slate-600 font-bold">
                        Kategori: <span className="text-emerald-700">{calculatedCategory}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rubric Categories */}
                <div className="space-y-6">
                  {EVALUATION_RUBRIC.map((category) => (
                    <div
                      key={category.category}
                      className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <h5 className="font-extrabold text-slate-800 text-xs tracking-wide">
                          {category.category}
                        </h5>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {category.phase}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {category.items.map((item) => {
                          const currentScore = scores[item.id] || 3;
                          const scoreInfo = RUBRIC_SCORE_LABELS[currentScore];

                          return (
                            <div
                              key={item.id}
                              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <label className="font-semibold text-slate-800 text-xs flex items-start flex-1 leading-snug">
                                  <span className="font-bold text-emerald-800 mr-2 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[10px] flex-shrink-0">
                                    {item.no}
                                  </span>
                                  <div>
                                    <span>{item.name}</span>
                                    {item.focusPoint && (
                                      <span className="block text-[10.5px] font-normal text-slate-500 mt-0.5">
                                        Fokus: {item.focusPoint}
                                      </span>
                                    )}
                                    <div className="mt-1 flex items-center space-x-1.5 text-[10px]">
                                      <span className={`px-2 py-0.2 rounded font-bold border ${scoreInfo?.bg} ${scoreInfo?.color}`}>
                                        {scoreInfo?.text}
                                      </span>
                                    </div>
                                  </div>
                                </label>

                                {/* Rentang Penilaian Skor 1 - 4 */}
                                <div className="flex flex-col items-end gap-1 flex-shrink-0 self-end md:self-center">
                                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                    {[1, 2, 3, 4].map((s) => {
                                      const isSelected = currentScore === s;
                                      return (
                                        <button
                                          key={s}
                                          type="button"
                                          onClick={() => handleScoreChange(item.id, s)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center space-x-1 cursor-pointer ${
                                            isSelected
                                              ? s === 4
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : s === 3
                                                ? 'bg-sky-600 text-white shadow-xs'
                                                : s === 2
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : 'bg-rose-600 text-white shadow-xs'
                                              : 'bg-white text-slate-700 hover:bg-slate-200 shadow-2xs'
                                          }`}
                                        >
                                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                          <span>{s}</span>
                                          <span className="hidden lg:inline text-[9.5px] font-bold">
                                            {s === 4 ? 'Sangat Efektif' : s === 3 ? 'Efektif' : s === 2 ? 'Cukup' : 'Kurang'}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Evidence input */}
                              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-slate-500 flex items-center flex-shrink-0">
                                  Bukti / Catatan Konkret:
                                </span>
                                <input
                                  type="text"
                                  value={evidence[item.id] || ''}
                                  onChange={(e) => handleEvidenceChange(item.id, e.target.value)}
                                  placeholder="Fakta perilaku yang diobservasi dari tindakan guru / respon murid di kelas..."
                                  className="flex-1 text-[11px] p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-time Timeline Notes of the class */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 text-xs flex items-center">
                  <Timer className="w-4 h-4 text-amber-500 mr-2" />
                  <span>Linimasa Kejadian Objektif Kelas (Catatan Waktu Nyata Observer)</span>
                </h5>
                <button
                  type="button"
                  onClick={addTimelineItem}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold transition flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Baris Waktu</span>
                </button>
              </div>

              <div className="space-y-2">
                {timelineNotes.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">
                    Belum ada linimasa waktu. Klik &quot;Tambah Baris Waktu&quot; untuk mencatat kejadian saat observasi berlangsung.
                  </p>
                ) : (
                  timelineNotes.map((note) => (
                    <div key={note.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={note.time}
                        onChange={(e) => updateTimelineItem(note.id, 'time', e.target.value)}
                        placeholder="07:45"
                        className="w-20 p-2 border border-slate-300 rounded-lg text-xs font-mono text-center font-semibold text-slate-700"
                      />
                      <input
                        type="text"
                        value={note.event}
                        onChange={(e) => updateTimelineItem(note.id, 'event', e.target.value)}
                        placeholder="Catatan aktivitas nyata guru dan respon siswa..."
                        className="flex-1 p-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(note.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Kekuatan & Rekomendasi GROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Kekuatan &amp; Praktik Baik Guru
                </label>
                <textarea
                  rows={3}
                  value={kekuatan}
                  onChange={(e) => setKekuatan(e.target.value)}
                  placeholder="Praktik baik yang tampak menonjol, antusiasme murid, pemanfaatan media, manajemen kelas..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rekomendasi Area Peningkatan Guru (PMM)
                </label>
                <textarea
                  rows={3}
                  value={rekomendasi}
                  onChange={(e) => setRekomendasi(e.target.value)}
                  placeholder="Saran konkret untuk ditingkatkan, variasi scaffolding, pertanyaan nalar kritis HOTS..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-slate-600">
                Nilai Tersimpan: {rubricViewMode === 'deep-learning' ? `${dlStats.overall.percentage}% (${dlStats.overall.category})` : `${calculatedPercentage}% (${calculatedCategory})`}
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Simpan Hasil Observasi &amp; Lanjut Pasca</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 3: PASCA OBSERVASI (GROW COACHING - OPTIONS) */}
      {activeTab === 'pasca' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Refleksi Pasca Observasi &amp; Percakapan GROW Coaching (O - OPTIONS &amp; FEEDBACK)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Dialog coaching yang memberdayakan guru untuk menemukan alternatif solusi dan komitmen perbaikan sendiri.
            </p>
          </div>

          <form onSubmit={handleSavePasca} className="space-y-4 text-xs">
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2.5">
              <h5 className="font-bold text-amber-950 flex items-center">
                <Lightbulb className="w-4 h-4 mr-1.5 text-amber-600" />
                <span>Refleksi Mandiri Guru (Self-Reflection)</span>
              </h5>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Bagaimana perasaan guru setelah mengajar? Apa yang dinilai berhasil &amp; tantangan yang dirasakan?
                </label>
                <textarea
                  rows={3}
                  value={pascaRefleksi}
                  onChange={(e) => setPascaRefleksi(e.target.value)}
                  placeholder="Saya merasa puas karena seluruh murid aktif dalam games, namun kelompok 3 menyelesaikan LKPD lebih cepat..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2.5">
                <h5 className="font-bold text-sky-950 flex items-center">
                  <Compass className="w-4 h-4 mr-1.5 text-sky-600" />
                  <span>O - OPTIONS (Pilihan Gagasan / Solusi Guru)</span>
                </h5>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Alternatif strategi apa yang terpikirkan untuk mengatasi tantangan tersebut ke depan?
                  </label>
                  <textarea
                    rows={3}
                    value={pascaOptions}
                    onChange={(e) => setPascaOptions(e.target.value)}
                    placeholder="Menyiapkan aktivitas pengayaan tantangan bagi siswa cepat, dan rubrik asesmen teman sebaya..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2.5">
                <h5 className="font-bold text-purple-950 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-purple-600" />
                  <span>W - WILL (Komitmen Aksi Nyata Guru)</span>
                </h5>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Langkah nyata apa yang akan dijalankan oleh guru dalam 2 pekan ke depan?
                  </label>
                  <textarea
                    rows={3}
                    value={pascaWill}
                    onChange={(e) => setPascaWill(e.target.value)}
                    placeholder="Berbagi pengalaman di Komunitas Belajar (Kombel) dan mencoba LKPD bertingkat pada tema berikutnya..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2.5">
              <h5 className="font-bold text-emerald-950 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                <span>Umpan Balik Positif &amp; Apresiasi Kepala Sekolah / Observer</span>
              </h5>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Apresiasi dan kesepakatan pembinaan dari Kepala Sekolah:
                </label>
                <textarea
                  rows={3}
                  value={pascaFeedback}
                  onChange={(e) => setPascaFeedback(e.target.value)}
                  placeholder="Sangat mengapresiasi keaktifan kelas. Sekolah siap memfasilitasi kebutuhan modul ajar di perpustakaan..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pasca Observasi &amp; Buka Tindak Lanjut</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 4: TINDAK LANJUT (WILL) */}
      {activeTab === 'tindaklanjut' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Rencana Tindak Lanjut (W - WILL &amp; ACTION PLAN)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Program peningkatan kapasitas guru sesuai kesepakatan coaching supervisi akademik.
              </p>
            </div>
            <button
              onClick={onOpenFollowUpModal}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tindak Lanjut</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Program / Kegiatan</th>
                  <th className="p-3">Area Fokus</th>
                  <th className="p-3">Target Waktu</th>
                  <th className="p-3">PIC Penanggung Jawab</th>
                  <th className="p-3">Status Pelaksanaan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(!observation.followups || observation.followups.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      Belum ada kegiatan tindak lanjut. Klik &quot;Tambah Tindak Lanjut&quot; di atas untuk menambahkan rencana aksi.
                    </td>
                  </tr>
                ) : (
                  observation.followups.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-800">{f.program}</td>
                      <td className="p-3 text-slate-700">{f.focus}</td>
                      <td className="p-3 font-mono">{f.target}</td>
                      <td className="p-3 text-slate-600">{f.pic || 'Kepala Sekolah'}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => toggleFollowUpStatus(f.id)}
                          title="Klik untuk mengubah status"
                          className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition inline-flex items-center space-x-1 ${
                            f.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : f.status === 'Proses'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{f.status}</span>
                          <RotateCw className="w-2.5 h-2.5 ml-1 opacity-70" />
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeFollowUp(f.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal Lembar Referensi Pembelajaran Mendalam */}
      <DeepLearningReferenceModal
        isOpen={isDlRefModalOpen}
        onClose={() => setIsDlRefModalOpen(false)}
        onOpenPrintModal={() => onOpenPrintPreview('deep-learning')}
      />

      {/* Modal Audit Administrasi Guru Lengkap */}
      {currentAudit && (
        <AdminDocAuditModal
          isOpen={isAdminAuditModalOpen}
          audit={currentAudit}
          settings={settings || INITIAL_SETTINGS}
          canEdit={true}
          onClose={() => setIsAdminAuditModalOpen(false)}
          onSave={(updated) => {
            onUpdateAdminAudit?.(updated);
            setIsAdminAuditModalOpen(false);
          }}
          onPrint={() => onOpenPrintPreview?.('all')}
        />
      )}
    </div>
  );
};
