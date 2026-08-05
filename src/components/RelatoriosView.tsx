import React from 'react';
import { FileText, Wrench, Activity, Download } from 'lucide-react';
import { Button } from './ui/Button';

export const RelatoriosView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Relatórios & Exportações</h2>
        <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Gere e baixe relatórios consolidados em PDF e Excel (XLSX).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-white/5 space-y-3 flex flex-col justify-between">
          <div>
            <FileText size={24} className="text-primary" />
            <h4 className="font-title-md text-[15px] font-semibold text-on-surface mt-2">Relatório Mensal de Custos</h4>
            <p className="text-[12px] text-on-surface-variant/70 mt-1">Resumo consolidado de gastos por centro de custos, combustível e peças.</p>
          </div>
          <Button variant="outline" icon={<Download size={16} className="w-full" />}>
            Exportar PDF
          </Button>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/5 space-y-3 flex flex-col justify-between">
          <div>
            <Wrench size={24} className="text-tertiary" />
            <h4 className="font-title-md text-[15px] font-semibold text-on-surface mt-2">Histórico de OS e Manutenções</h4>
            <p className="text-[12px] text-on-surface-variant/70 mt-1">Listagem completa de ordens de serviço executadas e pendentes.</p>
          </div>
          <Button variant="outline" icon={<Download size={16} className="w-full" />}>
            Exportar Excel
          </Button>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/5 space-y-3 flex flex-col justify-between">
          <div>
            <Activity size={24} className="text-secondary" />
            <h4 className="font-title-md text-[15px] font-semibold text-on-surface mt-2">Telemetria & Horas de Uso</h4>
            <p className="text-[12px] text-on-surface-variant/70 mt-1">Horímetro acumulado e consumo médio por equipamento.</p>
          </div>
          <Button variant="outline" icon={<Download size={16} className="w-full" />}>
            Exportar CSV
          </Button>
        </div>
      </div>
    </div>
  );
};
