import React, { useEffect, useState } from 'react';
import { Database } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { MasterDataOverviewStats } from './MasterDataOverviewStats';
import { MasterDataSearch } from './MasterDataSearch';
import { MasterDataGroupCard } from './MasterDataGroupCard';
import { masterDataService, MASTER_DATA_CARDS } from '../../services/master-data.service';
import type { MasterDataCategoryCard, MasterDataGroupType } from '../../types/master-data';

const GROUPS_TITLE: Record<MasterDataGroupType, { title: string; subtitle: string }> = {
  organizacao: {
    title: 'Organização',
    subtitle: 'Estrutura corporativa, fazendas, unidades, setores, localizações e equipes.',
  },
  equipamentos: {
    title: 'Equipamentos',
    subtitle: 'Tipos de frota, categorias, subcategorias, marcas, modelos e combustíveis.',
  },
  manutencao: {
    title: 'Manutenção',
    subtitle: 'Sistemas técnicos, falhas, sintomas, causas, prioridades e motivos operacionais.',
  },
  materiais_servicos: {
    title: 'Materiais e Serviços',
    subtitle: 'Fornecedores comerciais, categorias de peças, ferramentas e unidades de medida.',
  },
};

export const CadastrosView: React.FC = () => {
  const [cards] = useState<MasterDataCategoryCard[]>(MASTER_DATA_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<MasterDataGroupType | 'todos'>('todos');
  const [stats, setStats] = useState({
    totalCategories: MASTER_DATA_CARDS.length,
    totalActiveRecords: 45,
    activeSuppliersCount: 2,
    registeredLocationsCount: 2,
    equipmentModelsCount: 2,
    maintenanceSystemsCount: 4,
    pendingRecordsCount: 0,
    linkedRecordsCount: 24,
  });

  useEffect(() => {
    masterDataService.getOverviewStats().then((res) => {
      setStats((prev) => ({ ...prev, ...res }));
    });
  }, []);

  const filteredCards = cards.filter((c) => {
    const matchesGroup = selectedGroup === 'todos' || c.group === selectedGroup;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q);

    return matchesGroup && matchesQuery;
  });

  const groupedCards = (['organizacao', 'equipamentos', 'manutencao', 'materiais_servicos'] as MasterDataGroupType[])
    .filter((groupKey) => selectedGroup === 'todos' || selectedGroup === groupKey)
    .map((groupKey) => ({
      key: groupKey,
      groupInfo: GROUPS_TITLE[groupKey],
      items: filteredCards.filter((c) => c.group === groupKey),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Cabeçalho */}
        <PageHeader
          title="Cadastros Auxiliares"
          subtitle="Gerencie as informações utilizadas nos equipamentos, manutenções e operações."
          icon={<Database size={22} />}
        />

        {/* Indicadores Globais */}
        <MasterDataOverviewStats stats={stats} loading={false} />

        {/* Busca e Filtros */}
        <div className="glass-card rounded-xl border border-white/10 p-4">
          <MasterDataSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
          />
        </div>

        {/* Agrupamento por Categorias */}
        {groupedCards.length === 0 ? (
          <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
            <p className="text-[14px] font-medium text-on-surface">Nenhum cadastro encontrado</p>
            <p className="text-[12px] text-on-surface-variant/60 mt-1">
              Não existem registros de cadastro para os termos digitados ou filtros selecionados.
            </p>
          </div>
        ) : (
          groupedCards.map((group) => (
            <div key={group.key} className="space-y-3">
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-[16px] font-bold text-on-surface">{group.groupInfo.title}</h3>
                <p className="text-[12px] text-on-surface-variant/70">{group.groupInfo.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((card) => (
                  <MasterDataGroupCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
