import React from 'react';
import { FileText, Download } from 'lucide-react';

export const DocumentosView: React.FC = () => {
  const docs = [
    { title: 'CRLV Trator JD 8R (2026)', category: 'Licenciamento', validUntil: '15/12/2026', status: 'válido' },
    { title: 'Seguro Frota Colheitadeiras Porto Seguro', category: 'Apólice de Seguro', validUntil: '30/09/2026', status: 'válido' },
    { title: 'Laudo de Inspeção Técnica Pulverizador', category: 'Laudo Técnico', validUntil: '10/08/2026', status: 'atenção' },
    { title: 'Manual de Operação MB Actros', category: 'Manual', validUntil: 'Indeterminado', status: 'válido' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Repositório de Documentos</h2>
        <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Licenças, CRLVs, manuais, apólices de seguro e laudos técnicos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc, idx) => (
          <div key={idx} className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-title-md text-[14px] font-medium text-on-surface">{doc.title}</h4>
                <p className="text-[11px] text-on-surface-variant/70">{doc.category} • Vencimento: {doc.validUntil}</p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-primary p-2 transition-colors cursor-pointer">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
