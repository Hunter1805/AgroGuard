import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Edit, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase/supabase-client';

export const EmailConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

  // Tenta ler os dados pendentes de cadastro salvos no localStorage
  const pendingDataString = localStorage.getItem('agroguard_onboarding_pending');
  const pendingData = pendingDataString ? JSON.parse(pendingDataString) : null;
  const initialEmail = pendingData ? pendingData.email : 'seu e-mail profissional';

  const [email, setEmail] = useState(initialEmail);
  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResend = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        setError(resendError.message || 'Falha ao reenviar e-mail de ativação.');
      } else {
        setSuccess('E-mail de confirmação reenviado com sucesso! Verifique sua caixa de entrada.');
      }
    } catch (err) {
      setError('Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newEmail.trim() || newEmail === email) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      // No Supabase, se o e-mail não está confirmado, para atualizar o e-mail,
      // podemos disparar uma nova tentativa de signUp com o e-mail correto,
      // ou atualizar o e-mail do usuário se ele estiver pré-autenticado.
      // Como a sessão pode não existir, o jeito mais seguro se ele digitou errado
      // é pedir para ele voltar e fazer o cadastro de novo com o e-mail correto,
      // ou atualizarmos as informações salvas locais.
      // Mas para uma experiência fluida:
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (updateError) {
        setError(updateError.message || 'Erro ao alterar e-mail. Faça o cadastro novamente.');
      } else {
        setEmail(newEmail);
        setEditing(false);
        setSuccess('Endereço de e-mail atualizado! Enviamos a confirmação para o novo endereço.');

        // Atualiza no localStorage
        if (pendingData) {
          pendingData.email = newEmail;
          localStorage.setItem('agroguard_onboarding_pending', JSON.stringify(pendingData));
        }
      }
    } catch (err) {
      setError('Erro ao atualizar e-mail.');
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

        {/* Icone de Email grande */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full">
            <Mail size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Confirme seu e-mail</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Enviamos uma mensagem de ativação. Abra o e-mail para ativar sua conta e liberar seu ambiente de trabalho.
          </p>
        </div>

        {/* Status / Retornos */}
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

        {/* Display do Email cadastrado */}
        <div className="bg-slate-50 p-4 rounded-md border border-slate-150 space-y-3 text-center">
          {editing ? (
            <form onSubmit={handleUpdateEmail} className="space-y-2">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded px-3 py-2 outline-none focus:border-slate-400 text-center"
              />
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">E-mail de confirmação enviado para</span>
              <span className="text-xs font-bold text-slate-800 tracking-tight">{email}</span>
              <button
                type="button"
                onClick={() => {
                  setNewEmail(email);
                  setEditing(true);
                }}
                className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 pt-1"
              >
                <Edit size={10} />
                Alterar e-mail
              </button>
            </div>
          )}
        </div>

        {/* Ações principais */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-md py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Reenviar mensagem de confirmação
          </button>

          <button
            onClick={() => navigate('/entrar')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md py-2.5 transition-colors flex items-center justify-center gap-1.5"
          >
            Ir para Tela de Login
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/criar-conta"
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 block"
          >
            Voltar e se cadastrar novamente
          </Link>
        </div>
      </div>
    </div>
  );
};
export default EmailConfirmationPage;
