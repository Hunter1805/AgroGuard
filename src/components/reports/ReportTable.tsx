import React from 'react';
import type { ReportColumn, ReportTableData } from '../../types/reports';

interface ReportTableProps {
  data: ReportTableData;
  visibleColumns: ReportColumn[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ data, visibleColumns }) => {
  const formatCellValue = (val: any, col: ReportColumn) => {
    if (val === undefined || val === null) return '—';
    if (col.format === 'currency' && typeof val === 'number') {
      return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    if (col.format === 'badge') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/15 text-primary border border-primary/30 uppercase">
          {String(val).replace(/_/g, ' ')}
        </span>
      );
    }
    return String(val);
  };

  return (
    <div className="overflow-x-auto text-xs">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
            {visibleColumns.map(col => (
              <th key={col.id} className={`px-4 py-3 font-medium ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-on-surface-variant">
          {data.rows.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-surface-container-highest/20 transition-colors">
              {visibleColumns.map(col => (
                <td
                  key={col.id}
                  className={`px-4 py-3 ${col.align === 'right' ? 'text-right font-mono-label font-bold' : ''} ${
                    col.id === 'code' || col.id === 'internalCode' ? 'font-mono-label font-bold text-primary' : ''
                  }`}
                >
                  {formatCellValue(row[col.id], col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {data.totals && (
          <tfoot>
            <tr className="bg-surface-container-highest/60 font-bold text-on-surface border-t-2 border-white/10 font-mono-label">
              {visibleColumns.map((col, idx) => (
                <td key={col.id} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''}`}>
                  {idx === 0 ? 'TOTAL' : data.totals?.[col.id] !== undefined ? formatCellValue(data.totals[col.id], col) : ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};
