import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Check, X, Image as ImageIcon, User, AlertCircle } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string | null;
  userName: string;
  userRole: string;
  userInitials: string;
  userColor: string;
  onSavePhoto: (dataUrl: string | null) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  userName,
  userRole,
  userInitials,
  userColor,
  onSavePhoto,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when modal opens or currentPhotoUrl changes
  React.useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentPhotoUrl || null);
      setSelectedFile(null);
      setErrorMsg(null);
      setIsProcessing(false);
    }
  }, [isOpen, currentPhotoUrl]);

  if (!isOpen) return null;

  // Process and compress image file to standard square avatar
  const processImageFile = (file: File) => {
    setErrorMsg(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih berkas gambar yang valid (JPEG, PNG, WEBP).');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Ukuran berkas terlalu besar. Maksimal 8 MB.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Crop to 1:1 center and resize to max 320x320
          const canvas = document.createElement('canvas');
          const size = 320;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setPreviewUrl(img.src);
            setSelectedFile(file);
            setIsProcessing(false);
            return;
          }

          // Center-crop calculation
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

          // Convert to WebP or JPEG data URL with 0.88 quality (compact ~25KB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreviewUrl(compressedDataUrl);
          setSelectedFile(file);
        } catch (err) {
          console.error('Error processing image:', err);
          setPreviewUrl(img.src);
          setSelectedFile(file);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMsg('Gagal memuat gambar. Silakan coba berkas gambar lain.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca berkas gambar.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSave = () => {
    onSavePhoto(previewUrl);
    onClose();
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasPhoto = Boolean(previewUrl);

  return (
    <div className="no-print fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Unggah Foto Profil</h3>
              <p className="text-xs text-slate-300">Ubah foto akun & tampilan avatar supervisi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* User info & Live Avatar Preview */}
          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            {/* Live circular avatar */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-full ${userColor} flex items-center justify-center font-bold text-2xl uppercase text-white ring-4 ring-white shadow-md overflow-hidden flex-shrink-0`}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-xs">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile info */}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mb-1">
                {userRole}
              </span>
              <h4 className="font-bold text-slate-900 text-sm truncate">{userName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasPhoto ? 'Foto kustom aktif' : 'Menggunakan inisial nama'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition bg-slate-50/60 hover:bg-emerald-50/20 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 shadow-xs border border-slate-200 transition">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-3 group-hover:text-emerald-700">
              {isProcessing ? 'Memproses berkas foto...' : 'Klik atau seret foto ke sini'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Mendukung berkas JPG, PNG, atau WebP (Maks. 8 MB)
            </p>
          </div>

          {/* Actions for current photo */}
          {hasPhoto && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Ingin kembali ke avatar inisial?</span>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1 hover:underline p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Foto</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200/60 transition"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Foto Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
