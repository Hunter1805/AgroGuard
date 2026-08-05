import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentPartUsage } from '../../../../types/equipment-detail';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import { ROUTES } from '../../../../types/routes';

interface PartsTabProps {
  equipment?: Equipment;
  parts: EquipmentPartUsage[];
}

export const PartsTab: React.FC<PartsTabProps> = ({ parts }) => {
  const navigate = useNavigate();

  const totalCost = parts.reduce((acc, p) => acc + p.totalCost, 0);
  const totalItems = parts.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Consumo de Peças e Insumos
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Histórico de componentes, lubrificantes e materiais aplicados neste equipamento.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<ExternalLink size={14} />}
          onClick={() => navigate(ROUTES.PECAS_INSUMOS)}
        >
          Módulo Peças & Estoque
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Total de Itens Aplicados</span>
          <p className="text-[20px] font-bold text-on-surface mt-1">{totalItems} un</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custo Acumulado Peças</span>
          <p className="text-[18px] font-bold text-primary font-mono-label mt-1">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Item Mais Utilizado</span>
          <p className="text-[13px] font-bold text-on-surface truncate mt-1">Filtro Óleo Lubrificante</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Última Aplicação</span>
          <p className="text-[13px] font-bold text-success font-mono-label mt-1">15/07/2026</p>
        </div>
      </div>

      {/* Tabela de Consumo */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
          <Package size={15} className="text-primary" /> Relação de Materiais e Peças Utilizadas
        </h4>

        {parts.length === 0 ? (
          <EmptyState
            title="Nenhum item aplicado"
            description="Não constam registros de peças ou insumos baixados para este equipamento."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
                  <th className="px-3.5 py-2.5 font-medium">Data</th>
                  <th className="px-3.5 py-2.5 font-medium">Código / Item</th>
                  <th className="px-3.5 py-2.5 font-medium">Categoria</th>
                  <th className="px-3.5 py-2.5 font-medium">Qtd / Unidade</th>
                  <th className="px-3.5 py-2.5 font-medium">Custo Unit.</th>
                  <th className="px-3.5 py-2.5 font-medium">Custo Total</th>
                  <th className="px-3.5 py-2.5 font-medium">OS Vinculada</th>
                  <th className="px-3.5 py-2.5 font-medium">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {parts.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-3.5 py-3 font-mono-label">{p.date}</td>
                    <td className="px-3.5 py-3 font-medium text-on-surface">
                      <span className="font-mono-label text-[11px] text-primary">{p.itemCode}</span> · {p.itemName}
                    </td>
                    <td className="px-3.5 py-3">{p.category}</td>
                    <td className="px-3.5 py-3 font-mono-label font-bold text-on-surface">{p.quantity} {p.unit}</td>
                    <td className="px-3.5 py-3 font-mono-label">R$ {p.unitCost.toFixed(2)}</td>
                    <td className="px-3.5 py-3 font-mono-label font-bold text-primary">R$ {p.totalCost.toFixed(2)}</td>
                    <td className="px-3.5 py-3 font-mono-label text-primary">{p.serviceOrderId || '—'}</td>
                    <td className="px-3.5 py-3">{p.responsibleName}</td>
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
