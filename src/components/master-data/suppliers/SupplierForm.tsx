import React, { useState, useEffect } from 'react';
import { Truck, X } from 'lucide-react';
import type { SupplierMaster, SupplierClassification } from '../../../types/material-master-data';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SupplierMaster | null;
  onSave: (data: Partial<SupplierMaster>) => void;
}

const CLASSIFICATIONS: { key: SupplierClassification; label: string }[] = [
  { key: 'pecas', label: 'Peças' },
  { key: 'insumos', label: 'Insumos / Combustíveis' },
  { key: 'pneus', label: 'Pneus' },
  { key: 'ferramentas', label: 'Ferramentas' },
  { key: 'oficina', label: 'Serviço de Oficina' },
  { key: 'servico_tecnico', label: 'Serviço Técnico / Calibração' },
  { key: 'transporte', label: 'Transporte / Logística' },
  { key: 'locacao', label: 'Locação de Frota' },
  { key: 'outro', label: 'Outro' },
];

export const SupplierForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<SupplierMaster>>({
    code: '',
    personType: 'juridica',
    corporateName: '',
    tradeName: '',
    documentNumber: '',
    phone: '',
    email: '',
    city: '',
    state: 'MG',
    classifications: ['pecas'],
    paymentTerms: 'Faturado 30 dias',
    status: 'ativo',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `FOR-${Math.floor(100 + Math.random() * 900)}`,
        personType: 'juridica',
        corporateName: '',
        tradeName: '',
        documentNumber: '',
        phone: '',
        email: '',
        city: 'Varginha',
        state: 'MG',
        classifications: ['pecas'],
        paymentTerms: '30 dias',
        status: 'ativo',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleClassification = (key: SupplierClassification) => {
    const current = formData.classifications || [];
    if (current.includes(key)) {
      setFormData((p) => ({ ...p, classifications: current.filter((c) => c !== key) }));
    } else {
      setFormData((p) => ({ ...p, classifications: [...current, key] }));
    }
  };

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
      <div className="relative z-10 w-full max-w-xl bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Truck size={18} />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {initialData ? 'Editar Fornecedor' : 'Novo Fornecedor Comercial'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
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
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Pessoa</label>
              <select
                value={formData.personType || 'juridica'}
                onChange={(e) => setFormData((p) => ({ ...p, personType: e.target.value as any }))}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
              >
                <option value="juridica">Jurídica (CNPJ)</option>
                <option value="fisica">Física (CPF)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">
                {formData.personType === 'fisica' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                value={formData.documentNumber || ''}
                onChange={(e) => setFormData((p) => ({ ...p, documentNumber: e.target.value }))}
                required
                placeholder={formData.personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 font-mono-label"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Classificações do Fornecedor</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CLASSIFICATIONS.map((c) => {
                const isSelected = (formData.classifications || []).includes(c.key);
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleClassification(c.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-surface-container-highest/60 text-on-surface-variant border border-white/5'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
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
              Salvar Fornecedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
