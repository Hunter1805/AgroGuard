import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Gauge, Plus, History, Edit, Archive, AlertTriangle, AlertCircle, User } from 'lucide-react';
import type { Equipment } from '../../types/equipment';
import { StatusBadge } from '../ui/StatusBadge';
import { ROUTES } from '../../types/routes';

interface EquipmentTableProps {
  equipments: Equipment[];
  onOpenQuickReading?: (equipment: Equipment) => void;
  onOpenCreateOS?: (equipment: Equipment) => void;
  onEditEquipment?: (equipment: Equipment) => void;
  onArchiveEquipment?: (equipment: Equipment) => void;
}

function formatMeter(equipment: Equipment): string {
  if (equipment.meters && equipment.meters.length > 0) {
    const main = equipment.meters[0];
    return `${main.currentValue.toLocaleString('pt-BR')} ${main.unit}`;
  }
  if (equipment.meterType === 'nenhum' || equipment.currentHours === 0) {
    return '—';
  }
  const unit = equipment.meterType === 'odometro' ? 'km' : 'h';
  return `${equipment.currentHours.toLocaleString('pt-BR')} ${unit}`;
}

function getMaintenanceBadge(status?: string) {
  if (status === 'vencida') {
    return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-error/15 border border-error/30 text-error">Vencida</span>;
  }
  if (status === 'proxima') {
    return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-warning/15 border border-warning/30 text-warning">Próxima</span>;
  }
  return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-success/10 border border-success/20 text-success">Em dia</span>;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipments,
  onOpenQuickReading,
  onOpenCreateOS,
  onEditEquipment,
  onArchiveEquipment,
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant/60 font-mono-label text-[10px] uppercase bg-surface-container-highest/30 border-b border-white/5">
              <th className="px-3.5 py-3 font-medium">Código / Placa</th>
              <th className="px-3.5 py-3 font-medium">Equipamento</th>
              <th className="px-3.5 py-3 font-medium hidden sm:table-cell">Tipo</th>
              <th className="px-3.5 py-3 font-medium">Status</th>
              <th className="px-3.5 py-3 font-medium">Responsável</th>
              <th className="px-3.5 py-3 font-medium">Medidor</th>
              <th className="px-3.5 py-3 font-medium hidden lg:table-cell">Manutenção</th>
              <th className="px-3.5 py-3 font-medium">Alertas</th>
              <th className="px-3.5 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant">
            {equipments.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-container-highest/30 transition-colors group"
              >
                {/* Código / Placa */}
                <td className="px-3.5 py-3 font-mono-label text-on-surface font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>{item.plateOrCode}</span>
                  </div>
                </td>

                {/* Nome / Equipamento */}
                <td className="px-3.5 py-3">
                  <div>
                    <button
                      onClick={() => navigate(`/equipamentos/${item.id}`)}
                      className="font-medium text-on-surface hover:text-primary transition-colors text-left font-body-sm cursor-pointer"
                    >
                      {item.name}
                    </button>
                    <p className="text-[11px] text-on-surface-variant/60">
                      {item.brand} {item.model} {item.year ? `(${item.year})` : ''}
                    </p>
                  </div>
                </td>

                {/* Tipo de ativo */}
                <td className="px-3.5 py-3 hidden sm:table-cell">
                  <span className="text-[11px] font-mono-label text-on-surface-variant/80 bg-surface-container-highest px-2 py-0.5 rounded border border-white/5">
                    {item.assetType}
                  </span>
                </td>

                {/* Status */}
                <td className="px-3.5 py-3">
                  <StatusBadge status={item.status} />
                </td>

                {/* Coluna Responsável */}
                <td className="px-3.5 py-3 text-on-surface-variant">
                  {item.operatorName ? (
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <User size={12} className="text-primary/70 shrink-0" />
                      <span className="truncate max-w-[120px]">{item.operatorName}</span>
                    </span>
                  ) : (
                    <span className="text-on-surface-variant/40 text-[11px]">—</span>
                  )}
                </td>

                {/* Medidor */}
                <td className="px-3.5 py-3 font-mono-label text-on-surface">
                  {formatMeter(item)}
                </td>

                {/* Situação da Manutenção */}
                <td className="px-3.5 py-3 hidden lg:table-cell">
                  <div className="space-y-0.5">
                    {getMaintenanceBadge(item.maintenanceStatus)}
                    <p className="text-[10px] text-on-surface-variant/50 font-mono-label">
                      {item.nextMaintenanceDate || '—'}
                    </p>
                  </div>
                </td>

                {/* Coluna Alertas */}
                <td className="px-3.5 py-3">
                  <div className="flex flex-col gap-1">
                    {item.hasPendingAlert && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-error/15 text-error border border-error/30">
                        <AlertTriangle size={10} /> Alerta Crítico
                      </span>
                    )}
                    {item.isReadingOverdue && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-warning/15 text-warning border border-warning/30">
                        <AlertCircle size={10} /> Leitura Atrasada
                      </span>
                    )}
                    {!item.hasPendingAlert && !item.isReadingOverdue && (
                      <span className="text-on-surface-variant/40 text-[11px]">—</span>
                    )}
                  </div>
                </td>

                {/* Ações */}
                <td className="px-3.5 py-3 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    {/* Ver Ficha */}
                    <button
                      onClick={() => navigate(`/equipamentos/${item.id}`)}
                      title="Ver Ficha Detalhada"
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Editar Equipamento (Fase 3A.1 & 3B) */}
                    <button
                      onClick={() =>
                        onEditEquipment
                          ? onEditEquipment(item)
                          : navigate(`/equipamentos/${item.id}/editar`)
                      }
                      title="Editar Equipamento"
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>

                    {/* Registrar Leitura */}
                    <button
                      onClick={() => onOpenQuickReading && onOpenQuickReading(item)}
                      title="Registrar Leitura"
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                    >
                      <Gauge size={14} />
                    </button>

                    {/* Criar OS */}
                    <button
                      onClick={() =>
                        onOpenCreateOS
                          ? onOpenCreateOS(item)
                          : navigate(ROUTES.ORDENS_SERVICO)
                      }
                      title="Abrir Ordem de Serviço"
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>

                    {/* Ver histórico */}
                    <button
                      onClick={() => navigate(`/equipamentos/${item.id}/leituras`)}
                      title="Histórico de Leituras"
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                    >
                      <History size={14} />
                    </button>

                    {/* Arquivar Equipamento (Fase 3A.1) */}
                    <button
                      onClick={() => onArchiveEquipment && onArchiveEquipment(item)}
                      title="Arquivar Equipamento"
                      className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                    >
                      <Archive size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
