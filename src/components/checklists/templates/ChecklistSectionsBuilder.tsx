import React from 'react';
import { Plus, Layers } from 'lucide-react';
import type { ChecklistSection, ChecklistItem } from '../../../types/checklist';
import { ChecklistSectionEditor } from './ChecklistSectionEditor';
import { Button } from '../../ui/Button';

interface ChecklistSectionsBuilderProps {
  sections: ChecklistSection[];
  onAddSection: (title: string) => void;
  onRemoveSection: (secId: string) => void;
  onUpdateSectionTitle: (secId: string, title: string) => void;
  onAddItem: (secId: string, item: Omit<ChecklistItem, 'id' | 'order'>) => void;
  onUpdateItem: (secId: string, itemId: string, item: Partial<ChecklistItem>) => void;
  onRemoveItem: (secId: string, itemId: string) => void;
  onMoveItem: (secId: string, itemIdx: number, dir: 'up' | 'down') => void;
}

export const ChecklistSectionsBuilder: React.FC<ChecklistSectionsBuilderProps> = ({
  sections,
  onAddSection,
  onRemoveSection,
  onUpdateSectionTitle,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onMoveItem,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">Estrutura de Seções e Itens</h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Adicione perguntas ou pontos mecânicos específicos ordenados por categoria no modelo.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => onAddSection('Nova Seção de Inspeção')}
        >
          Nova Seção
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-10 glass-card bg-surface-container/30 rounded-2xl border border-white/5 text-on-surface-variant/70 text-[13px]">
          <Layers size={28} className="mx-auto text-primary/50 mb-2" />
          <p>Seu modelo não possui nenhuma seção. Clique em "Nova Seção" acima para começar.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((sec) => (
            <ChecklistSectionEditor
              key={sec.id}
              section={sec}
              onUpdateTitle={(title) => onUpdateSectionTitle(sec.id, title)}
              onRemoveSection={() => onRemoveSection(sec.id)}
              onAddItem={(i) => onAddItem(sec.id, i)}
              onUpdateItem={(iId, upd) => onUpdateItem(sec.id, iId, upd)}
              onRemoveItem={(iId) => onRemoveItem(sec.id, iId)}
              onMoveItem={(idx, dir) => onMoveItem(sec.id, idx, dir)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
