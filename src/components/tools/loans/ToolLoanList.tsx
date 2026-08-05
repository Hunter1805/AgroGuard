import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Search } from 'lucide-react';
import { useToolLoans } from '../../../hooks/useToolLoans';
import { Button } from '../../ui/Button';
import { ToolLoanForm } from './ToolLoanForm';
import { ToolReturnModal } from './ToolReturnModal';
import type { ToolLoan } from '../../../types/tool-loan';

export const ToolLoanList: React.FC = () => {
  const { loans, loading, filters, setFilters, refetch } = useToolLoans();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<ToolLoan | undefined>(undefined);

  const getStatusBadge = (status: ToolLoan['status']) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Ativo</span>;
      case 'atrasado':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Atrasado</span>;
      case 'parcialmente_devolvido':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Devolvido Parcial</span>;
      case 'concluido':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Concluído</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">Cancelado</span>;
    }
  };

  const handleReturnClick = (loan: ToolLoan) => {
    setSelectedLoan(loan);
    setActiveModal('devolver');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <ArrowRightLeft className="text-primary" size={18} />
            Empréstimos de Ferramentas
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Retiradas de ferramentas para uso em campo, oficinas e vinculadas a Ordens de Serviço.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setActiveModal('novo')} className="flex items-center gap-1.5">
          <Plus size={16} /> Novo Empréstimo
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por código, responsável ou OS..."
              value={filters.search || ''}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={filters.status || 'todos'}
              onChange={e => setFilters({ ...filters, status: e.target.value as any })}
              className="bg-surface-container/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-on-surface"
            >
              <option value="todos">Todos Status</option>
              <option value="ativo">Ativos</option>
              <option value="atrasado">Atrasados</option>
              <option value="parcialmente_devolvido">Devolvido Parcial</option>
              <option value="concluido">Concluídos</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando empréstimos...</div>
        ) : loans.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ArrowRightLeft className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhum empréstimo ativo</p>
            <p className="text-xs text-on-surface-variant/70">As ferramentas retiradas pelos mecânicos e operadores aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Cód. Empréstimo</th>
                  <th className="px-4 py-3 font-medium">Responsável / Equipe</th>
                  <th className="px-4 py-3 font-medium">Ordem de Serviço / Ativo</th>
                  <th className="px-4 py-3 font-medium">Itens Retirados</th>
                  <th className="px-4 py-3 font-medium">Data Retirada</th>
                  <th className="px-4 py-3 font-medium">Previsão Devolução</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {loans.map(loan => (
                  <tr key={loan.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{loan.code}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-on-surface block">{loan.borrowerName}</span>
                      <span className="text-[10px] text-on-surface-variant/70 block">{loan.borrowerTeam || 'Sem equipe'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono-label font-bold text-on-surface block">{loan.workOrderCode || 'Sem OS'}</span>
                      <span className="text-[10px] text-on-surface-variant/70 block truncate max-w-[150px]">{loan.equipmentName || 'Sem equipamento'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {loan.items.map(item => (
                        <div key={item.id} className="text-[11px] font-mono-label">
                          <strong className="text-on-surface">{item.quantity}x</strong> {item.toolName} ({item.returnedQuantity}/{item.quantity} dev.)
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">{new Date(loan.checkoutDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">
                      <span className={loan.status === 'atrasado' ? 'text-rose-400 font-bold' : ''}>
                        {new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(loan.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {loan.status !== 'concluido' && loan.status !== 'cancelado' && (
                        <button
                          onClick={() => handleReturnClick(loan)}
                          className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold hover:bg-emerald-500/25 transition-colors"
                        >
                          Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeModal === 'novo' && (
        <ToolLoanForm onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}

      {activeModal === 'devolver' && selectedLoan && (
        <ToolReturnModal loan={selectedLoan} onClose={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); refetch(); }} />
      )}
    </div>
  );
};
