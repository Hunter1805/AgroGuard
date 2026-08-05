import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Tire } from '../../../types/tires';
import { useTireMovements } from '../../../hooks/useTireMovements';
import { equipmentService } from '../../../services/equipment.service';
import { tiresService } from '../../../services/tires.service';
import { Button } from '../../ui/Button';

interface TireInstallationModalProps {
  tire?: Tire;
  equipmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TireInstallationModal: React.FC<TireInstallationModalProps> = ({ tire, equipmentId: initialEquipmentId, onClose, onSuccess }) => {
  const { installTire } = useTireMovements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableTires, setAvailableTires] = useState<Tire[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);

  const [selectedTireId, setSelectedTireId] = useState(tire?.id || '');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(initialEquipmentId || '');
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [reading, setReading] = useState<number | ''>('');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      const [tiresList, eqList] = await Promise.all([
        tiresService.getTires({ status: 'disponivel' }),
        equipmentService.getAllEquipments(),
      ]);
      if (tire && !tiresList.some((t: Tire) => t.id === tire.id)) {
        tiresList.unshift(tire);
      }
      setAvailableTires(tiresList);
      setEquipments(eqList);
    }
    loadData();
  }, [tire]);

  useEffect(() => {
    async function loadPositions() {
      if (!selectedEquipmentId) {
        setPositions([]);
        return;
      }
      const config = await tiresService.getEquipmentTireConfiguration(selectedEquipmentId);
      if (config) {
        const freePositions: any[] = [];
        config.axles.forEach(axle => {
          axle.positions.forEach(pos => {
            if (!pos.installedTireId) {
              freePositions.push({ ...pos, axleName: axle.name });
            }
          });
        });
        setPositions(freePositions);
      } else {
        setPositions([
          { id: 'pos-1e', name: 'Eixo 1 - Dianteiro Esquerdo', code: '1E' },
          { id: 'pos-1d', name: 'Eixo 1 - Dianteiro Direito', code: '1D' },
          { id: 'pos-2e', name: 'Eixo 2 - Traseiro Esquerdo', code: '2E' },
          { id: 'pos-2d', name: 'Eixo 2 - Traseiro Direito', code: '2D' },
        ]);
      }
    }
    loadPositions();
  }, [selectedEquipmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTireId || !selectedEquipmentId || !selectedPositionId) {
      setError('Por favor preencha Pneu, Equipamento e Posição livre.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const eq = equipments.find(e => e.id === selectedEquipmentId);
      const pos = positions.find(p => p.id === selectedPositionId);

      await installTire({
        tireId: selectedTireId,
        equipmentId: selectedEquipmentId,
        equipmentName: eq ? `${eq.code} - ${eq.name}` : selectedEquipmentId,
        positionId: selectedPositionId,
        positionName: pos ? `${pos.code} (${pos.name})` : selectedPositionId,
        reading: reading === '' ? undefined : Number(reading),
        responsibleId: 'RESP-01',
        responsibleName,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao instalar pneu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm">Instalar Pneu em Equipamento</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Selecionar Pneu *</label>
            <select
              value={selectedTireId}
              onChange={e => setSelectedTireId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="">Selecione um pneu disponível...</option>
              {availableTires.map(t => (
                <option key={t.id} value={t.id}>
                  {t.internalCode} — {t.brand} {t.model} ({t.size})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Equipamento de Destino *</label>
            <select
              value={selectedEquipmentId}
              onChange={e => setSelectedEquipmentId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="">Selecione o equipamento...</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.code} — {eq.name} ({eq.assetType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Posição no Eixo *</label>
              <select
                value={selectedPositionId}
                onChange={e => setSelectedPositionId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
                disabled={!selectedEquipmentId}
              >
                <option value="">Selecione a posição...</option>
                {positions.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Leitura do Odômetro/Horímetro</label>
              <input
                type="number"
                placeholder="Ex: 7800"
                value={reading}
                onChange={e => setReading(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
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

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Instruções ou motivo da instalação..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Confirmar Instalação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
