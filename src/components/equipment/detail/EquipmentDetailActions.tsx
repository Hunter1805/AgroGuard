import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gauge,
  ClipboardList,
  Plus,
  Calendar,
  Edit,
  MoreVertical,
  MapPin,
  FileText,
  Archive,
  Printer,
  Shield,
} from 'lucide-react';
import type { Equipment } from '../../../types/equipment';
import { Button } from '../../ui/Button';
import { ROUTE_HELPERS, ROUTES } from '../../../types/routes';

interface EquipmentDetailActionsProps {
  equipment: Equipment;
  onOpenReadingModal?: () => void;
  onArchiveEquipment?: () => void;
}

export const EquipmentDetailActions: React.FC<EquipmentDetailActionsProps> = ({
  equipment,
  onOpenReadingModal,
  onArchiveEquipment,
}) => {
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleEdit = () => {
    navigate(ROUTE_HELPERS.equipmentEdit(equipment.id));
  };

  const handleCreateOS = () => {
    navigate(ROUTES.ORDENS_SERVICO);
  };

  const handleStartChecklist = () => {
    navigate(ROUTES.CHECKLISTS);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 relative">
      {toastMsg && (
        <div className="absolute -top-12 right-0 bg-surface-container-highest border border-primary/40 text-primary px-3 py-1.5 rounded-md text-[12px] shadow-lg animate-fade-in z-20">
          ℹ {toastMsg}
        </div>
      )}

      {/* Ações Rápidas Principais */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          icon={<Gauge size={14} />}
          onClick={() => (onOpenReadingModal ? onOpenReadingModal() : showToast('Registrar leitura rápida'))}
        >
          Registrar Leitura
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<ClipboardList size={14} />}
          onClick={handleStartChecklist}
        >
          Iniciar Checklist
        </Button>

        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={14} />}
          onClick={handleCreateOS}
        >
          Abrir Ordem de Serviço
        </Button>

        <Button
          variant="outline"
          size="sm"
          icon={<Calendar size={14} />}
          onClick={() => showToast('Programar manutenção preventiva')}
        >
          Programar Manutenção
        </Button>
      </div>

      {/* Ação Editar e Menu Mais Opções */}
      <div className="flex items-center gap-2 relative">
        <Button
          variant="outline"
          size="sm"
          icon={<Edit size={14} />}
          onClick={handleEdit}
        >
          Editar Equipamento
        </Button>

        <div className="relative">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="p-2 rounded-lg bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-all cursor-pointer"
            title="Mais ações"
          >
            <MoreVertical size={16} />
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl py-2 z-30 text-[12px] space-y-0.5 animate-fade-in">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  showToast('Solicitação de alteração de status');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-on-surface flex items-center gap-2 cursor-pointer"
              >
                <Shield size={14} className="text-primary" /> Alterar Status Operacional
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  showToast('Transferência de localização');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-on-surface flex items-center gap-2 cursor-pointer"
              >
                <MapPin size={14} className="text-primary" /> Transferir Localização
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  showToast('Vincular plano preventivo');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-on-surface flex items-center gap-2 cursor-pointer"
              >
                <Calendar size={14} className="text-primary" /> Vincular Plano Preventivo
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  showToast('Adicionar novo documento');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-on-surface flex items-center gap-2 cursor-pointer"
              >
                <FileText size={14} className="text-primary" /> Adicionar Documento
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  window.print();
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-on-surface flex items-center gap-2 cursor-pointer"
              >
                <Printer size={14} className="text-primary" /> Imprimir Ficha Operacional
              </button>

              <div className="border-t border-white/5 my-1" />

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  if (onArchiveEquipment) onArchiveEquipment();
                  else showToast('Arquivar equipamento');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-error/15 text-error flex items-center gap-2 cursor-pointer font-medium"
              >
                <Archive size={14} /> Arquivar Equipamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
