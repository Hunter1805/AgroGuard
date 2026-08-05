import React, { useState, useEffect } from 'react';
import { Shield, X, Check } from 'lucide-react';
import { RolePermissionMatrix } from './RolePermissionMatrix';
import type { AccessRole } from '../../../types/roles';
import type { ModulePermission } from '../../../types/permissions';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AccessRole | null;
  onSave: (data: Partial<AccessRole>) => void;
}

const DEFAULT_MOD_PERMISSIONS: ModulePermission[] = [
  { module: 'dashboard', actions: { visualizar: true, criar: false, editar: false, aprovar: false, executar: false, cancelar: false, arquivar: false, exportar: true, administrar: false } },
  { module: 'equipamentos', actions: { visualizar: true, criar: true, editar: true, aprovar: false, executar: true, cancelar: false, arquivar: false, exportar: true, administrar: false } },
  { module: 'ordens_servico', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: false, exportar: true, administrar: false } },
];

export const RoleForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<AccessRole>>({
    code: '',
    name: '',
    description: '',
    permissions: DEFAULT_MOD_PERMISSIONS,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `ROLE-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        permissions: DEFAULT_MOD_PERMISSIONS,
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
      <div className="relative z-10 w-full max-w-3xl bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Shield size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Código do Perfil</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                required
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 font-mono-label"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome do Perfil</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="Ex: Planejador de Frotas Sr."
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Descrição</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descreva as atribuições e acessos deste perfil..."
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Matriz de Permissões</h4>
            <RolePermissionMatrix
              permissions={formData.permissions || DEFAULT_MOD_PERMISSIONS}
              onChange={(updated) => setFormData((p) => ({ ...p, permissions: updated }))}
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
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-md"
            >
              <Check size={14} />
              Salvar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
