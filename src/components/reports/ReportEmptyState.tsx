import React from 'react';
import { FileQuestion } from 'lucide-react';

interface ReportEmptyStateProps {
  title?: string;
  description?: string;
}

export const ReportEmptyState: React.FC<ReportEmptyStateProps> = ({
  title = 'Nenhum dado disponível',
  description = 'Não existem informações para os filtros e período selecionados.',
}) => {
  return (
    <div className="p-12 text-center space-y-2 glass-card rounded-2xl border border-white/10">
      <FileQuestion className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
      <p className="text-xs font-bold text-on-surface">{title}</p>
      <p className="text-xs text-on-surface-variant/70 max-w-sm mx-auto">{description}</p>
    </div>
  );
};
