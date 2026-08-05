import React from 'react';
import { FileText, Plus, Download, Eye } from 'lucide-react';
import type { Equipment } from '../../../../types/equipment';
import type { EquipmentDocumentSummary } from '../../../../types/equipment-detail';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';

interface DocumentsTabProps {
  equipment?: Equipment;
  documents: EquipmentDocumentSummary[];
  onAddDocument?: () => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onAddDocument,
}) => {
  const validCount = documents.filter((d) => d.status === 'Válido').length;
  const warningCount = documents.filter((d) => d.status === 'Próximo do Vencimento').length;
  const expiredCount = documents.filter((d) => d.status === 'Vencido').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-title-md text-[16px] font-bold text-on-surface">
            Documentos, Manual e Certificados
          </h3>
          <p className="text-[12px] text-on-surface-variant/70">
            Repositório de documentações rodo-agrícolas, laudos NR-12 e manuais técnicos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onAddDocument}
        >
          Adicionar Documento
        </Button>
      </div>

      {/* Cards Indicadores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Total de Documentos</span>
          <p className="text-[20px] font-bold text-on-surface mt-1">{documents.length}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Válidos</span>
          <p className="text-[20px] font-bold text-success mt-1">{validCount}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Próximos Vencimento</span>
          <p className="text-[20px] font-bold text-warning mt-1">{warningCount}</p>
        </div>
        <div className="glass-card rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-mono-label text-on-surface-variant/70 block">Vencidos</span>
          <p className="text-[20px] font-bold text-error mt-1">{expiredCount}</p>
        </div>
      </div>

      {/* Listagem de Documentos */}
      <div className="glass-card rounded-xl border border-white/10 p-5 space-y-4">
        <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
          <FileText size={15} className="text-primary" /> Relação de Arquivos Cadastrados
        </h4>

        {documents.length === 0 ? (
          <EmptyState
            title="Nenhum documento cadastrado"
            description="Adicione manuais, certificados, contratos ou documentos do equipamento."
            action={
              <Button variant="outline" size="sm" onClick={onAddDocument}>
                Adicionar Primeiro Documento
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label text-[10px] uppercase border-b border-white/5">
                  <th className="px-3.5 py-2.5 font-medium">Tipo / Categoria</th>
                  <th className="px-3.5 py-2.5 font-medium">Nome do Arquivo</th>
                  <th className="px-3.5 py-2.5 font-medium">Número do Registro</th>
                  <th className="px-3.5 py-2.5 font-medium">Emissão</th>
                  <th className="px-3.5 py-2.5 font-medium">Vencimento</th>
                  <th className="px-3.5 py-2.5 font-medium">Status</th>
                  <th className="px-3.5 py-2.5 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-3.5 py-3 font-medium text-on-surface">{d.docType}</td>
                    <td className="px-3.5 py-3 font-medium text-primary flex items-center gap-1.5">
                      <FileText size={14} className="shrink-0" /> {d.name}
                    </td>
                    <td className="px-3.5 py-3 font-mono-label">{d.docNumber || '—'}</td>
                    <td className="px-3.5 py-3 font-mono-label">{d.issueDate || '—'}</td>
                    <td className="px-3.5 py-3 font-mono-label">{d.dueDate || 'Sem Vencimento'}</td>
                    <td className="px-3.5 py-3 font-mono-label">
                      {d.status === 'Válido' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-success/15 text-success border border-success/30">
                          Válido
                        </span>
                      )}
                      {d.status === 'Próximo do Vencimento' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-warning/15 text-warning border border-warning/30">
                          Próximo
                        </span>
                      )}
                      {d.status === 'Vencido' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-error/15 text-error border border-error/30">
                          Vencido
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Visualizar Documento"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Baixar Arquivo"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
