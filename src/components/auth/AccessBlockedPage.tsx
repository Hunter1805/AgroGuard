import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertOctagon, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccessBlockedPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/entrar');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 justify-center items-center p-6 text-slate-800 font-sans">
      <div className="w-full max-w-[440px] bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6 text-center">
        {/* Topo - Logo */}
        <div className="flex items-center gap-3 justify-center pb-2 border-b border-slate-100">
          <div className="bg-slate-900 p-2 rounded-lg text-white">
            <Shield size={20} />
          </div>
          <span className="text-lg font-bold text-slate-900">AgroGuard</span>
        </div>

        {/* Icone de Bloqueio */}
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-red-50 text-red-600 p-4 rounded-full">
            <AlertOctagon size={40} className="stroke-[1.75]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Acesso Restrito</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Esta conta foi desativada ou suspensa pela administração da organização. Você não possui permissões ativas para acessar o painel operacional.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-md border border-slate-150 text-left space-y-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">O que fazer agora?</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Se você acredita que isso é um erro ou precisa reativar o seu acesso, entre em contato diretamente com o administrador de TI ou gerente de frota da sua empresa.
          </p>
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-2">
          <a
            href="mailto:suporte@agroguard.com.br?subject=Acesso%20Bloqueado"
            className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md py-2.5 transition-colors flex items-center justify-center gap-1.5"
          >
            <HelpCircle size={14} />
            Suporte
          </a>
          <button
            onClick={handleLogout}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md py-2.5 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut size={14} />
            Desconectar
          </button>
        </div>
      </div>
    </div>
  );
};
export default AccessBlockedPage;
