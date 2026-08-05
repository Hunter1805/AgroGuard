import React from 'react';
import { X, Truck, Phone, Mail, MapPin, Star } from 'lucide-react';
import type { SupplierMaster } from '../../../types/material-master-data';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierMaster | null;
}

export const SupplierDetailDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, supplier }) => {
  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest border-l border-white/10 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-on-surface">{supplier.tradeName || supplier.corporateName}</h3>
              <p className="text-[11px] text-on-surface-variant/70 font-mono-label">
                {supplier.code} — {supplier.documentNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest">
            <X size={18} />
          </button>
        </div>

        {/* Informações */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px]">
          <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2">
            <h4 className="text-[11px] font-semibold uppercase text-on-surface-variant/60 tracking-wider">Identificação Comercial</h4>
            <p className="text-on-surface"><strong>Razão Social:</strong> {supplier.corporateName || '—'}</p>
            <p className="text-on-surface"><strong>Inscrição Estadual:</strong> {supplier.stateRegistration || 'Isento / Não informado'}</p>
            <p className="text-on-surface"><strong>Pessoa:</strong> {supplier.personType === 'juridica' ? 'Pessoa Jurídica (CNPJ)' : 'Pessoa Física (CPF)'}</p>
          </div>

          <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2">
            <h4 className="text-[11px] font-semibold uppercase text-on-surface-variant/60 tracking-wider">Contato e Localização</h4>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Phone size={14} className="text-primary" />
              <span>{supplier.phone || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Mail size={14} className="text-primary" />
              <span>{supplier.email || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin size={14} className="text-primary" />
              <span>{supplier.city ? `${supplier.city} - ${supplier.state || 'MG'}` : '—'}</span>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2">
            <h4 className="text-[11px] font-semibold uppercase text-on-surface-variant/60 tracking-wider">Classificações e Serviços</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {supplier.classifications.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary border border-primary/20 font-medium">
                  {c.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/10 p-4 space-y-2">
            <h4 className="text-[11px] font-semibold uppercase text-on-surface-variant/60 tracking-wider">Condições Comerciais</h4>
            <p className="text-on-surface"><strong>Prazo Médio de Entrega:</strong> {supplier.averageDeliveryDays ? `${supplier.averageDeliveryDays} dias` : 'Imediato'}</p>
            <p className="text-on-surface"><strong>Condição de Pagamento:</strong> {supplier.paymentTerms || '30 dias'}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <Star size={14} className="text-warning fill-warning" />
              <span className="font-semibold text-on-surface">{supplier.ratingStars ?? 5.0} / 5.0</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-surface-container-high/40 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface-container-highest border border-white/10 text-[12px] font-medium text-on-surface">
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
