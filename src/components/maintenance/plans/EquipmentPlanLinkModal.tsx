import React, { useState } from 'react';
import { X, Link2, ShieldCheck } from 'lucide-react';
import type { MaintenancePlan } from '../../../types/maintenance-plan';
import { maintenancePlanService } from '../../../services/maintenance-plan.service';
import { Button } from '../../ui/Button';

interface EquipmentPlanLinkModalProps {
  plan: MaintenancePlan;
  onClose: () => void;
  onSuccess: () => void;
}

const mockAvailableMachines = [
  { id: 'EQ-022', name: 'Trator LS U80 22 4x4', code: 'TR-022', currentRead: 6185 },
  { id: 'EQ-001', name: 'Trator Massey 265 01 4x2', code: 'MAS-01', currentRead: 3442 },
  { id: 'EQ-005', name: 'Colhedora John Deere S700', code: 'COL-01', currentRead: 12515 },
  { id: 'EQ-018', name: 'Plantadeira Jacto Meridia 12', code: 'IMP-04', currentRead: 0 },
];

export const EquipmentPlanLinkModal: React.FC<EquipmentPlanLinkModalProps> = ({ plan, onClose, onSuccess }) => {
  const [selectedEqId, setSelectedEqId] = useState<string>(mockAvailableMachines[0].id);
  const [baseReading, setBaseReading] = useState<number>(mockAvailableMachines[0].currentRead);
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [workshop, setWorkshop] = useState<string>('Oficina Central Sede');
  const [responsible, setResponsible] = useState<string>('Eng. Mecânico (Carlos Roberto)');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEqChange = (id: string) => {
    setSelectedEqId(id);
    const m = mockAvailableMachines.find((x) => x.id === id);
    if (m) setBaseReading(m.currentRead);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const machine = mockAvailableMachines.find((x) => x.id === selectedEqId);
      await maintenancePlanService.linkPlanToEquipment({
        equipmentId: selectedEqId,
        equipmentCode: machine?.code || '',
        equipmentName: machine?.name || selectedEqId,
        planId: plan.id!,
        planName: plan.name,
        planVersion: plan.version || 1,
        startDate: baseDate,
        baseReading: Number(baseReading),
        baseDate,
        active: true,
        workshopName: workshop,
        maintenanceResponsibleName: responsible,
      } as any);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Erro ao vincular máquina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card bg-white dark:bg-gray-900 max-w-lg w-full p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Vincular Ativo ao Plano</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">{plan.name} (v{plan.version || 1})</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 p-2 rounded-lg">{error}</p>}

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Selecione o Equipamento / Máquina</label>
              <select
                value={selectedEqId}
                onChange={(e) => handleEqChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-purple-500"
              >
                {mockAvailableMachines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} • {m.name} (Leitura Atual: {m.currentRead}h)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Leitura Base (Horas/Km)</label>
                <input
                  type="number"
                  value={baseReading}
                  onChange={(e) => setBaseReading(Number(e.target.value))}
                  placeholder="Ex: 6000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm"
                />
                <span className="text-[10px] text-gray-400">Leitura a partir da qual conta o próximo intervalo.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Data-Base / Última Revisão</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Oficina / Comboio Responsável</label>
              <input
                type="text"
                value={workshop}
                onChange={(e) => setWorkshop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Responsável Técnico</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold"
              />
            </div>
          </div>

          <div className="mt-4 bg-purple-50 dark:bg-purple-950/50 p-3 rounded-xl border border-purple-100 dark:border-purple-900 flex items-center gap-2 text-xs text-purple-800 dark:text-purple-300 font-medium">
            <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <span>Ao salvar, o motor preventivo aplicará a regra deste plano (incluindo "O Que Ocorrer Primeiro") em tempo real ao ativo selecionado.</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="text-gray-500 font-bold text-xs">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 px-5">
            {loading ? 'Vinculando...' : 'Confirmar Vínculo'}
          </Button>
        </div>
      </div>
    </div>
  );
};
