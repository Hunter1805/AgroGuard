import React from 'react';
import { Upload, Trash2, Image, FileText, ShieldCheck } from 'lucide-react';
import type { EquipmentFormData } from '../../../types/equipment-form';
import type { EquipmentDocument, EquipmentImage } from '../../../types/equipment';

interface StepProps {
  data: EquipmentFormData;
  onChange: (field: keyof EquipmentFormData, value: any) => void;
}

export const Step6DocsReview: React.FC<StepProps> = ({ data, onChange }) => {
  const images: EquipmentImage[] = data.images || [];
  const documents: EquipmentDocument[] = data.documents || [];

  // Simulador de upload local de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    const newImage: EquipmentImage = {
      id: `img-${Date.now()}`,
      name: file.name,
      url: previewUrl,
    };
    onChange('images', [...images, newImage]);
  };

  const handleRemoveImage = (id: string) => {
    onChange(
      'images',
      images.filter((img) => img.id !== id)
    );
  };

  // Simulador de upload local de documento
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const newDoc: EquipmentDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      url: '#',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'Documento',
      uploadedAt: new Date().toLocaleDateString('pt-BR'),
    };
    onChange('documents', [...documents, newDoc]);
  };

  const handleRemoveDoc = (id: string) => {
    onChange(
      'documents',
      documents.filter((doc) => doc.id !== id)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-title-md text-[16px] font-bold text-on-surface">
          6. Documentos, Imagens e Revisão Final
        </h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Anexe fotos e arquivos (preview local) e revise as informações antes de salvar o cadastro.
        </p>
      </div>

      {/* Seção 1: Fotos e Imagens */}
      <div className="space-y-3">
        <h4 className="font-title-md text-[13px] font-semibold text-on-surface flex items-center gap-2">
          <Image size={15} className="text-primary" /> Fotos do Equipamento (Preview Local)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg border border-white/10 overflow-hidden bg-surface-container-highest group"
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-error text-white rounded transition-colors cursor-pointer"
                title="Remover foto"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-lg border border-dashed border-white/20 hover:border-primary/50 bg-surface-container-highest/30 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all">
            <Upload size={20} className="text-on-surface-variant/60 mb-1" />
            <span className="text-[10px] text-on-surface-variant font-medium">Adicionar Foto</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      {/* Seção 2: Documentos em Anexo */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <h4 className="font-title-md text-[13px] font-semibold text-on-surface flex items-center gap-2">
            <FileText size={15} className="text-primary" /> Documentos e Manuais (PDF / Laudos)
          </h4>
          <label className="cursor-pointer">
            <span className="px-3 py-1.5 rounded-md bg-surface-container-highest border border-white/10 text-[11px] font-medium text-on-surface hover:text-primary transition-all flex items-center gap-1.5">
              <Upload size={13} /> Anexar Documento
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              className="hidden"
              onChange={handleDocUpload}
            />
          </label>
        </div>

        {documents.length === 0 ? (
          <p className="text-[11px] text-on-surface-variant/50 italic">
            Nenhum documento anexado no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-surface-container-highest/30 text-[12px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface truncate">{doc.name}</p>
                    <p className="text-[10px] text-on-surface-variant/60">
                      {doc.size || 'Arquivo'} · {doc.uploadedAt || 'Hoje'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="text-on-surface-variant hover:text-error transition-colors p-1 rounded cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção 3: Resumo Completo para Conferência */}
      <div className="glass-card p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
        <div className="flex items-center gap-2 border-b border-primary/20 pb-3">
          <ShieldCheck size={20} className="text-primary" />
          <div>
            <h4 className="font-title-md text-[14px] font-bold text-on-surface">
              Resumo do Cadastro para Conferência
            </h4>
            <p className="text-[11px] text-on-surface-variant/70">
              Verifique os dados principais preenchidos nas 6 etapas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
          <div>
            <span className="text-on-surface-variant/60 text-[10px] uppercase font-mono-label block">
              Ativo / Placa
            </span>
            <span className="font-semibold text-on-surface">
              {data.name || 'Sem nome'} ({data.plateOrCode || 'Sem código'})
            </span>
          </div>

          <div>
            <span className="text-on-surface-variant/60 text-[10px] uppercase font-mono-label block">
              Marca / Modelo
            </span>
            <span className="text-on-surface">
              {data.brand || '—'} {data.model || '—'} {data.year ? `(${data.year})` : ''}
            </span>
          </div>

          <div>
            <span className="text-on-surface-variant/60 text-[10px] uppercase font-mono-label block">
              Fazenda & Setor
            </span>
            <span className="text-on-surface">
              {data.farm} · {data.sector} ({data.location})
            </span>
          </div>

          <div>
            <span className="text-on-surface-variant/60 text-[10px] uppercase font-mono-label block">
              Operador
            </span>
            <span className="text-on-surface">{data.operatorName || 'Não atribuído'}</span>
          </div>

          <div>
            <span className="text-on-surface-variant/60 text-[10px] uppercase font-mono-label block">
              Status & Combustível
            </span>
            <span className="text-on-surface">
              {data.status} · {data.fuelLevel}% ({data.fuelType || 'Não informado'})
            </span>
          </div>

          <div>
            <span className="text-on-surface-variant/60 text-[10px] uppercase font-mono-label block">
              Coleção de Medidores
            </span>
            <span className="text-on-surface font-mono-label">
              {data.meters?.length
                ? `${data.meters.length} medidor(es) cadastrado(s)`
                : 'Sem medidores'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
