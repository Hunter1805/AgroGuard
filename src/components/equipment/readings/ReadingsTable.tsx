import React from 'react';
import { Camera, Eye, CheckCircle2, XCircle, Edit, Trash2 } from 'lucide-react';
import type { MeterReading } from '../../../types/equipment-readings';
import { StatusBadge } from '../../ui/StatusBadge';
import { EmptyState } from '../../ui/EmptyState';

interface ReadingsTableProps {
  readings: MeterReading[];
  onSelectReading: (reading: MeterReading) => void;
  onApproveReading?: (reading: MeterReading) => void;
  onRejectReading?: (reading: MeterReading) => void;
  onCorrectReading?: (reading: MeterReading) => void;
  onCancelReading?: (reading: MeterReading) => void;
  onOpenNewReading?: () => void;
}

export const ReadingsTable: React.FC<ReadingsTableProps> = ({
  readings,
  onSelectReading,
  onApproveReading,
  onRejectReading,
  onCorrectReading,
  onCancelReading,
  onOpenNewReading,
}) => {
  if (readings.length === 0) {
    return (
      <div className="glass-card rounded-xl border border-white/10 p-6">
        <EmptyState
          title="Nenhuma leitura encontrada"
          description="Ajuste os filtros de pesquisa ou registre uma nova leitura de medidor na frota."
          action={
            onOpenNewReading ? (
              <button
                onClick={onOpenNewReading}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-medium hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Registrar Nova Leitura
              </button>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] text-left">
          <thead>
            <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
              <th className="px-3.5 py-2.5 font-medium">Data e Hora</th>
              <th className="px-3.5 py-2.5 font-medium">Equipamento</th>
              <th className="px-3.5 py-2.5 font-medium">Medidor</th>
              <th className="px-3.5 py-2.5 font-medium">Anterior</th>
              <th className="px-3.5 py-2.5 font-medium">Nova Leitura</th>
              <th className="px-3.5 py-2.5 font-medium">Diferença (Δ)</th>
              <th className="px-3.5 py-2.5 font-medium">Origem</th>
              <th className="px-3.5 py-2.5 font-medium">Responsável</th>
              <th className="px-3.5 py-2.5 font-medium">Status</th>
              <th className="px-3.5 py-2.5 font-medium text-center">Foto</th>
              <th className="px-3.5 py-2.5 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant">
            {readings.map((r) => (
              <tr key={r.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-3.5 py-3 font-mono-label text-on-surface">{r.readingAt}</td>
                <td className="px-3.5 py-3 font-medium text-on-surface">
                  <div className="flex flex-col">
                    <span>{r.equipmentName}</span>
                    <span className="text-[10px] font-mono-label text-primary">{r.equipmentCode}</span>
                  </div>
                </td>
                <td className="px-3.5 py-3">
                  <span className="font-mono-label text-[11px] bg-surface-container-highest px-2 py-0.5 rounded border border-white/5">
                    {r.meterName || r.meterType}
                  </span>
                </td>
                <td className="px-3.5 py-3 font-mono-label">{r.previousValue.toLocaleString('pt-BR')} {r.unit}</td>
                <td className="px-3.5 py-3 font-mono-label font-bold text-primary">
                  {r.value.toLocaleString('pt-BR')} {r.unit}
                </td>
                <td className="px-3.5 py-3 font-mono-label font-bold">
                  {r.difference < 0 ? (
                    <span className="text-error">{r.difference} {r.unit}</span>
                  ) : r.difference === 0 ? (
                    <span className="text-warning">0 {r.unit}</span>
                  ) : (
                    <span className="text-success">+{r.difference} {r.unit}</span>
                  )}
                </td>
                <td className="px-3.5 py-3 capitalize">{r.source.replace('_', ' ')}</td>
                <td className="px-3.5 py-3">{r.createdBy}</td>
                <td className="px-3.5 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3.5 py-3 text-center">
                  {r.photoUrl ? (
                    <span className="text-primary inline-block" title="Possui foto do painel">
                      <Camera size={16} />
                    </span>
                  ) : (
                    <span className="text-on-surface-variant/30">—</span>
                  )}
                </td>
                <td className="px-3.5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelectReading(r)}
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      title="Ver Detalhes e Auditoria"
                    >
                      <Eye size={14} />
                    </button>

                    {r.status === 'pendente_aprovacao' && onApproveReading && (
                      <button
                        onClick={() => onApproveReading(r)}
                        className="p-1.5 rounded text-success hover:bg-success/15 transition-colors cursor-pointer"
                        title="Aprovar Leitura"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}

                    {r.status === 'pendente_aprovacao' && onRejectReading && (
                      <button
                        onClick={() => onRejectReading(r)}
                        className="p-1.5 rounded text-error hover:bg-error/15 transition-colors cursor-pointer"
                        title="Rejeitar Leitura"
                      >
                        <XCircle size={14} />
                      </button>
                    )}

                    {r.status === 'valida' && onCorrectReading && (
                      <button
                        onClick={() => onCorrectReading(r)}
                        className="p-1.5 rounded text-warning hover:bg-warning/15 transition-colors cursor-pointer"
                        title="Corrigir Leitura"
                      >
                        <Edit size={14} />
                      </button>
                    )}

                    {r.status !== 'cancelada' && onCancelReading && (
                      <button
                        onClick={() => onCancelReading(r)}
                        className="p-1.5 rounded text-on-surface-variant/50 hover:text-error transition-colors cursor-pointer"
                        title="Cancelar Registro"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
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
