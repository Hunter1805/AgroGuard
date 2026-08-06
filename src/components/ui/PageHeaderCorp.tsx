import React from 'react';

interface Action {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
}

export interface PageHeaderCorpProps {
  title: string;
  description?: string;
  primaryAction?: Action;
  secondaryActions?: Action[];
  children?: React.ReactNode;
}

/**
 * Cabeçalho padrão de páginas — Design System Corporativo v1.1.0.
 *
 * Estrutura:
 *   [Título]                    [Ação primária verde]
 *   [Descrição]       [Ações secundárias discretas]
 *
 * Regra: somente 1 ação principal verde (variant="primary") por página.
 * Ações raras devem ficar em secondaryActions (ghost/secondary).
 */
export const PageHeaderCorp: React.FC<PageHeaderCorpProps> = ({
  title,
  description,
  primaryAction,
  secondaryActions = [],
  children,
}) => {
  const baseBtn =
    'inline-flex items-center gap-2 rounded-md px-4 h-10 text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0 select-none';

  const btnStyle = (v: Action['variant'] = 'secondary'): React.CSSProperties & { className?: string } => {
    if (v === 'primary') {
      return { backgroundColor: 'var(--color-brand)', color: '#fff' };
    }
    if (v === 'ghost') {
      return { backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' };
    }
    return { backgroundColor: 'var(--color-surface-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' };
  };

  const renderBtn = (action: Action, i: number) => {
    const style = btnStyle(action.variant);
    return (
      <button
        key={i}
        type="button"
        onClick={action.onClick}
        className={baseBtn}
        style={style}
        aria-label={action.label}
        onMouseEnter={(e) => {
          if (action.variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--color-brand-hover)';
          } else {
            e.currentTarget.style.backgroundColor = 'var(--color-border)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            action.variant === 'primary'
              ? 'var(--color-brand)'
              : action.variant === 'ghost'
              ? 'transparent'
              : 'var(--color-surface-secondary)';
        }}
      >
        {action.icon}
        {action.label}
      </button>
    );
  };

  return (
    <div
      className="flex flex-col gap-1 pb-5 mb-5"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Título e descrição */}
        <div className="min-w-0">
          <h1
            className="font-semibold leading-tight"
            style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-1"
              style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Ações */}
        {(secondaryActions.length > 0 || primaryAction) && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {secondaryActions.map((a, i) => renderBtn(a, i))}
            {primaryAction && renderBtn(primaryAction, secondaryActions.length)}
          </div>
        )}
      </div>

      {/* Slot opcional: chips de filtro, abas, etc. */}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};
