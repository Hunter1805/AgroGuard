import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor, Gauge, Wrench, ClipboardList, CheckSquare,
  AlertTriangle, Disc, Hammer, Package, DollarSign, BarChart2
} from 'lucide-react';
import type { ReportDefinition } from '../../types/reports';

interface ReportCategoryCardsProps {
  definitions: ReportDefinition[];
}

export const ReportCategoryCards: React.FC<ReportCategoryCardsProps> = ({ definitions }) => {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tractor': return <Tractor className="text-blue-400" size={24} />;
      case 'Gauge': return <Gauge className="text-cyan-400" size={24} />;
      case 'Wrench': return <Wrench className="text-amber-400" size={24} />;
      case 'ClipboardList': return <ClipboardList className="text-emerald-400" size={24} />;
      case 'CheckSquare': return <CheckSquare className="text-indigo-400" size={24} />;
      case 'AlertTriangle': return <AlertTriangle className="text-rose-400" size={24} />;
      case 'Disc': return <Disc className="text-purple-400" size={24} />;
      case 'Hammer': return <Hammer className="text-orange-400" size={24} />;
      case 'Package': return <Package className="text-teal-400" size={24} />;
      case 'DollarSign': return <DollarSign className="text-emerald-400" size={24} />;
      case 'BarChart2': return <BarChart2 className="text-primary" size={24} />;
      default: return <BarChart2 className="text-primary" size={24} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
      {definitions.map(def => (
        <div
          key={def.id}
          onClick={() => navigate(def.route)}
          className="glass-card rounded-2xl p-5 border border-white/10 hover:border-primary/50 transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-surface-container rounded-xl group-hover:scale-110 transition-transform">
                {getIcon(def.iconName)}
              </div>
              {def.popular && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/15 text-primary border border-primary/30 uppercase">
                  Destaque
                </span>
              )}
            </div>

            <h4 className="font-bold text-on-surface text-sm mt-3 group-hover:text-primary transition-colors">
              {def.title}
            </h4>
            <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-2">
              {def.description}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-label text-primary group-hover:underline">
            <span>Acessar Relatório</span>
            <span>&rarr;</span>
          </div>
        </div>
      ))}
    </div>
  );
};
