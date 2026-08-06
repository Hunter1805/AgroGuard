import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: loginError } = await login(email, password);

      if (loginError) {
        if (loginError.message === 'Invalid login credentials') {
          setError('E-mail ou senha incorretos.');
        } else if (loginError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu endereço de e-mail antes de acessar.');
          // Opcionalmente redireciona para a tela de confirmar-email
          setTimeout(() => navigate('/confirmar-email'), 2000);
        } else {
          setError(loginError.message || 'Ocorreu um erro ao fazer login.');
        }
      } else {
        // Redirecionamento com base no estado do profile será tratado no Callback/Auth Listener,
        // ou redirecionamos para o callback/dashboard para que o roteamento geral resolva.
        navigate('/auth/callback');
      }
    } catch (err: any) {
      setError('Erro interno do sistema. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-800 font-sans">
      {/* Painel Lateral Azul-Marinho (Institucional/Operacional) */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 text-slate-100 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        {/* Linhas técnicas de fundo discretas */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Topo - Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-emerald-600 p-2.5 rounded-lg flex items-center justify-center text-white shadow-md">
            <Shield size={24} className="stroke-[2]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">AgroGuard</span>
            <span className="block text-[10px] tracking-wider text-emerald-500 uppercase font-semibold">Operational Hub</span>
          </div>
        </div>

        {/* Centro - Mensagem institucional corporativa */}
        <div className="space-y-6 max-w-sm relative z-10 my-auto">
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            Controle operacional da frota em um único ambiente.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gerencie preventivas, corretivas, checklists, pneus, ferramentas e estoques de forma integrada, auditável e segura.
          </p>
          <ul className="space-y-3 pt-4 text-slate-300 text-sm">
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Manutenções Preventivas e Planejamento
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Controle de Equipamentos e Medidores
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ordens de Serviço e Fluxo de Trabalho
            </li>
          </ul>
        </div>

        {/* Rodapé */}
        <div className="text-[11px] text-slate-500 relative z-10 flex justify-between items-center border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} AgroGuard. Todos os direitos reservados.</span>
          <span className="text-emerald-500/80 font-medium">v1.1.0 Corp</span>
        </div>
      </div>

      {/* Painel do Formulário de Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50">
        <div className="w-full max-w-[440px] bg-white p-8 rounded-lg border border-slate-200/85 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Entrar no AgroGuard</h2>
            <p className="text-xs text-slate-500">Insira suas credenciais corporativas abaixo para acessar o sistema.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2.5 text-xs animate-shake">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
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
                  placeholder="exemplo@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700 block">
                  Senha
                </label>
                <Link
                  to="/recuperar-senha"
                  className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha corporativa"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-10 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  disabled={loading}
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
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Entrar no AgroGuard'
              )}
            </button>
          </form>

          {/* Links adicionais */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Não possui uma conta?{' '}
              <Link to="/criar-conta" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Criar conta corporativa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
