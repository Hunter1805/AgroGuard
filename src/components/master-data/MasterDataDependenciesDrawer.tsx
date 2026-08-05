import React from 'react';
import { X, Link2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MasterDataDependencyCheckResult } from '../../types/master-data-dependency';

interface DependenciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recordName: string;
  recordCode?: string;
  result: MasterDataDependencyCheckResult | null;
  loading?: boolean;
}

export const MasterDataDependenciesDrawer: React.FC<DependenciesDrawerProps> = ({
  isOpen,
  onClose,
  recordName,
  recordCode,
  result,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border-l border-white/10 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Link2 size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-on-surface">Vínculos do Cadastro</h3>
              <p className="text-[11px] text-on-surface-variant/70 font-mono-label">
                {recordCode ? `${recordCode} — ` : ''}{recordName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest">
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-[13px] text-on-surface-variant">
              Verificando vínculos nos módulos do sistema...
            </div>
          ) : !result || !result.hasDependencies ? (
            <div className="glass-card rounded-xl border border-success/20 bg-success/5 p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center">
                ✓
              </div>
              <h4 className="text-[14px] font-semibold text-on-surface">Nenhum Vínculo Encontrado</h4>
              <p className="text-[12px] text-on-surface-variant/70">
                Este cadastro não possui nenhuma referência ou dependência ativa nos outros módulos.
              </p>
            </div>
          ) : (
            <>
              <div className="glass-card rounded-xl border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-on-surface-variant/90 leading-relaxed">
                  Este cadastro está sendo utilizado em <strong>{result.dependencies.reduce((a, b) => a + b.count, 0)} registros</strong> do sistema. Inativar ou arquivar este item afetará novos cadastros nos módulos listados abaixo.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant/60">
                  Módulos e Registros Vinculados
                </h4>

                <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden glass-card">
                  {result.dependencies.map((dep, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-surface-container-highest/40 transition-colors">
                      <div>
                        <span className="text-[13px] font-medium text-on-surface">{dep.moduleName}</span>
                        <p className="text-[11px] text-on-surface-variant/60">{dep.relatedSummary}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-bold font-mono-label px-2 py-0.5 rounded-md bg-surface-container-high text-primary">
                          {dep.count}
                        </span>

                        {dep.targetRoute && (
                          <button
                            onClick={() => {
                              onClose();
                              navigate(dep.targetRoute!);
                            }}
                            className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                            title="Abrir Módulo"
                          >
                            <ExternalLink size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/10 bg-surface-container-high/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container-highest border border-white/10 text-[12px] font-medium text-on-surface"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
