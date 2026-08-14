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

            {(() => {
              const getRowType = (r: any) => {
                if (r.nature === 'INSPECTION' || r.type === 'inspecao') return 'ROUTINE_INSPECTION';
                if (r.nature && r.nature !== 'MAINTENANCE') return r.nature;
                const mType = r.maintenanceType || (r.type === 'preventiva' ? 'PREVENTIVE' : (r.type === 'preditiva' ? 'PREDICTIVE' : 'CORRECTIVE'));
                if (mType === 'PREVENTIVE') return 'PREVENTIVE';
                if (mType === 'CORRECTIVE') {
                  const mode = r.correctiveMode || ((r.type === 'corretiva_nao_planejada' || r.type === 'emergencial') ? 'EMERGENCY' : 'PLANNED');
                  return mode === 'EMERGENCY' ? 'CORRECTIVE_EMERGENCY' : 'CORRECTIVE_PLANNED';
                }
                if (mType === 'PREDICTIVE') return 'PREDICTIVE';
                if (mType === 'CONDITION_BASED') return 'CONDITION_BASED';
                if (mType === 'ROUTINE_INSPECTION') return 'ROUTINE_INSPECTION';
                return 'PREVENTIVE';
              };

              const chartSeries = [
                { label: 'Preventiva', value: data.rows.filter((r: any) => getRowType(r) === 'PREVENTIVE').length, color: 'bg-emerald-500' },
                { label: 'Corretiva Planejada', value: data.rows.filter((r: any) => getRowType(r) === 'CORRECTIVE_PLANNED').length, color: 'bg-blue-500' },
                { label: 'Corretiva Emergencial', value: data.rows.filter((r: any) => getRowType(r) === 'CORRECTIVE_EMERGENCY').length, color: 'bg-rose-500' },
                { label: 'Preditiva', value: data.rows.filter((r: any) => getRowType(r) === 'PREDICTIVE').length, color: 'bg-indigo-500' },
                { label: 'Baseada em Condição', value: data.rows.filter((r: any) => getRowType(r) === 'CONDITION_BASED').length, color: 'bg-amber-500' },
                { label: 'Inspeção / Rotina', value: data.rows.filter((r: any) => getRowType(r) === 'ROUTINE_INSPECTION').length, color: 'bg-slate-500' },
              ].filter(s => s.value > 0);

              return (
                <ReportChart
                  title="Ordens de Serviço por Tipo"
                  description="Distribuição consolidada entre preventivas, corretivas planejadas/emergenciais e demais estratégias"
                  series={chartSeries.length > 0 ? chartSeries : [{ label: 'Sem registros', value: 0, color: 'bg-gray-400' }]}
                />
              );
            })()}

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <ReportTable data={data} visibleColumns={colsToDisplay.filter(c => c.visible)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
