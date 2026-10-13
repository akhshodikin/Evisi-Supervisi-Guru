import React, { useState } from 'react';
import { 
  DEEP_LEARNING_DIMENSIONS, 
  ALL_DEEP_LEARNING_ITEMS 
} from '../../data/deepLearningData';
import { 
  Sparkles, 
  BookOpen, 
  X, 
  CheckCircle2, 
  Printer, 
  FileText, 
  Info, 
  Layers, 
  Compass, 
  Smile, 
  Lightbulb, 
  Users, 
  Laptop,
  Check
} from 'lucide-react';

interface DeepLearningReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintModal?: () => void;
}

export const DeepLearningReferenceModal: React.FC<DeepLearningReferenceModalProps> = ({
  isOpen,
  onClose,
  onOpenPrintModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'prinsip' | 'pengalaman' | 'kerangka'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredDimensions = DEEP_LEARNING_DIMENSIONS.map(dim => {
    if (activeTab !== 'all' && dim.id !== activeTab) return null;
    
    const filteredSubAspects = dim.subAspects.map(sub => {
      const filteredItems = sub.items.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.desc.toLowerCase().includes(q) ||
          item.aspect.toLowerCase().includes(q) ||
          String(item.no).includes(q)
        );
      });
      return { ...sub, items: filteredItems };
    }).filter(sub => sub.items.length > 0);

    if (filteredSubAspects.length === 0) return null;
    return { ...dim, subAspects: filteredSubAspects };
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white flex justify-between items-center border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold text-[10px] uppercase tracking-wider border border-emerald-500/30">
                  LEMBAR REFERENSI RESMI
                </span>
                <span className="text-slate-400 text-xs">• 33 Indikator</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                Instrumen &amp; Panduan Pembelajaran Mendalam (Deep Learning)
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenPrintModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrintModal();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                title="Cetak lembar instrumen ini ke format cetak A4"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak Instrumen A4</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner Konsep Deep Learning */}
        <div className="p-3.5 bg-emerald-50/80 border-b border-emerald-200 text-slate-800 text-xs flex-shrink-0">
          <div className="flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-emerald-900">Tentang Instrumen Pembelajaran Mendalam (Rentang 1 - 4):</span>
              <p className="text-[11.5px] text-slate-700 mt-0.5">
                Lembar ini dijadikan acuan dan referensi observasi kinerja guru di kelas untuk mengamati keterlaksanaan 
                <strong className="text-emerald-950 font-bold"> Prinsip Pembelajaran (Mindful, Meaningful, Joyful)</strong>, 
                <strong className="text-emerald-950 font-bold"> Pengalaman Belajar (Memahami, Mengaplikasikan, Merefleksikan)</strong>, dan 
                <strong className="text-emerald-950 font-bold"> Kerangka Pembelajaran (Pedagogik, Kemitraan, Lingkungan, Digital)</strong> 
                dengan skala nilai <strong>1 s.d. 4</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Panduan Rentang Penilaian 1 - 4 */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
            Rubrik Penilaian Skor 1 - 4:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-300" title="Belum Dilakukan / Belum Terlihat">
              1: Belum Dilakukan
            </span>
            <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300" title="Dilakukan tapi Belum Efektif">
              2: Belum Efektif
            </span>
            <span className="px-2 py-0.5 rounded font-bold bg-sky-100 text-sky-800 border border-sky-300" title="Dilakukan dan Efektif">
              3: Efektif (Baik)
            </span>
            <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" title="Sangat Efektif (Membudaya)">
              4: Sangat Efektif
            </span>
          </div>
        </div>

        {/* Toolbar Filter Dimensi */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Dimensi (33 Butir)
            </button>
            <button
              onClick={() => setActiveTab('prinsip')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'prinsip'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Prinsip (9)
            </button>
            <button
              onClick={() => setActiveTab('pengalaman')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'pengalaman'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Pengalaman (14)
            </button>
            <button
              onClick={() => setActiveTab('kerangka')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'kerangka'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              3. Kerangka (10)
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci indikator..."
              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Content: 3 Dimensi Rubrik */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 bg-slate-50">
          {filteredDimensions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Tidak ditemukan indikator dengan kata kunci &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredDimensions.map((dim) => {
              if (!dim) return null;
              return (
                <div key={dim.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-300">
                        {dim.title}
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Total {dim.totalItems} Indikator Pengamatan Lapangan
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[10px] font-bold">
                      Dimensi Resmi
                    </span>
                  </div>

                  <div className="p-4 space-y-5">
                    {dim.subAspects.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2.5">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-1.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-md">
                            {sub.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({sub.items.length} butir pengamatan)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {sub.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 bg-slate-50/70 hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-200 rounded-xl transition text-xs flex items-start space-x-3"
                            >
                              <span className="font-extrabold text-emerald-800 bg-white border border-emerald-200 px-2 py-1 rounded-lg text-xs flex-shrink-0 shadow-2xs">
                                No. {item.no}
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 leading-relaxed">
                                  {item.desc}
                                </p>
                                <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-500">
                                  <span className="font-mono bg-slate-200/80 px-1.5 py-0.2 rounded text-slate-700">
                                    ID: {item.id}
                                  </span>
                                  <span>•</span>
                                  <span className="italic">{item.aspect}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-slate-500">
            Sumber: Panduan Supervisi Pembelajaran Mendalam Kurikulum Merdeka Kemendikbudristek &amp; Disdikbud Pasuruan
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Tutup Lembar Referensi
          </button>
        </div>
      </div>
    </div>
  );
};
