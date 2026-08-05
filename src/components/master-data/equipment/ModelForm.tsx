import React, { useState, useEffect } from 'react';
import { Cpu, X } from 'lucide-react';
import type { ModelMaster } from '../../../types/equipment-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ModelMaster | null;
  onSave: (data: Partial<ModelMaster>) => void;
}

export const ModelForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<ModelMaster>>({
    code: '',
    name: '',
    brandId: 'MAR-01',
    startYear: 2015,
    endYear: 2024,
    defaultFuelType: 'Diesel S10',
    powerHp: 180,
    defaultMeterType: 'horimetro',
    defaultTireConfig: 'Dianteiro 600/16, Traseiro 18.4-34',
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `MOD-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        brandId: 'MAR-01',
        startYear: 2018,
        endYear: 2025,
        defaultFuelType: 'Diesel S10',
        powerHp: 220,
        defaultMeterType: 'horimetro',
        defaultTireConfig: 'Padrão Agrícola 4x4',
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
              <Cpu size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Modelo' : 'Novo Modelo de Equipamento'}
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Potência (cv / HP)</label>
              <input
                type="number"
                value={formData.powerHp || ''}
                onChange={(e) => setFormData((p) => ({ ...p, powerHp: Number(e.target.value) }))}
                placeholder="Ex: 210"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome do Modelo</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: 7225J, MF 7720, Magnum 340"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Ano Inicial Fabricação</label>
              <input
                type="number"
                value={formData.startYear || ''}
                onChange={(e) => setFormData((p) => ({ ...p, startYear: Number(e.target.value) }))}
                placeholder="2015"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Ano Final Fabricação</label>
              <input
                type="number"
                value={formData.endYear || ''}
                onChange={(e) => setFormData((p) => ({ ...p, endYear: Number(e.target.value) }))}
                placeholder="2025"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Combustível Padrão</label>
              <input
                type="text"
                value={formData.defaultFuelType || ''}
                onChange={(e) => setFormData((p) => ({ ...p, defaultFuelType: e.target.value }))}
                placeholder="Diesel S10"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Medidor Padrão</label>
              <select
                value={formData.defaultMeterType || 'horimetro'}
                onChange={(e) => setFormData((p) => ({ ...p, defaultMeterType: e.target.value as any }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                <option value="horimetro">Horímetro</option>
                <option value="odometro">Odômetro (KM)</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Configuração de Pneus Sugerida</label>
            <input
              type="text"
              value={formData.defaultTireConfig || ''}
              onChange={(e) => setFormData((p) => ({ ...p, defaultTireConfig: e.target.value }))}
              placeholder="Ex: Dianteiros 600/65R28, Traseiros 710/70R38"
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
              Salvar Modelo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
