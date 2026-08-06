import React, { useState } from 'react';
import { X, Send, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/api/api-client';

interface InviteUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteUserDrawer: React.FC<InviteUserDrawerProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('tecnico');
  const [allCompanies, setAllCompanies] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !role) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    const payload = {
      email: email.trim().toLowerCase(),
      role,
      scope: {
        allCompanies,
        allUnits: allCompanies,
        allFarms: allCompanies,
        companyIds: [],
        unitIds: [],
        farmIds: [],
      },
    };

    try {
      const res = await apiClient('/users/invitations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.data) {
        setSuccess(`Convite de acesso enviado com sucesso para ${email}!`);
        setEmail('');
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(null);
        }, 2000);
      } else {
        setError('Ocorreu um erro ao disparar o convite.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar convite administrativo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideOver text-slate-800 font-sans">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-md text-white">
              <Shield size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">Convidar Novo Usuário</h3>
              <p className="text-[10px] text-slate-500">Adicione um novo colaborador à sua organização.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-150 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2 text-xs">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md flex items-start gap-2 text-xs">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form id="invite-form" onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">E-mail profissional</label>
              <input
                type="email"
                required
                placeholder="colaborador@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md px-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={loading}
              />
            </div>

            {/* Perfil */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Perfil de acesso</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-md px-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={loading}
              >
                <option value="administrador">Administrador (Gestor total)</option>
                <option value="tecnico">Técnico / Mecânico (Operacional)</option>
                <option value="operador">Operador / Motorista (Checklists)</option>
                <option value="membro">Membro (Somente leitura)</option>
              </select>
            </div>

            {/* Escopo */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block">Escopo organizacional de acesso</label>
              
              <div className="space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-600">
                  <input
                    type="radio"
                    name="scope"
                    checked={allCompanies}
                    onChange={() => setAllCompanies(true)}
                    className="mt-0.5 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    disabled={loading}
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-800 block leading-none">Acesso total da organização</span>
                    <span className="text-[10px] text-slate-500">Permite visualizar todas as empresas, unidades e fazendas.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-slate-600">
                  <input
                    type="radio"
                    name="scope"
                    checked={!allCompanies}
                    onChange={() => setAllCompanies(false)}
                    className="mt-0.5 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    disabled={loading}
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-800 block leading-none">Escopo restrito (Configuração futura)</span>
                    <span className="text-[10px] text-slate-500">Permissão configurada para unidades específicas no cadastro detalhado.</span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md py-2.5 transition-colors"
          >
            Cancelar
          </button>
          <button
            form="invite-form"
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={12} />
                Enviar Convite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
