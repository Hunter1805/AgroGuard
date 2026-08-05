import React, { useState, useEffect } from 'react';
import { Trees, X } from 'lucide-react';
import type { Farm } from '../../../types/organization-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Farm | null;
  onSave: (data: Partial<Farm>) => void;
}

export const FarmForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<Farm>>({
    code: '',
    name: '',
    companyId: 'EMP-01',
    totalAreaHectares: 500,
    city: '',
    state: 'MG',
    responsibleName: '',
    coordinates: '',
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `FAZ-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        companyId: 'EMP-01',
        totalAreaHectares: 1200,
        city: 'Guaxupé',
        state: 'MG',
        responsibleName: '',
        coordinates: '-21.3045, -46.7142',
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
              <Trees size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Fazenda' : 'Nova Fazenda'}
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Área Total (Hectares)</label>
              <input
                type="number"
                value={formData.totalAreaHectares || ''}
                onChange={(e) => setFormData((p) => ({ ...p, totalAreaHectares: Number(e.target.value) }))}
                placeholder="Ex: 1200"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome da Fazenda</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Fazenda Santa Maria"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Município / UF</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                placeholder="Município"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Responsável Técnico</label>
              <input
                type="text"
                value={formData.responsibleName || ''}
                onChange={(e) => setFormData((p) => ({ ...p, responsibleName: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Coordenadas (Lat, Long)</label>
            <input
              type="text"
              value={formData.coordinates || ''}
              onChange={(e) => setFormData((p) => ({ ...p, coordinates: e.target.value }))}
              placeholder="-21.3045, -46.7142"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
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
              Salvar Fazenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
