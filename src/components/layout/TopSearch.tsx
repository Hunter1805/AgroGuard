import React from 'react';
import { Search } from 'lucide-react';

interface TopSearchProps {
  onOpenCommandPalette: () => void;
}

export const TopSearch: React.FC<TopSearchProps> = ({ onOpenCommandPalette }) => {
  return (
    <div
      onClick={onOpenCommandPalette}
      className="relative w-full hidden md:flex items-center group cursor-pointer"
    >
      <Search className="absolute left-3 text-on-surface-variant/50 group-hover:text-primary transition-colors" size={18} />
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
  );
};
