import React, { useEffect, useState } from 'react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  return (
    <header className="flex justify-between items-center w-full px-6 h-14 bg-surface/50 backdrop-blur-md border-b border-white/5 shrink-0 z-40 sticky top-0">
      {/* Search Input Trigger */}
      <div className="flex-1 max-w-2xl">
        <div 
          onClick={onOpenCommandPalette}
          className="relative w-full hidden md:flex items-center group cursor-pointer"
        >
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/50 text-[18px] group-hover:text-primary transition-colors">
            search
          </span>
          <input
            readOnly
            className="w-full bg-surface-container-highest/50 border border-white/5 hover:border-white/10 rounded-md py-1.5 pl-10 pr-12 text-[13px] font-body-sm text-on-surface focus:outline-none cursor-pointer transition-all placeholder:text-on-surface-variant/50"
            placeholder="Pesquisar equipamentos, OS, placas ou documentos..."
            type="text"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <span className="bg-surface border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono-label text-on-surface-variant/70">
              ⌘
            </span>
            <span className="bg-surface border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono-label text-on-surface-variant/70">
              K
            </span>
          </div>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3 pl-4 relative">
        <div className="flex items-center gap-1 border-r border-white/10 pr-3">
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-on-surface-variant/70 hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container-highest relative cursor-pointer"
              title="Notificações"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-2xl p-4 z-50 border border-white/10 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3">
                  <h4 className="font-semibold text-on-surface text-[13px]">Notificações</h4>
                  {unreadNotifications > 0 && (
                    <button 
                      onClick={() => setUnreadNotifications(0)}
                      className="text-primary text-[11px] hover:underline"
                    >
                      Marcar lidas
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2 rounded bg-surface-container-highest/40 flex flex-col gap-1">
                    <span className="font-medium text-error flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Alerta Crítico
                    </span>
                    <p className="text-on-surface-variant/80 text-[11px]">Trator John Deere 8R - Troca de óleo vencida.</p>
                    <span className="text-[10px] font-mono-label text-on-surface-variant/50">Há 5 minutos</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-highest/40 flex flex-col gap-1">
                    <span className="font-medium text-tertiary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Manutenção Próxima
                    </span>
                    <p className="text-on-surface-variant/80 text-[11px]">Colheitadeira S700 - Revisão em 50h.</p>
                    <span className="text-[10px] font-mono-label text-on-surface-variant/50">Há 1 hora</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="text-on-surface-variant/70 hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container-highest cursor-pointer" title="Ajuda">
            <span className="material-symbols-outlined text-[20px]">help_center</span>
          </button>
          <button className="text-on-surface-variant/70 hover:text-on-surface transition-colors p-1.5 rounded-md hover:bg-surface-container-highest cursor-pointer" title="Modo Escuro">
            <span className="material-symbols-outlined text-[20px]">dark_mode</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer group pl-1">
          <div className="text-right hidden sm:block">
            <p className="font-body-sm text-[13px] font-medium text-on-surface group-hover:text-primary transition-colors">João Silva</p>
            <p className="font-label-caps text-[9px] text-on-surface-variant/70">Admin • São João</p>
          </div>
          <img
            alt="User Profile Avatar"
            className="w-7 h-7 rounded-md border border-white/10 group-hover:border-primary/50 transition-colors object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcohqe9MeMMuzFTuoSLknHvmSx8a6x2fg35Pk-suBoBwhhx6czvQd-Td8-iPzd5R6_Rj3OLZRB9Our2bUT22S_CwnkWZTzciJWMnnOl8VBVfkUHIkj8DbqWWJ-UrhWoQ-U80q_HhdpZTYEN2kaK4OZVlemVySVzljYOpWkl7Hpv3vVPIgWfVHD2c9hpMgiMwN3FJ99GjnyA414Nc4ztWdEi0Sw2O5TJyhb02H5Zv2Le5EJGgwNmERj5g"
          />
        </div>
      </div>
    </header>
  );
};
