import React, { useState, useEffect } from 'react';
import { User, X, Check } from 'lucide-react';
import type { SystemUser } from '../../../types/users';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SystemUser | null;
  onSave: (data: Partial<SystemUser>) => void;
}

type FormStep = 1 | 2 | 3 | 4;

export const UserForm: React.FC<FormProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<SystemUser>>({
    name: '',
    email: '',
    phone: '',
    type: 'interno',
    status: 'ativo',
    primaryRoleId: 'role-mecanico',
    primaryRoleName: 'Mecânico Diesel',
    jobTitle: '',
    employeeCode: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'interno',
        status: 'ativo',
        primaryRoleId: 'role-mecanico',
        primaryRoleName: 'Mecânico Diesel',
        jobTitle: '',
        employeeCode: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
    setStep(1);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-on-surface">
                {initialData ? 'Editar Usuário' : 'Novo Usuário do Sistema'}
              </h3>
              <p className="text-[11px] text-on-surface-variant/60">Etapa {step} de 4</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X size={16} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-1">
          {([1, 2, 3, 4] as FormStep[]).map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-white/10'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Dados Pessoais</h4>
              <div>
                <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Ex: João da Silva"
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                    placeholder="joao@agroguard.com.br"
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="(16) 99999-0000"
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h4 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Vínculo Profissional</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Matrícula</label>
                  <input
                    type="text"
                    value={formData.employeeCode || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, employeeCode: e.target.value }))}
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 font-mono-label"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Cargo</label>
                  <input
                    type="text"
                    value={formData.jobTitle || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, jobTitle: e.target.value }))}
                    placeholder="Ex: Mecânico Diesel Sênior"
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h4 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Perfil de Acesso</h4>
              <div>
                <label className="block text-[11px] font-medium text-on-surface-variant uppercase mb-1">Perfil Principal</label>
                <select
                  value={formData.primaryRoleId || 'role-mecanico'}
                  onChange={(e) => setFormData((p) => ({ ...p, primaryRoleId: e.target.value, primaryRoleName: e.target.options[e.target.selectedIndex].text }))}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
                >
                  <option value="role-admin">Administrador do Sistema</option>
                  <option value="role-gestor">Gestor Operacional</option>
                  <option value="role-planejador">Planejador de Manutenção</option>
                  <option value="role-supervisor">Supervisor de Campo</option>
                  <option value="role-mecanico">Mecânico Diesel</option>
                  <option value="role-operador">Operador de Máquinas</option>
                  <option value="role-almoxarife">Almoxarife</option>
                  <option value="role-auditor">Auditor Externo</option>
                  <option value="role-consulta">Somente Leitura</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h4 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Revisão e Confirmação</h4>
              <div className="glass-card rounded-xl border border-white/10 p-3 space-y-1.5 text-[12px]">
                <p><strong className="text-on-surface-variant">Nome:</strong> <span className="text-on-surface font-semibold">{formData.name}</span></p>
                <p><strong className="text-on-surface-variant">E-mail:</strong> <span className="text-on-surface">{formData.email}</span></p>
                <p><strong className="text-on-surface-variant">Cargo:</strong> <span className="text-on-surface">{formData.jobTitle || '—'}</span></p>
                <p><strong className="text-on-surface-variant">Perfil:</strong> <span className="text-primary font-medium">{formData.primaryRoleName || 'Mecânico'}</span></p>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => step > 1 ? setStep((s) => (s - 1) as FormStep) : onClose()}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-on-surface-variant hover:text-on-surface"
            >
              {step > 1 ? 'Anterior' : 'Cancelar'}
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as FormStep)}
                className="px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary/90 transition-all"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-success text-white text-[12px] font-semibold hover:bg-success/90 transition-all flex items-center gap-1"
              >
                <Check size={14} />
                Salvar Usuário
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
