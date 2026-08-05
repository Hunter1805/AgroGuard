import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import type { LocationItem, LocationType } from '../../../types/organization-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LocationItem | null;
  onSave: (data: Partial<LocationItem>) => void;
}

const LOCATION_TYPES: { key: LocationType; label: string }[] = [
  { key: 'patio', label: 'Pátio' },
  { key: 'oficina', label: 'Oficina' },
  { key: 'galpao', label: 'Galpão' },
  { key: 'talhao', label: 'Talhão' },
  { key: 'almoxarifado', label: 'Almoxarifado' },
  { key: 'armario', label: 'Armário' },
  { key: 'linha_producao', label: 'Linha de Produção' },
  { key: 'area_externa', label: 'Área Externa' },
  { key: 'outro', label: 'Outro' },
];

export const LocationForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<LocationItem>>({
    code: '',
    name: '',
    type: 'galpao',
    parentLocationId: '',
    addressOrReference: '',
    responsibleName: '',
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `LOC-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        type: 'galpao',
        parentLocationId: '',
        addressOrReference: '',
        responsibleName: '',
        status: 'ativo',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <MapPin size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Localização' : 'Nova Localização'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Código</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                required
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Tipo de Localização</label>
              <select
                value={formData.type || 'galpao'}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as LocationType }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                {LOCATION_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome da Localização</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Galpão Central de Implementos"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Localização Pai (Hierarquia)</label>
            <input
              type="text"
              value={formData.parentLocationId || ''}
              onChange={(e) => setFormData((p) => ({ ...p, parentLocationId: e.target.value }))}
              placeholder="Nenhum (Raiz) ou Código/ID do local superior"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Referência / Endereço</label>
              <input
                type="text"
                value={formData.addressOrReference || ''}
                onChange={(e) => setFormData((p) => ({ ...p, addressOrReference: e.target.value }))}
                placeholder="Ex: Pátio Principal, Setor 02"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Responsável</label>
              <input
                type="text"
                value={formData.responsibleName || ''}
                onChange={(e) => setFormData((p) => ({ ...p, responsibleName: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 transition-all shadow-md"
            >
              Salvar Localização
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
