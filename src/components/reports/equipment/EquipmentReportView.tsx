import React, { useState } from 'react';
import { useReportFilters } from '../../../hooks/useReportFilters';
import { useReportData } from '../../../hooks/useReportData';
import { useReportExport } from '../../../hooks/useReportExport';
import { useFavoriteReports } from '../../../hooks/useFavoriteReports';
import { ReportHeader } from '../ReportHeader';
import { ReportGlobalFilters } from '../ReportGlobalFilters';
import { ReportStats } from '../ReportStats';
import { ReportChart } from '../ReportChart';
import { ReportTable } from '../ReportTable';
import { ReportEmptyState } from '../ReportEmptyState';
import { FavoriteReportModal } from '../FavoriteReportModal';

export const EquipmentReportView: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useReportFilters();
  const { data, loading } = useReportData('equipamentos', filters);
  const { exportData } = useReportExport();
  const { saveFavorite } = useFavoriteReports();
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

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
        title="Relatório de Equipamentos & Frota"
        subtitle="Disponibilidade, horímetro/odômetro, custos acumulados e status da frota"
        columns={colsToDisplay}
        onToggleColumn={handleToggleColumn}
        onExport={fmt => data && exportData('Relatório de Equipamentos', 'equipamentos', fmt, { ...data, columns: colsToDisplay })}
      />

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <ReportGlobalFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
          onSaveFavorite={() => setShowFavoriteModal(true)}
        />

        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">Carregando relatório de equipamentos...</div>
        ) : !data || data.rows.length === 0 ? (
          <ReportEmptyState />
        ) : (
          <div className="p-4 space-y-4">
            <ReportStats totalRows={data.totalRows} totals={data.totals} />

            <ReportChart
              title="Equipamentos por Status Operacional"
              description="Distribuição da frota entre em operação, em manutenção e parados"
              series={[
                { label: 'Em Operação', value: data.rows.filter((r: any) => r.status === 'em_operacao' || r.status === 'disponivel').length, color: 'bg-emerald-500' },
                { label: 'Em Manutenção', value: data.rows.filter((r: any) => r.status === 'manutencao').length, color: 'bg-amber-500' },
                { label: 'Parados / Bloqueados', value: data.rows.filter((r: any) => r.status === 'parado' || r.status === 'bloqueado').length, color: 'bg-rose-500' },
              ]}
            />

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <ReportTable data={data} visibleColumns={colsToDisplay.filter(c => c.visible)} />
            </div>
          </div>
        )}
      </div>

      {showFavoriteModal && (
        <FavoriteReportModal
          category="equipamentos"
          filters={filters}
          visibleColumns={colsToDisplay.filter(c => c.visible).map(c => c.id)}
          onClose={() => setShowFavoriteModal(false)}
          onSave={async (name, isPriv) => {
            await saveFavorite({
              name,
              category: 'equipamentos',
              reportTypeId: 'rep-equipments',
              filters,
              visibleColumns: colsToDisplay.filter(c => c.visible).map(c => c.id),
              createdByName: 'Roberto Alves',
              isPrivate: isPriv,
            });
          }}
        />
      )}
    </div>
  );
};
