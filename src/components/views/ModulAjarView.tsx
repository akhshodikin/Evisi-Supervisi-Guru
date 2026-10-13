import React, { useState } from 'react';
import { ObservationData, ModulAjarFile } from '../../types';
import { GoogleDriveButton } from '../GoogleDriveButton';
import { User } from 'firebase/auth';
import { 
  FolderDown, 
  Search, 
  ExternalLink, 
  Eye, 
  FileText, 
  HardDrive, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ModulAjarViewProps {
  observations: ObservationData[];
  isDriveConnected: boolean;
  driveUser: User | null;
  isDriveLoading: boolean;
  onSignInDrive: () => void;
  onSignOutDrive: () => void;
  onOpenObsDetail: (obsId: string) => void;
  onUpdateObservation: (updated: ObservationData) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onConfirmDelete: (title: string, desc: string, action: () => void) => void;
}

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({
  observations,
  isDriveConnected,
  driveUser,
  isDriveLoading,
  onSignInDrive,
  onSignOutDrive,
  onOpenObsDetail,
  onUpdateObservation,
  onShowToast,
  onConfirmDelete
}) => {
  const [search, setSearch] = useState('');
  const [filterDrive, setFilterDrive] = useState<string>('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfTitle, setPreviewPdfTitle] = useState<string>('');

  const observationsWithModul = observations.filter(o => o.modulAjar);
  const totalModul = observationsWithModul.length;
  const inDriveCount = observationsWithModul.filter(o => o.modulAjar?.driveFileId).length;

  const filtered = observations.filter(o => {
    const s = search.toLowerCase();
    const matchSearch =
      o.teacherName.toLowerCase().includes(s) ||
      o.subject.toLowerCase().includes(s) ||
      o.classTarget.toLowerCase().includes(s) ||
      (o.modulAjar?.name || '').toLowerCase().includes(s);

    if (filterDrive === 'drive') {
      return matchSearch && Boolean(o.modulAjar?.driveFileId);
    }
    if (filterDrive === 'local') {
      return matchSearch && Boolean(o.modulAjar && !o.modulAjar.driveFileId);
    }
    if (filterDrive === 'none') {
      return matchSearch && !o.modulAjar;
    }
    return matchSearch;
  });

  const handleDeleteModul = (obs: ObservationData) => {
    if (!obs.modulAjar) return;
    onConfirmDelete(
      'Hapus Modul Ajar',
      `Apakah Anda yakin ingin menghapus Modul Ajar "${obs.modulAjar.name}" milik ${obs.teacherName}?`,
      () => {
        const updated: ObservationData = {
          ...obs,
          modulAjar: undefined
        };
        onUpdateObservation(updated);
        onShowToast(`Modul Ajar untuk ${obs.teacherName} berhasil dihapus.`);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Google Drive Connection Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex-shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Repositori Modul Ajar Guru (Google Drive)
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                PDF Terintegrasi
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Seluruh berkas Modul Ajar Kurikulum Merdeka diunggah dan tersimpan rapi langsung di Google Drive pengguna. Pengawas dan Kepala Sekolah dapat menelaah dan mengunduh kapan saja.
            </p>
          </div>
        </div>

        <div className="self-end md:self-center flex-shrink-0">
          <GoogleDriveButton
            user={driveUser}
            isConnected={isDriveConnected}
            isLoading={isDriveLoading}
            onSignIn={onSignInDrive}
            onSignOut={onSignOutDrive}
          />
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FolderDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Modul Ajar Terunggah</p>
            <h4 className="text-xl font-extrabold text-slate-900 leading-tight">
              {totalModul} / {observations.length}
            </h4>
            <span className="text-[10px] text-slate-400">Target Observasi Kelas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tersimpan di Google Drive</p>
            <h4 className="text-xl font-extrabold text-emerald-700 leading-tight">{inDriveCount}</h4>
            <span className="text-[10px] text-emerald-600 font-semibold">Tersinkronisasi Cloud</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Format Standar</p>
            <h4 className="text-base font-extrabold text-slate-900 leading-tight">Adobe PDF (.pdf)</h4>
            <span className="text-[10px] text-amber-600 font-semibold">Alur Pra-Observasi GROW</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari guru, mata pelajaran, nama berkas PDF..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={filterDrive}
            onChange={(e) => setFilterDrive(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-auto"
          >
            <option value="">Semua Status Berkas</option>
            <option value="drive">Tersimpan di Google Drive</option>
            <option value="local">Tersimpan Lokal</option>
            <option value="none">Belum Unggah Modul</option>
          </select>
        </div>
      </div>

      {/* List of Modul Ajar per Observasi */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Guru &amp; Kelas</th>
                <th className="p-3">Mata Pelajaran &amp; Materi</th>
                <th className="p-3">Berkas Modul Ajar (PDF)</th>
                <th className="p-3">Status Google Drive</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    Tidak ditemukan data modul ajar yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((obs) => (
                  <tr key={obs.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <p className="font-bold text-slate-900 leading-snug">{obs.teacherName}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600 font-semibold">
                        {obs.classTarget}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{obs.subject}</p>
                      <p className="text-[10.5px] text-slate-500 truncate max-w-xs">
                        {obs.pra?.materi || 'Materi belum diisi'}
                      </p>
                    </td>
                    <td className="p-3">
                      {obs.modulAjar ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate max-w-xs text-[11px]" title={obs.modulAjar.name}>
                              {obs.modulAjar.name}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {(obs.modulAjar.size / 1024).toFixed(1)} KB • {obs.modulAjar.uploadDate}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum diunggah</span>
                      )}
                    </td>
                    <td className="p-3">
                      {obs.modulAjar?.driveFileId ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-md font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Google Drive</span>
                        </span>
                      ) : obs.modulAjar ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3 text-amber-700" />
                          <span>Lokal (Belum Sinkron)</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {/* View on Drive if link exists */}
                      {obs.modulAjar?.driveViewLink && (
                        <a
                          href={obs.modulAjar.driveViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold text-[11px] transition inline-flex items-center space-x-1 border border-sky-200"
                        >
                          <HardDrive className="w-3 h-3 text-sky-600" />
                          <span>Drive</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {/* Preview PDF */}
                      {obs.modulAjar?.localUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewPdfUrl(obs.modulAjar?.localUrl || null);
                            setPreviewPdfTitle(obs.modulAjar?.name || 'Modul Ajar');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat</span>
                        </button>
                      )}

                      {/* Go to observation details to upload/edit */}
                      <button
                        onClick={() => onOpenObsDetail(obs.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] transition inline-flex items-center space-x-1 shadow-2xs"
                      >
                        <span>{obs.modulAjar ? 'Kelola' : 'Unggah PDF'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      {obs.modulAjar && (
                        <button
                          onClick={() => handleDeleteModul(obs)}
                          title="Hapus Modul Ajar"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition inline-block align-middle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal Viewer */}
      {previewPdfUrl && (
        <div className="no-print fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden border border-slate-300">
            <div className="p-3.5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs truncate max-w-md">
                  Pratinjau Modul Ajar: {previewPdfTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPdfUrl(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={previewPdfUrl}
                title="Pratinjau Modul Ajar PDF"
                className="w-full h-full rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
