import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentOrderSummary } from '../../../../types/equipment-detail';
import { Button } from '../../../ui/Button';
import { StatusBadge } from '../../../ui/StatusBadge';
import { PriorityBadge } from '../../../ui/PriorityBadge';
import { EmptyState } from '../../../ui/EmptyState';
import { ROUTES } from '../../../../types/routes';

interface OrdersTabProps {
  equipment?: Equipment;
  orders: EquipmentOrderSummary[];
  onOpenNewOS?: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onOpenNewOS,
}) => {
  const navigate = useNavigate();

  const openCount = orders.filter((o) => o.status === 'Aberta' || o.status === 'Em Execução').length;
  const waitingPartsCount = orders.filter((o) => o.status === 'Aguardando Peça').length;
  const closedCount = orders.filter((o) => o.status === 'Encerrada').length;

  const handleOpenOSModule = (id?: string) => {
    if (id) navigate(`/ordens-servico/${id}`);
    else navigate(ROUTES.ORDENS_SERVICO);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Ordens de Serviço do Equipamento
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Histórico completo de intervenções corretivas, preventivas e inspeções.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onOpenNewOS || (() => handleOpenOSModule())}
        >
          Criar Nova OS
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">OS em Aberto / Execução</span>
          <p className="text-[20px] font-bold text-primary mt-1">{openCount}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Aguardando Peças</span>
          <p className="text-[20px] font-bold text-warning mt-1">{waitingPartsCount}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">OS Concluídas</span>
          <p className="text-[20px] font-bold text-success mt-1">{closedCount}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Tempo Parado Acumulado</span>
          <p className="text-[16px] font-bold text-on-surface font-mono-label mt-1">72 horas</p>
        </div>
      </div>

      {/* Tabela de OS */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
          <FileText size={15} className="text-primary" /> Registros de Ordens de Serviço
        </h4>

        {orders.length === 0 ? (
          <EmptyState
            title="Nenhuma ordem de serviço"
            description="Este equipamento ainda não possui ordens de serviço registradas."
            action={
              <Button variant="outline" size="sm" onClick={() => handleOpenOSModule()}>
                Abrir Ordem de Serviço
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
                  <th className="px-3.5 py-2.5 font-medium">Número OS</th>
                  <th className="px-3.5 py-2.5 font-medium">Abertura</th>
                  <th className="px-3.5 py-2.5 font-medium">Tipo</th>
                  <th className="px-3.5 py-2.5 font-medium">Descrição</th>
                  <th className="px-3.5 py-2.5 font-medium">Prioridade</th>
                  <th className="px-3.5 py-2.5 font-medium">Status</th>
                  <th className="px-3.5 py-2.5 font-medium">Responsável</th>
                  <th className="px-3.5 py-2.5 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {orders.map((os) => (
                  <tr key={os.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-3.5 py-3 font-mono-label font-bold text-primary">{os.number}</td>
                    <td className="px-3.5 py-3 font-mono-label">{os.openingDate}</td>
                    <td className="px-3.5 py-3 font-medium text-on-surface">{os.type}</td>
                    <td className="px-3.5 py-3 truncate max-w-xs">{os.description}</td>
                    <td className="px-3.5 py-3"><PriorityBadge priority={os.priority} /></td>
                    <td className="px-3.5 py-3"><StatusBadge status={os.status} /></td>
                    <td className="px-3.5 py-3">{os.responsibleName}</td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        className="p-1.5 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title="Ver Ficha da OS"
                        onClick={() => handleOpenOSModule(os.id)}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
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
