import React, { useState, useEffect } from 'react';
import { X, RefreshCw, AlertCircle } from 'lucide-react';
import { useTireMovements } from '../../../hooks/useTireMovements';
import { tiresService } from '../../../services/tires.service';
import { equipmentService } from '../../../services/equipment.service';
import { Button } from '../../ui/Button';

interface TireRotationModalProps {
  equipmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TireRotationModal: React.FC<TireRotationModalProps> = ({ equipmentId: initialEquipmentId, onClose, onSuccess }) => {
  const { rotateTires } = useTireMovements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [equipments, setEquipments] = useState<any[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(initialEquipmentId || '');
  const [positionsWithTires, setPositionsWithTires] = useState<any[]>([]);

  const [pos1Id, setPos1Id] = useState('');
  const [pos2Id, setPos2Id] = useState('');
  const [reading, setReading] = useState<number | ''>('');
  const [responsibleName, setResponsibleName] = useState('Carlos Silva');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadEquipments() {
      const list = await equipmentService.getAllEquipments();
      setEquipments(list);
    }
    loadEquipments();
  }, []);

  useEffect(() => {
    async function loadPositions() {
      if (!selectedEquipmentId) {
        setPositionsWithTires([]);
        return;
      }
      const config = await tiresService.getEquipmentTireConfiguration(selectedEquipmentId);
      if (config) {
        const installed: any[] = [];
        config.axles.forEach(axle => {
          axle.positions.forEach(pos => {
            if (pos.installedTireId) {
              installed.push({ ...pos, axleName: axle.name });
            }
          });
        });
        setPositionsWithTires(installed);
      }
    }
    loadPositions();
  }, [selectedEquipmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentId || !pos1Id || !pos2Id) {
      setError('Selecione o equipamento e as duas posições para rodízio.');
      return;
    }
    if (pos1Id === pos2Id) {
      setError('A posição de origem e destino não podem ser iguais.');
      return;
    }

    const p1 = positionsWithTires.find(p => p.id === pos1Id);
    const p2 = positionsWithTires.find(p => p.id === pos2Id);

    if (!p1 || !p2) {
      setError('Uma das posições selecionadas não possui pneu instalado.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const eq = equipments.find(e => e.id === selectedEquipmentId);

      await rotateTires({
        equipmentId: selectedEquipmentId,
        equipmentName: eq ? `${eq.code} - ${eq.name}` : selectedEquipmentId,
        pos1Id: p1.id,
        pos1Name: `${p1.code} (${p1.name})`,
        pos1TireId: p1.installedTireId,
        pos2Id: p2.id,
        pos2Name: `${p2.code} (${p2.name})`,
        pos2TireId: p2.installedTireId,
        reading: reading === '' ? undefined : Number(reading),
        responsibleId: 'RESP-01',
        responsibleName,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar rodízio.');
    } finally {
      setLoading(false);
    }
  };

  const p1Selected = positionsWithTires.find(p => p.id === pos1Id);
  const p2Selected = positionsWithTires.find(p => p.id === pos2Id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <RefreshCw className="text-primary" size={16} />
            Realizar Rodízio de Pneus
          </h3>
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
            <label className="block text-on-surface-variant font-mono-label mb-1">Equipamento *</label>
            <select
              value={selectedEquipmentId}
              onChange={e => {
                setSelectedEquipmentId(e.target.value);
                setPos1Id('');
                setPos2Id('');
              }}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="">Selecione o equipamento...</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.code} — {eq.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Posição A *</label>
              <select
                value={pos1Id}
                onChange={e => setPos1Id(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
                disabled={!selectedEquipmentId}
              >
                <option value="">Selecione a Posição A...</option>
                {positionsWithTires.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — Pneu: {p.installedTireId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Posição B *</label>
              <select
                value={pos2Id}
                onChange={e => setPos2Id(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
                disabled={!selectedEquipmentId}
              >
                <option value="">Selecione a Posição B...</option>
                {positionsWithTires.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — Pneu: {p.installedTireId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visual do Rodízio */}
          {p1Selected && p2Selected && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between text-xs font-mono-label">
              <div>
                <span className="text-on-surface-variant text-[10px] block">Pneu A ({p1Selected.installedTireId})</span>
                <span className="font-bold text-on-surface">{p1Selected.code} ➔ {p2Selected.code}</span>
              </div>
              <RefreshCw size={18} className="text-primary animate-spin-slow" />
              <div className="text-right">
                <span className="text-on-surface-variant text-[10px] block">Pneu B ({p2Selected.installedTireId})</span>
                <span className="font-bold text-on-surface">{p2Selected.code} ➔ {p1Selected.code}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Leitura Atual (h/km)</label>
              <input
                type="number"
                value={reading}
                onChange={e => setReading(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
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

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Motivo do rodízio (ex: equalização de desgaste)..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <RefreshCw size={14} /> Confirmar Rodízio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
