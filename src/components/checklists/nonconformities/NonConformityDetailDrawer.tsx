import React, { useState } from 'react';
import { X, Wrench, ShieldAlert, CheckCircle2, Ban, Link2 } from 'lucide-react';
import type { ChecklistNonConformity } from '../../../types/checklist';
import { Button } from '../../ui/Button';

interface NonConformityDetailDrawerProps {
  nonConformity: ChecklistNonConformity | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResolve: (nc: ChecklistNonConformity) => void;
  onLinkOrder: (id: string, orderId: string) => Promise<any>;
}

export const NonConformityDetailDrawer: React.FC<NonConformityDetailDrawerProps> = ({
  nonConformity: nc,
  isOpen,
  onClose,
  onOpenResolve,
  onLinkOrder,
}) => {
  const [orderIdInput, setOrderIdInput] = useState('OS-2026-062');
  const [isLinking, setIsLinking] = useState(false);

  if (!isOpen || !nc) return null;

  const handleLink = async () => {
    if (!orderIdInput.trim()) return;
    setIsLinking(true);
    try {
      await onLinkOrder(nc.id, orderIdInput.trim());
      onClose();
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs animate-fade-in text-[13px]">
      <div className="w-full max-w-md bg-surface-container-highest border-l border-white/10 p-6 h-full overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono-label text-error font-bold uppercase block">{nc.code}</span>
              <h3 className="font-title-md text-[17px] font-bold text-on-surface leading-snug">{nc.title}</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-label">
            <div className="p-2.5 rounded-xl bg-surface-container border border-white/5">
              <span className="text-on-surface-variant/70 uppercase">Equipamento</span>
              <strong className="text-on-surface block text-[12px] truncate">{nc.equipmentCode}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container border border-white/5">
              <span className="text-on-surface-variant/70 uppercase">Criticidade</span>
              <strong className="text-error uppercase block text-[12px] flex items-center gap-1">
                <ShieldAlert size={13} /> {nc.criticality}
              </strong>
            </div>
          </div>

          <div className="space-y-2 text-[12px]">
            <h4 className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase">Descrição Apontada</h4>
            <p className="p-3 rounded-xl bg-surface-container/60 border border-white/5 text-on-surface-variant/90 leading-relaxed">
              {nc.description || 'Sem detalhes informados.'}
            </p>
          </div>

          {nc.blockedEquipment && (
            <div className="p-3 rounded-xl bg-error/20 border border-error/40 text-error font-bold text-[12px] flex items-center gap-2">
              <Ban size={18} className="shrink-0" /> Este ativo encontra-se interditado por segurança até a resolução!
            </div>
          )}

          {nc.photoUrls.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase">Foto(s) Anexadas</h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {nc.photoUrls.map((img, idx) => (
                  <img key={idx} src={img} alt="Avaria na máquina" className="w-28 h-28 object-cover rounded-xl border border-white/10 shadow" />
                ))}
              </div>
            </div>
          )}

          {/* Vínculo de Ordem de Serviço (Sem duplicar a lógica de OS) */}
          <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-secondary font-bold text-[12px]">
              <Link2 size={16} /> Integração de Manutenção & OS
            </div>
            {nc.generatedOrderId ? (
              <p className="text-[12px] text-on-surface">
                Vinculada à Ordem de Serviço: <strong className="text-secondary font-mono-label font-bold text-[14px]">{nc.generatedOrderId}</strong>
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Ex: OS-2026-062"
                  className="bg-surface-container border border-white/20 rounded-lg px-2.5 py-1 text-[12px] text-on-surface w-full focus:outline-none"
                />
                <Button variant="outline" size="sm" onClick={handleLink} isLoading={isLinking} className="shrink-0 text-secondary">
                  Vincular OS
                </Button>
              </div>
            )}
          </div>

          {nc.status === 'resolvida' && (
            <div className="p-3.5 rounded-xl bg-success/15 border border-success/30 text-success space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono-label text-[12px]">
                <CheckCircle2 size={16} /> Pendência Resolvida por {nc.resolvedBy}
              </div>
              <p className="text-[11px] text-on-surface-variant">Solução: {nc.resolutionNotes}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>Fechar</Button>
          {nc.status !== 'resolvida' && nc.status !== 'cancelada' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Wrench size={15} />}
              onClick={() => {
                onClose();
                onOpenResolve(nc);
              }}
            >
              Resolver Falha
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
