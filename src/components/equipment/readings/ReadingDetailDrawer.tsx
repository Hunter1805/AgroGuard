import React from 'react';
import { X, Camera, CheckCircle2, XCircle, Edit, Trash2 } from 'lucide-react';
import type { MeterReading } from '../../../types/equipment-readings';
import { StatusBadge } from '../../ui/StatusBadge';
import { Button } from '../../ui/Button';

interface ReadingDetailDrawerProps {
  reading: MeterReading | null;
  onClose: () => void;
  onApprove?: (reading: MeterReading) => void;
  onReject?: (reading: MeterReading) => void;
  onCorrect?: (reading: MeterReading) => void;
  onCancel?: (reading: MeterReading) => void;
}

export const ReadingDetailDrawer: React.FC<ReadingDetailDrawerProps> = ({
  reading,
  onClose,
  onApprove,
  onReject,
  onCorrect,
  onCancel,
}) => {
  if (!reading) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md h-full glass-card bg-surface-container-highest border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono-label text-primary uppercase">Detalhamento e Trilha de Auditoria</span>
              <h3 className="font-title-md text-[18px] font-bold text-on-surface">{reading.equipmentName}</h3>
              <p className="text-[11px] font-mono-label text-on-surface-variant/70">{reading.equipmentCode} · ID: {reading.id}</p>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Status Badge e Alerta */}
          <div className="flex items-center justify-between bg-surface-container/50 p-3 rounded-xl border border-white/5">
            <span className="text-[12px] text-on-surface-variant/80 font-medium">Situação Atual:</span>
            <StatusBadge status={reading.status} />
          </div>

          {/* Dados numéricos */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container/40 rounded-xl border border-white/5 font-mono-label text-center">
            <div>
              <span className="text-[10px] text-on-surface-variant/60 block">Anterior</span>
              <span className="text-[13px] font-bold text-on-surface">{reading.previousValue} {reading.unit}</span>
            </div>
            <div>
              <span className="text-[10px] text-primary block font-bold">Nova Leitura</span>
              <span className="text-[14px] font-bold text-primary">{reading.value} {reading.unit}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant/60 block">Diferença (Δ)</span>
              <span className={`text-[13px] font-bold ${reading.difference < 0 ? 'text-error' : 'text-success'}`}>
                {reading.difference > 0 ? `+${reading.difference}` : reading.difference} {reading.unit}
              </span>
            </div>
          </div>

          {/* Atributos Gerais */}
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-on-surface-variant/70">Medidor:</span>
              <span className="font-medium text-on-surface">{reading.meterName || reading.meterType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-on-surface-variant/70">Data e Hora do Registro:</span>
              <span className="font-mono-label font-medium text-on-surface">{reading.readingAt}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-on-surface-variant/70">Origem do Apontamento:</span>
              <span className="font-medium text-on-surface capitalize">{reading.source.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-on-surface-variant/70">Cadastrado por:</span>
              <span className="font-medium text-on-surface">{reading.createdBy}</span>
            </div>
          </div>

          {/* Justificativa ou Motivos */}
          {reading.justification && (
            <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 text-warning text-[12px] space-y-1">
              <span className="font-bold block">Justificativa Informada:</span>
              <p className="opacity-90 leading-relaxed">{reading.justification}</p>
            </div>
          )}

          {reading.rejectionReason && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-[12px] space-y-1">
              <span className="font-bold block">Motivo da Rejeição:</span>
              <p className="opacity-90">{reading.rejectionReason}</p>
            </div>
          )}

          {/* Foto do Painel */}
          {reading.photoUrl && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase flex items-center gap-1">
                <Camera size={14} /> Foto Comprobatória do Painel
              </span>
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                <img src={reading.photoUrl} alt="Painel" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ações de Auditoria */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          {reading.status === 'pendente_aprovacao' && (
            <div className="grid grid-cols-2 gap-2">
              {onApprove && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 size={14} />}
                  onClick={() => {
                    onApprove(reading);
                    onClose();
                  }}
                >
                  Aprovar
                </Button>
              )}
              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<XCircle size={14} />}
                  onClick={() => {
                    onReject(reading);
                    onClose();
                  }}
                >
                  Rejeitar
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {reading.status === 'valida' && onCorrect && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                icon={<Edit size={14} />}
                onClick={() => {
                  onCorrect(reading);
                  onClose();
                }}
              >
                Corrigir Leitura
              </Button>
            )}

            {reading.status !== 'cancelada' && onCancel && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-error border-error/30 hover:bg-error/15"
                icon={<Trash2 size={14} />}
                onClick={() => {
                  onCancel(reading);
                  onClose();
                }}
              >
                Cancelar Registro
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
