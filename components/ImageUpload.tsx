import React, { useState, useRef } from 'react';
import { validateImageFile } from '../lib/validation';
import { compressImage, createImagePreview } from '../lib/imageCompression';

interface ImageUploadProps {
  label: string;
  onFileSelect: (file: File) => void;
  currentImageUrl?: string;
  error?: string;
  helpText?: string;
}

export const ImageUpload = ({ label, onFileSelect, currentImageUrl, error, helpText }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);

    try {
      const compressed = await compressImage(file);
      const previewUrl = await createImagePreview(compressed);

      setPreview(previewUrl);
      onFileSelect(compressed);
    } catch (err) {
      alert('Erro ao processar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {preview ? (
        <div className="relative w-32 h-32 border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors"
              title="Alterar imagem"
            >
              <span className="material-symbols-outlined text-slate-700 text-lg">edit</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors"
              title="Remover imagem"
            >
              <span className="material-symbols-outlined text-critical text-lg">delete</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-sm flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors">
                add_photo_alternate
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                Adicionar
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-critical flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  );
};
