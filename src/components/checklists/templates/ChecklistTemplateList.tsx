import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, GitBranch, Edit3, Trash2 } from 'lucide-react';
import type { ChecklistTemplate } from '../../../types/checklist';
import { ROUTES, ROUTE_HELPERS } from '../../../types/routes';
import { EmptyState } from '../../ui/EmptyState';
import { Button } from '../../ui/Button';

interface ChecklistTemplateListProps {
  templates: ChecklistTemplate[];
  onDuplicate: (id: string) => Promise<void>;
  onNewVersion: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
}

export const ChecklistTemplateList: React.FC<ChecklistTemplateListProps> = ({
  templates,
  onDuplicate,
  onNewVersion,
  onArchive,
}) => {
  const navigate = useNavigate();

  if (templates.length === 0) {
    return (
      <EmptyState
        title="Nenhum modelo ativo de checklist"
        description="Crie o primeiro modelo profissional com inspeções para tratores, colhedoras e caminhões."
        action={
          <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.CHECKLISTS_MODELO_NOVO)}>
            Criar Novo Modelo
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-[13px] font-mono-label text-on-surface-variant/80">
          Exibindo <strong>{templates.length}</strong> modelo(s) configuráveis
        </span>
        <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => navigate(ROUTES.CHECKLISTS_MODELO_NOVO)}>
          Criar Novo Modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-lg group"
          >
            <div>
              <div className="flex justify-between items-start mb-2 gap-2">
                <span className="font-mono-label px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-[11px] font-bold">
                  {tpl.code}
                </span>
                <span className="inline-flex items-center gap-1 font-mono-label px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                  v{tpl.version} • {tpl.type.toUpperCase()}
                </span>
              </div>

              <h3 className="font-title-md text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">
                {tpl.name}
              </h3>
              
              <p className="text-[12px] text-on-surface-variant/80 mt-1 line-clamp-2">
                {tpl.description || 'Nenhuma descrição informada.'}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px] font-mono-label">
                <span className="text-on-surface-variant/60 uppercase">Aplicável a:</span>
                {tpl.applicableEquipmentTypeIds?.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-surface-container text-secondary border border-white/5 font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono-label text-on-surface-variant/70">
                {tpl.sections?.length || 0} Seção(ões) • {tpl.sections?.reduce((acc, s) => acc + s.items.length, 0)} Item(ns)
              </span>

              <div className="flex gap-1.5">
                <button
                  onClick={() => onDuplicate(tpl.id)}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="Duplicar modelo (Copia com nova numeração)"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => onNewVersion(tpl.id)}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                  title="Criar nova versão deste modelo sem afetar execuções anteriores"
                >
                  <GitBranch size={15} />
                </button>
                <button
                  onClick={() => navigate(ROUTE_HELPERS.checklistTemplateEdit(tpl.id))}
                  className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors cursor-pointer"
                  title="Editar modelo"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => onArchive(tpl.id)}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                  title="Arquivar modelo"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
