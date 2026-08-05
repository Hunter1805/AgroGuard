import React from 'react';
import { Eye, Edit, Power, Archive, Link2, RefreshCw } from 'lucide-react';
import type { MasterDataBase } from '../../types/master-data';

interface TableProps {
  items: MasterDataBase[];
  loading?: boolean;
  onViewDetails?: (item: MasterDataBase) => void;
  onEdit?: (item: MasterDataBase) => void;
  onToggleStatus?: (item: MasterDataBase, action: 'inativar' | 'arquivar' | 'ativar') => void;
  onViewDependencies?: (item: MasterDataBase) => void;
  onSetReplacement?: (item: MasterDataBase) => void;
}

export const MasterDataTable: React.FC<TableProps> = ({
  items,
  loading = false,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onViewDependencies,
  onSetReplacement,
}) => {
  if (loading) {
    return (
      <div className="glass-card rounded-xl border border-white/10 p-12 text-center text-[13px] text-on-surface-variant animate-pulse">
        Carregando registros de cadastro...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
        <p className="text-[14px] font-medium text-on-surface">Nenhum registro encontrado</p>
        <p className="text-[12px] text-on-surface-variant/60 mt-1">
          Não há cadastros que correspondam aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl border border-white/10 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-high/60 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider">
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Nome / Descrição</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Vínculos</th>
              <th className="py-3 px-4">Última Atualização</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => {
              const isAtivo = item.status === 'ativo';
              const isArquivado = item.status === 'arquivado';

              return (
                <tr key={item.id} className="hover:bg-surface-container-highest/40 transition-colors">
                  <td className="py-3 px-4 font-mono-label font-medium text-primary">
                    {item.code || item.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-on-surface">{item.name}</div>
                    {item.description && (
                      <div className="text-[11px] text-on-surface-variant/60 line-clamp-1">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono-label ${
                        isAtivo
                          ? 'bg-success/10 text-success border border-success/20'
                          : isArquivado
                          ? 'bg-warning/10 text-warning border border-warning/20'
                          : 'bg-error/10 text-error border border-error/20'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onViewDependencies?.(item)}
                      className="inline-flex items-center gap-1 text-[12px] font-mono-label text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    >
                      <Link2 size={13} />
                      <span>{item.usageCount ?? 0}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[12px] text-on-surface-variant/70 font-mono-label">
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(item)}
                          title="Visualizar Detalhes"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          title="Editar Cadastro"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest"
                        >
                          <Edit size={15} />
                        </button>
                      )}
                      {onViewDependencies && (
                        <button
                          onClick={() => onViewDependencies(item)}
                          title="Consultar Vínculos"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-surface-container-highest"
                        >
                          <Link2 size={15} />
                        </button>
                      )}
                      {!isAtivo && onSetReplacement && (
                        <button
                          onClick={() => onSetReplacement(item)}
                          title="Definir Substituto"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-accent hover:bg-surface-container-highest"
                        >
                          <RefreshCw size={15} />
                        </button>
                      )}
                      {onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(item, isAtivo ? 'inativar' : 'ativar')}
                          title={isAtivo ? 'Inativar Registro' : 'Ativar Registro'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isAtivo
                              ? 'text-on-surface-variant hover:text-error hover:bg-surface-container-highest'
                              : 'text-success hover:bg-surface-container-highest'
                          }`}
                        >
                          <Power size={15} />
                        </button>
                      )}
                      {isAtivo && onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(item, 'arquivar')}
                          title="Arquivar Registro"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-warning hover:bg-surface-container-highest"
                        >
                          <Archive size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
