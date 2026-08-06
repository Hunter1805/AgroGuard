import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, digite seu e-mail.');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message || 'Erro ao enviar e-mail de recuperação.');
      } else {
        setSuccess('Instruções de recuperação enviadas com sucesso! Verifique seu e-mail.');
        setEmail('');
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 justify-center items-center p-6 text-slate-800 font-sans">
      <div className="w-full max-w-[440px] bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
        {/* Topo - Logo */}
        <div className="flex items-center gap-3 justify-center pb-2 border-b border-slate-100">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Shield size={20} />
          </div>
          <span className="text-lg font-bold text-slate-900">AgroGuard</span>
        </div>

        <div className="space-y-1.5 text-center">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Recuperar Senha</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Digite seu endereço de e-mail corporativo cadastrado e nós lhe enviaremos as instruções para definir uma nova senha.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2.5 text-xs">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md flex items-start gap-2.5 text-xs">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
              E-mail profissional
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="michael@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Enviar link de recuperação'
            )}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link
            to="/entrar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={14} />
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
