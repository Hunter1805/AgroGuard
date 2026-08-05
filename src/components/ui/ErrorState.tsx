import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Tente novamente.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
        <AlertCircle size={24} className="text-error" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-on-surface">{title}</p>
        <p className="text-[12px] text-on-surface-variant/70 mt-1 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-container-highest border border-white/10 text-[13px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer"
        >
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      )}
    </div>
  );
};
