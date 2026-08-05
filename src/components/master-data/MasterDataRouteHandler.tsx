import React, { useEffect, useState } from 'react';
import { MasterDataListView } from './MasterDataListView';

// Import dos Formulários
import { CompanyForm } from './organization/CompanyForm';
import { UnitForm } from './organization/UnitForm';
import { FarmForm } from './organization/FarmForm';
import { SectorForm } from './organization/SectorForm';
import { LocationForm } from './organization/LocationForm';
import { CostCenterForm } from './organization/CostCenterForm';
import { WorkshopForm } from './organization/WorkshopForm';
import { WarehouseForm } from './organization/WarehouseForm';
import { TeamForm } from './organization/TeamForm';

import { EquipmentTypeForm } from './equipment/EquipmentTypeForm';
import { EquipmentCategoryForm } from './equipment/EquipmentCategoryForm';
import { EquipmentSubcategoryForm } from './equipment/EquipmentSubcategoryForm';
import { BrandForm } from './equipment/BrandForm';
import { ModelForm } from './equipment/ModelForm';
import { FuelTypeForm } from './equipment/FuelTypeForm';
import { OwnershipTypeForm } from './equipment/OwnershipTypeForm';

import { SystemForm } from './maintenance/SystemForm';
import { SubsystemForm } from './maintenance/SubsystemForm';
import { ComponentForm } from './maintenance/ComponentForm';
import { FailureTypeForm } from './maintenance/FailureTypeForm';
import { SymptomForm } from './maintenance/SymptomForm';
import { CauseForm } from './maintenance/CauseForm';
import { MaintenanceTypeForm } from './maintenance/MaintenanceTypeForm';
import { PriorityForm } from './maintenance/PriorityForm';
import { OperationalReasonForm } from './maintenance/OperationalReasonForm';

import { SupplierList } from './suppliers/SupplierList';

import { PartCategoryForm } from './materials/PartCategoryForm';
import { ToolCategoryForm } from './materials/ToolCategoryForm';
import { UnitMeasureForm } from './materials/UnitMeasureForm';
import { DocumentTypeForm } from './materials/DocumentTypeForm';
import { ServiceTypeForm } from './materials/ServiceTypeForm';
import { SpecialtyForm } from './materials/SpecialtyForm';

// Import dos Serviços
import { organizationService } from '../../services/organization.service';
import { equipmentCatalogService } from '../../services/equipment-catalog.service';
import { maintenanceCatalogService } from '../../services/maintenance-catalog.service';
import { materialCatalogService } from '../../services/material-catalog.service';
import { unitMeasureService } from '../../services/unit-measure.service';
import type { MasterDataBase, MasterDataStatus } from '../../types/master-data';

interface RouteHandlerProps {
  type: string;
}

export const MasterDataRouteHandler: React.FC<RouteHandlerProps> = ({ type }) => {
  const [items, setItems] = useState<MasterDataBase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    setLoading(true);
    let data: MasterDataBase[] = [];

    switch (type) {
      // Organização
      case 'empresas': data = (await organizationService.getCompanies()) as any; break;
      case 'unidades': data = (await organizationService.getUnits()) as any; break;
      case 'fazendas': data = (await organizationService.getFarms()) as any; break;
      case 'setores': data = (await organizationService.getSectors()) as any; break;
      case 'localizacoes': data = (await organizationService.getLocations()) as any; break;
      case 'centros_custo': data = (await organizationService.getCostCenters()) as any; break;
      case 'oficinas': data = (await organizationService.getWorkshops()) as any; break;
      case 'almoxarifados': data = (await organizationService.getWarehouses()) as any; break;
      case 'equipes': data = (await organizationService.getTeams()) as any; break;

      // Equipamentos
      case 'tipos_equipamento': data = (await equipmentCatalogService.getEquipmentTypes()) as any; break;
      case 'categorias_equipamento': data = (await equipmentCatalogService.getCategories()) as any; break;
      case 'subcategorias_equipamento': data = (await equipmentCatalogService.getSubcategories()) as any; break;
      case 'marcas': data = (await equipmentCatalogService.getBrands()) as any; break;
      case 'modelos': data = (await equipmentCatalogService.getModels()) as any; break;
      case 'combustiveis': data = (await equipmentCatalogService.getFuelTypes()) as any; break;
      case 'formas_propriedade': data = (await equipmentCatalogService.getOwnershipTypes()) as any; break;

      // Manutenção
      case 'sistemas': data = (await maintenanceCatalogService.getSystems()) as any; break;
      case 'subsistemas': data = (await maintenanceCatalogService.getSubsystems()) as any; break;
      case 'componentes': data = (await maintenanceCatalogService.getComponents()) as any; break;
      case 'tipos_falha': data = (await maintenanceCatalogService.getFailureTypes()) as any; break;
      case 'sintomas': data = (await maintenanceCatalogService.getSymptoms()) as any; break;
      case 'causas': data = (await maintenanceCatalogService.getCauses()) as any; break;
      case 'tipos_manutencao': data = (await maintenanceCatalogService.getMaintenanceTypes()) as any; break;
      case 'prioridades': data = (await maintenanceCatalogService.getPriorities()) as any; break;
      case 'motivos_pausa':
      case 'motivos_cancelamento':
      case 'motivos_adiamento':
        data = (await maintenanceCatalogService.getOperationalReasons()) as any; break;

      // Materiais e Serviços
      case 'categorias_pecas': data = (await materialCatalogService.getPartCategories()) as any; break;
      case 'categorias_ferramentas': data = (await materialCatalogService.getToolCategories()) as any; break;
      case 'unidades_medida': data = (await unitMeasureService.getAll()) as any; break;
      case 'tipos_documento': data = (await materialCatalogService.getDocumentTypes()) as any; break;
      case 'tipos_servico': data = (await materialCatalogService.getServiceTypes()) as any; break;
      case 'especialidades': data = (await materialCatalogService.getSpecialties()) as any; break;

      default: data = []; break;
    }

    setItems(data);
    setLoading(false);
  };

  if (type === 'fornecedores') {
    return <SupplierList />;
  }

  const CONFIGS: Record<string, { title: string; subtitle: string; FormComponent: any }> = {
    empresas: { title: 'Cadastro de Empresas', subtitle: 'Razão social, CNPJ, inscrições e responsáveis pelas empresas operacionais.', FormComponent: CompanyForm },
    unidades: { title: 'Cadastro de Unidades', subtitle: 'Gerencie matriz, filiais, oficinas, centros de distribuição e bases.', FormComponent: UnitForm },
    fazendas: { title: 'Cadastro de Fazendas', subtitle: 'Propriedades rurais, áreas em hectares e coordenadas geográficas.', FormComponent: FarmForm },
    setores: { title: 'Cadastro de Setores', subtitle: 'Setores operacionais de preparo de solo, plantio, tratos e colheita.', FormComponent: SectorForm },
    localizacoes: { title: 'Cadastro de Localizações', subtitle: 'Estrutura hierárquica de pátios, oficinas, galpões e armários.', FormComponent: LocationForm },
    centros_custo: { title: 'Centros de Custo', subtitle: 'Contas gerenciais para controle e apropriação de despesas operacionais.', FormComponent: CostCenterForm },
    oficinas: { title: 'Cadastro de Oficinas', subtitle: 'Unidades de manutenção interna, terceirizada e oficinas móveis de campo.', FormComponent: WorkshopForm },
    almoxarifados: { title: 'Almoxarifados', subtitle: 'Locais físicos de armazenagem para controle de peças, insumos e ferramentas.', FormComponent: WarehouseForm },
    equipes: { title: 'Equipes Técnicas', subtitle: 'Equipes de manutenção mecânica, elétrica, hidráulica e operação.', FormComponent: TeamForm },

    tipos_equipamento: { title: 'Tipos de Equipamento', subtitle: 'Classificação primária (tratores, colhedoras, caminhões e implementos).', FormComponent: EquipmentTypeForm },
    categorias_equipamento: { title: 'Categorias de Equipamento', subtitle: 'Categorias operacionais e de porte dos equipamentos.', FormComponent: EquipmentCategoryForm },
    subcategorias_equipamento: { title: 'Subcategorias', subtitle: 'Subdivisões específicas das categorias da frota.', FormComponent: EquipmentSubcategoryForm },
    marcas: { title: 'Marcas e Fabricantes', subtitle: 'Marcas de frota, máquinas, veículos, implementos e componentes.', FormComponent: BrandForm },
    modelos: { title: 'Modelos de Equipamentos', subtitle: 'Modelos com especificações técnicas, combustíveis e medidores padrão.', FormComponent: ModelForm },
    combustiveis: { title: 'Tipos de Combustível', subtitle: 'Tipos de combustível e unidades de consumo para cálculo de consumo.', FormComponent: FuelTypeForm },
    formas_propriedade: { title: 'Formas de Propriedade', subtitle: 'Regimes de aquisição e posse (próprio, alugado, arrendado, comodato).', FormComponent: OwnershipTypeForm },

    sistemas: { title: 'Sistemas Técnicos', subtitle: 'Sistemas estruturais e mecânicos (motor, transmissão, hidráulica, freios).', FormComponent: SystemForm },
    subsistemas: { title: 'Subsistemas Técnicos', subtitle: 'Subsistemas específicos dos equipamentos (lubrificação, arrefecimento).', FormComponent: SubsystemForm },
    componentes: { title: 'Componentes Técnicos', subtitle: 'Peças de reposição e componentes associados a sistemas e subsistemas.', FormComponent: ComponentForm },
    tipos_falha: { title: 'Tipos de Falha', subtitle: 'Classificação de ocorrências (mecânica, elétrica, vazamento, desgaste).', FormComponent: FailureTypeForm },
    sintomas: { title: 'Sintomas de Falha', subtitle: 'Evidências e sinais perceptíveis relatados pelos operadores.', FormComponent: SymptomForm },
    causas: { title: 'Causas de Falha', subtitle: 'Causas raiz catalogadas por categorias de falha e desgaste.', FormComponent: CauseForm },
    tipos_manutencao: { title: 'Tipos de Manutenção', subtitle: 'Preventiva, corretiva planejada/não planejada, preditiva e inspeção.', FormComponent: MaintenanceTypeForm },
    prioridades: { title: 'Prioridades de Atendimento', subtitle: 'Níveis de urgência (1 a 4) com prazos de atendimento e regras de bloqueio.', FormComponent: PriorityForm },
    motivos_pausa: { title: 'Motivos de Pausa de OS', subtitle: 'Motivos padronizados para paralisação de Ordens de Serviço.', FormComponent: OperationalReasonForm },
    motivos_cancelamento: { title: 'Motivos de Cancelamento', subtitle: 'Justificativas operacionais para cancelamento de manutenções.', FormComponent: OperationalReasonForm },
    motivos_adiamento: { title: 'Motivos de Adiamento', subtitle: 'Motivos para reagendamento de planos preventivos e corretivos.', FormComponent: OperationalReasonForm },

    categorias_pecas: { title: 'Categorias de Peças', subtitle: 'Classificação do catálogo de peças de reposição e insumos.', FormComponent: PartCategoryForm },
    categorias_ferramentas: { title: 'Categorias de Ferramentas', subtitle: 'Classificação de ferramentas manuais, elétricas e equipamentos de medição.', FormComponent: ToolCategoryForm },
    unidades_medida: { title: 'Unidades de Medida', subtitle: 'Unidades de comercialização, estoque, volume, massa e consumo.', FormComponent: UnitMeasureForm },
    tipos_documento: { title: 'Tipos de Documento', subtitle: 'Notas fiscais, laudos, manuais e certificados de calibração.', FormComponent: DocumentTypeForm },
    tipos_servico: { title: 'Tipos de Serviço', subtitle: 'Serviços especializados de oficina, calibração e mão de obra terceirizada.', FormComponent: ServiceTypeForm },
    especialidades: { title: 'Especialidades Técnicas', subtitle: 'Competências e qualificações dos mecânicos e técnicos.', FormComponent: SpecialtyForm },
  };

  const currentConfig = CONFIGS[type] || {
    title: 'Cadastro Auxiliar',
    subtitle: 'Gerenciamento de tabelas de referência do sistema.',
    FormComponent: null,
  };

  const handleSaveRecord = (recordData: Partial<MasterDataBase>) => {
    const newItem: MasterDataBase = {
      id: recordData.id || `${type}-${Date.now()}`,
      code: recordData.code || `COD-${Date.now()}`,
      name: recordData.name || 'Novo Cadastro',
      description: recordData.description,
      status: recordData.status || 'ativo',
      createdAt: recordData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: recordData.createdBy || 'Usuário Atual',
      usageCount: recordData.usageCount || 0,
      ...recordData,
    };

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === newItem.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newItem;
        return copy;
      }
      return [newItem, ...prev];
    });
  };

  const handleStatusChange = (id: string, newStatus: MasterDataStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item))
    );
  };

  const handleSetReplacement = (id: string, replacementId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, replacementId, updatedAt: new Date().toISOString() } : item))
    );
  };

  return (
    <MasterDataListView
      title={currentConfig.title}
      subtitle={currentConfig.subtitle}
      items={items}
      loading={loading}
      FormComponent={currentConfig.FormComponent}
      onSaveRecord={handleSaveRecord}
      onStatusChange={handleStatusChange}
      onSetReplacement={handleSetReplacement}
    />
  );
};
