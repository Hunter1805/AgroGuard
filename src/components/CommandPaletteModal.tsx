import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../types/routes';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** @deprecated — usar navigate do React Router. Mantido por compatibilidade. */
  setActiveTab?: (tab: string) => void;
  onOpenNewOS: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onOpenNewOS,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const items = [
    { title: 'Dashboard', type: 'Página', route: ROUTES.DASHBOARD },
    { title: 'Equipamentos e Frota', type: 'Página', route: ROUTES.EQUIPAMENTOS },
    { title: 'Checklists', type: 'Página', route: ROUTES.CHECKLISTS },
    { title: 'Manutenções — Visão Geral', type: 'Página', route: ROUTES.MANUTENCOES },
    { title: 'Planos Preventivos', type: 'Página', route: ROUTES.MANUTENCOES_PLANOS },
    { title: 'Agenda de Manutenção', type: 'Página', route: ROUTES.MANUTENCOES_AGENDA },
    { title: 'Ordens de Serviço', type: 'Página', route: ROUTES.ORDENS_SERVICO },
    { title: 'Central de Alertas', type: 'Página', route: ROUTES.ALERTAS },
    { title: 'Pneus', type: 'Página', route: ROUTES.PNEUS },
    { title: 'Ferramentas', type: 'Página', route: ROUTES.FERRAMENTAS },
    { title: 'Peças e Insumos', type: 'Página', route: ROUTES.PECAS_INSUMOS },
    { title: 'Relatórios', type: 'Página', route: ROUTES.RELATORIOS },
    { title: 'Cadastros', type: 'Página', route: ROUTES.CADASTROS },
    { title: 'Usuários e Permissões', type: 'Página', route: ROUTES.USUARIOS },
    { title: 'Configurações', type: 'Página', route: ROUTES.CONFIGURACOES },
    { title: '+ Nova Ordem de Serviço', type: 'Ação', route: null },
    { title: 'Trator Massey 265 01 4x2 — MF-265-01', type: 'Equipamento', route: ROUTES.EQUIPAMENTOS },
    { title: 'Colhedora Jacto K3 4x2 — JC-K3-01', type: 'Equipamento', route: ROUTES.EQUIPAMENTOS },
  ];

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: (typeof items)[0]) => {
    if (item.route === null) {
      onClose();
      onOpenNewOS();
    } else {
      navigate(item.route);
      onClose();
    }
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-3 border-b border-white/10 flex items-center gap-3">
          <Search size={20} className="text-primary" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            placeholder="Buscar módulos, equipamentos ou ações..."
            className="w-full bg-transparent text-[14px] text-on-surface focus:outline-none placeholder:text-on-surface-variant/40"
          />
          <button
            onClick={onClose}
            className="text-xs text-on-surface-variant hover:text-on-surface bg-surface border border-white/10 px-2 py-0.5 rounded cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-white/5 p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant/60">
              Nenhum resultado para "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-surface-container-highest/60 transition-colors flex justify-between items-center group cursor-pointer"
              >
                <span className="text-[13px] text-on-surface group-hover:text-primary transition-colors font-medium">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono-label px-2 py-0.5 rounded bg-surface border border-white/10 text-on-surface-variant">
                  {item.type}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
