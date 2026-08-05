import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: Array<{ label: string; onClick?: () => void }>;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  breadcrumb,
  showBackButton = false,
  onBack,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col gap-2 mb-6 ${className}`}>
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Navegação" className="flex items-center gap-1.5">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-on-surface-variant/40 text-[11px]">/</span>
              )}
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-[11px] text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer font-mono-label"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-[11px] text-on-surface-variant/40 font-mono-label">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Linha principal */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Botão voltar */}
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {/* Ícone */}
          {icon && (
            <span className="text-primary">{icon}</span>
          )}

          {/* Título */}
          <div>
            <h1 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Ações */}
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
