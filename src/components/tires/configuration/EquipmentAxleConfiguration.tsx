import React, { useState } from 'react';
import { X, Save, Sliders, AlertCircle } from 'lucide-react';
import type { EquipmentTireConfiguration } from '../../../types/tires';
import { useEquipmentTires } from '../../../hooks/useEquipmentTires';
import { Button } from '../../ui/Button';

interface EquipmentAxleConfigurationProps {
  equipmentId: string;
  config?: EquipmentTireConfiguration | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EquipmentAxleConfiguration: React.FC<EquipmentAxleConfigurationProps> = ({
  equipmentId,
  config,
  onClose,
  onSuccess,
}) => {
  const { saveConfiguration } = useEquipmentTires(equipmentId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [axleCount, setAxleCount] = useState(config?.axleCount || 2);
  const [spareTireCount, setSpareTireCount] = useState(config?.spareTireCount || 1);
  const [pressureUnit, setPressureUnit] = useState<'psi' | 'bar' | 'kpa'>(config?.pressureUnit || 'psi');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Gera eixos com posições padrão
      const generatedAxles = Array.from({ length: axleCount }).map((_, idx) => {
        const order = idx + 1;
        const isFirst = order === 1;
        const type = isFirst ? 'direcional' : 'tracao';
        const sideConfig = isFirst ? 'simples' : 'duplo';

        return {
          id: `axle-${order}`,
          order,
          name: `Eixo ${order} — ${isFirst ? 'Dianteiro' : 'Traseiro'}`,
          type: type as any,
          sideConfiguration: sideConfig as any,
          positions: [
            {
              id: `pos-${order}e`,
              code: `${order}E`,
              name: `Eixo ${order} Esquerdo`,
              axleId: `axle-${order}`,
              axleOrder: order,
              side: 'esquerdo' as any,
              recommendedMinimumPressure: isFirst ? 32 : 28,
              recommendedMaximumPressure: isFirst ? 38 : 34,
            },
            {
              id: `pos-${order}d`,
              code: `${order}D`,
              name: `Eixo ${order} Direito`,
              axleId: `axle-${order}`,
              axleOrder: order,
              side: 'direito' as any,
              recommendedMinimumPressure: isFirst ? 32 : 28,
              recommendedMaximumPressure: isFirst ? 38 : 34,
            },
          ],
        };
      });

      await saveConfiguration({
        axleCount,
        spareTireCount,
        pressureUnit,
        axles: generatedAxles,
        active: true,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configuração de eixos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            Configuração de Eixos do Equipamento
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
            <label className="block text-on-surface-variant font-mono-label mb-1">Quantidade de Eixos *</label>
            <input
              type="number"
              min={1}
              max={6}
              value={axleCount}
              onChange={e => setAxleCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Estepes Previstos</label>
              <input
                type="number"
                min={0}
                max={4}
                value={spareTireCount}
                onChange={e => setSpareTireCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Unidade de Pressão</label>
              <select
                value={pressureUnit}
                onChange={e => setPressureUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              >
                <option value="psi">PSI</option>
                <option value="bar">BAR</option>
                <option value="kpa">KPA</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-surface-container/60 rounded-xl border border-white/10 text-[11px] text-on-surface-variant">
            O salvamento irá estruturar automaticamente as posições dos eixos para montagem do mapa gráfico.
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Salvar Estrutura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
