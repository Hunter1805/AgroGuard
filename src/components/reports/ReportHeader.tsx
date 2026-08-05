import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ReportColumn } from '../../types/reports';
import type { ReportExportFormat } from '../../types/report-export';
import { ReportColumnSelector } from './ReportColumnSelector';
import { ReportExportMenu } from './ReportExportMenu';
import { Button } from '../ui/Button';
import { ROUTES } from '../../types/routes';

interface ReportHeaderProps {
  title: string;
  subtitle: string;
  columns: ReportColumn[];
  onToggleColumn: (columnId: string) => void;
  onExport: (format: ReportExportFormat) => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  title,
  subtitle,
  columns,
  onToggleColumn,
  onExport,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-white/10 text-xs">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.RELATORIOS)}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h2 className="text-xl font-bold font-title-lg text-on-surface">{title}</h2>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ReportColumnSelector columns={columns} onToggleColumn={onToggleColumn} />
        <ReportExportMenu onExport={onExport} />
      </div>
    </div>
  );
};
