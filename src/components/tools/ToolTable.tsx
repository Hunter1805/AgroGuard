import React from 'react';
import { Eye, Edit3, ArrowRightLeft } from 'lucide-react';
import type { Tool } from '../../types/tools';
import { useNavigate } from 'react-router-dom';
import { ROUTE_HELPERS } from '../../types/routes';

interface ToolTableProps {
  tools: Tool[];
  onOpenAction: (actionType: string, tool: Tool) => void;
}

export const ToolTable: React.FC<ToolTableProps> = ({ tools, onOpenAction }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Tool['status']) => {
    switch (status) {
      case 'disponivel':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Disponível</span>;
      case 'emprestada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Emprestada</span>;
      case 'reservada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Reservada</span>;
      case 'em_manutencao':
      case 'aguardando_manutencao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">Em Manutenção</span>;
      case 'aguardando_calibracao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">Calibração Pendente</span>;
      case 'danificada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Danificada</span>;
      case 'perdida':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-700/20 text-rose-500 border border-rose-500/30">Perdida</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">Baixada</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
            <th className="px-4 py-3 font-medium">Cód.</th>
            <th className="px-4 py-3 font-medium">Ferramenta / Descrição</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Patrimônio / Série</th>
            <th className="px-4 py-3 font-medium">Qtd. Disp. / Total</th>
            <th className="px-4 py-3 font-medium">Localização</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Próx. Calibração</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-on-surface-variant">
          {tools.map(tool => {
            const isIndividual = tool.controlType === 'individual';
            return (
              <tr key={tool.id} className="hover:bg-surface-container-highest/20 transition-colors">
                <td className="px-4 py-3 font-mono-label font-bold text-primary">{tool.code}</td>

                <td className="px-4 py-3">
                  <span
                    onClick={() => navigate(ROUTE_HELPERS.toolDetail(tool.id))}
                    className="font-semibold text-on-surface hover:text-primary cursor-pointer transition-colors block"
                  >
                    {tool.name}
                  </span>
                  <span className="text-[11px] text-on-surface-variant/70 block truncate max-w-xs">
                    {tool.brand} {tool.model ? `(${tool.model})` : ''} — {tool.technicalSpec || tool.description || 'Sem especificações'}
                  </span>
                </td>

                <td className="px-4 py-3 font-mono-label text-[11px] text-on-surface-variant">{tool.category}</td>

                <td className="px-4 py-3 font-mono-label text-[11px]">
                  {isIndividual ? (
                    <div>
                      <span className="block font-bold text-on-surface">{tool.patrimonyNumber || 'Sem Patrimônio'}</span>
                      <span className="block text-[10px] text-on-surface-variant/60">SN: {tool.serialNumber || 'N/A'}</span>
                    </div>
                  ) : (
                    <span className="text-on-surface-variant/60 font-semibold">Controle por Qtd.</span>
                  )}
                </td>

                <td className="px-4 py-3 font-mono-label">
                  <span className={`font-bold ${tool.availableQuantity === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {tool.availableQuantity}
                  </span>{' '}
                  / {tool.totalQuantity} {tool.unitOfMeasure || 'UN'}
                </td>

                <td className="px-4 py-3 text-[11px] max-w-[150px] truncate" title={tool.location?.detailedLocation || tool.location?.workshop}>
                  {tool.location?.detailedLocation || tool.location?.workshop || 'Almoxarifado'}
                </td>

                <td className="px-4 py-3">{getStatusBadge(tool.status)}</td>

                <td className="px-4 py-3 font-mono-label text-[11px]">
                  {tool.requiresCalibration && tool.nextCalibrationDate ? (
                    <span className={tool.nextCalibrationDate < new Date().toISOString().split('T')[0] ? 'text-rose-400 font-bold' : 'text-on-surface-variant'}>
                      {new Date(tool.nextCalibrationDate).toLocaleDateString('pt-BR')}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant/40">Não requer</span>
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(ROUTE_HELPERS.toolDetail(tool.id))}
                      className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                      title="Ver Ficha Detalhada"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => navigate(ROUTE_HELPERS.toolEdit(tool.id))}
                      className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
                      title="Editar Ferramenta"
                    >
                      <Edit3 size={15} />
                    </button>
                    {tool.status === 'disponivel' && tool.availableQuantity > 0 && (
                      <button
                        onClick={() => onOpenAction('emprestar', tool)}
                        className="p-1.5 hover:bg-amber-500/20 rounded-lg text-amber-400 transition-colors"
                        title="Registrar Empréstimo"
                      >
                        <ArrowRightLeft size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
