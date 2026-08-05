import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import type { ChecklistSection, ChecklistItem } from '../../../types/checklist';
import { ChecklistItemEditor } from './ChecklistItemEditor';
import { Button } from '../../ui/Button';

interface ChecklistSectionEditorProps {
  section: ChecklistSection;
  onUpdateTitle: (title: string) => void;
  onRemoveSection: () => void;
  onAddItem: (item: Omit<ChecklistItem, 'id' | 'order'>) => void;
  onUpdateItem: (itemId: string, updated: Partial<ChecklistItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveItem: (itemIndex: number, direction: 'up' | 'down') => void;
}

export const ChecklistSectionEditor: React.FC<ChecklistSectionEditorProps> = ({
  section,
  onUpdateTitle,
  onRemoveSection,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onMoveItem,
}) => {
  const handleAddNewItem = () => {
    onAddItem({
      title: 'Nova inspeção operacional',
      responseType: 'conformidade',
      criticality: 'media',
      required: true,
      allowNotApplicable: true,
      requireNotesOnNonConformity: true,
      requirePhotoOnNonConformity: true,
      generateAlert: true,
      createOrderAutomatically: false,
      blockEquipment: false,
    });
  };

  return (
    <div className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 w-full max-w-lg">
          <Layers size={18} className="text-primary shrink-0" />
          <input
            type="text"
            value={section.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="Nome da Seção (Ex: 1. Níveis de Fluidos)"
            className="bg-transparent border-b border-white/20 px-1.5 py-1 text-[15px] font-title-md font-bold text-on-surface w-full focus:outline-none focus:border-primary"
          />
        </div>
        
        <button
          type="button"
          onClick={onRemoveSection}
          className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-lg cursor-pointer shrink-0"
          title="Excluir Seção Inteira"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-primary/20">
        {section.items.map((item, index) => (
          <ChecklistItemEditor
            key={item.id}
            item={item}
            onChange={(upd) => onUpdateItem(item.id, upd)}
            onRemove={() => onRemoveItem(item.id)}
            onMoveUp={() => onMoveItem(index, 'up')}
            onMoveDown={() => onMoveItem(index, 'down')}
            isFirst={index === 0}
            isLast={index === section.items.length - 1}
          />
        ))}

        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus size={15} />}
            onClick={handleAddNewItem}
            className="w-full sm:w-auto border-dashed text-primary border-primary/40 hover:bg-primary/10"
          >
            Adicionar Item de Inspeção
          </Button>
        </div>
      </div>
    </div>
  );
};
