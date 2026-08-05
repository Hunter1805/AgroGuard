import React from 'react';
import type { Tire } from '../../../types/tires';
import { tireCalculationService } from '../../../services/tire-calculation.service';

interface TireOverviewTabProps {
  tire: Tire;
}

export const TireOverviewTab: React.FC<TireOverviewTabProps> = ({ tire }) => {
  const life = tireCalculationService.calculateRemainingLife(
    tire.initialTreadDepth || 0,
    tire.currentTreadDepth || 0,
    tire.minimumTreadDepth || 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      {/* Dados Técnicos e Desgaste */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">Especificações Técnicas</h3>

        <div className="grid grid-cols-2 gap-3 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Marca / Modelo</span>
            <span className="font-bold text-on-surface text-xs">{tire.brand} — {tire.model || 'N/I'}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Medida</span>
            <span className="font-bold text-primary text-xs">{tire.size}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Construção</span>
            <span className="font-bold text-on-surface text-xs uppercase">{tire.constructionType || 'radial'}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Nº de Série / DOT</span>
            <span className="font-bold text-on-surface text-xs">{tire.serialNumber || '—'} / {tire.dotCode || '—'}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between font-mono-label">
            <span className="text-on-surface-variant/70">Profundidade de Sulco</span>
            <span className="font-bold text-on-surface">
              {tire.currentTreadDepth} mm <span className="text-on-surface-variant/60">(Inicial: {tire.initialTreadDepth}mm | Mín: {tire.minimumTreadDepth}mm)</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono-label text-[11px]">
              <span className="text-on-surface-variant">Vida Útil Restante</span>
              <span className="font-bold text-emerald-400">{life}%</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${life > 60 ? 'bg-emerald-500' : life > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${life}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Faixa de Pressão Recomendada</span>
            <span className="font-bold text-emerald-400 text-xs">
              {tire.recommendedMinimumPressure || 30} a {tire.recommendedMaximumPressure || 35} {tire.pressureUnit.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Câmara / Lastro</span>
            <span className="font-bold text-on-surface text-xs">
              {tire.hasTube ? 'Com Câmara' : 'Sem Câmara'} | {tire.usesWaterBallast ? 'Com Água' : 'Sem Água'}
            </span>
          </div>
        </div>
      </div>

      {/* Dados de Aquisição e Histórico Operacional */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">Dados de Aquisição e Ciclo de Vida</h3>

        <div className="grid grid-cols-2 gap-3 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Data de Aquisição</span>
            <span className="font-bold text-on-surface text-xs">
              {tire.acquisitionDate ? new Date(tire.acquisitionDate).toLocaleDateString('pt-BR') : '—'}
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Valor de Compra</span>
            <span className="font-bold text-emerald-400 text-xs">
              R$ {(tire.acquisitionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Garantia Até</span>
            <span className="font-bold text-on-surface text-xs">
              {tire.warrantyEndDate ? new Date(tire.warrantyEndDate).toLocaleDateString('pt-BR') : 'Sem garantia'}
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Recapagens Realizadas</span>
            <span className="font-bold text-primary text-xs">
              {tire.retreadCount} de {tire.maximumRetreads || 2} permitidas
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-2 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Horas / Odômetro Acumulado</span>
            <span className="font-bold text-on-surface text-sm">
              {tire.accumulatedHours || 0} h / {tire.accumulatedKilometers || 0} km
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Equipamento / Posição Atual</span>
            <span className="font-bold text-on-surface text-xs">
              {tire.currentEquipmentId ? `${tire.currentEquipmentId} (${tire.currentPositionId || '—'})` : 'Desinstalado (Em Estoque)'}
            </span>
          </div>
        </div>

        {tire.notes && (
          <div className="pt-3 border-t border-white/5">
            <span className="text-on-surface-variant/70 text-[11px] block font-mono-label">Observações</span>
            <p className="text-on-surface text-xs mt-1">{tire.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
