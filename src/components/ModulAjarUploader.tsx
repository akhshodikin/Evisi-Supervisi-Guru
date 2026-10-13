import React, { useState, useRef } from 'react';
import { ModulAjarFile } from '../types';
import { uploadPdfToDrive, deleteFileFromDrive, getAccessToken } from '../services/googleDriveService';
import { 
  FileText, 
  UploadCloud, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  AlertCircle, 
  Loader2, 
  HardDrive
} from 'lucide-react';

interface ModulAjarUploaderProps {
  modulAjar?: ModulAjarFile;
  teacherName: string;
  subject: string;
  classTarget: string;
  isDriveConnected: boolean;
  onConnectDrive: () => void;
  onModulAjarChange: (modul: ModulAjarFile | undefined) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onConfirmDelete: (title: string, desc: string, action: () => void) => void;
}

export const ModulAjarUploader: React.FC<ModulAjarUploaderProps> = ({
  modulAjar,
  teacherName,
  subject,
  classTarget,
  isDriveConnected,
  onConnectDrive,
  onModulAjarChange,
  onShowToast,
  onConfirmDelete
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [pdfPreviewModal, setPdfPreviewModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      onShowToast('Harap pilih berkas dengan format PDF (.pdf)', 'error');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      onShowToast('Ukuran berkas melebihi batas 30 MB', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Membaca berkas PDF...');

    try {
      // Create local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      const cleanTeacher = teacherName.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanSubject = subject.replace(/[^a-zA-Z0-9]/g, '_');
      const driveTitle = `Modul_Ajar_${cleanTeacher}_${cleanSubject}_${classTarget.replace(/\s+/g, '')}.pdf`;

      let driveResult = null;
      const token = await getAccessToken();

      if (token) {
        setUploadProgress('Mengunggah ke Google Drive...');
        driveResult = await uploadPdfToDrive(
          file,
          driveTitle,
          `Modul Ajar Kurikulum Merdeka ${subject} (${classTarget}) - Guru: ${teacherName}`
        );
      }

      const newModul: ModulAjarFile = {
        id: driveResult ? driveResult.id : 'MOD-' + Date.now(),
        name: file.name,
        size: file.size,
        mimeType: 'application/pdf',
        uploadDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        driveFileId: driveResult?.id,
        driveViewLink: driveResult?.webViewLink,
        driveWebContentLink: driveResult?.webContentLink,
        localUrl: localUrl,
        uploadedBy: teacherName
      };

      onModulAjarChange(newModul);

      if (driveResult) {
        onShowToast('Modul Ajar PDF berhasil diunggah & tersimpan di Google Drive!', 'success');
      } else {
        onShowToast('Modul Ajar PDF disimpan di penampung lokal. Hubungkan Google Drive untuk sinkronisasi cloud.', 'info');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      onShowToast(err.message || 'Gagal mengunggah Modul Ajar', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDelete = () => {
    if (!modulAjar) return;

    onConfirmDelete(
      'Hapus Modul Ajar',
      `Apakah Anda yakin ingin menghapus berkas "${modulAjar.name}"? Jika tersimpan di Google Drive, file juga akan dihapus.`,
      async () => {
        try {
          if (modulAjar.driveFileId && isDriveConnected) {
            await deleteFileFromDrive(modulAjar.driveFileId);
          }
          if (modulAjar.localUrl) {
            URL.revokeObjectURL(modulAjar.localUrl);
          }
          onModulAjarChange(undefined);
          onShowToast('Modul Ajar berhasil dihapus.');
        } catch (err: any) {
          console.error(err);
          onModulAjarChange(undefined);
          onShowToast('Modul Ajar dihapus dari catatan lokal.');
        }
      }
    );
  };

  const syncCurrentToDrive = async () => {
    if (!isDriveConnected) {
      onConnectDrive();
      return;
    }

    if (!modulAjar?.localUrl) {
      onShowToast('Silakan pilih berkas PDF terlebih dahulu.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Menyinkronkan ke Google Drive...');

    try {
      const response = await fetch(modulAjar.localUrl);
      const blob = await response.blob();
      const file = new File([blob], modulAjar.name, { type: 'application/pdf' });

      const cleanTeacher = teacherName.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanSubject = subject.replace(/[^a-zA-Z0-9]/g, '_');
      const driveTitle = `Modul_Ajar_${cleanTeacher}_${cleanSubject}_${classTarget.replace(/\s+/g, '')}.pdf`;

      const driveResult = await uploadPdfToDrive(file, driveTitle);

      const updated: ModulAjarFile = {
        ...modulAjar,
        driveFileId: driveResult.id,
        driveViewLink: driveResult.webViewLink,
        driveWebContentLink: driveResult.webContentLink
      };

      onModulAjarChange(updated);
      onShowToast('Modul Ajar berhasil disinkronkan ke Google Drive!', 'success');
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Gagal menyinkronkan ke Google Drive', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="space-y-3">
      {/* If file is uploaded */}
      {modulAjar ? (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl flex-shrink-0 shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-slate-900 text-xs truncate max-w-sm" title={modulAjar.name}>
                  {modulAjar.name}
                </h5>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-500">
                  <span>Ukuran: {formatFileSize(modulAjar.size)}</span>
                  <span>•</span>
                  <span>Diunggah: {modulAjar.uploadDate}</span>
                </div>

                {/* Drive Sync status badge */}
                <div className="mt-2 flex items-center space-x-1.5">
                  {modulAjar.driveFileId ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-md font-semibold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Tersimpan di Google Drive</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-md font-semibold text-[10px]">
                      <AlertCircle className="w-3 h-3 text-amber-700" />
                      <span>Tersimpan Lokal (Belum ke Drive)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center">
              {/* Open in Google Drive */}
              {modulAjar.driveViewLink && (
                <a
                  href={modulAjar.driveViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1 border border-sky-200"
                >
                  <HardDrive className="w-3.5 h-3.5 text-sky-600" />
                  <span>Buka di Drive</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {/* Sync to drive button if not yet synced */}
              {!modulAjar.driveFileId && (
                <button
                  type="button"
                  onClick={syncCurrentToDrive}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1 shadow-2xs"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>Simpan ke Google Drive</span>
                </button>
              )}

              {/* In-app preview */}
              {modulAjar.localUrl && (
                <button
                  type="button"
                  onClick={() => setPdfPreviewModal(modulAjar.localUrl || null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau PDF</span>
                </button>
              )}

              {/* Replace file button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
              >
                Ganti
              </button>

              {/* Delete file */}
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Hapus Modul Ajar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area (Drag & Drop + Button) */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-6 border-2 border-dashed rounded-2xl text-center transition flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-sm">
            <h5 className="font-bold text-slate-800 text-xs">
              Unggah Modul Ajar Pembelajaran (Format PDF)
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tarik berkas PDF ke area ini atau klik tombol di bawah. Berkas akan langsung disimpan secara aman di Google Drive Anda.
            </p>
          </div>

          {/* Drive Status Alert */}
          {!isDriveConnected ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center space-x-2 text-left max-w-md">
              <HardDrive className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <div className="flex-1">
                <span>Google Drive belum terhubung. Anda dapat mengunggah sekarang atau hubungkan Google Drive untuk sinkronisasi otomatis.</span>
              </div>
              <button
                type="button"
                onClick={onConnectDrive}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] transition flex-shrink-0"
              >
                Hubungkan
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Drive aktif: Modul akan langsung diunggah ke Google Drive</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadProgress || 'Mengunggah...'}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Pilih Berkas PDF Modul Ajar</span>
                </>
              )}
            </button>
          </div>

          <span className="text-[10px] text-slate-400">
            Maksimum ukuran: 30 MB • Format: PDF (.pdf)
          </span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* In-App PDF Preview Modal */}
      {pdfPreviewModal && (
        <div className="no-print fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden border border-slate-300">
            <div className="p-3.5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs truncate max-w-md">
                  Pratinjau Modul Ajar: {modulAjar?.name}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                {modulAjar?.driveViewLink && (
                  <a
                    href={modulAjar.driveViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <span>Buka di Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPdfPreviewModal(null)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={pdfPreviewModal}
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
