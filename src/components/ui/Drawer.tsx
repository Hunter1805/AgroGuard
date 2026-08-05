import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
  footer?: React.ReactNode;
}

const widthClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  width = 'xl',
  footer,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fechar com ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Travar scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel */}
      <div
        className={`relative w-full ${widthClasses[width]} h-full bg-surface-container border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <span className="text-primary shrink-0">{icon}</span>
            )}
            <div className="min-w-0">
              <h2 className="font-title-md text-[18px] font-semibold text-on-surface truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="font-body-sm text-[12px] text-on-surface-variant/70 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            id="drawer-close-btn"
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container-highest cursor-pointer shrink-0 ml-3"
            aria-label="Fechar painel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Rodapé */}
        {footer && (
          <div className="shrink-0 p-4 border-t border-white/10 bg-surface-container/80">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
