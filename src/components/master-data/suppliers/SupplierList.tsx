import React, { useState, useEffect } from 'react';
import { MasterDataListView } from '../MasterDataListView';
import { SupplierForm } from './SupplierForm';
import { SupplierDetailDrawer } from './SupplierDetailDrawer';
import { suppliersService } from '../../../services/suppliers.service';
import type { SupplierMaster } from '../../../types/material-master-data';
import type { MasterDataStatus } from '../../../types/master-data';

export const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierMaster | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    const data = await suppliersService.getAll();
    setSuppliers(data);
    setLoading(false);
  };

  const handleSaveRecord = async (data: Partial<SupplierMaster>) => {
    if (data.id) {
      await suppliersService.update(data.id, data);
    } else {
      await suppliersService.create(data as any);
    }
    await loadSuppliers();
  };

  const handleStatusChange = async (id: string, newStatus: MasterDataStatus) => {
    if (newStatus === 'ativo') {
      await suppliersService.activate(id);
    } else {
      await suppliersService.deactivate(id);
    }
    await loadSuppliers();
  };

  return (
    <>
      <MasterDataListView
        title="Cadastro de Fornecedores"
        subtitle="Gerencie fornecedores comerciais de peças, ferramentas, serviços, pneus e insumos."
        items={suppliers as any}
        loading={loading}
        FormComponent={SupplierForm as any}
        onSaveRecord={handleSaveRecord}
        onStatusChange={handleStatusChange}
      />

      <SupplierDetailDrawer
        isOpen={Boolean(selectedSupplier)}
        onClose={() => setSelectedSupplier(null)}
        supplier={selectedSupplier}
      />
    </>
  );
};
