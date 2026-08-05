import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-3 ${className}`}>
      <Loader2 size={28} className="text-primary animate-spin" />
      <p className="text-[13px] text-on-surface-variant font-body-sm">{message}</p>
    </div>
  );
};
