import React from 'react';

export const CustosView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Análise de Custos</h2>
        <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Detalhamento de gastos com combustível, peças e serviços.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
          <span className="text-[12px] text-on-surface-variant font-medium">Combustível (Junho)</span>
          <p className="font-title-md text-[28px] font-bold text-on-surface">R$ 24.150,00</p>
          <span className="text-[11px] font-mono-label text-primary flex items-center gap-1">↓ -4% vs maio</span>
        </div>
        <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
          <span className="text-[12px] text-on-surface-variant font-medium">Peças & Reposições</span>
          <p className="font-title-md text-[28px] font-bold text-on-surface">R$ 14.830,00</p>
          <span className="text-[11px] font-mono-label text-error flex items-center gap-1">↑ +18% vs maio</span>
        </div>
        <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
          <span className="text-[12px] text-on-surface-variant font-medium">Serviços de Terceiros</span>
          <p className="font-title-md text-[28px] font-bold text-on-surface">R$ 6.300,00</p>
          <span className="text-[11px] font-mono-label text-on-surface-variant flex items-center gap-1">Estável</span>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
        <h3 className="font-title-md text-[16px] font-semibold text-on-surface">Custo Médio por Categoria de Equipamento</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-on-surface-variant">Tratores (7 unidades)</span>
              <span className="font-mono-label text-on-surface">R$ 18.400 (40.6%)</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '40.6%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-on-surface-variant">Colheitadeiras (4 unidades)</span>
              <span className="font-mono-label text-on-surface">R$ 16.200 (35.7%)</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: '35.7%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-on-surface-variant">Caminhões & Apoio (6 unidades)</span>
              <span className="font-mono-label text-on-surface">R$ 10.680 (23.7%)</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '23.7%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
