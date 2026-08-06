import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/api/api-client';

export const AcceptInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de convite ausente ou inválido. Solicite um novo convite ao administrador da organização.');
    }
  }, [token]);

  // Validação da Força da Senha
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-slate-200', textClass: 'text-slate-400', width: 'w-0' };
    if (password.length < 6) return { label: 'Fraca', color: 'bg-red-500', textClass: 'text-red-500', width: 'w-1/3' };
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (password.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { label: 'Forte', color: 'bg-emerald-500', textClass: 'text-emerald-500', width: 'w-full' };
    }
    return { label: 'Média', color: 'bg-amber-500', textClass: 'text-amber-500', width: 'w-2/3' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Token de convite ausente.');
      return;
    }

    if (!name.trim() || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError('Você precisa ler e concordar com os Termos de Uso e Política de Privacidade.');
      return;
    }

    setLoading(true);

    try {
      // Dispara chamada ao endpoint do backend para aceitar convite
      const res = await apiClient<{ message: string; userId: string }>(`/users/invitations/${token}/accept`, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          password,
        }),
      });

      if (!res.data) {
        setError('Ocorreu um erro ao aceitar o convite.');
        setLoading(false);
        return;
      }

      setSuccess('Cadastro ativado com sucesso! Você está pronto para fazer o login.');
      setName('');
      setPassword('');
      setConfirmPassword('');

      // Redireciona para o login após 3 segundos
      setTimeout(() => navigate('/entrar'), 3000);
    } catch (err: any) {
      setError(err.message || 'Falha ao aceitar convite. Verifique se ele já expirou ou foi aceito.');
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
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Aceitar Convite</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Defina seus dados pessoais e crie sua senha de acesso corporativo para ingressar na sua organização.
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
          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Seu nome completo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                placeholder="Michael Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={loading || !token}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Sua senha de acesso</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-10 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={loading || !token}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Força da Senha */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Força da senha:</span>
                  <span className={`font-semibold ${strength.textClass}`}>{strength.label}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Confirmar senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Repita sua senha de acesso"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-10 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={loading || !token}
              />
            </div>
          </div>

          {/* Aceites Termos e Privacidade */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                disabled={loading || !token}
              />
              <span className="text-[11px] leading-tight">
                Li e concordo com os{' '}
                <a href="/termos" target="_blank" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Termos de Uso
                </a>{' '}
                do AgroGuard.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                disabled={loading || !token}
              />
              <span className="text-[11px] leading-tight">
                Autorizo o processamento de dados conforme a{' '}
                <a href="/privacidade" target="_blank" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Política de Privacidade
                </a>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Ingressar na Organização'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AcceptInvitationPage;
