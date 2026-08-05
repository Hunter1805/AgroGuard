import React from 'react';
import { FileText } from 'lucide-react';

export const StockDocumentsTab: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <FileText size={16} className="text-primary" /> Notas Fiscais e Laudos Técnicos
      </h3>
      <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhum documento anexado a este item.</p>
    </div>
  );
};
