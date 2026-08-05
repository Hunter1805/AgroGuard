import React, { useState } from 'react';
import { Columns, Check } from 'lucide-react';
import type { ReportColumn } from '../../types/reports';

interface ReportColumnSelectorProps {
  columns: ReportColumn[];
  onToggleColumn: (columnId: string) => void;
}

export const ReportColumnSelector: React.FC<ReportColumnSelectorProps> = ({ columns, onToggleColumn }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-white/10 rounded-xl text-xs font-bold text-on-surface flex items-center gap-1.5 transition-colors"
      >
        <Columns size={14} /> Colunas ({columns.filter(c => c.visible).length}/{columns.length})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in text-xs">
          <div className="font-bold text-on-surface p-2 border-b border-white/10 font-mono-label text-[11px]">
            Exibir/Ocultar Colunas
          </div>
          <div className="max-h-60 overflow-y-auto py-1 space-y-1">
            {columns.map(col => (
              <button
                key={col.id}
                onClick={() => onToggleColumn(col.id)}
                className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left hover:bg-surface-container transition-colors text-on-surface"
              >
                <span>{col.label}</span>
                {col.visible && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
