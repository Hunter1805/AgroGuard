import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, PenTool, ShieldAlert, Info } from 'lucide-react';
import { Button } from '../../ui/Button';
import { workOrderService } from '../../../services/work-order.service';
import { ROUTES } from '../../../types/routes';

export const WorkOrderOpeningForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('equipmentId') || '';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    nature: 'MAINTENANCE',
    selectedType: 'CORRECTIVE_EMERGENCY', // tipo de manutenção visual unificado
    trigger: 'MANUAL',
    priority: 'NORMAL',
    impact: 'sem_impacto',
    equipmentCanOperate: true,
    requiresBlock: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Desmembrar o tipo de manutenção operacional selecionado
      let maintenanceType: string | null = null;
      let correctiveMode: string | null = null;

      if (formData.nature === 'MAINTENANCE') {
        if (formData.selectedType === 'PREVENTIVE') {
          maintenanceType = 'PREVENTIVE';
        } else if (formData.selectedType === 'CORRECTIVE_PLANNED') {
          maintenanceType = 'CORRECTIVE';
          correctiveMode = 'PLANNED';
        } else if (formData.selectedType === 'CORRECTIVE_EMERGENCY') {
          maintenanceType = 'CORRECTIVE';
          correctiveMode = 'EMERGENCY';
        } else if (formData.selectedType === 'PREDICTIVE') {
          maintenanceType = 'PREDICTIVE';
        } else if (formData.selectedType === 'CONDITION_BASED') {
          maintenanceType = 'CONDITION_BASED';
        } else if (formData.selectedType === 'ROUTINE_INSPECTION') {
          maintenanceType = 'ROUTINE_INSPECTION';
        }
      }

      const newOs = await workOrderService.createWorkOrder({
        title: formData.title,
        description: formData.description,
        nature: formData.nature as any,
        maintenanceType: maintenanceType as any,
        correctiveMode: correctiveMode as any,
        trigger: formData.trigger as any,
        priority: formData.priority as any,
        impact: formData.impact as any,
        equipmentId,
        equipmentName: 'Equipamento Selecionado',
        openedAt: new Date().toISOString(),
        requesterId: 'u-1',
        requesterName: 'Operador Atual',
        equipmentCanOperate: formData.equipmentCanOperate,
        requiresBlock: formData.requiresBlock,
      } as any);

      navigate(ROUTES.ORDEM_DETALHE.replace(':orderId', newOs.id));
    } catch (err) {
      alert('Erro ao abrir OS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h2 className="text-xl font-title-lg font-extrabold text-on-surface">Nova Ordem de Serviço</h2>
            <p className="text-sm text-on-surface-variant">Abertura de requisição de manutenção ou intervenção técnica</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
        
        <div className="space-y-4">
          <h3 className="font-title-md font-bold text-primary flex items-center gap-2 border-b border-primary/20 pb-2">
            <PenTool size={18} /> Identificação e Problema
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">Título da OS *</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 font-semibold text-[var(--color-text-primary)]"
                placeholder="Ex: Troca de óleo, Falha no motor, Vazamento hidráulico..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Descrição Detalhada *</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 h-24 resize-none text-[var(--color-text-primary)]"
                placeholder="Descreva detalhadamente o sintoma apresentado ou o escopo do serviço a ser realizado..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-title-md font-bold text-[var(--color-brand)] flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
            <ShieldAlert size={18} /> Classificação e Prioridade
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase flex items-center gap-1">
                Natureza da OS
                <span className="tooltip-trigger" title="Classifica a natureza da intervenção técnica para diferenciar manutenção de outros serviços.">
                  <Info size={12} className="text-on-surface-variant cursor-help" />
                </span>
              </label>
              <select 
                value={formData.nature}
                onChange={e => setFormData({ ...formData, nature: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none font-semibold text-[var(--color-text-primary)]"
              >
                <option value="MAINTENANCE">Manutenção</option>
                <option value="INSPECTION">Inspeção</option>
                <option value="DIAGNOSIS">Diagnóstico</option>
                <option value="INSTALLATION">Instalação</option>
                <option value="IMPROVEMENT">Melhoria</option>
                <option value="CAMPAIGN_RECALL">Campanha / Recall</option>
              </select>
            </div>

            {formData.nature === 'MAINTENANCE' && (
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase flex items-center gap-1">
                  Tipo de Manutenção
                  <span className="tooltip-trigger" title="Indica a estratégia da atividade de manutenção.">
                    <Info size={12} className="text-on-surface-variant cursor-help" />
                  </span>
                </label>
                <select 
                  value={formData.selectedType}
                  onChange={e => setFormData({ ...formData, selectedType: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none font-semibold text-[var(--color-text-primary)]"
                >
                  <option value="PREVENTIVE">Preventiva</option>
                  <option value="CORRECTIVE_PLANNED">Corretiva Planejada</option>
                  <option value="CORRECTIVE_EMERGENCY">Corretiva Emergencial</option>
                  <option value="PREDICTIVE">Preditiva</option>
                  <option value="CONDITION_BASED">Baseada em Condição</option>
                  <option value="ROUTINE_INSPECTION">Inspeção / Rotina</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase flex items-center gap-1">
                Gatilho / Origem
                <span className="tooltip-trigger" title="O fato gerador que disparou a abertura desta Ordem de Serviço.">
                  <Info size={12} className="text-on-surface-variant cursor-help" />
                </span>
              </label>
              <select 
                value={formData.trigger}
                onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none font-semibold text-[var(--color-text-primary)]"
              >
                <option value="MANUAL">Ordem Manual</option>
                <option value="SCHEDULE">Plano Preventivo</option>
                <option value="CALENDAR">Calendário</option>
                <option value="HOUR_METER">Horímetro</option>
                <option value="ODOMETER">Odômetro</option>
                <option value="CYCLE">Ciclos</option>
                <option value="CHECKLIST">Checklist</option>
                <option value="INSPECTION">Inspeção</option>
                <option value="FAILURE">Falha Reportada</option>
                <option value="SENSOR">Sensor / Telemetria</option>
                <option value="ALERT">Alerta</option>
                <option value="OPERATOR_REPORT">Solicitação do Operador</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase flex items-center gap-1">
                Prioridade da OS
                <span className="tooltip-trigger" title="Classificação da gravidade e impacto operacional do serviço.">
                  <Info size={12} className="text-on-surface-variant cursor-help" />
                </span>
              </label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none font-semibold text-[var(--color-text-primary)]"
              >
                <option value="LOW">Baixa</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
            <label className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.requiresBlock}
                onChange={e => setFormData({ ...formData, requiresBlock: e.target.checked, equipmentCanOperate: !e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              Bloquear equipamento (Indisponibiliza o ativo para a operação até liberação)
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={loading} className="flex items-center gap-2">
            <Save size={18} />
            {loading ? 'Abrindo...' : 'Abrir Ordem de Serviço'}
          </Button>
        </div>
      </form>
    </div>
  );
};
