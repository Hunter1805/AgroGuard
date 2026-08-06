import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Layers, Cpu, Phone, User, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProvisioningPage: React.FC = () => {
  const { user, provisionOrganization } = useAuth();
  const navigate = useNavigate();

  const [ownerName, setOwnerName] = useState(user?.user_metadata?.name || '');
  const [companyName, setCompanyName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [segment, setSegment] = useState('AGRICULTURE');
  const [equipmentCount, setEquipmentCount] = useState('11_50');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ownerName.trim() || !companyName.trim() || !workspaceName.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setStatusText('Criando sua organização e empresa principal...');

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
      setTimeout(() => setStatusText('Inicializando preferências e numerações...'), 1000);
      
      const { error: provisionError } = await provisionOrganization(payload);

      if (provisionError) {
        setError(provisionError.message || 'Erro ao criar ambiente. Tente novamente.');
        setLoading(false);
        return;
      }

      setStatusText('Ambiente provisionado! Redirecionando...');
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
          /* Estado de Carregamento Animado */
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <RefreshCw size={36} className="text-emerald-600 animate-spin" />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Provisionamento</span>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{statusText}</p>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              Estamos montando a infraestrutura de banco de dados e escopo para o seu novo ambiente operacional corporativo.
            </p>
          </div>
        ) : (
          /* Formulário de Criação */
          <div className="space-y-5">
            <div className="space-y-1.5 text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Criar Novo Ambiente</h2>
              <p className="text-xs text-slate-500">
                Seu usuário não possui uma organização ativa. Preencha as informações para provisionar seu ambiente exclusivo.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2.5 text-xs">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-md pl-9 pr-3 py-2.5 outline-none focus:border-slate-400 focus:bg-white transition-all appearance-none"
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
        )}
      </div>
    </div>
  );
};
export default ProvisioningPage;
