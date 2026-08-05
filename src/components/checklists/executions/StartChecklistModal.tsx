import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Gauge, Tractor, User, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { useEquipments } from '../../../hooks/useEquipments';
import { useChecklistTemplateForm } from '../../../hooks/useChecklistTemplateForm';
import { useChecklistExecution } from '../../../hooks/useChecklistExecution';
import { ROUTE_HELPERS } from '../../../types/routes';

interface StartChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquipmentId?: string;
}

export const StartChecklistModal: React.FC<StartChecklistModalProps> = ({
  isOpen,
  onClose,
  initialEquipmentId,
}) => {
  const navigate = useNavigate();
  const { equipments } = useEquipments();
  const { templates } = useChecklistTemplateForm();
  const { startNewExecution } = useChecklistExecution();

  const [selectedEquipmentId, setSelectedEquipmentId] = useState(initialEquipmentId || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [operatorName, setOperatorName] = useState('Motorista / Operador (Marcos Paulo)');
  const [horimeterReading, setHorimeterReading] = useState<string>('');
  const [initialPhotoUrl, setInitialPhotoUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEquipmentId) {
      setSelectedEquipmentId(initialEquipmentId);
    }
  }, [initialEquipmentId]);

  const currentEq = equipments.find((eq) => eq.id === selectedEquipmentId);
  
  // Filtrar modelos compatíveis com o tipo deste equipamento ou mostrar todos se nenhum selecionado
  const compatibleTemplates = templates.filter((tpl) => {
    if (!tpl.active) return false;
    if (!currentEq) return true;
    if (tpl.applicableEquipmentTypeIds?.includes(currentEq.assetType) || tpl.applicableEquipmentTypeIds?.length === 0) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (compatibleTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(compatibleTemplates[0].id);
    }
    if (currentEq) {
      setHorimeterReading(currentEq.currentHours?.toString() || '');
    }
  }, [compatibleTemplates, currentEq, selectedTemplateId]);

  if (!isOpen) return null;

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentId || !selectedTemplateId) {
      setError('Selecione o equipamento e o modelo de checklist.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const numReading = parseFloat(horimeterReading) || undefined;
      const created = await startNewExecution({
        templateId: selectedTemplateId,
        equipmentId: selectedEquipmentId,
        operatorName,
        horimeterReading: currentEq?.meterType !== 'odometro' ? numReading : undefined,
        odometerReading: currentEq?.meterType === 'odometro' ? numReading : undefined,
        initialPhotoUrl: initialPhotoUrl || undefined,
        generalNotes: notes.trim() || undefined,
      });

      onClose();
      // Navegar diretamente para a tela de preenchimento do checklist criado
      navigate(ROUTE_HELPERS.checklistExecution(created.id));
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar sessão de checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-lg w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-primary">
            <CheckSquare size={22} />
            <div>
              <h3 className="font-title-md text-[16px] font-bold text-on-surface">Iniciar Novo Checklist</h3>
              <p className="text-[12px] text-on-surface-variant/70">Inspeção pré-operacional, diária ou segurança da frota.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error/15 text-error rounded-xl text-[12px] border border-error/30 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleStart} className="space-y-4 text-[12px]">
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1 flex items-center gap-1">
                <Tractor size={14} /> Equipamento Alvo *
              </label>
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                required
              >
                <option value="">Selecione o equipamento na frota...</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.plateOrCode} — {eq.name} ({eq.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1 flex items-center gap-1">
                <CheckSquare size={14} /> Modelo de Checklist *
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                required
              >
                <option value="">Selecione o modelo de inspeção...</option>
                {compatibleTemplates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.code} — {tpl.name} (v{tpl.version})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1 flex items-center gap-1">
                  <User size={14} /> Operador / Inspetor *
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-label text-primary uppercase font-bold block mb-1 flex items-center gap-1">
                  <Gauge size={14} /> Leitura Atual ({currentEq?.meterType === 'odometro' ? 'km' : 'h'})
                </label>
                <input
                  type="number"
                  step="any"
                  value={horimeterReading}
                  onChange={(e) => setHorimeterReading(e.target.value)}
                  placeholder="Ex: 6810"
                  className="w-full bg-surface-container border border-primary/40 rounded-lg px-3 py-2 text-primary font-bold focus:outline-none font-mono-label"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1 flex items-center gap-1">
                <Camera size={14} /> URL da Foto Inicial do Pátio (Opcional)
              </label>
              <input
                type="text"
                value={initialPhotoUrl}
                onChange={(e) => setInitialPhotoUrl(e.target.value)}
                placeholder="https://exemplo.com/foto-trator.jpg"
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none mb-3"
              />

              <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
                Observações ou Condição Inicial (Opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Trator assumido limpo e com tanque cheio..."
                rows={2}
                className="w-full bg-surface-container border border-white/10 rounded-lg p-2 text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} icon={<CheckSquare size={16} />}>
              Iniciar Inspeção
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
