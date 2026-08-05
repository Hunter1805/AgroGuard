import React, { useState, useEffect } from 'react';
import { Ruler, X } from 'lucide-react';
import type { UnitMeasureMaster, UnitMeasureGroup } from '../../../types/material-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UnitMeasureMaster | null;
  onSave: (data: Partial<UnitMeasureMaster>) => void;
}

const MEASURE_GROUPS: { key: UnitMeasureGroup; label: string }[] = [
  { key: 'quantidade', label: 'Quantidade (UN, CX, PCT)' },
  { key: 'volume', label: 'Volume (L, mL, m³)' },
  { key: 'massa', label: 'Massa / Peso (kg, g, t)' },
  { key: 'comprimento', label: 'Comprimento (m, cm, mm)' },
  { key: 'area', label: 'Área (ha, m²)' },
  { key: 'pressao', label: 'Pressão (psi, bar)' },
  { key: 'temperatura', label: 'Temperatura (°C)' },
  { key: 'tempo', label: 'Tempo (h, min)' },
  { key: 'horimetro', label: 'Horímetro (Horas)' },
  { key: 'outro', label: 'Outro' },
];

export const UnitMeasureForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<UnitMeasureMaster>>({
    code: '',
    name: '',
    symbol: 'UN',
    group: 'quantidade',
    allowsDecimal: false,
    decimalPlaces: 0,
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `UM-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        symbol: 'UN',
        group: 'quantidade',
        allowsDecimal: false,
        decimalPlaces: 0,
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
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Ruler size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Unidade de Medida' : 'Nova Unidade de Medida'}
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Símbolo</label>
              <input
                type="text"
                value={formData.symbol || ''}
                onChange={(e) => setFormData((p) => ({ ...p, symbol: e.target.value }))}
                required
                placeholder="Ex: L, kg, UN, h"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 font-mono-label font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome Extenso</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Litro, Quilograma, Unidade"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Grupo de Grandeza</label>
              <select
                value={formData.group || 'quantidade'}
                onChange={(e) => setFormData((p) => ({ ...p, group: e.target.value as UnitMeasureGroup }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                {MEASURE_GROUPS.map((g) => (
                  <option key={g.key} value={g.key}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Casas Decimais</label>
              <input
                type="number"
                value={formData.decimalPlaces || 0}
                onChange={(e) => setFormData((p) => ({ ...p, decimalPlaces: Number(e.target.value) }))}
                min={0}
                max={4}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 font-mono-label"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-[12px] text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.allowsDecimal ?? false}
                onChange={(e) => setFormData((p) => ({ ...p, allowsDecimal: e.target.checked }))}
                className="rounded border-white/20 bg-surface-container-highest text-primary"
              />
              Permite valores fracionados / decimais
            </label>
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
              Salvar Unidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
