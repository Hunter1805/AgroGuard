import React from 'react';
import { Building2, Layers, Cpu, Phone, User, AlertTriangle } from 'lucide-react';

interface ManualEnvironmentFormProps {
  ownerName: string;
  setOwnerName: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  workspaceName: string;
  setWorkspaceName: (val: string) => void;
  segment: string;
  setSegment: (val: string) => void;
  equipmentCount: string;
  setEquipmentCount: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const ManualEnvironmentForm: React.FC<ManualEnvironmentFormProps> = ({
  ownerName,
  setOwnerName,
  companyName,
  setCompanyName,
  workspaceName,
  setWorkspaceName,
  segment,
  setSegment,
  equipmentCount,
  setEquipmentCount,
  phone,
  setPhone,
  error,
  onSubmit,
}) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-1.5 text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Configurar sua Empresa</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Forneça as informações básicas abaixo para concluirmos a criação do seu ambiente operacional.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2.5 text-xs">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
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
  );
};
export default ManualEnvironmentForm;
