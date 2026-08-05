import type { UnitMeasureMaster } from '../types/material-master-data';

let mockUnitsOfMeasure: UnitMeasureMaster[] = [
  { id: 'um-01', code: 'UN', name: 'Unidade', symbol: 'UN', group: 'quantidade', allowsDecimal: false, decimalPlaces: 0, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'um-02', code: 'LITRO', name: 'Litro', symbol: 'L', group: 'volume', allowsDecimal: true, decimalPlaces: 2, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'um-03', code: 'KG', name: 'Quilograma', symbol: 'kg', group: 'massa', allowsDecimal: true, decimalPlaces: 3, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'um-04', code: 'HORA', name: 'Horas de Horímetro', symbol: 'h', group: 'horimetro', allowsDecimal: true, decimalPlaces: 1, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'um-05', code: 'PSI', name: 'Pressão PSI', symbol: 'PSI', group: 'pressao', allowsDecimal: false, decimalPlaces: 0, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

export const unitMeasureService = {
  async getAll(): Promise<UnitMeasureMaster[]> {
    return mockUnitsOfMeasure;
  },

  async getUnitsOfMeasure(): Promise<UnitMeasureMaster[]> {
    return mockUnitsOfMeasure;
  },
};
