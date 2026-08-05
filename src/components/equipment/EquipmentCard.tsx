import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Gauge, MapPin, Edit, Archive, User, AlertTriangle, AlertCircle } from 'lucide-react';
import type { Equipment } from '../../types/equipment';
import { StatusBadge } from '../ui/StatusBadge';

interface EquipmentCardProps {
  item: Equipment;
  onViewPlan?: () => void;
  onOpenQuickReading?: (item: Equipment) => void;
  onEditEquipment?: (item: Equipment) => void;
  onArchiveEquipment?: (item: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  item,
  onOpenQuickReading,
  onEditEquipment,
  onArchiveEquipment,
}) => {
  const navigate = useNavigate();
  const showHorimeter = item.currentHours > 0;
  const unit = item.meterType === 'odometro' ? 'km' : 'h';

  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4 hover:border-primary/30 transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono-label text-[10px] text-on-surface-variant/60 uppercase">
                {item.assetType}{item.assetId ? ` · ID ${item.assetId}` : ''} · {item.plateOrCode}
              </span>
              {item.hasPendingAlert && (
                <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-error/20 text-error rounded border border-error/30 flex items-center gap-1">
                  <AlertTriangle size={9} /> Alerta
                </span>
              )}
              {item.isReadingOverdue && (
                <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-warning/20 text-warning rounded border border-warning/30 flex items-center gap-1">
                  <AlertCircle size={9} /> Leitura Atrasada
                </span>
              )}
            </div>
            <h3
              onClick={() => navigate(`/equipamentos/${item.id}`)}
              className="font-title-md text-[15px] font-bold text-on-surface leading-snug truncate hover:text-primary transition-colors cursor-pointer mt-0.5"
            >
              {item.name}
            </h3>
            <p className="text-[11px] text-on-surface-variant/70">
              {item.brand} {item.model}{item.year && item.year !== '-' ? ` · ${item.year}` : ''}
            </p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Informações operacionais */}
        <div className="space-y-2 text-[12px] border-t border-b border-white/5 py-3">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant/70 flex items-center gap-1">
              <MapPin size={12} className="text-primary/70" /> Localização:
            </span>
            <span className="text-on-surface font-medium truncate max-w-[160px]">{item.location}</span>
          </div>

          {item.operatorName && (
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant/70 flex items-center gap-1">
                <User size={12} className="text-primary/70" /> Responsável:
              </span>
              <span className="text-on-surface font-medium truncate max-w-[160px]">{item.operatorName}</span>
            </div>
          )}

          {showHorimeter && (
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant/70">Medidor atual:</span>
              <span className="font-mono-label text-on-surface font-semibold">
                {item.currentHours.toLocaleString('pt-BR')} {unit}
              </span>
            </div>
          )}

          {item.fuelLevel > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant/70">Combustível:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.fuelLevel < 25 ? 'bg-error' : item.fuelLevel < 50 ? 'bg-warning' : 'bg-primary'
                    }`}
                    style={{ width: `${item.fuelLevel}%` }}
                  />
                </div>
                <span className="font-mono-label text-[10px] text-on-surface">{item.fuelLevel}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center gap-2 pt-1">
        <div className="text-[11px] font-mono-label text-on-surface-variant/60">
          <span>Próx. revisão: </span>
          <span className="text-warning font-medium">{item.nextMaintenanceDate || '—'}</span>
        </div>

        <div className="flex items-center gap-1">
          {onEditEquipment ? (
            <button
              onClick={() => onEditEquipment(item)}
              title="Editar equipamento"
              className="p-1.5 rounded-md bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <Edit size={14} />
            </button>
          ) : (
            <button
              onClick={() => navigate(`/equipamentos/${item.id}/editar`)}
              title="Editar equipamento"
              className="p-1.5 rounded-md bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <Edit size={14} />
            </button>
          )}

          {onOpenQuickReading && (
            <button
              onClick={() => onOpenQuickReading(item)}
              title="Registrar leitura"
              className="p-1.5 rounded-md bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <Gauge size={14} />
            </button>
          )}

          {onArchiveEquipment && (
            <button
              onClick={() => onArchiveEquipment(item)}
              title="Arquivar equipamento"
              className="p-1.5 rounded-md bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-error transition-all cursor-pointer"
            >
              <Archive size={14} />
            </button>
          )}

          <button
            onClick={() => navigate(`/equipamentos/${item.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-medium transition-all cursor-pointer"
          >
            <Eye size={13} />
            Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
