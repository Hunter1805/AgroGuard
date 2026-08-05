import React, { useState } from 'react';
import { DollarSign, Filter } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentCostSummary } from '../../../../types/equipment-detail';
import { EmptyState } from '../../../ui/EmptyState';

interface CostsTabProps {
  equipment?: Equipment;
  costs: EquipmentCostSummary[];
}

export const CostsTab: React.FC<CostsTabProps> = ({ costs }) => {
  const [periodFilter, setPeriodFilter] = useState<string>('ano');

  const totalAccumulated = costs.reduce((acc, c) => acc + c.value, 0);
  const preventiveTotal = costs.filter((c) => c.category === 'Preventiva').reduce((acc, c) => acc + c.value, 0);
  const correctiveTotal = costs.filter((c) => c.category === 'Corretiva').reduce((acc, c) => acc + c.value, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Análise Financeira de Custos Operacionais
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Acompanhamento dos custos diretos de manutenção preventiva, corretiva, peças e insumos.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <Filter size={14} className="text-primary" />
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-surface-container border border-white/10 rounded-md px-3 py-1.5 text-on-surface focus:outline-none"
          >
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="ano">Ano Atual (2026)</option>
            <option value="todos">Todo o Histórico</option>
          </select>
        </div>
      </div>

      {/* Cards de Categorias Financeiras */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-primary/30 bg-primary/5">
          <span className="text-[11px] font-mono-label text-primary font-semibold uppercase block">Custo Total Acumulado</span>
          <p className="text-[20px] font-bold text-on-surface font-mono-label mt-1">
            R$ {totalAccumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Manutenção Preventiva</span>
          <p className="text-[18px] font-bold text-success font-mono-label mt-1">
            R$ {preventiveTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Manutenção Corretiva</span>
          <p className="text-[18px] font-bold text-error font-mono-label mt-1">
            R$ {correctiveTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Peças & Insumos</span>
          <p className="text-[18px] font-bold text-warning font-mono-label mt-1">
            R$ {(totalAccumulated * 0.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Tabela de Lançamentos de Custos */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
          <DollarSign size={15} className="text-primary" /> Lançamentos de Despesas Registradas
        </h4>

        {costs.length === 0 ? (
          <EmptyState
            title="Nenhum custo registrado"
            description="Não constam lançamentos financeiros de manutenção para o período selecionado."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
                  <th className="px-3.5 py-2.5 font-medium">Data</th>
                  <th className="px-3.5 py-2.5 font-medium">Categoria</th>
                  <th className="px-3.5 py-2.5 font-medium">Descrição</th>
                  <th className="px-3.5 py-2.5 font-medium">Origem</th>
                  <th className="px-3.5 py-2.5 font-medium">Valor (R$)</th>
                  <th className="px-3.5 py-2.5 font-medium">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {costs.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-3.5 py-3 font-mono-label">{c.date}</td>
                    <td className="px-3.5 py-3 font-medium text-on-surface">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest border border-white/10">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 truncate max-w-xs">{c.description}</td>
                    <td className="px-3.5 py-3 font-mono-label text-primary">{c.source}</td>
                    <td className="px-3.5 py-3 font-mono-label font-bold text-on-surface">
                      R$ {c.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3.5 py-3">{c.responsibleName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
