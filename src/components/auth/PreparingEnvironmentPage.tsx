import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Building2, Layers, Cpu, Phone, User, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PreparingEnvironmentPage: React.FC = () => {
  const { user, provisionOrganization, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estados de Controle
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState('Concluindo a criação do seu ambiente...');
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  // Campos do formulário manual de contingência
  const [ownerName, setOwnerName] = useState(user?.user_metadata?.name || '');
  const [companyName, setCompanyName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [segment, setSegment] = useState('AGRICULTURE');
  const [equipmentCount, setEquipmentCount] = useState('11_50');
  const [phone, setPhone] = useState('');

  // Executa a tentativa automática de provisionamento ao carregar
  useEffect(() => {
    const autoProvision = async () => {
      // Se veio explicitamente com erro de dados ausentes, exibe o formulário direto
      if (searchParams.get('erro') === 'dados_ausentes') {
        setShowManualForm(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setStatusText('Estamos preparando o AgroGuard para a sua empresa...');

      try {
        const { error: provisionError } = await provisionOrganization({});

        if (provisionError) {
          const msg = provisionError.message || '';
          if (
            provisionError.code === 'ONBOARDING_DATA_MISSING' ||
            msg.includes('não localizados') ||
            msg.includes('indisponíveis')
          ) {
            // Se os dados não estão disponíveis na nuvem nem localmente
            setShowManualForm(true);
          } else {
            setError(provisionError.message || 'Ocorreu um erro ao provisionar seu ambiente.');
          }
          setLoading(false);
          return;
        }

        // Sucesso no provisionamento silencioso
        setStatusText('Tudo pronto! Preparando seu primeiro acesso...');
        setTimeout(() => navigate('/boas-vindas'), 1500);
      } catch (err) {
        setError('Não foi possível conectar ao servidor de provisionamento.');
        setLoading(false);
      }
    };

    autoProvision();
  }, [searchParams]);

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ownerName.trim() || !companyName.trim() || !workspaceName.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setStatusText('Criando sua organização e ambiente operacional...');

    const payload = {
      ownerName: ownerName.trim(),
      organizationName: companyName.trim(),
      workspaceName: workspaceName.trim(),
      segment,
      estimatedEquipmentCount: equipmentCount,
      phone: phone.trim() || null,
      acceptedTermsVersion: '2026-08',
      acceptedPrivacyVersion: '2026-08',
    };

    try {
      const { error: provisionError } = await provisionOrganization(payload);

      if (provisionError) {
        setError(provisionError.message || 'Erro ao criar ambiente. Tente novamente.');
        setLoading(false);
        return;
      }

      // Sincroniza o perfil e redireciona
      await refreshProfile();
      setStatusText('Ambiente provisionado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/boas-vindas'), 1500);
    } catch (err) {
      setError('Erro ao processar solicitação no servidor.');
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

        {loading ? (
          /* Estado de Carregamento Animado (Processamento Silencioso) */
          <div className="py-12 flex flex-col items-center text-center space-y-4 animate-fade-in">
            <RefreshCw size={36} className="text-emerald-600 animate-spin" />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Configurando</span>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{statusText}</p>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              Estamos montando a infraestrutura de banco de dados e preferências para o seu novo ambiente operacional corporativo.
            </p>
          </div>
        ) : showManualForm ? (
          /* Estado de Contingência Manual (Quando os metadados do cadastro sumiram) */
          <div className="space-y-5">
            <div className="space-y-1.5 text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Configurar sua Empresa</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Não conseguimos recuperar os dados do cadastro original de forma automática. Por favor, forneça-os abaixo para concluirmos a configuração.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2.5 text-xs">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitManual} className="space-y-4">
              {/* Nome do Responsável */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Nome completo do responsável</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Michael Silva"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

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
                      if (!workspaceName) {
                        setWorkspaceName(e.target.value.replace(/Fazenda |Ltda |S\/A /gi, '').trim());
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
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
                >
                  <option value="AGRICULTURE">Agricultura / Cultivo</option>
                  <option value="FORESTRY">Silvicultura / Florestal</option>
                  <option value="TRANSPORT">Logística / Transporte</option>
                  <option value="COOPERATIVE">Cooperativa Agrícola</option>
                  <option value="MINING">Mineração / Terraplenagem</option>
                  <option value="OTHER">Outros Segmentos</option>
                </select>
              </div>

              {/* Estimativa de Equipamentos */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Quantidade estimada de equipamentos</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Cpu size={16} />
                  </span>
                  <select
                    value={equipmentCount}
                    onChange={(e) => setEquipmentCount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all"
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
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md py-2.5 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                Provisionar Organização e Empresa
              </button>
            </form>
          </div>
        ) : (
          /* Erros Gerais (ex: servidor fora do ar) com botao de Tentar Novamente */
          <div className="space-y-4 text-center">
            <div className="bg-red-50 text-red-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-950">Falha ao preparar ambiente</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  // Dispara reload
                  navigate('/onboarding/preparando-ambiente', { replace: true });
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md py-2.5 transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => setShowManualForm(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-md py-2.5 transition-colors border border-slate-200"
              >
                Configurar Manualmente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PreparingEnvironmentPage;
