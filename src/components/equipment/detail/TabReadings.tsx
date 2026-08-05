import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { Plus, Camera } from 'lucide-react';
import { Button } from '../../ui/Button';

interface TabReadingsProps {
  equipment: Equipment;
  onNewReading?: () => void;
}

const mockReadings = [
  { id: '1', date: '04/08/2026 07:30', value: 6800, delta: 8, source: 'Checklist Diário', user: 'Paulo Souza', status: 'normal', photo: true },
  { id: '2', date: '03/08/2026 17:00', value: 6792, delta: 7, source: 'Registro Rápido', user: 'Carlos Silva', status: 'normal', photo: true },
  { id: '3', date: '02/08/2026 08:15', value: 6785, delta: 9, source: 'Checklist Diário', user: 'Paulo Souza', status: 'normal', photo: false },
  { id: '4', date: '01/08/2026 18:00', value: 6776, delta: 6, source: 'Ordem de Serviço', user: 'João Mecânico', status: 'normal', photo: false },
];

export const TabReadings: React.FC<TabReadingsProps> = ({ equipment, onNewReading }) => {
  const unit = equipment.meterType === 'odometro' ? 'km' : 'h';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-[14px] font-semibold text-on-surface">Histórico de Leituras de Medidor</h4>
          <p className="text-[12px] text-on-surface-variant/70">Registros de horímetro/odômetro validados para este equipamento.</p>
        </div>
        {onNewReading && (
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onNewReading}>
            Registrar Nova Leitura
          </Button>
        )}
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-[12px] text-left">
          <thead>
            <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
              <th className="px-4 py-2.5 font-medium">Data / Hora</th>
              <th className="px-4 py-2.5 font-medium">Leitura ({unit})</th>
              <th className="px-4 py-2.5 font-medium">Variação (Δ)</th>
              <th className="px-4 py-2.5 font-medium">Origem</th>
              <th className="px-4 py-2.5 font-medium">Registrado por</th>
              <th className="px-4 py-2.5 font-medium">Comprovante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant">
            {mockReadings.map((r) => (
              <tr key={r.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-4 py-3 font-mono-label text-on-surface">{r.date}</td>
                <td className="px-4 py-3 font-mono-label font-bold text-primary">{r.value.toLocaleString('pt-BR')} {unit}</td>
                <td className="px-4 py-3 font-mono-label text-success">+{r.delta} {unit}</td>
                <td className="px-4 py-3">{r.source}</td>
                <td className="px-4 py-3">{r.user}</td>
                <td className="px-4 py-3">
                  {r.photo ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
                      <Camera size={12} /> Foto do Painel
                    </span>
                  ) : (
                    <span className="text-on-surface-variant/40">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
