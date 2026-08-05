import React from 'react';
import { Phone } from 'lucide-react';

export const FornecedoresView: React.FC = () => {
  const vendors = [
    { name: 'John Deere Concessionária Treviso', service: 'Peças e Assistência Autorizada', phone: '(16) 3322-1000', rating: '4.9 ★' },
    { name: 'Mercedes-Benz Dieselcenter', service: 'Manutenção de Caminhões', phone: '(16) 3455-8890', rating: '4.8 ★' },
    { name: 'TotalLub Agrocultura', service: 'Óleos e Lubrificantes Agrícolas', phone: '(16) 3998-4411', rating: '4.7 ★' },
    { name: 'Pneusul Agrícola', service: 'Pneus e Recapagem de Tratores', phone: '(16) 3211-7700', rating: '4.6 ★' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Fornecedores & Parceiros</h2>
        <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Catálogo de parceiros homologados para peças e manutenção de frota.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((v, i) => (
          <div key={i} className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-title-md text-[15px] font-semibold text-on-surface">{v.name}</h4>
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-mono-label">{v.rating}</span>
            </div>
            <p className="text-[12px] text-on-surface-variant/80">{v.service}</p>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono-label text-on-surface-variant flex items-center gap-2">
              <Phone size={14} /> {v.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
