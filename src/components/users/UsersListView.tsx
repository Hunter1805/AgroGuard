import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Ban, RefreshCw, LogOut, CheckCircle, Clock, XSquare, Eye, Edit } from 'lucide-react';
import { apiClient } from '../../lib/api/api-client';
import { InviteUserDrawer } from './InviteUserDrawer';

interface Member {
  membershipId: string;
  userId: string;
  authUserId: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  scope: {
    allCompanies: boolean;
    allUnits: boolean;
    allFarms: boolean;
  } | null;
  createdAt: string;
}

export const UsersListView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Drawer e menus de controle
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (roleFilter) params.append('role', roleFilter);

      const res = await apiClient<Member[]>(`/users/org?${params.toString()}`);
      if (res.data) {
        setMembers(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar lista de equipe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter, roleFilter]);

  // Ações administrativas
  const handleBlockUser = async (userId: string, currentStatus: string) => {
    const shouldBlock = currentStatus === 'ativo';
    setActiveMenuId(null);
    try {
      await apiClient(`/users/org/${userId}/block`, {
        method: 'POST',
        body: JSON.stringify({ block: shouldBlock }),
      });
      setSuccessMessage(shouldBlock ? 'Membro bloqueado com sucesso.' : 'Membro reativado com sucesso.');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Falha ao alterar status do membro.');
    }
  };

  const handleTerminateSessions = async (userId: string) => {
    setActiveMenuId(null);
    try {
      await apiClient(`/users/org/${userId}/sessions/terminate`, {
        method: 'POST',
      });
      setSuccessMessage('Sessões do usuário encerradas com sucesso.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Falha ao desconectar sessões do usuário.');
    }
  };

  const handlePromoteUser = async (userId: string, currentRole: string) => {
    setActiveMenuId(null);
    const newRole = currentRole === 'administrador' ? 'tecnico' : 'administrador';
    try {
      await apiClient(`/users/org/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      setSuccessMessage(`Perfil do usuário alterado para ${newRole}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Falha ao alterar perfil do usuário.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-250 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} />
            Ativo
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-250 px-2 py-0.5 rounded-full">
            <Clock size={10} />
            Pendente
          </span>
        );
      case 'bloqueado':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-red-50 text-red-700 border border-red-250 px-2 py-0.5 rounded-full">
            <Ban size={10} />
            Bloqueado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
            <XSquare size={10} />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Header da Tela */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-900">
            <Users className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-950">Usuários</h1>
          </div>
          <p className="text-xs text-slate-500">Gerencie acessos, perfis e escopos de acesso da equipe da organização.</p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          Convidar usuário
        </button>
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-xs font-semibold">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        {/* Busca por Nome/Email */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail profissional..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-250 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2 outline-none focus:border-slate-400 focus:bg-white transition-all"
          />
        </div>

        {/* Filtro Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-250 text-slate-900 text-xs rounded-md px-3 py-2 outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer min-w-[140px]"
        >
          <option value="">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="pendente">Convites Pendentes</option>
          <option value="bloqueado">Bloqueados</option>
        </select>

        {/* Filtro Perfil */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-50 border border-slate-250 text-slate-900 text-xs rounded-md px-3 py-2 outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer min-w-[160px]"
        >
          <option value="">Todos os Perfis</option>
          <option value="proprietario">Proprietário</option>
          <option value="administrador">Administrador</option>
          <option value="tecnico">Técnico / Mecânico</option>
          <option value="operador">Operador / Motorista</option>
        </select>
      </div>

      {/* Tabela de Membros */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <RefreshCw size={24} className="text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-semibold">Buscando equipe no servidor...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Nenhum membro encontrado</h3>
            <p className="text-xs text-slate-500">Ajuste os filtros de busca ou convide novos funcionários.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Perfil</th>
                  <th className="p-4">Escopo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.userId} className="hover:bg-slate-50/50 transition-colors">
                    {/* Usuario */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 border border-slate-200">
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{member.name}</span>
                        <span className="text-[11px] text-slate-500 block leading-none">{member.email}</span>
                      </div>
                    </td>

                    {/* Perfil */}
                    <td className="p-4 capitalize font-semibold text-slate-700">
                      {member.role === 'proprietario' ? 'Proprietário' : member.role}
                    </td>

                    {/* Escopo */}
                    <td className="p-4">
                      {member.scope?.allCompanies ? (
                        <span className="text-[11px] font-medium text-slate-650">Acesso Total</span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-600">Restrito</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(member.status)}
                    </td>

                    {/* Acoes */}
                    <td className="p-4 relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === member.userId ? null : member.userId)}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === member.userId && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-4 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-20 divide-y divide-slate-150 py-1 font-medium animate-fadeIn">
                            {/* Ações operacionais */}
                            <div className="py-1">
                              {member.role !== 'proprietario' && (
                                <button
                                  onClick={() => handlePromoteUser(member.userId, member.role)}
                                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[11px] text-slate-700 flex items-center gap-2"
                                >
                                  <Edit size={12} />
                                  Alterar Perfil
                                </button>
                              )}
                              <button
                                onClick={() => setActiveMenuId(null)}
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[11px] text-slate-700 flex items-center gap-2"
                              >
                                <Eye size={12} />
                                Ver Escopo
                              </button>
                            </div>

                            {/* Ações de login / status */}
                            <div className="py-1">
                              {member.role !== 'proprietario' && (
                                <button
                                  onClick={() => handleBlockUser(member.userId, member.status)}
                                  className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-[11px] flex items-center gap-2 ${
                                    member.status === 'ativo' ? 'text-red-600' : 'text-emerald-600'
                                  }`}
                                >
                                  <Ban size={12} />
                                  {member.status === 'ativo' ? 'Bloquear Acesso' : 'Desbloquear'}
                                </button>
                              )}

                              {member.authUserId && (
                                <button
                                  onClick={() => handleTerminateSessions(member.userId)}
                                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[11px] text-red-650 flex items-center gap-2"
                                >
                                  <LogOut size={12} />
                                  Encerrar Sessões
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer de Convite */}
      <InviteUserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={fetchMembers}
      />
    </div>
  );
};
export default UsersListView;
