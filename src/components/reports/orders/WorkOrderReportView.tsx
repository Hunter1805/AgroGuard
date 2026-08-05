import React, { useState } from 'react';
import { useReportFilters } from '../../../hooks/useReportFilters';
import { useReportData } from '../../../hooks/useReportData';
import { useReportExport } from '../../../hooks/useReportExport';
import { ReportHeader } from '../ReportHeader';
import { ReportGlobalFilters } from '../ReportGlobalFilters';
import { ReportStats } from '../ReportStats';
import { ReportChart } from '../ReportChart';
import { ReportTable } from '../ReportTable';
import { ReportEmptyState } from '../ReportEmptyState';

export const WorkOrderReportView: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useReportFilters();
  const { data, loading } = useReportData('ordens-servico', filters);
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
        title="Relatório de Ordens de Serviço"
        subtitle="Análise por tipo (preventiva/corretiva), prioridade, status e custos acumulados"
        columns={colsToDisplay}
        onToggleColumn={handleToggleColumn}
        onExport={fmt => data && exportData('Relatório de Ordens de Serviço', 'ordens-servico', fmt, { ...data, columns: colsToDisplay })}
      />

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <ReportGlobalFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">Carregando relatório de ordens de serviço...</div>
        ) : !data || data.rows.length === 0 ? (
          <ReportEmptyState />
        ) : (
          <div className="p-4 space-y-4">
            <ReportStats totalRows={data.totalRows} totals={data.totals} />

            <ReportChart
              title="Ordens de Serviço por Tipo"
              description="Proporção entre manutenções preventivas e corretivas emergenciais"
              series={[
                { label: 'Preventivas', value: data.rows.filter((r: any) => r.type === 'preventiva').length, color: 'bg-emerald-500' },
                { label: 'Corretivas', value: data.rows.filter((r: any) => r.type === 'corretiva').length, color: 'bg-amber-500' },
                { label: 'Preditivas', value: data.rows.filter((r: any) => r.type === 'preditiva').length, color: 'bg-indigo-500' },
              ]}
            />

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <ReportTable data={data} visibleColumns={colsToDisplay.filter(c => c.visible)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
