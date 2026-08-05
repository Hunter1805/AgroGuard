import React from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface ReadingPhotoPreviewProps {
  photoUrl?: string;
  onPhotoChange: (url?: string) => void;
  required?: boolean;
}

export const ReadingPhotoPreview: React.FC<ReadingPhotoPreviewProps> = ({
  photoUrl,
  onPhotoChange,
  required,
}) => {
  const handleSimulatePhoto = () => {
    // Imagem mockada de painel de horímetro/odômetro
    const samplePhotos = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    ];
    const chosen = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    onPhotoChange(chosen);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase flex items-center justify-between">
        <span>Foto do Painel {required && <span className="text-error">*</span>}</span>
        {required && <span className="text-[10px] text-error font-normal">Obrigatória para este medidor</span>}
      </label>

      {photoUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-black">
          <img src={photoUrl} alt="Foto do Painel" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onPhotoChange(undefined)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-error transition-colors cursor-pointer"
            title="Remover Foto"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleSimulatePhoto}
          className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors space-y-2 bg-surface-container/40"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Camera size={18} />
          </div>
          <div>
            <p className="text-[12px] font-medium text-on-surface flex items-center justify-center gap-1">
              <Upload size={14} /> Anexar Foto do Painel
            </p>
            <p className="text-[10px] text-on-surface-variant/60">
              Clique para selecionar imagem ou simular foto do horímetro/odômetro
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
