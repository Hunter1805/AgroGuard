import React from 'react';
import type { StockItem } from '../../../types/parts';
import { Wrench } from 'lucide-react';

interface StockCompatibilityTabProps {
  item: StockItem;
}

export const StockCompatibilityTab: React.FC<StockCompatibilityTabProps> = ({ item }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <Wrench size={16} className="text-primary" /> Equipamentos e Modelos Compatíveis
      </h3>

      {(!item.compatibleEquipmentNames || item.compatibleEquipmentNames.length === 0) ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma compatibilidade registrada para este item.</p>
      ) : (
        <div className="space-y-2">
          {item.compatibleEquipmentNames.map((name, idx) => (
            <div key={idx} className="p-3 bg-surface-container rounded-xl border border-white/10 font-bold text-on-surface">
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
