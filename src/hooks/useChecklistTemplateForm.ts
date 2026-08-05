import { useState, useEffect, useCallback } from 'react';
import type { ChecklistTemplate, ChecklistSection, ChecklistItem, ChecklistTemplateType } from '../types/checklist';
import { checklistTemplateService } from '../services/checklist-template.service';

export function useChecklistTemplateForm(templateId?: string) {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Stepper do construtor profissional de modelos (1 a 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dados do formulário em edição
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChecklistTemplateType>('diario');
  const [applicableEquipmentTypes, setApplicableEquipmentTypes] = useState<string[]>(['Trator']);
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      id: 'sec-init',
      title: '1. Verificação Operacional e Estrutura',
      order: 1,
      items: [
        {
          id: 'item-init',
          title: 'Condição geral do ativo (lataria, pneus/rodado e vazamentos)',
          order: 1,
          responseType: 'conformidade',
          criticality: 'alta',
          required: true,
          allowNotApplicable: false,
          requireNotesOnNonConformity: true,
          requirePhotoOnNonConformity: true,
          generateAlert: true,
          createOrderAutomatically: false,
          blockEquipment: false,
        },
      ],
    },
  ]);

  const loadTemplates = useCallback(async () => {
    if (templateId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await checklistTemplateService.getChecklistTemplates();
      setTemplates(list);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar modelos de checklist.');
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  const loadSingleTemplate = useCallback(async () => {
    if (!templateId) return;
    setLoading(true);
    setError(null);
    try {
      const t = await checklistTemplateService.getChecklistTemplateById(templateId);
      if (t) {
        setName(t.name);
        setDescription(t.description || '');
        setType(t.type);
        setApplicableEquipmentTypes(t.applicableEquipmentTypeIds || []);
        setSections(t.sections || []);
      } else {
        setError('Modelo de checklist não localizado.');
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar modelo.');
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (templateId) {
      loadSingleTemplate();
    } else {
      loadTemplates();
    }
  }, [templateId, loadSingleTemplate, loadTemplates]);

  // Manipulação do Construtor
  const addSection = (title: string) => {
    const nextOrder = sections.length + 1;
    const newSec: ChecklistSection = {
      id: `sec-${Date.now()}`,
      title: `${nextOrder}. ${title}`,
      order: nextOrder,
      items: [],
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (secId: string) => {
    setSections(sections.filter((s) => s.id !== secId));
  };

  const addItemToSection = (secId: string, item: Omit<ChecklistItem, 'id' | 'order'>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== secId) return s;
        const nextOrder = s.items.length + 1;
        const newItem: ChecklistItem = {
          ...item,
          id: `item-${Date.now()}-${nextOrder}`,
          order: nextOrder,
        };
        return { ...s, items: [...s.items, newItem] };
      })
    );
  };

  const updateItem = (secId: string, itemId: string, itemData: Partial<ChecklistItem>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== secId) return s;
        return {
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, ...itemData } : i)),
        };
      })
    );
  };

  const removeItem = (secId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s))
    );
  };

  // Subir ou descer itens
  const moveItem = (secId: string, itemIdx: number, direction: 'up' | 'down') => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== secId) return s;
        const copy = [...s.items];
        const targetIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
        if (targetIdx < 0 || targetIdx >= copy.length) return s;
        const tmp = copy[itemIdx];
        copy[itemIdx] = copy[targetIdx];
        copy[targetIdx] = tmp;
        // reordenar indices
        return { ...s, items: copy.map((item, idx) => ({ ...item, order: idx + 1 })) };
      })
    );
  };

  const saveTemplate = async () => {
    if (!name.trim()) throw new Error('O nome do modelo de checklist é obrigatório.');
    if (sections.length === 0 || sections.every((s) => s.items.length === 0)) {
      throw new Error('O modelo deve conter ao menos uma seção e um item para inspeção.');
    }

    if (templateId) {
      // Edição simples se ainda não foi utilizado ou se quisermos atualizar em linha
      await checklistTemplateService.updateChecklistTemplate(templateId, {
        name,
        description,
        type,
        applicableEquipmentTypeIds: applicableEquipmentTypes,
        sections,
      });
    } else {
      await checklistTemplateService.createChecklistTemplate({
        name,
        description,
        type,
        applicableEquipmentTypeIds: applicableEquipmentTypes,
        applicableModelIds: [],
        specificEquipmentIds: [],
        active: true,
        sections,
      });
    }
  };

  const duplicateTemplate = async (id: string) => {
    await checklistTemplateService.duplicateChecklistTemplate(id);
    await loadTemplates();
  };

  const createNewVersion = async (id: string) => {
    await checklistTemplateService.createChecklistTemplateVersion(id);
    await loadTemplates();
  };

  const archiveTemplate = async (id: string) => {
    await checklistTemplateService.archiveChecklistTemplate(id);
    await loadTemplates();
  };

  return {
    templates,
    loading,
    error,
    currentStep,
    setCurrentStep,
    name,
    setName,
    description,
    setDescription,
    type,
    setType,
    applicableEquipmentTypes,
    setApplicableEquipmentTypes,
    sections,
    setSections,
    addSection,
    removeSection,
    addItemToSection,
    updateItem,
    removeItem,
    moveItem,
    saveTemplate,
    duplicateTemplate,
    createNewVersion,
    archiveTemplate,
    refetch: loadTemplates,
  };
}
