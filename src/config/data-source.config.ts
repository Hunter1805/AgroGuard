export type DataSourceMode = 'mock' | 'api' | 'hybrid';

export interface DataSourceFlags {
  mode: DataSourceMode;
  masterData: 'mock' | 'api';
  equipment: 'mock' | 'api';
  readings: 'mock' | 'api';
  checklists: 'mock' | 'api';
  maintenance: 'mock' | 'api';
  workOrders: 'mock' | 'api';
  tires: 'mock' | 'api';
  tools: 'mock' | 'api';
  stock: 'mock' | 'api';
  alerts: 'mock' | 'api';
  reports: 'mock' | 'api';
}

// Mocks só podem ser usados quando o modo demo for explicitamente habilitado.
const currentMode = (import.meta.env.VITE_DATA_SOURCE as DataSourceMode) || 'api';

export const isExplicitMockMode = currentMode === 'mock';

export const dataSourceConfig: DataSourceFlags = {
  mode: currentMode,
  masterData: currentMode === 'mock' ? 'mock' : 'api',
  equipment: currentMode === 'mock' ? 'mock' : 'api',
  readings: currentMode === 'mock' ? 'mock' : 'api',
  checklists: currentMode === 'mock' ? 'mock' : 'api',
  maintenance: currentMode === 'mock' ? 'mock' : 'api',
  workOrders: currentMode === 'mock' ? 'mock' : 'api',
  tires: currentMode === 'mock' ? 'mock' : 'api',
  tools: currentMode === 'mock' ? 'mock' : 'api',
  stock: currentMode === 'mock' ? 'mock' : 'api',
  alerts: currentMode === 'mock' ? 'mock' : 'api',
  reports: currentMode === 'mock' ? 'mock' : 'api',
};
