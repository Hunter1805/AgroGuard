import React, { useState } from 'react';
import { Shield, Plus, Copy, Edit2, Users, Power } from 'lucide-react';
import { useRoles } from '../../../hooks/useRoles';
import { RoleForm } from './RoleForm';
import type { AccessRole } from '../../../types/roles';

export const RoleList: React.FC = () => {
  const { roles, loading, duplicateRole, toggleRoleStatus, refetchRoles } = useRoles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AccessRole | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-on-surface">Perfis de Acesso</h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Defina papéis e conjuntos padronizados de permissões para os usuários.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Novo Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          <div className="col-span-full p-8 text-center text-[13px] text-on-surface-variant animate-pulse">
            Carregando perfis de acesso...
          </div>
        ) : (
          roles.map((r) => (
            <div key={r.id} className="glass-card rounded-xl border border-white/10 p-4 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all shadow-md">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Shield size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] text-on-surface">{r.name}</h4>
                      <span className="text-[10px] font-mono-label text-on-surface-variant/60">{r.code}</span>
                    </div>
                  </div>
                  {r.systemRole && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-label bg-surface-container-high text-on-surface-variant border border-white/10 uppercase">
                      Sistema
                    </span>
                  )}
                </div>

                <p className="text-[12px] text-on-surface-variant/70 line-clamp-2 leading-relaxed">
                  {r.description || 'Sem descrição cadastrada.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-on-surface-variant/60">
                <span className="inline-flex items-center gap-1">
                  <Users size={13} />
                  {r.userCount} usuário(s)
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateRole(r.id)}
                    title="Duplicar Perfil"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
                  >
                    <Copy size={14} />
                  </button>
                  {r.editable && (
                    <button
                      onClick={() => {
                        setEditingRole(r);
                        setIsFormOpen(true);
                      }}
                      title="Editar Perfil"
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  {r.editable && (
                    <button
                      onClick={() => toggleRoleStatus(r.id, !r.active)}
                      title={r.active ? 'Inativar Perfil' : 'Ativar Perfil'}
                      className={`p-1.5 rounded-lg hover:bg-surface-container-highest ${r.active ? 'text-success' : 'text-on-surface-variant/40'}`}
                    >
                      <Power size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <RoleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingRole}
        onSave={() => {
          setIsFormOpen(false);
          refetchRoles();
        }}
      />
    </div>
  );
};
