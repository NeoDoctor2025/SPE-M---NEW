import React, { useState } from 'react';
import { compressImage } from '../lib/imageCompression';
import { evaluationAutoSave } from '../lib/evaluationAutoSave';
import { supabase } from '../lib/supabase';

interface EvaluationPhotoUploadProps {
  evaluationId: string;
  step: number;
  photos: Array<{ step: number; url: string; uploaded_at: string }>;
  onPhotosChange: (photos: Array<{ step: number; url: string; uploaded_at: string }>) => void;
}

export const EvaluationPhotoUpload: React.FC<EvaluationPhotoUploadProps> = ({
  evaluationId,
  step,
  photos,
  onPhotosChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const stepPhotos = photos.filter((p) => p.step === step);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Você precisa estar logado para fazer upload de fotos');
        setUploading(false);
        return;
      }

      for (const file of Array.from(files)) {
        const compressedFile = await compressImage(file);
        const photoUrl = await evaluationAutoSave.uploadPhoto(
          compressedFile,
          user.id,
          evaluationId
        );

        if (photoUrl) {
          const success = await evaluationAutoSave.addPhoto(evaluationId, step, photoUrl);
          if (success) {
            const newPhotos = [
              ...photos,
              {
                step,
                url: photoUrl,
                uploaded_at: new Date().toISOString(),
              },
            ];
            onPhotosChange(newPhotos);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    }

    setUploading(false);
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    const updatedPhotos = photos.filter((p) => p.url !== photoUrl);
    onPhotosChange(updatedPhotos);

    try {
      const { error } = await supabase
        .from('evaluations')
        .update({ photos: updatedPhotos })
        .eq('id', evaluationId);

      if (error) {
        console.error('Error deleting photo:', error);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Fotos da Etapa {step}
        </label>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <span className="px-4 py-2 bg-primary text-white font-mono text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors inline-flex items-center gap-2 disabled:opacity-50">
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Enviando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                Adicionar Foto
              </>
            )}
          </span>
        </label>
      </div>

      {stepPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stepPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 border border-border dark:border-slate-700 overflow-hidden">
                <img
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleDeletePhoto(photo.url)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700"
                title="Deletar foto"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs font-mono p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(photo.uploaded_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {stepPhotos.length === 0 && (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-600 mb-2">
            photo_camera
          </span>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            Nenhuma foto adicionada ainda
          </p>
        </div>
      )}
    </div>
  );
};
