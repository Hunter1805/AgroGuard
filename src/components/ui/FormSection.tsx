import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        {icon && (
          <span className="text-primary">{icon}</span>
        )}
        <div>
          <h4 className="text-[13px] font-semibold text-on-surface">{title}</h4>
          {description && (
            <p className="text-[11px] text-on-surface-variant/60 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {/* Campos da seção */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};
