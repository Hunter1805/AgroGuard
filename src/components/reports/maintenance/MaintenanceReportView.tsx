import React, { useState } from 'react';
import { useReportFilters } from '../../../hooks/useReportFilters';
import { useReportData } from '../../../hooks/useReportData';
import { useReportExport } from '../../../hooks/useReportExport';
import { ReportHeader } from '../ReportHeader';
import { ReportGlobalFilters } from '../ReportGlobalFilters';
import { ReportStats } from '../ReportStats';
import { ReportTable } from '../ReportTable';
import { ReportEmptyState } from '../ReportEmptyState';

export const MaintenanceReportView: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useReportFilters();
  const { data, loading } = useReportData('manutencoes', filters);
  const { exportData } = useReportExport();

  const [visibleColumns, setVisibleColumns] = useState<any[]>(() => data?.columns || []);

  React.useEffect(() => {
    if (data?.columns && visibleColumns.length === 0) {
      setVisibleColumns(data.columns);
    }
  }, [data?.columns]);

  const handleToggleColumn = (colId: string) => {
    setVisibleColumns(prev => prev.map(c => (c.id === colId ? { ...c, visible: !c.visible } : c)));
  };

  const colsToDisplay = visibleColumns.length > 0 ? visibleColumns : data?.columns || [];

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      <ReportHeader
        title="Relatório de Manutenções Preventivas"
        subtitle="Cumprimento de planos preventivos, revisões programadas e custos estimados"
        columns={colsToDisplay}
        onToggleColumn={handleToggleColumn}
        onExport={fmt => data && exportData('Relatório de Manutenções Preventivas', 'manutencoes', fmt, { ...data, columns: colsToDisplay })}
      />

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <ReportGlobalFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">Carregando relatório de manutenções...</div>
        ) : !data || data.rows.length === 0 ? (
          <ReportEmptyState />
        ) : (
          <div className="p-4 space-y-4">
            <ReportStats totalRows={data.totalRows} totals={data.totals} />
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <ReportTable data={data} visibleColumns={colsToDisplay.filter(c => c.visible)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
