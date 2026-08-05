import React, { useState } from 'react';
import { X, Save, CalendarCheck, AlertCircle } from 'lucide-react';
import type { ToolCalibrationResult } from '../../../types/tool-calibration';
import { useTools } from '../../../hooks/useTools';
import { useToolCalibrations } from '../../../hooks/useToolCalibrations';
import { Button } from '../../ui/Button';

interface ToolCalibrationFormProps {
  toolId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolCalibrationForm: React.FC<ToolCalibrationFormProps> = ({ toolId: initialToolId, onClose, onSuccess }) => {
  const { tools } = useTools();
  const { registerCalibration } = useToolCalibrations();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [toolId, setToolId] = useState(initialToolId || '');
  const [calibrationType, setCalibrationType] = useState('Aferição de Precisão Standard');
  const [sentDate, setSentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [calibrationDate, setCalibrationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nextCalibrationDate, setNextCalibrationDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });
  const [responsibleCompany, setResponsibleCompany] = useState('Inmetro / TecnoCalib');
  const [certificateNumber, setCertificateNumber] = useState(`CERT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [result, setResult] = useState<ToolCalibrationResult>('aprovada');
  const [deviationFound, setDeviationFound] = useState('Sem desvios detectados');
  const [adjustmentMade, setAdjustmentMade] = useState('Calibração e zera de ponteiro');
  const [cost, setCost] = useState<number | ''>(250);
  const [responsibleName, setResponsibleName] = useState('Roberto Alves');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolId) {
      setError('Selecione uma ferramenta.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await registerCalibration({
        toolId,
        calibrationType,
        sentDate,
        calibrationDate,
        nextCalibrationDate,
        responsibleCompany,
        certificateNumber,
        result,
        deviationFound,
        adjustmentMade,
        cost: cost === '' ? undefined : Number(cost),
        responsibleName,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar calibração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <CalendarCheck size={16} className="text-primary" />
            Registrar Calibração de Ferramenta
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Ferramenta *</label>
            <select
              value={toolId}
              onChange={e => setToolId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="">Selecione a ferramenta a calibrar...</option>
              {tools.filter(t => t.requiresCalibration || t.category === 'Medição').map(t => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name} (SN: {t.serialNumber || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Tipo de Calibração</label>
              <input
                type="text"
                value={calibrationType}
                onChange={e => setCalibrationType(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Nº do Certificado</label>
              <input
                type="text"
                value={certificateNumber}
                onChange={e => setCertificateNumber(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Envio</label>
              <input
                type="date"
                value={sentDate}
                onChange={e => setSentDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Realização *</label>
              <input
                type="date"
                value={calibrationDate}
                onChange={e => setCalibrationDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Próxima Calibração *</label>
              <input
                type="date"
                value={nextCalibrationDate}
                onChange={e => setNextCalibrationDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Resultado da Calibração *</label>
              <select
                value={result}
                onChange={e => setResult(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              >
                <option value="aprovada">Aprovada</option>
                <option value="aprovada_com_restricao">Aprovada com Restrição</option>
                <option value="reprovada">Reprovada (Bloquear Ferramenta)</option>
              </select>
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Laboratório / Empresa *</label>
              <input
                type="text"
                value={responsibleCompany}
                onChange={e => setResponsibleCompany(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Ajuste Efetuado</label>
              <input
                type="text"
                value={adjustmentMade}
                onChange={e => setAdjustmentMade(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Responsável *</label>
              <input
                type="text"
                value={responsibleName}
                onChange={e => setResponsibleName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Desvio Encontrado</label>
              <input
                type="text"
                value={deviationFound}
                onChange={e => setDeviationFound(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={cost}
                onChange={e => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Instruções ou ressalvas técnicas..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Salvar Calibração
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
