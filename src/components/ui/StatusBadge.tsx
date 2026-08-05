import React from 'react';

// ─── StatusBadge ─────────────────────────────────────────────────────────────

type EquipmentStatus =
  | 'operante'
  | 'em_operacao'
  | 'manutencao'
  | 'inoperante'
  | 'parado'
  | 'bloqueado'
  | 'disponivel';

type OSStatus =
  | 'Rascunho'
  | 'Aberta'
  | 'Em triagem'
  | 'Aguardando aprovação'
  | 'Planejada'
  | 'Programada'
  | 'Aguardando peças'
  | 'Aguardando ferramenta'
  | 'Aguardando terceiro'
  | 'Em execução'
  | 'Pausada'
  | 'Em teste'
  | 'Finalizada'
  | 'Aguardando aprovação final'
  | 'Encerrada'
  | 'Cancelada';

type ChecklistStatus =
  | 'Não iniciado'
  | 'Em andamento'
  | 'Concluído'
  | 'Concluído com não conformidade'
  | 'Aguardando validação'
  | 'Reprovado'
  | 'Cancelado';

type AlertStatus =
  | 'Novo'
  | 'Visualizado'
  | 'Em tratamento'
  | 'Adiado'
  | 'Resolvido'
  | 'Ignorado'
  | 'Cancelado';

type GenericStatus = string;

type StatusValue =
  | EquipmentStatus
  | OSStatus
  | ChecklistStatus
  | AlertStatus
  | GenericStatus;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // Equipamentos
  operante: { label: 'Operante', className: 'bg-success/10 text-success border-success/20' },
  disponivel: { label: 'Disponível', className: 'bg-success/10 text-success border-success/20' },
  em_operacao: { label: 'Em Operação', className: 'bg-primary/10 text-primary border-primary/20' },
  manutencao: { label: 'Manutenção', className: 'bg-warning/10 text-warning border-warning/20' },
  inoperante: { label: 'Inoperante', className: 'bg-error/10 text-error border-error/20' },
  parado: { label: 'Parado', className: 'bg-error/10 text-error border-error/20' },
  bloqueado: { label: 'Bloqueado', className: 'bg-error/15 text-error border-error/30 font-bold' },

  // OS
  'Rascunho': { label: 'Rascunho', className: 'bg-surface-container-highest text-on-surface-variant border-white/10' },
  'Aberta': { label: 'Aberta', className: 'bg-primary/10 text-primary border-primary/20' },
  'Em triagem': { label: 'Em triagem', className: 'bg-primary/10 text-primary border-primary/20' },
  'Aguardando aprovação': { label: 'Aguard. aprovação', className: 'bg-warning/10 text-warning border-warning/20' },
  'Planejada': { label: 'Planejada', className: 'bg-primary/10 text-primary border-primary/20' },
  'Programada': { label: 'Programada', className: 'bg-primary/10 text-primary border-primary/20' },
  'Aguardando peças': { label: 'Aguard. peças', className: 'bg-warning/10 text-warning border-warning/20' },
  'Aguardando ferramenta': { label: 'Aguard. ferramenta', className: 'bg-warning/10 text-warning border-warning/20' },
  'Aguardando terceiro': { label: 'Aguard. terceiro', className: 'bg-warning/10 text-warning border-warning/20' },
  'Em execução': { label: 'Em execução', className: 'bg-primary/10 text-primary border-primary/20' },
  'Pausada': { label: 'Pausada', className: 'bg-warning/10 text-warning border-warning/20' },
  'Em teste': { label: 'Em teste', className: 'bg-primary/10 text-primary border-primary/20' },
  'Finalizada': { label: 'Finalizada', className: 'bg-success/10 text-success border-success/20' },
  'Aguardando aprovação final': { label: 'Aguard. aprv. final', className: 'bg-warning/10 text-warning border-warning/20' },
  'Encerrada': { label: 'Encerrada', className: 'bg-success/15 text-success border-success/30' },
  'Cancelada': { label: 'Cancelada', className: 'bg-surface-container-highest text-on-surface-variant/60 border-white/10 line-through' },

  // Checklist
  'Não iniciado': { label: 'Não iniciado', className: 'bg-surface-container-highest text-on-surface-variant border-white/10' },
  'Em andamento': { label: 'Em andamento', className: 'bg-primary/10 text-primary border-primary/20' },
  'Concluído': { label: 'Concluído', className: 'bg-success/10 text-success border-success/20' },
  'Concluído com não conformidade': { label: 'Com NC', className: 'bg-warning/10 text-warning border-warning/20' },
  'Aguardando validação': { label: 'Aguard. validação', className: 'bg-warning/10 text-warning border-warning/20' },
  'Reprovado': { label: 'Reprovado', className: 'bg-error/10 text-error border-error/20' },

  // Alertas
  'Novo': { label: 'Novo', className: 'bg-error/10 text-error border-error/20' },
  'Visualizado': { label: 'Visualizado', className: 'bg-primary/10 text-primary border-primary/20' },
  'Em tratamento': { label: 'Em tratamento', className: 'bg-primary/10 text-primary border-primary/20' },
  'Adiado': { label: 'Adiado', className: 'bg-warning/10 text-warning border-warning/20' },
  'Resolvido': { label: 'Resolvido', className: 'bg-success/10 text-success border-success/20' },
  'Ignorado': { label: 'Ignorado', className: 'bg-surface-container-highest text-on-surface-variant border-white/10' },

  // Legado para compatibilidade
  'Em Progresso': { label: 'Em Progresso', className: 'bg-primary/10 text-primary border-primary/20' },
  'Aguardando Peça': { label: 'Aguard. Peça', className: 'bg-warning/10 text-warning border-warning/20' },
  'Concluída': { label: 'Concluída', className: 'bg-success/10 text-success border-success/20' },
  'Pendente': { label: 'Pendente', className: 'bg-surface-container-highest text-on-surface-variant border-white/10' },
};

interface StatusBadgeProps {
  status: StatusValue;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] ?? {
    label: String(status),
    className: 'bg-surface-container-highest text-on-surface-variant border-white/10',
  };

  const sizeClass = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-[11px] px-2 py-1';

  return (
    <span className={`inline-flex items-center border rounded-full font-mono-label font-medium whitespace-nowrap ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
};
