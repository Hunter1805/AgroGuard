import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, Flame, CheckCircle2, Clock, Eye, ArrowRight } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { PriorityBadge } from '../ui/PriorityBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { Tabs } from '../ui/Tabs';

type AlertPriority = 'Informativo' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
type AlertStatus = 'Novo' | 'Visualizado' | 'Em tratamento' | 'Adiado' | 'Resolvido' | 'Ignorado' | 'Cancelado';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  equipment: string;
  priority: AlertPriority;
  status: AlertStatus;
  createdAt: string;
  deadline?: string;
  action: string;
}

const mockAlerts: Alert[] = [
  {
    id: 'AL-001', title: 'Manutenção Vencida', description: 'Troca de óleo motor — 250h vencida há 3 dias',
    type: 'Manutenção', equipment: 'Trator Massey 265 01', priority: 'Crítico', status: 'Novo',
    createdAt: '2026-08-01T08:00:00Z', deadline: '2026-08-01T00:00:00Z', action: 'Criar OS',
  },
  {
    id: 'AL-002', title: 'Checklist Não Realizado', description: 'Checklist diário não realizado há 2 dias',
    type: 'Checklist', equipment: 'Trator Valtra A750 13', priority: 'Alto', status: 'Novo',
    createdAt: '2026-08-02T07:00:00Z', deadline: '2026-08-02T12:00:00Z', action: 'Ver checklist',
  },
  {
    id: 'AL-003', title: 'Pressão de Pneu Irregular', description: 'Pressão 22 PSI — recomendado 35 PSI',
    type: 'Pneus', equipment: 'Trator LS U80 22', priority: 'Médio', status: 'Visualizado',
    createdAt: '2026-08-03T09:30:00Z', action: 'Calibrar pneu',
  },
  {
    id: 'AL-004', title: 'Manutenção Próxima', description: 'Revisão 500h — restam 48 horas',
    type: 'Manutenção', equipment: 'Trator Agrale 4100 11', priority: 'Baixo', status: 'Em tratamento',
    createdAt: '2026-08-03T14:00:00Z', deadline: '2026-08-10T00:00:00Z', action: 'Programar manutenção',
  },
  {
    id: 'AL-005', title: 'OS Aguardando Peça', description: 'Filtro de ar — aguardando chegada há 5 dias',
    type: 'Ordem de Serviço', equipment: 'Caminhão Volvo FH 360', priority: 'Alto', status: 'Em tratamento',
    createdAt: '2026-07-28T10:00:00Z', action: 'Ver OS',
  },
  {
    id: 'AL-006', title: 'Leitura de Horímetro Atrasada', description: 'Sem leitura registrada há 4 dias',
    type: 'Leitura', equipment: 'Colhedora Jacto K3', priority: 'Médio', status: 'Novo',
    createdAt: '2026-08-01T00:00:00Z', action: 'Registrar leitura',
  },
];

const TABS = [
  { id: 'todos', label: 'Todos', badge: mockAlerts.filter((a) => a.status === 'Novo' || a.status === 'Em tratamento').length },
  { id: 'critico', label: 'Crítico', badge: mockAlerts.filter((a) => a.priority === 'Crítico').length },
  { id: 'alto', label: 'Alto' },
  { id: 'resolvidos', label: 'Resolvidos' },
];

const PriorityIcon = ({ priority }: { priority: AlertPriority }) => {
  const icons: Record<AlertPriority, React.ReactNode> = {
    Crítico: <Flame size={16} className="text-error" />,
    Alto: <AlertTriangle size={16} className="text-error" />,
    Médio: <AlertCircle size={16} className="text-warning" />,
    Baixo: <Info size={16} className="text-success" />,
    Informativo: <Info size={16} className="text-on-surface-variant" />,
  };
  return <>{icons[priority]}</>;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export const CentralAlertas: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('todos');

  const filtered = mockAlerts.filter((a) => {
    if (activeTab === 'todos') return a.status !== 'Resolvido' && a.status !== 'Cancelado';
    if (activeTab === 'critico') return a.priority === 'Crítico';
    if (activeTab === 'alto') return a.priority === 'Alto';
    if (activeTab === 'resolvidos') return a.status === 'Resolvido';
    return true;
  });

  const stats = {
    criticos: mockAlerts.filter((a) => a.priority === 'Crítico').length,
    altos: mockAlerts.filter((a) => a.priority === 'Alto').length,
    medios: mockAlerts.filter((a) => a.priority === 'Médio').length,
    total: mockAlerts.filter((a) => a.status !== 'Resolvido').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <PageHeader
          title="Central de Alertas"
          subtitle="Pendências, avisos e alertas críticos de todos os módulos do sistema."
          icon={<Bell size={22} />}
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Críticos', value: stats.criticos, color: 'text-error', bg: 'bg-error/10 border-error/20' },
            { label: 'Altos', value: stats.altos, color: 'text-error', bg: 'bg-error/5 border-error/10' },
            { label: 'Médios', value: stats.medios, color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
            { label: 'Total Abertos', value: stats.total, color: 'text-on-surface', bg: 'bg-surface-container-highest border-white/10' },
          ].map((kpi) => (
            <div key={kpi.label} className={`glass-card rounded-xl border p-4 ${kpi.bg}`}>
              <p className={`text-[24px] font-bold font-mono-label ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[12px] text-on-surface-variant mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Abas */}
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Lista de alertas */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 size={36} className="text-success mx-auto mb-3 opacity-60" />
              <p className="text-[14px] font-medium text-on-surface">Nenhum alerta nesta categoria</p>
              <p className="text-[12px] text-on-surface-variant/60 mt-1">Tudo em dia por aqui.</p>
            </div>
          ) : (
            filtered.map((alert) => (
              <div
                key={alert.id}
                className="glass-card rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <PriorityIcon priority={alert.priority} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] font-semibold text-on-surface">{alert.title}</p>
                          <PriorityBadge priority={alert.priority} />
                          <StatusBadge status={alert.status} />
                        </div>
                        <p className="text-[12px] text-on-surface-variant/70 mt-0.5">{alert.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[11px] text-on-surface-variant/50 font-mono-label">
                            🚜 {alert.equipment}
                          </span>
                          <span className="text-[11px] text-on-surface-variant/50 font-mono-label">
                            📂 {alert.type}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/50 font-mono-label">
                            <Clock size={10} /> Gerado em {formatDate(alert.createdAt)}
                          </span>
                          {alert.deadline && (
                            <span className="flex items-center gap-1 text-[11px] text-error/80 font-mono-label">
                              ⚠ Prazo {formatDate(alert.deadline)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button className="flex items-center gap-1.5 text-[12px] text-primary hover:text-primary/80 transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100">
                        <Eye size={13} /> {alert.action} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
