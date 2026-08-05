import React, { useState } from 'react';
import { Plus, Maximize2, X } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentPhotoSummary } from '../../../../types/equipment-detail';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';

interface PhotosTabProps {
  equipment?: Equipment;
  photos: EquipmentPhotoSummary[];
  onAddPhoto?: () => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({
  photos,
  onAddPhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<EquipmentPhotoSummary | null>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Galeria de Fotos do Equipamento
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Registro fotográfico de inspeções, painel, placa e identificação de patrimônio.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onAddPhoto}
        >
          Adicionar Foto
        </Button>
      </div>

      {photos.length === 0 ? (
        <EmptyState
          title="Nenhuma foto cadastrada"
          description="Adicione imagens para facilitar o reconhecimento e acompanhamento do estado visual."
          action={
            <Button variant="outline" size="sm" onClick={onAddPhoto}>
              Adicionar Primeira Foto
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-xl border border-white/10 overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-surface-container-highest overflow-hidden">
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedPhoto(p)}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-black/70 text-white backdrop-blur-xs">
                  {p.category}
                </span>

                <button
                  onClick={() => setSelectedPhoto(p)}
                  className="absolute bottom-2 right-2 p-1.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Expandir Foto"
                >
                  <Maximize2 size={14} />
                </button>
              </div>

              <div className="p-3 space-y-1">
                <h5 className="font-medium text-[13px] text-on-surface truncate">{p.name}</h5>
                {p.caption && (
                  <p className="text-[11px] text-on-surface-variant/70 line-clamp-2">{p.caption}</p>
                )}
                <div className="text-[10px] text-on-surface-variant/50 pt-1 font-mono-label flex justify-between">
                  <span>{p.date}</span>
                  <span>por {p.uploadedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de foto ampliada */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-4xl w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <h4 className="font-bold text-[15px] text-on-surface">{selectedPhoto.name}</h4>
                <span className="text-[11px] text-primary font-mono-label uppercase">{selectedPhoto.category}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center overflow-hidden bg-black rounded-lg">
              <img src={selectedPhoto.url} alt={selectedPhoto.name} className="max-h-[70vh] object-contain" />
            </div>

            {selectedPhoto.caption && (
              <p className="text-[12px] text-on-surface-variant/80 italic">{selectedPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
