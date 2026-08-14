import type { StockItem, StockDashboardStats, StockItemFilter, StockHistoryLog } from '../types/parts';
import { stockCalculationService } from './stock-calculation.service';
import { dataSourceConfig } from '../config/data-source.config';
import { fetchStockItemsFromApi } from './api-gateways/stock.gateway';
import { mockStorage } from './mock-storage';

const defaultStockItems: StockItem[] = [
  {
    id: 'PART-001',
    internalCode: 'FLT-0150',
    barcode: '7891234567891',
    name: 'Filtro de Óleo Lubrificante Motor',
    description: 'Filtro lubrificante blindado para motores diesel 4 e 6 cilindros',
    type: 'filtro',
    categoryName: 'Filtros de Motor',
    brand: 'Mann Filter',
    manufacturerCode: 'W 950/26',
    supplierReference: 'FK-MANN-950',
    controlUnit: 'Unidade',
    allowsFractionalQuantity: false,
    currentQuantity: 18,
    reservedQuantity: 4,
    availableQuantity: 14,
    minimumQuantity: 10,
    maximumQuantity: 50,
    reorderPoint: 15,
    averageCost: 65.50,
    lastPurchaseCost: 68.00,
    totalStockValue: 1179.00,
    location: {
      warehouseId: 'WH-01',
      warehouseName: 'Almoxarifado Central',
      shelf: 'Prateleira B',
      bin: 'Gaveta B3',
      detailedLocation: 'Almoxarifado Central — Prateleira B (Gaveta B3)',
    },
    controlsLot: false,
    controlsExpiration: false,
    requiresWorkOrderLink: true,
    compatibleEquipmentNames: ['Trator Massey Ferguson 275', 'Trator Valtra A750', 'Trator LS U80'],
    preferredSupplierIds: ['SUP-01'],
    suppliersInfo: [
      {
        supplierId: 'SUP-01',
        supplierName: 'AgroPeças Distribuidora',
        supplierItemCode: 'AP-MANN-950',
        leadTimeDays: 2,
        lastPurchasePrice: 68.00,
        isPreferred: true,
      },
    ],
    status: 'ativo',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'PART-002',
    internalCode: 'OIL-15W40',
    barcode: '7899876543210',
    name: 'Óleo Lubrificante 15W40 Mineral Premium',
    description: 'Óleo multiviscoso API CK-4 para motores diesel de alta performance agrícola',
    type: 'oleo',
    categoryName: 'Óleos e Lubrificantes',
    brand: 'Shell Rimula',
    manufacturerCode: 'R4 X 15W-40',
    controlUnit: 'Litro',
    allowsFractionalQuantity: true,
    currentQuantity: 240,
    reservedQuantity: 60,
    availableQuantity: 180,
    minimumQuantity: 100,
    maximumQuantity: 1000,
    reorderPoint: 200,
    averageCost: 28.50,
    lastPurchaseCost: 29.00,
    totalStockValue: 6840.00,
    location: {
      warehouseId: 'WH-01',
      warehouseName: 'Almoxarifado Central',
      shelf: 'Setor de Fluidos',
      position: 'Tambor T-02',
      detailedLocation: 'Almoxarifado Central — Setor de Fluidos (Tambor T-02)',
    },
    controlsLot: true,
    controlsExpiration: true,
    requiresWorkOrderLink: true,
    compatibleEquipmentNames: ['Toda Frota Diesel (Tratores, Caminhões, Colhedoras)'],
    status: 'ativo',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-08-02T11:00:00Z',
  },
  {
    id: 'PART-003',
    internalCode: 'GRS-LITIO',
    name: 'Graxa de Lítio NLGI 2 para Chassi e Pinos',
    description: 'Graxa de sabão de lítio EP-2 para engraxamento geral de pinos, buchas e cruzetas',
    type: 'graxa',
    categoryName: 'Óleos e Lubrificantes',
    brand: 'Texaco Marfak',
    controlUnit: 'Balde',
    allowsFractionalQuantity: false,
    currentQuantity: 4,
    reservedQuantity: 1,
    availableQuantity: 3,
    minimumQuantity: 5,
    maximumQuantity: 20,
    reorderPoint: 8,
    averageCost: 450.00,
    lastPurchaseCost: 460.00,
    totalStockValue: 1800.00,
    location: {
      warehouseId: 'WH-01',
      warehouseName: 'Almoxarifado Central',
      shelf: 'Palete P-01',
      detailedLocation: 'Almoxarifado Central — Palete P-01',
    },
    controlsLot: true,
    controlsExpiration: true,
    status: 'estoque_baixo',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-04T09:00:00Z',
  },
  {
    id: 'PART-004',
    internalCode: 'FLI-ISO68',
    name: 'Fluido Hidráulico ISO VG 68',
    description: 'Óleo hidráulico antidesgaste HLP 68 para transmissões e sistemas hidráulicos pesados',
    type: 'fluido',
    categoryName: 'Óleos e Lubrificantes',
    brand: 'Ipiranga Ipitur AW 68',
    controlUnit: 'Litro',
    allowsFractionalQuantity: true,
    currentQuantity: 0,
    reservedQuantity: 0,
    availableQuantity: 0,
    minimumQuantity: 50,
    maximumQuantity: 500,
    averageCost: 22.00,
    totalStockValue: 0.00,
    location: {
      warehouseId: 'WH-01',
      warehouseName: 'Almoxarifado Central',
      shelf: 'Setor de Fluidos',
      detailedLocation: 'Almoxarifado Central — Setor de Fluidos',
    },
    controlsLot: true,
    controlsExpiration: true,
    status: 'sem_estoque',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-08-03T16:00:00Z',
  },
  {
    id: 'PART-005',
    internalCode: 'ELE-CORREIA-V',
    name: 'Correia em V do Alternador / Bomba d’Água',
    description: 'Correia trapezoidal dentada AVX 13 x 1250',
    type: 'peca',
    categoryName: 'Transmissão e Correias',
    brand: 'Continental Gates',
    controlUnit: 'Unidade',
    allowsFractionalQuantity: false,
    currentQuantity: 8,
    reservedQuantity: 2,
    availableQuantity: 6,
    minimumQuantity: 4,
    maximumQuantity: 25,
    averageCost: 85.00,
    totalStockValue: 680.00,
    location: {
      warehouseId: 'WH-02',
      warehouseName: 'Oficina Mecânica Campo',
      shelf: 'Prateleira A',
      bin: 'Gaveta A1',
      detailedLocation: 'Oficina Mecânica Campo — Prateleira A (Gaveta A1)',
    },
    controlsLot: false,
    controlsExpiration: false,
    status: 'ativo',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
  },
];

const defaultStockHistory: StockHistoryLog[] = [
  {
    id: 'LOG-001',
    itemId: 'PART-001',
    itemCode: 'FLT-0150',
    date: '2026-01-10T08:00:00Z',
    event: 'cadastro',
    responsibleName: 'Roberto Alves (Almoxarife)',
    notes: 'Cadastro inicial do item de filtro Mann W950/26 no sistema.',
  },
];

export const partsService = {
  async getStockDashboardStats(): Promise<StockDashboardStats> {
    const list = await mockStorage.get<StockItem>('stock_items', defaultStockItems);
    const totalItems = list.filter(i => i.status !== 'arquivado').length;
    const totalStockValue = list.reduce((acc, i) => acc + (i.status !== 'arquivado' ? i.totalStockValue : 0), 0);
    const itemsBelowMinimum = list.filter(i => i.currentQuantity <= i.minimumQuantity && i.currentQuantity > 0 && i.status !== 'arquivado').length;
    const itemsOutOfStock = list.filter(i => i.currentQuantity <= 0 && i.status !== 'arquivado').length;
    const reservedItems = list.filter(i => i.reservedQuantity > 0 && i.status !== 'arquivado').length;

    return {
      totalItems,
      totalStockValue,
      itemsBelowMinimum,
      itemsOutOfStock,
      reservedItems,
      pendingReservations: 4,
      lotsExpiringSoon: 2,
      expiredLots: 1,
      movementsCountPeriod: 38,
      monthlyConsumptionCost: 14850.00,
      periodLossCost: 320.00,
      inventoryDivergencesCount: 2,
    };
  },

  async getStockItems(filters?: StockItemFilter): Promise<StockItem[]> {
    if (dataSourceConfig.stock === 'api') {
      const items = await fetchStockItemsFromApi(filters?.search);
      return items.map(i => ({
        id: i.id,
        internalCode: i.code,
        name: i.name,
        description: i.name,
        type: 'peca' as any,
        categoryName: 'Peça de Estoque',
        controlUnit: i.unitMeasure,
        allowsFractionalQuantity: false,
        currentQuantity: i.quantity,
        reservedQuantity: 0,
        availableQuantity: i.quantity,
        minimumQuantity: i.minQuantity,
        maximumQuantity: i.minQuantity * 5,
        reorderPoint: i.minQuantity,
        averageCost: 50.00,
        totalStockValue: i.quantity * 50.00,
        location: {
          warehouseId: 'wh-01',
          warehouseName: 'Almoxarifado Central',
          shelf: 'A1',
          detailedLocation: 'Almoxarifado Central - A1',
        },
        controlsLot: false,
        controlsExpiration: false,
        requiresWorkOrderLink: false,
        compatibleEquipmentNames: [],
        status: (i.status as any) || 'em_estoque',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    const list = await mockStorage.get<StockItem>('stock_items', defaultStockItems);
    let items = [...list];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.internalCode.toLowerCase().includes(q) ||
          (i.brand && i.brand.toLowerCase().includes(q)) ||
          (i.barcode && i.barcode.includes(q))
      );
    }

    if (filters?.type && filters.type !== 'todos') {
      items = items.filter(i => i.type === filters.type);
    }

    if (filters?.status && filters.status !== 'todos') {
      items = items.filter(i => i.status === filters.status);
    }

    if (filters?.belowMinimumOnly) {
      items = items.filter(i => i.currentQuantity <= i.minimumQuantity && i.currentQuantity > 0);
    }

    if (filters?.outOfStockOnly) {
      items = items.filter(i => i.currentQuantity <= 0);
    }

    if (filters?.hasReservationsOnly) {
      items = items.filter(i => i.reservedQuantity > 0);
    }

    return items;
  },

  async getStockItemById(id: string): Promise<StockItem | undefined> {
    const list = await mockStorage.get<StockItem>('stock_items', defaultStockItems);
    return list.find(i => i.id === id);
  },

  async createStockItem(data: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt' | 'availableQuantity' | 'totalStockValue'>): Promise<StockItem> {
    const list = await mockStorage.get<StockItem>('stock_items', defaultStockItems);
    const existing = list.find(i => i.internalCode.toLowerCase() === data.internalCode.toLowerCase());
    if (existing) {
      throw new Error(`O código interno ${data.internalCode} já está em uso por outro item.`);
    }

    const availableQuantity = stockCalculationService.calculateAvailableQuantity(data.currentQuantity, data.reservedQuantity || 0);
    const totalStockValue = Number((data.currentQuantity * data.averageCost).toFixed(2));

    const newItem: StockItem = {
      ...data,
      id: `PART-${Math.floor(100 + Math.random() * 900)}`,
      availableQuantity,
      totalStockValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.push(newItem);
    await mockStorage.set('stock_items', list);

    const history = await mockStorage.get<StockHistoryLog>('stock_history', defaultStockHistory);
    history.unshift({
      id: `LOG-${Date.now()}`,
      itemId: newItem.id,
      itemCode: newItem.internalCode,
      date: new Date().toISOString(),
      event: 'cadastro',
      responsibleName: 'Roberto Alves (Almoxarife)',
      notes: `Item ${newItem.name} (${newItem.internalCode}) cadastrado no estoque.`,
    });
    await mockStorage.set('stock_history', history);

    return newItem;
  },

  async updateStockItem(id: string, data: Partial<StockItem>): Promise<StockItem> {
    const list = await mockStorage.get<StockItem>('stock_items', defaultStockItems);
    const index = list.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item de estoque não encontrado.');

    const updated = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const finalItem = stockCalculationService.updateCalculatedItemFields(updated);
    list[index] = finalItem;
    await mockStorage.set('stock_items', list);

    const history = await mockStorage.get<StockHistoryLog>('stock_history', defaultStockHistory);
    history.unshift({
      id: `LOG-${Date.now()}`,
      itemId: id,
      itemCode: finalItem.internalCode,
      date: new Date().toISOString(),
      event: 'edicao',
      responsibleName: 'Roberto Alves (Almoxarife)',
      notes: 'Alteração dos dados cadastrais do item de estoque.',
    });
    await mockStorage.set('stock_history', history);

    return finalItem;
  },

  async archiveStockItem(id: string, reason: string): Promise<StockItem> {
    const item = await this.getStockItemById(id);
    if (!item) throw new Error('Item não encontrado.');

    return this.updateStockItem(id, {
      status: 'arquivado',
      archivedAt: new Date().toISOString(),
      notes: `${item.notes || ''}\nArquivado em ${new Date().toLocaleDateString('pt-BR')}: ${reason}`,
    });
  },

  async getStockHistory(itemId?: string): Promise<StockHistoryLog[]> {
    const history = await mockStorage.get<StockHistoryLog>('stock_history', defaultStockHistory);
    if (itemId) {
      return history.filter(h => h.itemId === itemId);
    }
    return history;
  },
};
