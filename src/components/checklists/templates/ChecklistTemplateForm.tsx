import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Save, Sliders, Tractor } from 'lucide-react';
import { useChecklistTemplateForm } from '../../../hooks/useChecklistTemplateForm';
import { ChecklistTemplateStepper } from './ChecklistTemplateStepper';
import { ChecklistSectionsBuilder } from './ChecklistSectionsBuilder';
import { ChecklistTemplateReview } from './ChecklistTemplateReview';
import { ROUTES } from '../../../types/routes';
import { Button } from '../../ui/Button';

export const ChecklistTemplateForm: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const {
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
    addSection,
    removeSection,
    addItemToSection,
    updateItem,
    removeItem,
    moveItem,
    saveTemplate,
  } = useChecklistTemplateForm(templateId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTypes = ['Trator', 'Colhedora', 'Caminhão', 'Implemento', 'Pivô', 'Veículo Leve'];

  const toggleEquipmentType = (t: string) => {
    if (applicableEquipmentTypes.includes(t)) {
      setApplicableEquipmentTypes(applicableEquipmentTypes.filter((i) => i !== t));
    } else {
      setApplicableEquipmentTypes([...applicableEquipmentTypes, t]);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await saveTemplate();
      navigate(ROUTES.CHECKLISTS);
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar o modelo de checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in text-[13px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.CHECKLISTS)}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[11px] font-mono-label text-primary font-bold uppercase block">
              {templateId ? 'Edição de Modelo' : 'Novo Construtor de Checklist'}
            </span>
            <h1 className="font-title-md text-[20px] font-bold text-on-surface">
              {templateId ? `Editando: ${name}` : 'Criar Modelo Profissional de Inspeção'}
            </h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error/15 text-error rounded-xl border border-error/30 font-medium">
          {error}
        </div>
      )}

      <ChecklistTemplateStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Etapa 1: Informações Gerais */}
      {currentStep === 1 && (
        <div className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg animate-fade-in">
          <h3 className="font-title-md text-[16px] font-bold text-on-surface flex items-center gap-2">
            <CheckSquare size={18} className="text-primary" /> Dados Básicos e Frequência do Modelo
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-mono-label text-on-surface-variant text-[11px] uppercase block mb-1">
                Nome do Modelo de Checklist *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Checklist Diário de Trator de Pequeno Porte"
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3.5 py-2 text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="font-mono-label text-on-surface-variant text-[11px] uppercase block mb-1">
                Categoria / Tipo *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none capitalize"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="pre_operacao">Pré-Operação</option>
                <option value="seguranca">Segurança do Trabalho</option>
              </select>
            </div>
            <div>
              <label className="font-mono-label text-on-surface-variant text-[11px] uppercase block mb-1">
                Descrição e Objetivo Operacional
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explique à equipe quando e por que aplicar este checklist..."
                rows={3}
                className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Etapa 2: Aplicação na Frota */}
      {currentStep === 2 && (
        <div className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg animate-fade-in">
          <h3 className="font-title-md text-[16px] font-bold text-on-surface flex items-center gap-2">
            <Tractor size={18} className="text-secondary" /> Selecione os Tipos de Equipamento Compatíveis
          </h3>
          <p className="text-on-surface-variant/80 text-[12px]">
            Marque para quais categorias da frota AgroGuard este checklist deve ser sugerido automaticamente.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {availableTypes.map((t) => {
              const sel = applicableEquipmentTypes.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleEquipmentType(t)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    sel ? 'bg-secondary/20 text-secondary border-secondary shadow-md' : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant border-white/10'
                  }`}
                >
                  {t} {sel && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Etapa 3: Seções e Itens */}
      {currentStep === 3 && (
        <ChecklistSectionsBuilder
          sections={sections}
          onAddSection={addSection}
          onRemoveSection={removeSection}
          onUpdateSectionTitle={(id, title) => {
            sections.find((s) => s.id === id) && (sections.find((s) => s.id === id)!.title = title);
            setName(`${name} `); // Forçar rerender simples ou usar setter no hook
            setName(name.trim());
          }}
          onAddItem={addItemToSection}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
          onMoveItem={moveItem}
        />
      )}

      {/* Etapa 4: Regras & Automações */}
      {currentStep === 4 && (
        <div className="glass-card bg-surface-container-highest/40 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg animate-fade-in">
          <h3 className="font-title-md text-[16px] font-bold text-on-surface flex items-center gap-2">
            <Sliders size={18} className="text-primary" /> Regras Globais de Automação no AgroGuard
          </h3>
          <p className="text-[12px] text-on-surface-variant">
            As automações (bloqueio de máquina e Ordem de Serviço) já estão habilitadas nos itens marcados como críticos na Etapa 3. Quando o operador registrar uma falha, o sistema acionará automaticamente a Central de Alertas.
          </p>
          <div className="p-4 rounded-xl bg-surface-container/60 border border-white/5 space-y-2 font-mono-label text-[12px]">
            <p className="text-success font-bold">✓ Bloqueio Operacional de Ativos em Falhas Críticas habilitado</p>
            <p className="text-primary font-bold">✓ Integração contínua com Leituras da Fase 3D habilitada</p>
            <p className="text-secondary font-bold">✓ Criação de Não Conformidades auditáveis ativada</p>
          </div>
        </div>
      )}

      {/* Etapa 5: Revisão */}
      {currentStep === 5 && (
        <ChecklistTemplateReview
          name={name}
          description={description}
          type={type}
          applicableTypes={applicableEquipmentTypes}
          sections={sections}
        />
      )}

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <Button variant="outline" size="sm" disabled={currentStep === 1} onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}>
          Voltar Etapa
        </Button>
        {currentStep < 5 ? (
          <Button variant="primary" size="sm" onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}>
            Avançar Para Etapa {currentStep + 1}
          </Button>
        ) : (
          <Button variant="primary" size="sm" icon={<Save size={16} />} onClick={handleSave} isLoading={isSubmitting}>
            Confirmar e Ativar Modelo
          </Button>
        )}
      </div>
    </div>
  );
};
