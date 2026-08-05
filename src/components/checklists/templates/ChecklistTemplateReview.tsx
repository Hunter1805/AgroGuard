import React from 'react';
import { CheckSquare, ShieldCheck, Tractor, Layers } from 'lucide-react';
import type { ChecklistSection, ChecklistTemplateType } from '../../../types/checklist';

interface ChecklistTemplateReviewProps {
  name: string;
  description: string;
  type: ChecklistTemplateType;
  applicableTypes: string[];
  sections: ChecklistSection[];
}

export const ChecklistTemplateReview: React.FC<ChecklistTemplateReviewProps> = ({
  name,
  description,
  type,
  applicableTypes,
  sections,
}) => {
  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const criticalItems = sections.reduce(
    (acc, s) => acc + s.items.filter((i) => i.criticality === 'critica' || i.blockEquipment).length,
    0
  );

  return (
    <div className="glass-card bg-surface-container-highest/50 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl animate-fade-in">
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="p-3 rounded-2xl bg-primary/20 text-primary">
          <CheckSquare size={28} />
        </div>
        <div>
          <span className="text-[11px] font-mono-label text-primary font-bold uppercase block">
            Revisão Final do Modelo
          </span>
          <h3 className="font-title-md text-[20px] font-bold text-on-surface">{name || 'Modelo Sem Nome'}</h3>
          <p className="text-[13px] text-on-surface-variant/80">{description || 'Sem descrição cadastrada.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px] font-mono-label">
        <div className="p-3.5 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
          <span className="text-on-surface-variant/70 uppercase text-[11px]">Categoria / Frequência</span>
          <strong className="text-[16px] text-primary capitalize mt-1">{type}</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
          <span className="text-on-surface-variant/70 uppercase text-[11px]">Total de Seções & Itens</span>
          <strong className="text-[16px] text-on-surface mt-1">{sections.length} Seções ({totalItems} Itens)</strong>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
          <span className="text-on-surface-variant/70 uppercase text-[11px]">Itens Críticos (Bloqueantes)</span>
          <strong className={`text-[16px] mt-1 ${criticalItems > 0 ? 'text-error' : 'text-success'}`}>
            {criticalItems} Item(ns)
          </strong>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[12px] font-mono-label font-bold text-on-surface uppercase flex items-center gap-1.5">
          <Tractor size={15} className="text-secondary" /> Tipos de Equipamentos Contemplados
        </h4>
        <div className="flex flex-wrap gap-2">
          {applicableTypes.map((t) => (
            <span key={t} className="px-3 py-1 rounded-lg bg-surface text-secondary border border-white/10 text-[12px] font-mono-label font-bold">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-[12px] font-mono-label font-bold text-on-surface uppercase flex items-center gap-1.5">
          <Layers size={15} className="text-primary" /> Resumo das Seções
        </h4>
        <div className="divide-y divide-white/10 rounded-xl bg-surface-container/50 border border-white/5 overflow-hidden text-[12px]">
          {sections.map((sec, idx) => (
            <div key={sec.id} className="p-3 flex justify-between items-center hover:bg-white/5">
              <div>
                <strong className="text-on-surface">{sec.title}</strong>
                <span className="text-on-surface-variant/70 ml-2">({sec.items.length} itens)</span>
              </div>
              <span className="text-[11px] font-mono-label text-primary">Seção #{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-primary text-[12px] font-medium flex items-center gap-3">
        <ShieldCheck size={20} className="shrink-0" />
        <span>Tudo certo! Ao confirmar abaixo, este modelo será ativado e estará imediatamente disponível para que a equipe operacional do campo e oficina execute as inspeções no AgroGuard.</span>
      </div>
    </div>
  );
};
