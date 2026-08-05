import React, { useState } from 'react';
import { Plus, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../ui/PageHeader';
import { MasterDataFilters } from './MasterDataFilters';
import { MasterDataTable } from './MasterDataTable';
import { MasterDataStatusModal } from './MasterDataStatusModal';
import { MasterDataDependenciesDrawer } from './MasterDataDependenciesDrawer';
import { MasterDataReplacementModal } from './MasterDataReplacementModal';
import type { MasterDataBase, MasterDataStatus } from '../../types/master-data';
import type { MasterDataDependencyCheckResult } from '../../types/master-data-dependency';

interface MasterDataListViewProps {
  title: string;
  subtitle: string;
  items: MasterDataBase[];
  loading?: boolean;
  FormComponent?: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    initialData?: MasterDataBase | null;
    onSave: (data: any) => void;
  }>;
  onSaveRecord?: (data: any) => void;
  onStatusChange?: (id: string, newStatus: MasterDataStatus, reason?: string) => void;
  onSetReplacement?: (id: string, replacementId: string) => void;
}

export const MasterDataListView: React.FC<MasterDataListViewProps> = ({
  title,
  subtitle,
  items,
  loading = false,
  FormComponent,
  onSaveRecord,
  onStatusChange,
  onSetReplacement,
}) => {
  const navigate = useNavigate();

  // Estados de Filtro
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MasterDataStatus | 'todos'>('todos');
  const [hasLinksFilter, setHasLinksFilter] = useState<'todos' | 'com_vinculos' | 'sem_vinculos'>('todos');

  // Modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MasterDataBase | null>(null);

  const [statusModalRecord, setStatusModalRecord] = useState<MasterDataBase | null>(null);
  const [statusModalAction, setStatusModalAction] = useState<'inativar' | 'arquivar' | 'ativar'>('inativar');

  const [depDrawerRecord, setDepDrawerRecord] = useState<MasterDataBase | null>(null);
  const [depCheckResult, setDepCheckResult] = useState<MasterDataDependencyCheckResult | null>(null);

  const [replModalRecord, setReplModalRecord] = useState<MasterDataBase | null>(null);

  // Filtragem dos Dados
  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    const matchesLinks =
      hasLinksFilter === 'todos' ||
      (hasLinksFilter === 'com_vinculos' && (item.usageCount ?? 0) > 0) ||
      (hasLinksFilter === 'sem_vinculos' && (item.usageCount ?? 0) === 0);

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    return matchesStatus && matchesLinks && matchesQuery;
  });

  const totalCount = items.length;
  const activeCount = items.filter((i) => i.status === 'ativo').length;
  const inactiveCount = items.filter((i) => i.status === 'inativo').length;
  const linkedCount = items.filter((i) => (i.usageCount ?? 0) > 0).length;

  const handleOpenDependencies = (item: MasterDataBase) => {
    setDepDrawerRecord(item);
    setDepCheckResult({
      hasDependencies: (item.usageCount ?? 0) > 0,
      canDelete: (item.usageCount ?? 0) === 0,
      dependencies: (item.usageCount ?? 0) > 0
        ? [{ moduleName: 'Cadastros e Módulos Operacionais', count: item.usageCount ?? 0, relatedSummary: 'Registros associados no sistema.' }]
        : [],
    });
  };

  const handleConfirmStatusModal = (reason: string) => {
    if (!statusModalRecord) return;
    const targetStatus = statusModalAction === 'ativar' ? 'ativo' : statusModalAction === 'arquivar' ? 'arquivado' : 'inativo';
    onStatusChange?.(statusModalRecord.id, targetStatus, reason);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Voltar para a Central de Cadastros */}
        <button
          onClick={() => navigate('/cadastros')}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Voltar para Central de Cadastros
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeader title={title} subtitle={subtitle} />

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => alert('Exportação simulada em CSV/XLSX.')}
              className="px-3 py-2 rounded-lg border border-white/10 glass-card text-[13px] font-medium text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-all"
            >
              <Download size={15} />
              Exportar
            </button>
            {FormComponent && (
              <button
                onClick={() => {
                  setEditingRecord(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold flex items-center gap-1.5 transition-all shadow-md glow-success"
              >
                <Plus size={16} />
                Novo Cadastro
              </button>
            )}
          </div>
        </div>

        {/* Mini Indicadores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total</span>
            <p className="text-[18px] font-bold text-on-surface font-mono-label">{totalCount}</p>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-success uppercase tracking-wider">Ativos</span>
            <p className="text-[18px] font-bold text-success font-mono-label">{activeCount}</p>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-error uppercase tracking-wider">Inativos</span>
            <p className="text-[18px] font-bold text-error font-mono-label">{inactiveCount}</p>
          </div>
          <div className="glass-card rounded-xl p-3 border border-white/10">
            <span className="text-[10px] text-tertiary uppercase tracking-wider">Com Vínculos</span>
            <p className="text-[18px] font-bold text-tertiary font-mono-label">{linkedCount}</p>
          </div>
        </div>

        {/* Filtros */}
        <MasterDataFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          hasLinksFilter={hasLinksFilter}
          onHasLinksChange={setHasLinksFilter}
        />

        {/* Tabela de Dados */}
        <MasterDataTable
          items={filteredItems}
          loading={loading}
          onEdit={(rec) => {
            setEditingRecord(rec);
            setIsFormOpen(true);
          }}
          onToggleStatus={(rec, action) => {
            setStatusModalRecord(rec);
            setStatusModalAction(action);
          }}
          onViewDependencies={handleOpenDependencies}
          onSetReplacement={(rec) => setReplModalRecord(rec)}
        />
      </div>

      {/* Modais e Drawers Globais */}
      {FormComponent && (
        <FormComponent
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={editingRecord}
          onSave={(data) => {
            onSaveRecord?.(data);
            setIsFormOpen(false);
          }}
        />
      )}

      <MasterDataStatusModal
        isOpen={Boolean(statusModalRecord)}
        onClose={() => setStatusModalRecord(null)}
        recordName={statusModalRecord?.name || ''}
        targetAction={statusModalAction}
        onConfirm={handleConfirmStatusModal}
      />

      <MasterDataDependenciesDrawer
        isOpen={Boolean(depDrawerRecord)}
        onClose={() => setDepDrawerRecord(null)}
        recordName={depDrawerRecord?.name || ''}
        recordCode={depDrawerRecord?.code}
        result={depCheckResult}
      />

      <MasterDataReplacementModal
        isOpen={Boolean(replModalRecord)}
        onClose={() => setReplModalRecord(null)}
        currentRecord={replModalRecord}
        availableOptions={items}
        onConfirmReplacement={(repId) => onSetReplacement?.(replModalRecord!.id, repId)}
      />
    </div>
  );
};
