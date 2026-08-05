import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import type { Team } from '../../../types/organization-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Team | null;
  onSave: (data: Partial<Team>) => void;
}

const TEAM_TYPES: { key: Team['type']; label: string }[] = [
  { key: 'manutencao', label: 'Manutenção Geral' },
  { key: 'operacao', label: 'Operação Agrícola' },
  { key: 'mecanica', label: 'Mecânica Diesel' },
  { key: 'eletrica', label: 'Elétrica & Eletrônica' },
  { key: 'hidraulica', label: 'Hidráulica' },
  { key: 'pneus', label: 'Gestão de Pneus' },
  { key: 'almoxarifado', label: 'Almoxarifado' },
  { key: 'inspecao', label: 'Inspeção & Qualidade' },
  { key: 'outro', label: 'Outro' },
];

export const TeamForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<Team>>({
    code: '',
    name: '',
    type: 'mecanica',
    supervisorName: '',
    membersCount: 4,
    shift: 'diurno',
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `EQP-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        type: 'mecanica',
        supervisorName: '',
        membersCount: 4,
        shift: 'diurno',
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
              <Users size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Equipe' : 'Nova Equipe Técnica'}
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Especialidade</label>
              <select
                value={formData.type || 'mecanica'}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as any }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                {TEAM_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome da Equipe</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ex: Equipe Alfa - Mecânica Pesada"
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Supervisor</label>
              <input
                type="text"
                value={formData.supervisorName || ''}
                onChange={(e) => setFormData((p) => ({ ...p, supervisorName: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Qtd. Integrantes</label>
              <input
                type="number"
                value={formData.membersCount || 1}
                onChange={(e) => setFormData((p) => ({ ...p, membersCount: Number(e.target.value) }))}
                min={1}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Turno</label>
            <select
              value={formData.shift || 'diurno'}
              onChange={(e) => setFormData((p) => ({ ...p, shift: e.target.value as any }))}
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            >
              <option value="diurno">Diurno</option>
              <option value="noturno">Noturno</option>
              <option value="rotativo">Rotativo</option>
            </select>
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
              Salvar Equipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
