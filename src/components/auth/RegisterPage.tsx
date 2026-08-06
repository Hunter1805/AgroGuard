import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, User, Building2, Layers, Cpu, Phone, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  // Etapa Atual (1 ou 2)
  const [step, setStep] = useState(1);

  // Etapa 1 — Dados Pessoais / Conta
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Etapa 2 — Dados da Empresa
  const [companyName, setCompanyName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [segment, setSegment] = useState('AGRICULTURE');
  const [equipmentCount, setEquipmentCount] = useState('11_50');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações Etapa 1
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos da conta.');
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
      setError('Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações Etapa 2
    if (!companyName.trim() || !workspaceName.trim()) {
      setError('Por favor, preencha o nome da empresa e do ambiente.');
      return;
    }

    setLoading(true);

    try {
      // 1. Registrar usuário no Supabase Auth
      const { user, error: signUpError } = await registerUser(email, password, name);

      if (signUpError) {
        setError(signUpError.message || 'Erro ao criar conta. Verifique os dados e tente novamente.');
        setLoading(false);
        return;
      }

      if (user) {
        // Guardar temporariamente os dados da empresa no localStorage para provisionar
        // assim que o usuário confirmar o e-mail e receber a sessão.
        const onboardingData = {
          ownerName: name,
          organizationName: companyName,
          workspaceName,
          segment,
          estimatedEquipmentCount: equipmentCount,
          phone: phone.trim() || null,
          acceptedTermsVersion: '2026-08',
          acceptedPrivacyVersion: '2026-08',
        };
        localStorage.setItem('agroguard_onboarding_pending', JSON.stringify(onboardingData));

        // Redirecionar para a tela de confirmação de e-mail
        navigate('/confirmar-email');
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-800 font-sans">
      {/* Painel Lateral Azul-Marinho (Institucional/Cadastro) */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 text-slate-100 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
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

        {/* Centro - Passos / Progresso */}
        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Crie sua conta corporativa</h1>
            <p className="text-slate-400 text-sm">Monte o seu ambiente de frotas e comece a operar hoje mesmo.</p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Passo 1 */}
            <div className="flex gap-4 items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors shrink-0 ${step === 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>
                1
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-semibold block uppercase tracking-wider ${step === 1 ? 'text-white' : 'text-slate-400'}`}>Sua conta</span>
                <span className="text-xs text-slate-400 block">Defina suas credenciais de login e dados pessoais.</span>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4 items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors shrink-0 ${step === 2 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>
                2
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-semibold block uppercase tracking-wider ${step === 2 ? 'text-white' : 'text-slate-400'}`}>Sua empresa</span>
                <span className="text-xs text-slate-400 block">Configure os dados iniciais do seu ambiente operacional.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-[11px] text-slate-500 relative z-10 flex justify-between items-center border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} AgroGuard. Todos os direitos reservados.</span>
          <span className="text-emerald-500/80 font-medium">v1.1.0 Corp</span>
        </div>
      </div>

      {/* Painel do Formulário de Registro */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white p-8 rounded-lg border border-slate-200/85 shadow-sm space-y-6 my-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {step === 1 ? 'Dados da sua conta' : 'Sobre a sua empresa'}
            </h2>
            <p className="text-xs text-slate-500">
              {step === 1 ? 'Etapa 1 de 2 — Suas informações pessoais de login.' : 'Etapa 2 de 2 — Detalhes para o provisionamento do ambiente.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2.5 text-xs">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* Formulário Etapa 1 */
            <form onSubmit={handleNextStep} className="space-y-4">
              {/* Nome Completo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Nome completo</label>
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
                  />
                </div>
              </div>

              {/* E-mail Profissional */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">E-mail profissional</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="michael@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Senha</label>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
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
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-10 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
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
                  />
                  <span className="text-[11px] leading-tight">
                    Autorizo o processamento de dados conforme a{' '}
                    <a href="/privacidade" target="_blank" className="font-semibold text-emerald-600 hover:text-emerald-700">
                      Política de Privacidade
                    </a>.
                  </span>
                </label>
              </div>

              {/* Botão Próximo */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                Prosseguir para Dados da Empresa
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Formulário Etapa 2 */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome da Empresa */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Nome da empresa / fazenda</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Building2 size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Fazenda Agro Norte"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      // Sugere o nome do ambiente a partir da empresa
                      if (!workspaceName) {
                        setWorkspaceName(e.target.value.replace(/Fazenda |Ltda |S\/A /gi, '').trim());
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Nome do Ambiente */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Nome do ambiente (Workspace)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Layers size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Agro Norte"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Segmento */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Segmento de atuação</label>
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-md px-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  disabled={loading}
                >
                  <option value="AGRICULTURE">Agricultura / Cultivo</option>
                  <option value="FORESTRY">Silvicultura / Florestal</option>
                  <option value="TRANSPORT">Logística / Transporte</option>
                  <option value="COOPERATIVE">Cooperativa Agrícola</option>
                  <option value="MINING">Mineração / Terraplenagem</option>
                  <option value="OTHER">Outros Segmentos</option>
                </select>
              </div>

              {/* Quantidade estimada de equipamentos */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Quantidade estimada de equipamentos</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Cpu size={16} />
                  </span>
                  <select
                    value={equipmentCount}
                    onChange={(e) => setEquipmentCount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all appearance-none"
                    disabled={loading}
                  >
                    <option value="1_10">1 a 10 equipamentos</option>
                    <option value="11_50">11 a 50 equipamentos</option>
                    <option value="51_100">51 a 100 equipamentos</option>
                    <option value="101_500">101 a 500 equipamentos</option>
                    <option value="500_plus">Mais de 500 equipamentos</option>
                  </select>
                </div>
              </div>

              {/* Telefone (opcional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Telefone (opcional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Botões Voltar e Criar Conta */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md py-2.5 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Links adicionais */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Já possui uma conta?{' '}
              <Link to="/entrar" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
