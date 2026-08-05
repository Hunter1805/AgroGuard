import React from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum item encontrado',
  description = 'Não há registros para exibição no momento.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center text-on-surface-variant/50">
        {icon ?? <InboxIcon size={22} />}
      </div>
      <div>
        <h4 className="font-title-md text-[14px] font-medium text-on-surface">{title}</h4>
        {description && (
          <p className="text-[12px] text-on-surface-variant/60 mt-1 max-w-sm">{description}</p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
