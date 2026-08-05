import React, { useState, useEffect } from 'react';
import { Search, Gauge } from 'lucide-react';
import { tirePressureService } from '../../services/tools.service';
import type { TirePressureEntry } from '../../types/tools';

const pressureColor = (pressure: string) => {
  const vals = pressure.replace(/[^0-9\s]/g, ' ').trim().split(/\s+/).map(Number).filter(Boolean);
  if (vals.length === 0) return 'text-on-surface-variant';
  const max = Math.max(...vals);
  if (max >= 100) return 'text-error';
  if (max >= 60) return 'text-tertiary';
  return 'text-primary';
};

export const PressaoPneusView: React.FC = () => {
  const [tirePressures, setTirePressures] = useState<TirePressureEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await tirePressureService.getAll();
      setTirePressures(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = tirePressures.filter((t: TirePressureEntry) =>
    search.trim() === '' || t.vehicleType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">
            <Gauge size={20} className="inline mr-2 text-primary mb-0.5" />
            Tabela de Pressão de Pneus
          </h2>
          <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">
            Pressão recomendada (em lbs) por tipo de veículo/implemento.
          </p>
        </div>
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar tipo de veículo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-surface-container-highest border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 w-52"
          />
        </div>
      </div>

      <div className="flex gap-4 text-[11px] font-mono-label">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary/60" />Pressão baixa</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tertiary/60" />Pressão média</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error/60" />Pressão alta</span>
      </div>

      <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface-container-high/60 border-b border-white/8">
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wide w-6">#</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wide">Veículo / Implemento</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wide">Medida do Pneu</th>
              <th className="text-right px-5 py-3 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wide">Pressão (em lbs)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-on-surface-variant">Carregando...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-on-surface-variant">Nenhum resultado encontrado.</td>
              </tr>
            ) : (
              filtered.map((entry: TirePressureEntry) => (
                <tr key={entry.id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="px-5 py-3 font-mono-label text-[11px] text-on-surface-variant/50">{entry.id}</td>
                  <td className="px-5 py-3 text-on-surface font-medium">{entry.vehicleType}</td>
                  <td className="px-5 py-3 font-mono-label text-[12px] text-on-surface-variant/80">{entry.tireMeasure}</td>
                  <td className={`px-5 py-3 text-right font-bold font-mono-label text-[15px] ${pressureColor(entry.pressure)}`}>
                    {entry.pressure}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
