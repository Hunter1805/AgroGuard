import React from 'react';
import type { Tool } from '../../../types/tools';

interface ToolOverviewTabProps {
  tool: Tool;
}

export const ToolOverviewTab: React.FC<ToolOverviewTabProps> = ({ tool }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      {/* Especificações & Localização */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">Identificação & Especificações</h3>

        <div className="grid grid-cols-2 gap-3 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Cód. Interno</span>
            <span className="font-bold text-primary text-xs">{tool.code}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Tipo de Controle</span>
            <span className="font-bold text-on-surface text-xs uppercase">{tool.controlType}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Marca / Modelo</span>
            <span className="font-bold text-on-surface text-xs">{tool.brand || 'N/I'} — {tool.model || 'N/I'}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Patrimônio / Série</span>
            <span className="font-bold text-on-surface text-xs">{tool.patrimonyNumber || '—'} / {tool.serialNumber || '—'}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-2 font-mono-label">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant/70">Estoque Atual</span>
            <span className="font-bold text-emerald-400">
              {tool.availableQuantity} Disp. / {tool.totalQuantity} Total ({tool.unitOfMeasure || 'UN'})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant/70">Localização Detalhada</span>
            <span className="font-bold text-on-surface">
              {tool.location?.detailedLocation || tool.location?.workshop || 'Almoxarifado Geral'}
            </span>
          </div>
        </div>

        {tool.technicalSpec && (
          <div className="pt-3 border-t border-white/5">
            <span className="text-on-surface-variant/70 text-[11px] block font-mono-label">Especificação Técnica</span>
            <p className="text-on-surface text-xs mt-1">{tool.technicalSpec}</p>
          </div>
        )}
      </div>

      {/* Aquisição, Conservação & Calibração */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <h3 className="font-bold text-on-surface text-sm border-b border-white/5 pb-2">Dados de Aquisição & Conservação</h3>

        <div className="grid grid-cols-2 gap-3 font-mono-label">
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Data de Aquisição</span>
            <span className="font-bold text-on-surface text-xs">
              {tool.acquisitionDate ? new Date(tool.acquisitionDate).toLocaleDateString('pt-BR') : '—'}
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Valor Patrimonial</span>
            <span className="font-bold text-emerald-400 text-xs">
              R$ {(tool.acquisitionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Estado de Conservação</span>
            <span className="font-bold text-on-surface text-xs uppercase">{tool.condition}</span>
          </div>
          <div>
            <span className="text-on-surface-variant/70 text-[11px] block">Garantia Até</span>
            <span className="font-bold text-on-surface text-xs">
              {tool.warrantyEndDate ? new Date(tool.warrantyEndDate).toLocaleDateString('pt-BR') : 'Sem garantia'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-2 font-mono-label">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant/70">Requer Calibração</span>
            <span className="font-bold text-on-surface">
              {tool.requiresCalibration ? `Sim (${tool.calibrationFrequencyValue} ${tool.calibrationFrequencyUnit || 'meses'})` : 'Não'}
            </span>
          </div>
          {tool.requiresCalibration && (
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant/70">Próxima Calibração</span>
              <span className="font-bold text-amber-400">
                {tool.nextCalibrationDate ? new Date(tool.nextCalibrationDate).toLocaleDateString('pt-BR') : 'Pendente'}
              </span>
            </div>
          )}
        </div>

        {tool.unavailabilityReason && (
          <div className="pt-3 border-t border-white/5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <span className="text-rose-400 text-[11px] font-bold block font-mono-label">Motivo de Indisponibilidade:</span>
            <p className="text-rose-300 text-xs mt-0.5">{tool.unavailabilityReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
