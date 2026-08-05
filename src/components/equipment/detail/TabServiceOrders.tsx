import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { Plus } from 'lucide-react';
import { StatusBadge } from '../../ui/StatusBadge';
import { Button } from '../../ui/Button';

interface TabServiceOrdersProps {
  equipment?: Equipment;
  onNewOS?: () => void;
}

const mockOrders = [
  { id: 'OS-0042', date: '01/08/2026', type: 'Corretiva não planejada', description: 'Vazamento de óleo no retentor dianteiro', status: 'Em execução', responsible: 'João Mecânico', priority: 'Alta' },
  { id: 'OS-0028', date: '10/07/2026', type: 'Preventiva', description: 'Revisão periódica de 250h', status: 'Concluída', responsible: 'Pedro Antunes', priority: 'Média' },
  { id: 'OS-0012', date: '15/05/2026', type: 'Inspeção', description: 'Troca de lâmpadas do farol auxiliar', status: 'Concluída', responsible: 'Carlos Silva', priority: 'Baixa' },
];

export const TabServiceOrders: React.FC<TabServiceOrdersProps> = ({ onNewOS }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-[14px] font-semibold text-on-surface">Ordens de Serviço do Equipamento</h4>
          <p className="text-[12px] text-on-surface-variant/70">Histórico de OS corretivas, preventivas e inspeções.</p>
        </div>
        {onNewOS && (
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onNewOS}>
            Abrir Nova OS
          </Button>
        )}
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-[12px] text-left">
          <thead>
            <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
              <th className="px-4 py-2.5 font-medium">OS #</th>
              <th className="px-4 py-2.5 font-medium">Data de Abertura</th>
              <th className="px-4 py-2.5 font-medium">Tipo</th>
              <th className="px-4 py-2.5 font-medium">Descrição</th>
              <th className="px-4 py-2.5 font-medium">Prioridade</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Responsável</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-on-surface-variant">
            {mockOrders.map((os) => (
              <tr key={os.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-4 py-3 font-mono-label text-primary font-bold">{os.id}</td>
                <td className="px-4 py-3 font-mono-label">{os.date}</td>
                <td className="px-4 py-3 font-medium text-on-surface">{os.type}</td>
                <td className="px-4 py-3">{os.description}</td>
                <td className="px-4 py-3 font-mono-label font-bold text-error">{os.priority}</td>
                <td className="px-4 py-3"><StatusBadge status={os.status} /></td>
                <td className="px-4 py-3">{os.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
