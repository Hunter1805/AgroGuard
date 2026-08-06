import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, PenTool, ShieldAlert } from 'lucide-react';
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
    type: 'corretiva_nao_planejada',
    priority: 'media',
    impact: 'sem_impacto',
    equipmentCanOperate: true,
    requiresBlock: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newOs = await workOrderService.createWorkOrder({
        ...formData,
        equipmentId,
        equipmentName: 'Trator JD 7J', // mock
        origin: 'manual',
        openedAt: new Date().toISOString(),
        requesterId: 'u-1',
        requesterName: 'Operador Atual'
      } as any);

      navigate(ROUTES.ORDEM_DETALHE.replace(':orderId', newOs.id));
    } catch (err) {
      alert('Erro ao abrir OS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h2 className="text-xl font-title-lg font-extrabold text-on-surface">Nova Ordem de Serviço</h2>
            <p className="text-sm text-on-surface-variant">Abertura de requisição de manutenção</p>
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
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 text-sm font-semibold text-[var(--color-text-primary)]"
                placeholder="Ex: Troca de óleo, Falha no motor..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Descrição Detalhada *</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 text-sm h-24 resize-none text-[var(--color-text-primary)]"
                placeholder="Descreva detalhadamente o sintoma ou o serviço a ser realizado..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-title-md font-bold text-[var(--color-brand)] flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
            <ShieldAlert size={18} /> Classificação e Impacto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Tipo de Manutenção</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none text-sm font-semibold text-[var(--color-text-primary)]"
              >
                <option value="corretiva_nao_planejada">Corretiva Não Planejada (Quebra)</option>
                <option value="corretiva_planejada">Corretiva Planejada</option>
                <option value="preventiva">Preventiva</option>
                <option value="inspecao">Inspeção</option>
                <option value="emergencial">Emergencial (Risco de Segurança)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1 uppercase">Prioridade</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl outline-none text-sm font-semibold text-[var(--color-text-primary)]"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
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
              Bloquear equipamento (Impede operação até a liberação)
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
