import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const { error } = await login(email, password);
      if (error) {
        setErrorMsg(error.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      setErrorMsg('Falha ao conectar com o serviço de autenticação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 bg-pattern">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">AgroGuard</h1>
          <p className="text-xs text-on-background-variant mt-1">
            Gestão Autônoma de Frotas e Operações Agrícolas
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-on-background-variant uppercase tracking-wider mb-2">
              E-mail Institucional
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-background-variant" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@agroguard.com.br"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-background-variant uppercase tracking-wider mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-background-variant" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Acessar Painel AgroGuard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
