import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Gauge, Edit, Plus, Wrench, ClipboardList, MapPin, Archive } from 'lucide-react';
import type { Equipment } from '../../../types/equipment';
import { StatusBadge } from '../../ui/StatusBadge';
import { ROUTES } from '../../../types/routes';

export interface EquipmentDetailHeaderCorpProps {
  equipment: Equipment;
  onBack?: () => void;
  onOpenQuickReading?: (equipment: Equipment) => void;
  onEditEquipment?: (equipment: Equipment) => void;
  onArchiveEquipment?: (equipment: Equipment) => void;
}

export const EquipmentDetailHeaderCorp: React.FC<EquipmentDetailHeaderCorpProps> = ({
  equipment,
  onBack,
  onOpenQuickReading,
  onEditEquipment,
  onArchiveEquipment,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/equipamentos');
  };

  return (
    <div className="space-y-3 pb-4 border-b border-[var(--color-border)]">
      {/* Botão voltar */}
      <div>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft size={16} /> Equipamentos
        </button>
      </div>

      {/* Linha Principal */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="font-semibold leading-tight text-[24px]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {equipment.plateOrCode} · {equipment.name}
            </h1>
            <StatusBadge status={equipment.status} />
          </div>

          {/* Subtítulo / Localização */}
          <p className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
            {equipment.location} · {equipment.farm || 'Fazenda Principal'}
          </p>

          {/* Metadados */}
          <div className="flex items-center gap-4 text-[12px] flex-wrap pt-1" style={{ color: 'var(--color-text-muted)' }}>
            {equipment.patrimony && (
              <span>Patrimônio: <strong style={{ color: 'var(--color-text-primary)' }}>{equipment.patrimony}</strong></span>
            )}
            <span>Modelo: <strong style={{ color: 'var(--color-text-primary)' }}>{equipment.brand} {equipment.model}</strong></span>
            {equipment.operatorName && (
              <span>Responsável: <strong style={{ color: 'var(--color-text-primary)' }}>{equipment.operatorName}</strong></span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 relative shrink-0">
          {/* Botão Primário Verde Único */}
          <button
            type="button"
            onClick={() => onOpenQuickReading ? onOpenQuickReading(equipment) : navigate(ROUTES.EQUIPAMENTOS_LEITURAS)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-white text-[13px] font-medium transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--color-brand)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-brand-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-brand)')}
          >
            <Gauge size={16} />
            Registrar leitura
          </button>

          {/* Menu de 3 pontos */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Mais opções"
              title="Mais opções"
              className="h-10 w-10 flex items-center justify-center rounded-md border text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface-secondary)',
              }}
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg border border-[var(--color-border)] bg-[var(--color-surface)] z-50 py-1 text-[13px] animate-slide-in-up"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onEditEquipment ? onEditEquipment(equipment) : navigate(`/equipamentos/${equipment.id}/editar`); }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-secondary)] flex items-center gap-2 text.primary cursor-pointer"
                  >
                    <Edit size={14} /> Editar equipamento
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate(ROUTES.ORDEM_NOVA); }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-secondary)] flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={14} /> Abrir Ordem de Serviço
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate(ROUTES.MANUTENCOES_PLANOS); }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-secondary)] flex items-center gap-2 cursor-pointer"
                  >
                    <Wrench size={14} /> Programar manutenção
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate(ROUTES.CHECKLISTS); }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-secondary)] flex items-center gap-2 cursor-pointer"
                  >
                    <ClipboardList size={14} /> Iniciar checklist
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate(ROUTES.CADASTROS_LOCALIZACOES); }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-surface-secondary)] flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin size={14} /> Alterar localização
                  </button>
                  <div className="h-px bg-[var(--color-border)] my-1" />
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onArchiveEquipment && onArchiveEquipment(equipment); }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--color-danger-light)] text-[var(--color-danger)] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Archive size={14} /> Arquivar equipamento
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
