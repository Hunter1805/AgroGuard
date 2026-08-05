import type {
  Equipment,
  EquipmentStats,
  MaintenanceSituation,
  MeterConfig,
} from '../types/equipment';
import type { EquipmentFormData } from '../types/equipment-form';
import { dataSourceConfig } from '../config/data-source.config';
import { fetchEquipmentsFromApi } from './api-gateways/equipment.gateway';

const DRAFT_STORAGE_KEY = 'agroguard_equipment_draft';

const mockEquipments: Equipment[] = [
  // ── TRATORES ───────────────────────────────────────────────────────────────
  {
    id: 'EQ-001', assetId: '1', assetType: 'Trator',
    name: 'Trator Massey 265 01 4x2', brand: 'Massey Ferguson', model: '265', year: '2010',
    plateOrCode: 'MF-265-01', status: 'operante', location: 'Talhão 1', farm: 'Fazenda São João', sector: 'Café',
    currentHours: 6800, meterType: 'horimetro',
    meters: [
      { id: 'm-1', type: 'horimetro', label: 'Horímetro Principal', currentValue: 6800, unit: 'h', lastReadingDate: '01/08/2026' }
    ],
    fuelLevel: 70, lastMaintenanceDate: '10/07/2026', nextMaintenanceDate: '20/08/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0012', serialNumber: 'MF265-2010-9901', operatorName: 'Carlos Silva',
    fuelType: 'Diesel S10', enginePower: '65 cv', transmissionType: 'Manual 8x2', tireConfig: 'Agrícola Dianteiro 7.50-16 / Traseiro 18.4-30',
  },
  {
    id: 'EQ-002', assetId: '2', assetType: 'Trator',
    name: 'Trator Massey 265 02 4x2', brand: 'Massey Ferguson', model: '265', year: '2011',
    plateOrCode: 'MF-265-02', status: 'em_operacao', location: 'Talhão 2', farm: 'Fazenda São João', sector: 'Café',
    currentHours: 7200, meterType: 'horimetro',
    meters: [
      { id: 'm-2', type: 'horimetro', label: 'Horímetro Principal', currentValue: 7200, unit: 'h', lastReadingDate: '02/08/2026' }
    ],
    fuelLevel: 55, lastMaintenanceDate: '12/07/2026', nextMaintenanceDate: '22/08/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0013', serialNumber: 'MF265-2011-9902', operatorName: 'Roberto Alves',
    fuelType: 'Diesel S10', enginePower: '65 cv',
  },
  {
    id: 'EQ-003', assetId: '3', assetType: 'Trator',
    name: 'Trator Massey 275 03 4x2', brand: 'Massey Ferguson', model: '275', year: '2011',
    plateOrCode: 'MF-275-03', status: 'manutencao', location: 'Oficina Central', farm: 'Sede Central', sector: 'Oficina',
    currentHours: 8100, meterType: 'horimetro',
    meters: [
      { id: 'm-3', type: 'horimetro', label: 'Horímetro Motor', currentValue: 8100, unit: 'h', lastReadingDate: '25/07/2026' }
    ],
    fuelLevel: 30, lastMaintenanceDate: '01/07/2026', nextMaintenanceDate: '10/08/2026', maintenanceStatus: 'vencida',
    patrimony: 'PAT-0014', serialNumber: 'MF275-2011-9903', operatorName: 'João Mecânico', hasPendingAlert: true,
  },
  {
    id: 'EQ-011', assetId: '11', assetType: 'Trator',
    name: 'Trator Agrale 4100 11 4x2', brand: 'Agrale', model: '4100', year: '2008',
    plateOrCode: 'AG-4100-11', status: 'operante', location: 'Galpão Principal', farm: 'Fazenda Santa Maria', sector: 'Logística',
    currentHours: 3200, meterType: 'horimetro',
    meters: [
      { id: 'm-11', type: 'horimetro', label: 'Horímetro Horas Trabalhadas', currentValue: 3200, unit: 'h', lastReadingDate: '30/07/2026' }
    ],
    fuelLevel: 80, lastMaintenanceDate: '05/07/2026', nextMaintenanceDate: '15/09/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0045', operatorName: 'Paulo Souza',
  },
  {
    id: 'EQ-022', assetId: '22', assetType: 'Trator',
    name: 'Trator LS U80 22 4x4', brand: 'LS Trator', model: 'U80', year: '2019',
    plateOrCode: 'LS-U80-22', status: 'em_operacao', location: 'Talhão 5', farm: 'Fazenda São João', sector: 'Café',
    currentHours: 2100, meterType: 'horimetro',
    meters: [
      { id: 'm-22', type: 'horimetro', label: 'Horímetro Principal', currentValue: 2100, unit: 'h', lastReadingDate: '03/08/2026' }
    ],
    fuelLevel: 90, lastMaintenanceDate: '20/07/2026', nextMaintenanceDate: '30/09/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0089', operatorName: 'Lucas Lima', hasPendingAlert: true,
  },
  {
    id: 'EQ-013', assetId: '13', assetType: 'Trator',
    name: 'Trator Valtra A750 13 4x4', brand: 'Valtra', model: 'A750', year: '2014',
    plateOrCode: 'VA-A750-13', status: 'operante', location: 'Talhão 7', farm: 'Fazenda Santa Maria', sector: 'Grãos',
    currentHours: 5400, meterType: 'horimetro',
    meters: [
      { id: 'm-13', type: 'horimetro', label: 'Horímetro Digital', currentValue: 5400, unit: 'h', lastReadingDate: '28/07/2026' }
    ],
    fuelLevel: 65, lastMaintenanceDate: '15/07/2026', nextMaintenanceDate: '06/08/2026', maintenanceStatus: 'proxima',
    patrimony: 'PAT-0056', operatorName: 'Marcos Dias', hasPendingAlert: true,
  },
  {
    id: 'EQ-014', assetId: '14', assetType: 'Trator',
    name: 'Trator Valtra A750 14 4x4', brand: 'Valtra', model: 'A750', year: '2014',
    plateOrCode: 'VA-A750-14', status: 'bloqueado', location: 'Oficina Externa', farm: 'Sede Central', sector: 'Oficina',
    currentHours: 5900, meterType: 'horimetro',
    meters: [
      { id: 'm-14', type: 'horimetro', label: 'Horímetro Digital', currentValue: 5900, unit: 'h', lastReadingDate: '20/07/2026' }
    ],
    fuelLevel: 20, lastMaintenanceDate: '25/06/2026', nextMaintenanceDate: '05/08/2026', maintenanceStatus: 'vencida',
    patrimony: 'PAT-0057', hasPendingAlert: true, isReadingOverdue: true,
  },

  // ── COLHEDORAS ─────────────────────────────────────────────────────────────
  {
    id: 'EQ-C01', assetId: 'C1', assetType: 'Colhedora',
    name: 'Colhedora Jacto K3 4x2', brand: 'Jacto', model: 'K3 4x2', year: '2013',
    plateOrCode: 'JC-K3-01', status: 'operante', location: 'Galpão de Máquinas', farm: 'Fazenda São João', sector: 'Colheita',
    currentHours: 4500, meterType: 'ambos',
    meters: [
      { id: 'mc-1', type: 'horimetro', label: 'Horímetro Motor', currentValue: 4500, unit: 'h', lastReadingDate: '15/07/2026' },
      { id: 'mc-2', type: 'horimetro', label: 'Horímetro Trilhado', currentValue: 3100, unit: 'h', lastReadingDate: '15/07/2026' },
    ],
    fuelLevel: 60, lastMaintenanceDate: '18/07/2026', nextMaintenanceDate: '28/08/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0078', operatorName: 'Daniel Rocha', isReadingOverdue: true,
  },

  // ── VEÍCULOS / CAMINHÕES ───────────────────────────────────────────────────
  {
    id: 'EQ-V01', assetId: 'V1', assetType: 'Caminhão',
    name: 'Caminhão Volvo FH 360', brand: 'Volvo', model: 'FH 360', year: '2018',
    plateOrCode: 'VL-FH360', status: 'em_operacao', location: 'Estrada Principal', farm: 'Logística Geral', sector: 'Transporte',
    currentHours: 185000, meterType: 'odometro',
    meters: [
      { id: 'mv-1', type: 'odometro', label: 'Odômetro Principal', currentValue: 185000, unit: 'km', lastReadingDate: '02/08/2026' }
    ],
    fuelLevel: 75, lastMaintenanceDate: '10/07/2026', nextMaintenanceDate: '10/10/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0090', operatorName: 'Pedro Antunes', hasPendingAlert: true,
  },
  {
    id: 'EQ-V02', assetId: 'V2', assetType: 'Caminhão',
    name: 'Caminhão IVECO 240E28S', brand: 'Iveco', model: '240E28S', year: '2016',
    plateOrCode: 'IV-240E28', status: 'operante', location: 'Pátio Central', farm: 'Logística Geral', sector: 'Transporte',
    currentHours: 142000, meterType: 'odometro',
    meters: [
      { id: 'mv-2', type: 'odometro', label: 'Odômetro Principal', currentValue: 142000, unit: 'km', lastReadingDate: '01/08/2026' }
    ],
    fuelLevel: 50, lastMaintenanceDate: '05/07/2026', nextMaintenanceDate: '05/10/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0091', operatorName: 'Renato Faria',
  },
  {
    id: 'EQ-V04', assetId: 'V4', assetType: 'Caminhão',
    name: 'Caminhão VW 14220', brand: 'Volkswagen', model: '14220', year: '2012',
    plateOrCode: 'VW-14220-01', status: 'manutencao', location: 'Oficina Central', farm: 'Sede Central', sector: 'Oficina',
    currentHours: 210000, meterType: 'odometro',
    meters: [
      { id: 'mv-4', type: 'odometro', label: 'Odômetro Chassi', currentValue: 210000, unit: 'km', lastReadingDate: '01/07/2026' }
    ],
    fuelLevel: 30, lastMaintenanceDate: '01/07/2026', nextMaintenanceDate: '01/08/2026', maintenanceStatus: 'vencida',
    patrimony: 'PAT-0093', hasPendingAlert: true,
  },
  {
    id: 'EQ-M01', assetId: 'M1', assetType: 'Moto',
    name: 'Moto Honda NXR 150 Bros', brand: 'Honda', model: 'NXR 150 Bros', year: '2020',
    plateOrCode: 'HN-NXR150', status: 'operante', location: 'Campo de Apoio', farm: 'Fazenda São João', sector: 'Fiscalização',
    currentHours: 28500, meterType: 'odometro',
    meters: [
      { id: 'mm-1', type: 'odometro', label: 'Odômetro Painel', currentValue: 28500, unit: 'km', lastReadingDate: '31/07/2026' }
    ],
    fuelLevel: 60, lastMaintenanceDate: '15/07/2026', nextMaintenanceDate: '15/10/2026', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0105', operatorName: 'Vitor Hugo',
  },

  // ── IMPLEMENTOS ────────────────────────────────────────────────────────────
  {
    id: 'EQ-I01', assetId: 'I1', assetType: 'Implemento',
    name: 'Varredor Hidráulico VACCA Vincon 3.60', brand: 'Vicon', model: 'VACCA 3.6H', year: '2013',
    plateOrCode: 'VC-VH360', status: 'operante', location: 'Galpão de Implementos', farm: 'Fazenda São João', sector: 'Preparo',
    currentHours: 0, meterType: 'nenhum', meters: [], fuelLevel: 0, lastMaintenanceDate: '10/07/2026', nextMaintenanceDate: '10/08/2026', maintenanceStatus: 'proxima',
    patrimony: 'PAT-0201',
  },
  {
    id: 'EQ-I07', assetId: 'I7', assetType: 'Implemento',
    name: 'Adubadeira Minami M535D', brand: 'Minami', model: 'M535D', year: '2018',
    plateOrCode: 'MI-ADU01', status: 'operante', location: 'Galpão de Implementos', farm: 'Fazenda São João', sector: 'Fertilização',
    currentHours: 0, meterType: 'nenhum', meters: [], fuelLevel: 0, lastMaintenanceDate: '01/06/2026', nextMaintenanceDate: '01/01/2027', maintenanceStatus: 'em_dia',
    patrimony: 'PAT-0207',
  },
];

export const equipmentService = {
  async getAllEquipments(includeArchived = false): Promise<Equipment[]> {
    if (dataSourceConfig.equipment === 'api') {
      return fetchEquipmentsFromApi();
    }
    const list = includeArchived ? mockEquipments : mockEquipments.filter((e) => !e.isArchived);
    return Promise.resolve([...list]);
  },

  async getEquipmentById(id: string): Promise<Equipment | undefined> {
    if (dataSourceConfig.equipment === 'api') {
      const list = await fetchEquipmentsFromApi();
      return list.find(e => e.id === id);
    }
    const item = mockEquipments.find((e) => e.id === id);
    return Promise.resolve(item ? { ...item } : undefined);
  },

  async getEquipmentStats(): Promise<EquipmentStats> {
    const active = mockEquipments.filter((e) => !e.isArchived);
    const stats: EquipmentStats = {
      total: active.length,
      operantes: active.filter((e) => e.status === 'operante').length,
      emOperacao: active.filter((e) => e.status === 'em_operacao').length,
      emManutencao: active.filter((e) => e.status === 'manutencao').length,
      parados: active.filter((e) => e.status === 'parado' || e.status === 'inoperante').length,
      bloqueados: active.filter((e) => e.status === 'bloqueado').length,
      alertasPendentes: active.filter((e) => e.hasPendingAlert).length,
      manutencoesVencidas: active.filter((e) => e.maintenanceStatus === 'vencida').length,
      leiturasAtrasadas: active.filter((e) => e.isReadingOverdue).length,
    };
    return Promise.resolve(stats);
  },

  async getLocations(): Promise<string[]> {
    const locs = Array.from(
      new Set(mockEquipments.filter((e) => !e.isArchived).map((e) => e.location))
    ).sort();
    return Promise.resolve(locs);
  },

  async filterEquipments(options: {
    assetType?: string;
    status?: string;
    search?: string;
    location?: string;
    maintenanceStatus?: MaintenanceSituation;
    hasPendingAlert?: boolean;
    isReadingOverdue?: boolean;
    includeArchived?: boolean;
  }): Promise<Equipment[]> {
    return new Promise((resolve) => {
      let result = [...mockEquipments];

      if (!options.includeArchived) {
        result = result.filter((e) => !e.isArchived);
      }

      if (options.assetType && options.assetType !== 'todos') {
        result = result.filter((e) => e.assetType === options.assetType);
      }

      if (options.status && options.status !== 'todos') {
        result = result.filter((e) => e.status === options.status);
      }

      if (options.location && options.location !== 'todas') {
        result = result.filter((e) => e.location === options.location);
      }

      if (options.maintenanceStatus && options.maintenanceStatus !== 'todas') {
        result = result.filter((e) => e.maintenanceStatus === options.maintenanceStatus);
      }

      if (options.hasPendingAlert) {
        result = result.filter((e) => e.hasPendingAlert);
      }

      if (options.isReadingOverdue) {
        result = result.filter((e) => e.isReadingOverdue);
      }

      if (options.search && options.search.trim() !== '') {
        const q = options.search.toLowerCase();
        result = result.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.brand.toLowerCase().includes(q) ||
            e.model.toLowerCase().includes(q) ||
            e.plateOrCode.toLowerCase().includes(q) ||
            (e.patrimony && e.patrimony.toLowerCase().includes(q)) ||
            (e.operatorName && e.operatorName.toLowerCase().includes(q)) ||
            (e.serialNumber && e.serialNumber.toLowerCase().includes(q))
        );
      }

      resolve(result);
    });
  },

  async archiveEquipment(id: string, reason: string): Promise<boolean> {
    const index = mockEquipments.findIndex((e) => e.id === id);
    if (index !== -1) {
      mockEquipments[index].isArchived = true;
      mockEquipments[index].archiveReason = reason;
      mockEquipments[index].archivedAt = new Date().toISOString();
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  async createEquipment(formData: EquipmentFormData): Promise<Equipment> {
    const newId = `EQ-${String(mockEquipments.length + 1).padStart(3, '0')}`;
    const todayStr = new Date().toLocaleDateString('pt-BR');

    // Se meters não for especificado, cria 1 por padrão se houver horímetro/odômetro
    const meters: MeterConfig[] = formData.meters?.length
      ? formData.meters
      : formData.meterType === 'horimetro'
      ? [{ id: `m-${Date.now()}`, type: 'horimetro', label: 'Horímetro Principal', currentValue: formData.currentHours || 0, unit: 'h', lastReadingDate: todayStr }]
      : formData.meterType === 'odometro'
      ? [{ id: `m-${Date.now()}`, type: 'odometro', label: 'Odômetro Principal', currentValue: formData.currentHours || 0, unit: 'km', lastReadingDate: todayStr }]
      : [];

    const newEquipment: Equipment = {
      id: newId,
      assetType: formData.assetType,
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      year: formData.year || '2026',
      plateOrCode: formData.plateOrCode,
      status: formData.status,
      location: formData.location || 'Pátio Central',
      farm: formData.farm || 'Fazenda Principal',
      sector: formData.sector || 'Geral',
      currentHours: Number(formData.currentHours) || (meters[0]?.currentValue || 0),
      meterType: formData.meterType,
      meters: meters,
      fuelLevel: Number(formData.fuelLevel) || 100,
      lastMaintenanceDate: formData.lastMaintenanceDate || todayStr,
      nextMaintenanceDate: formData.nextMaintenanceDate || 'Em 30 dias',
      maintenanceStatus: 'em_dia',
      patrimony: formData.patrimony,
      serialNumber: formData.serialNumber,
      operatorName: formData.operatorName,
      fuelType: formData.fuelType,
      enginePower: formData.enginePower,
      transmissionType: formData.transmissionType,
      tankCapacity: formData.tankCapacity,
      operatingWeight: formData.operatingWeight,
      tireConfig: formData.tireConfig,
      maintenancePlanId: formData.maintenancePlanId,
      maintenancePlanName: formData.maintenancePlanName,
      maintenanceInterval: formData.maintenanceInterval,
      notes: formData.notes,
      documents: formData.documents || [],
      images: formData.images || [],
    };

    mockEquipments.unshift(newEquipment);
    this.clearDraft();
    return Promise.resolve(newEquipment);
  },

  async updateEquipment(id: string, formData: Partial<EquipmentFormData>): Promise<Equipment> {
    const index = mockEquipments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Equipamento ${id} não encontrado.`);
    }

    const current = mockEquipments[index];

    const updated: Equipment = {
      ...current,
      ...formData,
      currentHours: formData.currentHours !== undefined ? Number(formData.currentHours) : current.currentHours,
      fuelLevel: formData.fuelLevel !== undefined ? Number(formData.fuelLevel) : current.fuelLevel,
      meters: formData.meters || current.meters || [],
      documents: formData.documents || current.documents || [],
      images: formData.images || current.images || [],
    };

    mockEquipments[index] = updated;
    this.clearDraft();
    return Promise.resolve(updated);
  },

  // Centralização de dados auxiliares para o formulário
  getAuxiliaryOptions() {
    return {
      farms: ['Fazenda São João', 'Fazenda Santa Maria', 'Fazenda Vista Alegre', 'Logística Geral', 'Sede Central'],
      sectors: ['Café', 'Grãos', 'Citros', 'Colheita', 'Oficina', 'Transporte', 'Fiscalização', 'Preparo', 'Fertilização'],
      locations: ['Talhão 1', 'Talhão 2', 'Talhão 3', 'Talhão 5', 'Talhão 6', 'Talhão 7', 'Galpão Principal', 'Galpão de Máquinas', 'Pátio Central', 'Oficina Central', 'Estrada Principal', 'Campo de Apoio'],
      brands: ['Massey Ferguson', 'John Deere', 'New Holland', 'Valtra', 'Agrale', 'LS Trator', 'Jacto', 'Volvo', 'Iveco', 'Volkswagen', 'Honda', 'Vicon', 'Minami'],
      fuelTypes: ['Diesel S10', 'Diesel S500', 'Gasolina Comum', 'Etanol', 'Elétrico / Bateria', 'Biodiesel'],
      operators: ['Carlos Silva', 'Roberto Alves', 'João Mecânico', 'Paulo Souza', 'Lucas Lima', 'Marcos Dias', 'Fernando Costa', 'Tiago Santos', 'Daniel Rocha', 'Pedro Antunes', 'Renato Faria', 'Vitor Hugo'],
      maintenancePlans: [
        { id: 'plan-1', name: 'Plano Tratores Preventivo 250h', interval: 250 },
        { id: 'plan-2', name: 'Plano Colhedoras Intensivo 100h', interval: 100 },
        { id: 'plan-3', name: 'Plano Veículos Pesados 10.000km', interval: 10000 },
        { id: 'plan-4', name: 'Plano Implementos Semestral', interval: 500 },
      ],
    };
  },

  // Rascunhos de Formulário
  saveDraft(formData: Partial<EquipmentFormData>): void {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  },

  getDraft(): Partial<EquipmentFormData> | null {
    try {
      const data = localStorage.getItem(DRAFT_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearDraft(): void {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
