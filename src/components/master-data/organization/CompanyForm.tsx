import React, { useState, useEffect } from 'react';
import { Building2, X } from 'lucide-react';
import type { Company } from '../../../types/organization-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Company | null;
  onSave: (data: Partial<Company>) => void;
}

export const CompanyForm: React.FC<FormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    code: '',
    corporateName: '',
    tradeName: '',
    cnpj: '',
    stateRegistration: '',
    segment: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    responsibleName: '',
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        corporateName: '',
        tradeName: '',
        cnpj: '',
        stateRegistration: '',
        segment: 'Agronegócio / Produção Agrícola',
        phone: '',
        email: '',
        city: '',
        state: 'MG',
        responsibleName: '',
        status: 'ativo',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      name: formData.tradeName || formData.corporateName || '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Building2 size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Empresa' : 'Nova Empresa'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Código</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                required
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">CNPJ</label>
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj || ''}
                onChange={(e) => setFormData((p) => ({ ...p, cnpj: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome Fantasia (Obrigatório)</label>
            <input
              type="text"
              value={formData.tradeName || ''}
              onChange={(e) => setFormData((p) => ({ ...p, tradeName: e.target.value }))}
              required
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Razão Social</label>
            <input
              type="text"
              value={formData.corporateName || ''}
              onChange={(e) => setFormData((p) => ({ ...p, corporateName: e.target.value }))}
              className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Telefone</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Cidade</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">UF</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-on-surface-variant hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 transition-all shadow-md"
            >
              Salvar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
