import React, { useState } from 'react';
import { Plus, Search, Gauge, FileSpreadsheet } from 'lucide-react';
import { useTireRecommendations } from '../../../hooks/useTireRecommendations';
import { Button } from '../../ui/Button';
import { TireRecommendationForm } from './TireRecommendationForm';

export const TireRecommendationList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { recommendations, loading, refetch } = useTireRecommendations({ size: search });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Gauge className="text-primary" size={18} />
            Diretrizes Profissionais de Pressão
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Tabela de referência para calibragem ideal por medida de pneu, tipo de eixo e aplicação.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsFormOpen(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> Nova Recomendação
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Filtrar por medida ou categoria..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs text-on-surface-variant font-mono-label">{recommendations.length} diretrizes ativas</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando recomendações...</div>
        ) : recommendations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma recomendação encontrada</p>
            <p className="text-xs text-on-surface-variant/70">Cadastre uma recomendação de pressão para esta medida e aplicação.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Modelo Equipamento</th>
                  <th className="px-4 py-3 font-medium">Medida do Pneu</th>
                  <th className="px-4 py-3 font-medium">Aplicação</th>
                  <th className="px-4 py-3 font-medium">Pressão Recomendada</th>
                  <th className="px-4 py-3 font-medium">Lastro Água</th>
                  <th className="px-4 py-3 font-medium">Fonte / Referência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {recommendations.map(rec => (
                  <tr key={rec.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-on-surface">{rec.category}</td>
                    <td className="px-4 py-3">{rec.equipmentModel || 'Todas'}</td>
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{rec.size}</td>
                    <td className="px-4 py-3">{rec.application || 'Geral'}</td>
                    <td className="px-4 py-3 font-mono-label">
                      <span className="text-emerald-400 font-bold">{rec.minPressure}</span>
                      {' a '}
                      <span className="text-emerald-400 font-bold">{rec.maxPressure} {rec.unit.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3">{rec.withWaterBallast ? 'Sim (75%)' : 'Não'}</td>
                    <td className="px-4 py-3 text-[11px] text-on-surface-variant/70">{rec.sourceRecommendation || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TireRecommendationForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};
