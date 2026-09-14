import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  /** Página atual (1-based). */
  page: number;
  totalPages: number;
  /** Total de registros no servidor (não apenas os exibidos). */
  total: number;
  /** Quantidade exibida na página atual. */
  shown: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  /** Rótulo do que está sendo listado, ex.: "equipamentos", "ordens de serviço". */
  itemLabel?: string;
  className?: string;
}

/**
 * Controle de paginação para listas servidas pelo backend.
 * Só aparece quando há mais de uma página, para não poluir telas curtas.
 */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  shown,
  pageSize,
  onPageChange,
  disabled = false,
  itemLabel = 'registros',
  className = '',
}) => {
  if (total <= pageSize) return null;

  const firstOnPage = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastOnPage = Math.min(firstOnPage + shown - 1, total);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-on-surface-variant ${className}`}
    >
      <span>
        Mostrando{' '}
        <strong className="text-on-surface">
          {firstOnPage.toLocaleString('pt-BR')}–{lastOnPage.toLocaleString('pt-BR')}
        </strong>{' '}
        de <strong className="text-on-surface">{total.toLocaleString('pt-BR')}</strong> {itemLabel}
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} className="mr-1" /> Anterior
        </Button>
        <span className="font-mono-label">
          Página <strong className="text-on-surface">{page}</strong> de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          aria-label="Próxima página"
        >
          Próxima <ChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};
