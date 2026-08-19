import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ManualEnvironmentForm } from './ManualEnvironmentForm';

export const PreparingEnvironmentPage: React.FC = () => {
  const { user, provisionOrganization } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isMissingDataError = searchParams.get('erro') === 'dados_ausentes';

  // Estados de Controle inicializados sem flashes ou atrasos
  const [loading, setLoading] = useState(() => !isMissingDataError);
  const [statusText, setStatusText] = useState('Estamos preparando o AgroGuard para a sua empresa...');
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(() => isMissingDataError);

  // Campos do formulário manual de contingência
  const [ownerName, setOwnerName] = useState(user?.user_metadata?.name || '');
  const [companyName, setCompanyName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [segment, setSegment] = useState('AGRICULTURE');
  const [equipmentCount, setEquipmentCount] = useState('11_50');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Se a URL indica falta de dados, o formulário manual já está ativo no estado inicial
    if (isMissingDataError) return;

    // Verificar se possuímos algum dado no localStorage ou metadata antes de chamar o servidor
    const pendingDataString = localStorage.getItem('agroguard_onboarding_pending');
    const pendingData = pendingDataString ? JSON.parse(pendingDataString) : {};
    const hasCompanyData = !!(pendingData.organizationName || user?.user_metadata?.organizationName);

    // Se não temos dados da empresa, ativa o formulário manual INSTANTANEAMENTE sem esperar chamada de rede
    if (!hasCompanyData) {
      setShowManualForm(true);
      setLoading(false);
      return;
    }

    // Timer de segurança de no máximo 6 segundos para NUNCA travar a tela
    const safetyTimeout = setTimeout(() => {
      setShowManualForm(true);
      setLoading(false);
    }, 6000);

    const autoProvision = async () => {
      setLoading(true);
      setError(null);
      setStatusText('Estamos preparando o AgroGuard para a sua empresa...');

      try {
        const { error: provisionError } = await provisionOrganization({});
        clearTimeout(safetyTimeout);

        if (provisionError) {
          setShowManualForm(true);
          setLoading(false);
          return;
        }

        // Sucesso no provisionamento silencioso - vai direto para o dashboard
        navigate('/app/dashboard', { replace: true });
      } catch (err) {
        clearTimeout(safetyTimeout);
        setShowManualForm(true);
        setLoading(false);
      }
    };

    autoProvision();

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [searchParams, isMissingDataError, user]);

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

      // Navega imediatamente para o dashboard
      navigate('/app/dashboard', { replace: true });
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
          /* Estado de Carregamento Rápido */
          <div className="py-12 flex flex-col items-center text-center space-y-4 animate-fade-in">
            <RefreshCw size={36} className="text-emerald-600 animate-spin" />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Configurando</span>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{statusText}</p>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              Estamos montando a infraestrutura e o ambiente corporativo para a sua empresa.
            </p>
          </div>
        ) : showManualForm ? (
          /* Formulário Manual de Contingência (Sem atrasos) */
          <ManualEnvironmentForm
            ownerName={ownerName}
            setOwnerName={setOwnerName}
            companyName={companyName}
            setCompanyName={setCompanyName}
            workspaceName={workspaceName}
            setWorkspaceName={setWorkspaceName}
            segment={segment}
            setSegment={setSegment}
            equipmentCount={equipmentCount}
            setEquipmentCount={setEquipmentCount}
            phone={phone}
            setPhone={setPhone}
            error={error}
            onSubmit={handleSubmitManual}
          />
        ) : (
          /* Erros Gerais (ex: servidor fora do ar) */
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
