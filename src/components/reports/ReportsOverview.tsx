import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Clock, Wrench, AlertTriangle, Bookmark, Trash2 } from 'lucide-react';
import { useReportsOverview } from '../../hooks/useReportsOverview';
import { useFavoriteReports } from '../../hooks/useFavoriteReports';
import { ReportCategoryCards } from './ReportCategoryCards';
import { ROUTE_HELPERS } from '../../types/routes';

export const ReportsOverview: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading } = useReportsOverview();
  const { favorites, deleteFavorite } = useFavoriteReports();

  if (loading) return <div className="p-8 text-center text-xs text-on-surface-variant">Carregando painel de relatórios...</div>;

  const ind = data?.indicators;

  return (
    <div className="space-y-6 text-xs animate-fade-in">
      {/* Cards de Indicadores Operacionais Gerais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant/70">
            <span className="font-mono-label text-[11px]">Disponibilidade</span>
            <Tractor size={15} className="text-blue-400" />
          </div>
          <p className="text-xl font-bold font-mono-label text-blue-400">{ind?.availability?.formattedValue || '0%'}</p>
          <span className="text-[10px] text-on-surface-variant/60 block">{ind?.totalEquipmentCount || 0} equipamentos na frota</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant/70">
            <span className="font-mono-label text-[11px]">MTTR Médio</span>
            <Clock size={15} className="text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono-label text-amber-400">{ind?.mttr?.formattedValue || '0 h'}</p>
          <span className="text-[10px] text-on-surface-variant/60 block">Tempo de reparo por OS</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant/70">
            <span className="font-mono-label text-[11px]">MTBF Médio</span>
            <Clock size={15} className="text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono-label text-emerald-400">{ind?.mtbf?.formattedValue || '0 h'}</p>
          <span className="text-[10px] text-on-surface-variant/60 block">Tempo entre falhas</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant/70">
            <span className="font-mono-label text-[11px]">Cumprimento Prev.</span>
            <Wrench size={15} className="text-indigo-400" />
          </div>
          <p className="text-xl font-bold font-mono-label text-indigo-400">{ind?.preventiveCompliance?.formattedValue || '0%'}</p>
          <span className="text-[10px] text-on-surface-variant/60 block">Revisões no prazo</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant/70">
            <span className="font-mono-label text-[11px]">Taxa Conformidade</span>
            <CheckCircleIcon size={15} className="text-teal-400" />
          </div>
          <p className="text-xl font-bold font-mono-label text-teal-400">{ind?.complianceRate?.formattedValue || '0%'}</p>
          <span className="text-[10px] text-on-surface-variant/60 block">Checklists sem falhas</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant/70">
            <span className="font-mono-label text-[11px]">Horas de Parada</span>
            <AlertTriangle size={15} className="text-rose-400" />
          </div>
          <p className="text-xl font-bold font-mono-label text-rose-400">{ind?.totalParadaHours || 0} h</p>
          <span className="text-[10px] text-on-surface-variant/60 block">{ind?.stoppedEquipmentCount || 0} equipamentos parados</span>
        </div>
      </div>

      {/* Relatórios Favoritos Salvos */}
      {favorites.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Bookmark className="text-primary" size={16} /> Relatórios Favoritos & Filtros Salvos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites.map(fav => (
              <div key={fav.id} className="p-3 bg-surface-container rounded-xl border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-on-surface text-xs">{fav.name}</h4>
                  <span className="text-[10px] font-mono-label text-on-surface-variant/70 capitalize block">
                    Categoria: {fav.category.replace(/-/g, ' ')} | Por: {fav.createdByName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(ROUTE_HELPERS.reportWorkOrder())}
                    className="px-2.5 py-1 bg-primary/15 text-primary hover:bg-primary/25 rounded-lg font-bold text-[10px]"
                  >
                    Abrir
                  </button>
                  <button onClick={() => deleteFavorite(fav.id)} className="p-1 hover:bg-rose-500/15 rounded text-rose-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Categorias de Relatórios */}
      <div className="space-y-3">
        <h3 className="font-bold text-on-surface text-sm">Categorias de Relatórios Operacionais</h3>
        <ReportCategoryCards definitions={data?.definitions || []} />
      </div>
    </div>
  );
};

const CheckCircleIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
