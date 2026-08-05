import React from 'react';
import type { Tire } from '../../../types/tires';
import type { TireMovementLog } from '../../../types/tire-movement';
import { DollarSign } from 'lucide-react';

interface TireCostsTabProps {
  tire: Tire;
  movements: TireMovementLog[];
}

export const TireCostsTab: React.FC<TireCostsTabProps> = ({ tire, movements }) => {
  const acquisitionCost = tire.acquisitionValue || 0;
  const maintenanceCost = movements.reduce((acc, m) => acc + (m.cost && m.cost > 0 ? m.cost : 0), 0);
  const totalCost = acquisitionCost + maintenanceCost;

  const totalHours = tire.accumulatedHours || 1;
  const costPerHour = totalHours > 0 ? totalCost / totalHours : totalCost;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custo de Aquisição</span>
          <p className="text-xl font-bold text-on-surface mt-1 font-mono-label">
            R$ {acquisitionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Manutenções / Recapagens</span>
          <p className="text-xl font-bold text-amber-400 mt-1 font-mono-label">
            R$ {maintenanceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Custo Total por Hora Operada</span>
          <p className="text-xl font-bold text-emerald-400 mt-1 font-mono-label">
            R$ {costPerHour.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /h
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-400" /> Lançamentos de Custos do Pneu
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2.5 font-medium">Data</th>
                <th className="px-3.5 py-2.5 font-medium">Tipo de Custo</th>
                <th className="px-3.5 py-2.5 font-medium">Descrição</th>
                <th className="px-3.5 py-2.5 font-medium text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant font-mono-label">
              <tr className="hover:bg-surface-container-highest/20">
                <td className="px-3.5 py-2.5">{tire.acquisitionDate ? new Date(tire.acquisitionDate).toLocaleDateString('pt-BR') : '—'}</td>
                <td className="px-3.5 py-2.5 font-bold text-primary">Aquisição</td>
                <td className="px-3.5 py-2.5 font-sans">Compra de pneu novo — {tire.brand} {tire.model}</td>
                <td className="px-3.5 py-2.5 text-right font-bold text-on-surface">R$ {acquisitionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              {movements.filter(m => m.cost && m.cost > 0).map(m => (
                <tr key={m.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3.5 py-2.5 font-bold text-amber-400 capitalize">{m.action}</td>
                  <td className="px-3.5 py-2.5 font-sans">{m.notes || 'Serviço em pneu'}</td>
                  <td className="px-3.5 py-2.5 text-right font-bold text-amber-400">R$ {m.cost!.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
