import { MasterDataRepository } from './master-data.repository';

export class MasterDataService {
  constructor(private repo: MasterDataRepository) {}

  async getAllMasterData() {
    const [equipmentTypes, brands, models, technicalSystems, suppliers, unitMeasures] = await Promise.all([
      this.repo.getEquipmentTypes(),
      this.repo.getBrands(),
      this.repo.getModels(),
      this.repo.getTechnicalSystems(),
      this.repo.getSuppliers(),
      this.repo.getUnitMeasures(),
    ]);

    return {
      equipmentTypes,
      brands,
      models,
      technicalSystems,
      suppliers,
      unitMeasures,
    };
  }
}
