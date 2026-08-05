import type { Supplier } from '../types/supplier';

const mockSuppliers: Supplier[] = [
  { id: '1', name: 'John Deere Concessionária Treviso', service: 'Peças e Assistência Autorizada', phone: '(16) 3322-1000', rating: '4.9 ★' },
  { id: '2', name: 'Mercedes-Benz Dieselcenter', service: 'Manutenção de Caminhões', phone: '(16) 3455-8890', rating: '4.8 ★' },
  { id: '3', name: 'TotalLub Agrocultura', service: 'Óleos e Lubrificantes Agrícolas', phone: '(16) 3998-4411', rating: '4.7 ★' },
  { id: '4', name: 'Pneusul Agrícola', service: 'Pneus e Recapagem de Tratores', phone: '(16) 3211-7700', rating: '4.6 ★' },
];

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
    return Promise.resolve([...mockSuppliers]);
  },
};
