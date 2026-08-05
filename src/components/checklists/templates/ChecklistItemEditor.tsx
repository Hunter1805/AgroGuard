import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Ban, Wrench } from 'lucide-react';
import type { ChecklistItem, ChecklistItemResponseType, ChecklistCriticality } from '../../../types/checklist';

interface ChecklistItemEditorProps {
  item: ChecklistItem;
  onChange: (updated: Partial<ChecklistItem>) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const ChecklistItemEditor: React.FC<ChecklistItemEditorProps> = ({
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  return (
    <div className="p-4 rounded-xl bg-surface-container border border-white/10 space-y-3 relative group transition-all text-[12px]">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5 font-mono-label text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
            {item.order}
          </span>
          <span className="text-on-surface-variant font-semibold">Configuração do Item</span>
        </div>

        <div className="flex items-center gap-1">
          {!isFirst && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 rounded bg-surface hover:text-primary transition-colors cursor-pointer"
              title="Mover para cima"
            >
              <ArrowUp size={14} />
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 rounded bg-surface hover:text-primary transition-colors cursor-pointer"
              title="Mover para baixo"
            >
              <ArrowDown size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded bg-surface hover:text-error transition-colors text-on-surface-variant cursor-pointer ml-2"
            title="Remover item da seção"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-mono-label text-on-surface-variant uppercase block mb-1">
            Título / Descrição da Inspeção *
          </label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Nível de óleo entre mínimo e máximo"
            className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono-label text-on-surface-variant uppercase block mb-1">
            Tipo de Resposta
          </label>
          <select
            value={item.responseType}
            onChange={(e) => onChange({ responseType: e.target.value as ChecklistItemResponseType })}
            className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-on-surface focus:outline-none capitalize"
          >
            <option value="conformidade">Conforme / Não Conforme</option>
            <option value="sim_nao">Sim / Não</option>
            <option value="texto">Texto</option>
            <option value="numero">Valor Numérico</option>
            <option value="medicao">Medição com Unidade</option>
            <option value="foto">Anexo Foto</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono-label text-on-surface-variant uppercase block mb-1">
            Criticidade da Falha
          </label>
          <select
            value={item.criticality}
            onChange={(e) => onChange({ criticality: e.target.value as ChecklistCriticality })}
            className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-on-surface focus:outline-none capitalize"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-mono-label text-on-surface-variant uppercase block mb-1">
          Instrução de Correção para o Operador (Opcional)
        </label>
        <input
          type="text"
          value={item.correctionGuidance || ''}
          onChange={(e) => onChange({ correctionGuidance: e.target.value })}
          placeholder="Ex: Em caso de nível baixo, complete apenas com óleo 15W40 do almoxarifado."
          className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-on-surface text-[11px] focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/5 text-[11px] font-mono-label">
        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={item.required}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="rounded border-white/20 bg-surface text-primary focus:ring-0"
          />
          <span className="text-on-surface">Obrigatório</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={item.requirePhotoOnNonConformity}
            onChange={(e) => onChange({ requirePhotoOnNonConformity: e.target.checked })}
            className="rounded border-white/20 bg-surface text-warning focus:ring-0"
          />
          <span className="text-warning">Foto na Não Conformidade</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={item.blockEquipment}
            onChange={(e) => onChange({ blockEquipment: e.target.checked })}
            className="rounded border-white/20 bg-surface text-error focus:ring-0"
          />
          <span className="text-error font-bold inline-flex items-center gap-1">
            <Ban size={12} /> Bloquear Máquina na Falha
          </span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={item.createOrderAutomatically}
            onChange={(e) => onChange({ createOrderAutomatically: e.target.checked })}
            className="rounded border-white/20 bg-surface text-secondary focus:ring-0"
          />
          <span className="text-secondary font-bold inline-flex items-center gap-1">
            <Wrench size={12} /> Gerar Ordem de Serviço Automática
          </span>
        </label>
      </div>
    </div>
  );
};
