import React, { useState } from 'react';
import { Download, FileText, Printer, Table } from 'lucide-react';
import type { ReportExportFormat } from '../../types/report-export';

interface ReportExportMenuProps {
  onExport: (format: ReportExportFormat) => void;
}

export const ReportExportMenu: React.FC<ReportExportMenuProps> = ({ onExport }) => {
  const [open, setOpen] = useState(false);

  const handleExport = (format: ReportExportFormat) => {
    onExport(format);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 bg-primary text-on-primary hover:bg-primary-dark rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
      >
        <Download size={14} /> Exportar Relatório
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in text-xs space-y-1">
          <button
            onClick={() => handleExport('csv')}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container text-on-surface font-bold text-left"
          >
            <Table size={15} className="text-emerald-400" /> Exportar em CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container text-on-surface font-bold text-left"
          >
            <FileText size={15} className="text-rose-400" /> Exportar em PDF
          </button>
          <button
            onClick={() => handleExport('print')}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container text-on-surface font-bold text-left"
          >
            <Printer size={15} className="text-blue-400" /> Imprimir Documento
          </button>
        </div>
      )}
    </div>
  );
};
