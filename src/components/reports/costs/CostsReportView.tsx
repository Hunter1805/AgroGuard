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

export const CostsReportView: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useReportFilters();
  const { data, loading } = useReportData('custos', filters);
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
        title="Relatório Consolidado de Custos"
        subtitle="Agregação dos custos operacionais com peças, pneus e mão de obra por equipamento"
        columns={colsToDisplay}
        onToggleColumn={handleToggleColumn}
        onExport={fmt => data && exportData('Relatório Consolidado de Custos', 'custos', fmt, { ...data, columns: colsToDisplay })}
      />

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <ReportGlobalFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">Carregando relatório de custos...</div>
        ) : !data || data.rows.length === 0 ? (
          <ReportEmptyState />
        ) : (
          <div className="p-4 space-y-4">
            <ReportStats totalRows={data.totalRows} totals={data.totals} />

            <ReportChart
              title="Composição dos Custos Operacionais"
              description="Distribuição do gasto acumulado entre peças, pneus e mão de obra técnica"
              unit="R$"
              series={[
                { label: 'Peças & Insumos', value: Number(data.totals?.partsCost || 0), color: 'bg-emerald-500' },
                { label: 'Pneus & Borracharia', value: Number(data.totals?.tiresCost || 0), color: 'bg-blue-500' },
                { label: 'Mão de Obra', value: Number(data.totals?.laborCost || 0), color: 'bg-amber-500' },
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
