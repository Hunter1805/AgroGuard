import React from 'react';
import { X, Gauge, AlertCircle } from 'lucide-react';
import type { MeterReadingSource } from '../../../types/equipment-readings';
import { useReadingForm } from '../../../hooks/useReadingForm';
import { ReadingValidationAlert } from './ReadingValidationAlert';
import { ReadingPhotoPreview } from './ReadingPhotoPreview';
import { Button } from '../../ui/Button';

interface ReadingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquipmentId?: string;
  onSuccess?: () => void;
}

export const ReadingFormModal: React.FC<ReadingFormModalProps> = ({
  isOpen,
  onClose,
  initialEquipmentId,
  onSuccess,
}) => {
  const {
    equipments,
    selectedEquipmentId,
    setSelectedEquipmentId,
    availableMeters,
    selectedMeterId,
    handleMeterChange,
    selectedMeter,
    previousValue,
    value,
    setValue,
    difference,
    readingAt,
    setReadingAt,
    source,
    setSource,
    photoUrl,
    setPhotoUrl,
    notes,
    setNotes,
    justification,
    setJustification,
    validation,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useReadingForm({
    initialEquipmentId,
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-xl w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Header do Modal */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Gauge size={20} />
            </div>
            <div>
              <h3 className="font-title-md text-[16px] font-bold text-on-surface">
                Registrar Leitura de Medidor
              </h3>
              <p className="text-[12px] text-on-surface-variant/70">
                Apontamento rápido de horímetro ou odômetro da frota.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4 text-[12px]">
          {submitError && (
            <div className="bg-error/15 border border-error/40 rounded-xl p-3 text-error text-[12px] flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Seleção de Equipamento e Medidor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Equipamento *
              </label>
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                disabled={!!initialEquipmentId}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary disabled:opacity-70"
              >
                <option value="">Selecione o equipamento...</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.plateOrCode} — {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Medidor *
              </label>
              <select
                value={selectedMeterId}
                onChange={(e) => handleMeterChange(e.target.value)}
                disabled={availableMeters.length <= 1}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary disabled:opacity-70"
              >
                {availableMeters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leitura Anterior vs Nova Leitura */}
          {selectedMeter && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface-container/50 rounded-xl border border-white/5 font-mono-label">
              <div>
                <span className="text-[10px] text-on-surface-variant/60 uppercase block">Leitura Anterior</span>
                <span className="text-[15px] font-bold text-on-surface">
                  {previousValue.toLocaleString('pt-BR')} {selectedMeter.unit}
                </span>
              </div>
              <div>
                <label className="text-[10px] text-primary uppercase block font-bold mb-0.5">Nova Leitura *</label>
                <input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Ex: 6800"
                  className="w-full bg-surface-container border border-primary/40 rounded px-2 py-1 text-[14px] font-bold text-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant/60 uppercase block">Diferença (Δ)</span>
                <span className={`text-[15px] font-bold ${difference < 0 ? 'text-error' : 'text-success'}`}>
                  {difference > 0 ? `+${difference}` : difference} {selectedMeter.unit}
                </span>
              </div>
            </div>
          )}

          {/* Banner de Feedback de Validação */}
          <ReadingValidationAlert validation={validation} />

          {/* Data, Hora e Origem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Data e Hora *
              </label>
              <input
                type="text"
                value={readingAt}
                onChange={(e) => setReadingAt(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm"
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Origem *
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as MeterReadingSource)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none capitalize"
              >
                <option value="manual">Manual (Apontamento)</option>
                <option value="checklist">Checklist Diário</option>
                <option value="ordem_servico">Ordem de Serviço</option>
                <option value="manutencao">Manutenção Preventiva</option>
                <option value="importacao">Importação de Planilha</option>
                <option value="integracao">Integração / Telemetria</option>
              </select>
            </div>
          </div>

          {/* Foto do Painel */}
          <ReadingPhotoPreview photoUrl={photoUrl} onPhotoChange={setPhotoUrl} />

          {/* Justificativa Obrigatória quando exigida */}
          {validation?.requiresJustification && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono-label text-warning uppercase block font-bold">
                Justificativa Obrigatória *
              </label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explique o motivo desta leitura (ex: erro de digitação anterior, equipamento parado, troca de relógio)..."
                rows={2}
                className="w-full bg-surface-container border border-warning/40 rounded-lg p-2.5 text-on-surface focus:outline-none"
                required
              />
            </div>
          )}

          {/* Observações Opcionais */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block">
              Observação Adicional
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas gerais sobre a operação ou horímetro..."
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
            />
          </div>

          {/* Rodapé e Botões */}
          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Salvar Leitura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
