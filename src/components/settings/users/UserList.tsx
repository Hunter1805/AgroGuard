import React, { useState } from 'react';
import { Plus, Lock, Unlock, Eye, ShieldCheck, Mail } from 'lucide-react';
import { useUsers } from '../../../hooks/useUsers';
import { UserFilters } from './UserFilters';
import { UserForm } from './UserForm';
import { UserDetailView } from './UserDetailView';
import { EffectivePermissionsDrawer } from '../permissions/EffectivePermissionsDrawer';
import type { SystemUser } from '../../../types/users';

export const UserList: React.FC = () => {
  const { users, loading, searchQuery, setSearchQuery, statusFilter, setStatusFilter, blockUser, unblockUser, refetchUsers } = useUsers();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<SystemUser | null>(null);
  const [permDrawerUser, setPermDrawerUser] = useState<SystemUser | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-on-surface">Usuários do Sistema</h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Gerencie o acesso, perfis e escopo operacional dos colaboradores.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <UserFilters
        query={searchQuery}
        onQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Tabela */}
      <div className="glass-card rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-[13px] text-on-surface-variant animate-pulse">
            Carregando lista de usuários...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[14px] font-medium text-on-surface">Nenhum usuário encontrado</p>
            <p className="text-[12px] text-on-surface-variant/60 mt-1">Não há cadastros para os filtros selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-white/10 bg-surface-container-high/60 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider">
                  <th className="py-3 px-4">Usuário</th>
                  <th className="py-3 px-4">Perfil Principal</th>
                  <th className="py-3 px-4">Cargo / Matrícula</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Último Acesso</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const isBlocked = u.status === 'bloqueado';
                  const isPending = u.status === 'convite_pendente';
                  const isActive = u.status === 'ativo';

                  return (
                    <tr key={u.id} className="hover:bg-surface-container-highest/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[12px]">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-on-surface">{u.name}</div>
                            <div className="text-[11px] text-on-surface-variant/60">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-primary">{u.primaryRoleName || 'Mecânico'}</span>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-on-surface-variant/80">
                        <div>{u.jobTitle || '—'}</div>
                        {u.employeeCode && <span className="font-mono-label text-[10px] text-on-surface-variant/50">{u.employeeCode}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono-label ${
                            isActive
                              ? 'bg-success/10 text-success border border-success/20'
                              : isBlocked
                              ? 'bg-error/10 text-error border border-error/20'
                              : isPending
                              ? 'bg-warning/10 text-warning border border-warning/20'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-on-surface-variant/70 font-mono-label">
                        {u.lastAccessAt ? new Date(u.lastAccessAt).toLocaleDateString('pt-BR') : 'Sem acesso'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedUserDetail(u)} title="Ver Ficha" className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => setPermDrawerUser(u)} title="Permissões Efetivas" className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest">
                            <ShieldCheck size={15} />
                          </button>
                          {isPending && (
                            <button onClick={() => alert(`Convite reenviado para ${u.email}`)} title="Reenviar Convite" className="p-1.5 rounded-lg text-on-surface-variant hover:text-warning hover:bg-surface-container-highest">
                              <Mail size={15} />
                            </button>
                          )}
                          {isBlocked ? (
                            <button onClick={() => unblockUser(u.id)} title="Desbloquear Usuário" className="p-1.5 rounded-lg text-success hover:bg-surface-container-highest">
                              <Unlock size={15} />
                            </button>
                          ) : (
                            <button onClick={() => blockUser(u.id, 'Bloqueio administrativo manual')} title="Bloquear Usuário" className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container-highest">
                              <Lock size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modais */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingUser}
        onSave={() => {
          setIsFormOpen(false);
          refetchUsers();
        }}
      />

      <UserDetailView
        isOpen={Boolean(selectedUserDetail)}
        onClose={() => setSelectedUserDetail(null)}
        user={selectedUserDetail}
      />

      <EffectivePermissionsDrawer
        isOpen={Boolean(permDrawerUser)}
        onClose={() => setPermDrawerUser(null)}
        user={permDrawerUser}
      />
    </div>
  );
};
