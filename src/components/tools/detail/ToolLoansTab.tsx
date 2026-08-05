import React from 'react';
import type { ToolLoan } from '../../../types/tool-loan';
import { ArrowRightLeft } from 'lucide-react';

interface ToolLoansTabProps {
  loans: ToolLoan[];
}

export const ToolLoansTab: React.FC<ToolLoansTabProps> = ({ loans }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <ArrowRightLeft size={16} className="text-primary" /> Histórico de Empréstimos e Devoluções
      </h3>

      {loans.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhum empréstimo registrado para esta ferramenta.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2 font-medium">Cód. Empréstimo</th>
                <th className="px-3.5 py-2 font-medium">Responsável</th>
                <th className="px-3.5 py-2 font-medium">OS / Ativo</th>
                <th className="px-3.5 py-2 font-medium font-mono-label">Retirada</th>
                <th className="px-3.5 py-2 font-medium font-mono-label">Prev. Devolução</th>
                <th className="px-3.5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant">
              {loans.map(loan => (
                <tr key={loan.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5 font-mono-label font-bold text-primary">{loan.code}</td>
                  <td className="px-3.5 py-2.5 font-medium text-on-surface">{loan.borrowerName}</td>
                  <td className="px-3.5 py-2.5 font-mono-label">{loan.workOrderCode || loan.equipmentName || '—'}</td>
                  <td className="px-3.5 py-2.5 font-mono-label text-[11px]">{new Date(loan.checkoutDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2.5 font-mono-label text-[11px]">{new Date(loan.expectedReturnDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2.5 capitalize font-bold text-amber-400">{loan.status.replace(/_/g, ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
