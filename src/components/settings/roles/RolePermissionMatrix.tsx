import React from 'react';
import { Check, X } from 'lucide-react';
import type { ModulePermission, PermissionAction } from '../../../types/permissions';

interface MatrixProps {
  permissions: ModulePermission[];
  onChange?: (updated: ModulePermission[]) => void;
  readOnly?: boolean;
}

const ACTIONS_HEADER: { key: PermissionAction; label: string }[] = [
  { key: 'visualizar', label: 'Visualizar' },
  { key: 'criar', label: 'Criar' },
  { key: 'editar', label: 'Editar' },
  { key: 'aprovar', label: 'Aprovar' },
  { key: 'executar', label: 'Executar' },
  { key: 'cancelar', label: 'Cancelar' },
  { key: 'arquivar', label: 'Arquivar' },
  { key: 'exportar', label: 'Exportar' },
  { key: 'administrar', label: 'Admin' },
];

export const RolePermissionMatrix: React.FC<MatrixProps> = ({ permissions, onChange, readOnly = false }) => {
  const togglePermission = (modIdx: number, actionKey: PermissionAction) => {
    if (readOnly || !onChange) return;
    const copy = [...permissions];
    const targetMod = copy[modIdx];
    if (targetMod) {
      targetMod.actions[actionKey] = !targetMod.actions[actionKey];
      onChange(copy);
    }
  };

  return (
    <div className="overflow-x-auto border border-white/10 rounded-xl glass-card">
      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-white/10 bg-surface-container-high/60 text-[10px] font-semibold text-on-surface-variant/70 uppercase">
            <th className="py-2.5 px-3">Módulo</th>
            {ACTIONS_HEADER.map((act) => (
              <th key={act.key} className="py-2.5 px-2 text-center">{act.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {permissions.map((modPerm, idx) => (
            <tr key={modPerm.module} className="hover:bg-surface-container-highest/40 transition-colors">
              <td className="py-2 px-3 font-semibold text-on-surface capitalize">
                {modPerm.module.replace('_', ' ')}
              </td>
              {ACTIONS_HEADER.map((act) => {
                const isChecked = modPerm.actions[act.key];
                return (
                  <td key={act.key} className="py-2 px-2 text-center">
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => togglePermission(idx, act.key)}
                      className={`p-1 rounded-md transition-all ${
                        isChecked
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-surface-container-high/40 text-on-surface-variant/30 border border-white/5'
                      }`}
                    >
                      {isChecked ? <Check size={13} /> : <X size={13} />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
