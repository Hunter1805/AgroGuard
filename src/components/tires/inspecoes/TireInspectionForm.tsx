import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, ClipboardCheck, AlertCircle } from 'lucide-react';
import { equipmentService } from '../../../services/equipment.service';
import { tiresService } from '../../../services/tires.service';
import { useTireInspections } from '../../../hooks/useTireInspections';
import { tireIntegrationService } from '../../../services/tire-integration.service';
import { TireInspectionPositionCard } from './TireInspectionPositionCard';
import { Button } from '../../ui/Button';
import { PageHeader } from '../../ui/PageHeader';
import { ROUTES } from '../../../types/routes';

export const TireInspectionForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryEquipmentId = searchParams.get('equipmentId');

  const { createInspection } = useTireInspections();

  const [equipments, setEquipments] = useState<any[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(queryEquipmentId || '');
  const [inspectionType, setInspectionType] = useState<any>('rotina');
  const [horimeterReading, setHorimeterReading] = useState<number | ''>('');
  const [odometerReading, setOdometerReading] = useState<number | ''>('');
  const [location, setLocation] = useState('Oficina Central — Fazenda Primavera');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEquipments() {
      const list = await equipmentService.getAllEquipments();
      setEquipments(list);
    }
    loadEquipments();
  }, []);

  useEffect(() => {
    async function loadTiresForEquipment() {
      if (!selectedEquipmentId) {
        setItems([]);
        return;
      }
      const config = await tiresService.getEquipmentTireConfiguration(selectedEquipmentId);
      const equipmentTires = await tiresService.getTires({ equipmentId: selectedEquipmentId });

      if (config) {
        const initialItems: any[] = [];
        config.axles.forEach(axle => {
          axle.positions.forEach(pos => {
            if (pos.installedTireId) {
              const installed = equipmentTires.find(t => t.id === pos.installedTireId);
              initialItems.push({
                positionId: pos.id,
                positionName: `${pos.code} — ${pos.name}`,
                tireId: pos.installedTireId,
                tireCode: installed?.internalCode || pos.installedTireId,
                measuredPressure: installed?.recommendedMinimumPressure || 32,
                recommendedPressure: pos.recommendedMinimumPressure || installed?.recommendedMinimumPressure || 32,
                measuredTreadDepth: installed?.currentTreadDepth || 15,
                anomalies: [],
                result: 'conforme',
                recommendedAction: 'nenhuma',
              });
            }
          });
        });
        setItems(initialItems);
      }
    }
    loadTiresForEquipment();
  }, [selectedEquipmentId]);

  const handleItemChange = (index: number, updatedItem: any) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = updatedItem;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentId) {
      setError('Por favor selecione um equipamento.');
      return;
    }
    if (items.length === 0) {
      setError('Este equipamento não possui pneus instalados para inspeção.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const hasCritical = items.some(i => i.result === 'critico' || i.recommendedAction === 'criar_os');
      const overallResult = hasCritical ? 'critico' : items.some(i => i.result === 'atencao') ? 'atencao' : 'conforme';

      const inspection = await createInspection({
        equipmentId: selectedEquipmentId,
        inspectionType,
        date: new Date().toISOString(),
        responsibleId: 'RESP-01',
        responsibleName,
        horimeterReading: horimeterReading === '' ? undefined : Number(horimeterReading),
        odometerReading: odometerReading === '' ? undefined : Number(odometerReading),
        location,
        notes: notes || undefined,
        overallResult,
        items,
      });

      // Se houver anomalia crítica, solicita ou gera a OS integrada automaticamente
      for (const item of items) {
        if (item.recommendedAction === 'criar_os' || item.result === 'critico') {
          await tireIntegrationService.createWorkOrderFromInspection({
            inspectionId: inspection.id,
            tireId: item.tireId,
            tireCode: item.tireCode,
            equipmentId: selectedEquipmentId,
            anomalyDescription: item.anomalies.join(', ') || 'Anomalia detectada em inspeção de rotina',
            recommendedAction: item.recommendedAction,
          });
        }
      }

      navigate(ROUTES.PNEUS_INSPECOES);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar inspeção.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-14 animate-fade-in">
      <PageHeader
        title="Lançar Nova Inspeção de Pneus"
        subtitle="Auditoria preventiva de pressão, sulco e integridade das carcaças por equipamento"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PNEUS_INSPECOES)}>
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 border-b border-white/5 pb-3">
            <ClipboardCheck className="text-primary" size={18} />
            Dados Gerais da Inspeção
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Equipamento *</label>
              <select
                value={selectedEquipmentId}
                onChange={e => setSelectedEquipmentId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-semibold"
                required
              >
                <option value="">Selecione um equipamento...</option>
                {equipments.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.code} — {eq.name} ({eq.assetType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Tipo de Inspeção *</label>
              <select
                value={inspectionType}
                onChange={e => setInspectionType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="rotina">Rotina</option>
                <option value="pre_operacao">Pré-Operação</option>
                <option value="semanal">Semanal</option>
                <option value="manutencao">Manutenção</option>
                <option value="emergencial">Emergencial</option>
              </select>
            </div>

            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Responsável *</label>
              <input
                type="text"
                value={responsibleName}
                onChange={e => setResponsibleName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Leitura do Horímetro (h)</label>
              <input
                type="number"
                value={horimeterReading}
                onChange={e => setHorimeterReading(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Leitura do Odômetro (km)</label>
              <input
                type="number"
                value={odometerReading}
                onChange={e => setOdometerReading(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block font-mono-label text-on-surface-variant mb-1">Localização</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Pneus a inspecionar */}
        {selectedEquipmentId && (
          <div className="space-y-4">
            <h3 className="font-bold text-on-surface text-sm">Pneus Instalados no Equipamento ({items.length})</h3>
            {items.length === 0 ? (
              <div className="p-8 glass-card rounded-2xl text-center text-on-surface-variant">
                Este equipamento ainda não possui pneus vinculados no mapa de eixos.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, idx) => (
                  <TireInspectionPositionCard
                    key={item.positionId}
                    item={item}
                    onChange={updated => handleItemChange(idx, updated)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

          <div>
            <label className="block font-mono-label text-on-surface-variant mb-1">Observações da Inspeção</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Instruções ou observações gerais..."
            />
          </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PNEUS_INSPECOES)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
            <Save size={16} /> Salvar Inspeção
          </Button>
        </div>
      </form>
    </div>
  );
};
