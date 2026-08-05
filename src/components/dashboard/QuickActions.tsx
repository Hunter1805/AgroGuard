import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, CheckSquare, Plus, Tractor, CalendarClock, Zap } from 'lucide-react';
import { ROUTES } from '../../types/routes';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  route: string;
  variant: 'primary' | 'secondary' | 'ghost';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'leitura',
    icon: <Gauge size={20} />,
    label: 'Registrar Leitura',
    description: 'Horímetro ou odômetro',
    route: `${ROUTES.EQUIPAMENTOS_LEITURAS}?novo=true`,
    variant: 'primary',
  },
  {
    id: 'checklist',
    icon: <CheckSquare size={20} />,
    label: 'Iniciar Checklist',
    description: 'Diário ou inspeção',
    route: ROUTES.CHECKLISTS,
    variant: 'secondary',
  },
  {
    id: 'nova-os',
    icon: <Plus size={20} />,
    label: 'Abrir OS',
    description: 'Nova ordem de serviço',
    route: ROUTES.ORDENS_SERVICO,
    variant: 'secondary',
  },
  {
    id: 'equipamento',
    icon: <Tractor size={20} />,
    label: 'Cadastrar Equipamento',
    description: 'Adicionar à frota',
    route: ROUTES.EQUIPAMENTO_NOVO,
    variant: 'ghost',
  },
  {
    id: 'manutencao',
    icon: <CalendarClock size={20} />,
    label: 'Programar Manutenção',
    description: 'Plano preventivo',
    route: ROUTES.MANUTENCOES_PLANOS,
    variant: 'ghost',
  },
];

const VARIANT_CLASSES = {
  primary: 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/40',
  secondary: 'bg-surface-container-highest/60 hover:bg-surface-container-highest text-on-surface border-white/10 hover:border-white/20',
  ghost: 'bg-transparent hover:bg-surface-container-highest/40 text-on-surface-variant hover:text-on-surface border-white/5 hover:border-white/10',
};

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-xl border border-white/5 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-primary" />
        <h3 className="font-body-sm text-[13px] font-semibold text-on-surface">Ações Rápidas</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.route)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all cursor-pointer active:scale-[0.97] ${VARIANT_CLASSES[action.variant]}`}
          >
            <span className="shrink-0">{action.icon}</span>
            <div className="text-left">
              <p className="text-[12px] font-medium leading-tight">{action.label}</p>
              <p className="text-[10px] opacity-60 leading-tight mt-0.5">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
