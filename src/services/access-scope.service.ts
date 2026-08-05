export interface UserAccessScopes {
  userId: string;
  companyIds: string[];
  unitIds: string[];
  farmIds: string[];
  sectorIds: string[];
  warehouseIds: string[];
}

let mockUserScopesMap: Record<string, UserAccessScopes> = {
  'usr-01': { userId: 'usr-01', companyIds: ['emp-01'], unitIds: ['und-01', 'und-02'], farmIds: ['fzm-01'], sectorIds: [], warehouseIds: ['alm-01'] },
  'usr-02': { userId: 'usr-02', companyIds: ['emp-01'], unitIds: ['und-01'], farmIds: ['fzm-01'], sectorIds: [], warehouseIds: ['alm-01'] },
};

export const accessScopeService = {
  async getUserScopes(userId: string): Promise<UserAccessScopes> {
    return mockUserScopesMap[userId] || {
      userId,
      companyIds: ['emp-01'],
      unitIds: ['und-01'],
      farmIds: [],
      sectorIds: [],
      warehouseIds: [],
    };
  },

  async updateUserScopes(userId: string, scopes: Partial<UserAccessScopes>): Promise<UserAccessScopes> {
    const current = await this.getUserScopes(userId);
    const updated = { ...current, ...scopes };
    mockUserScopesMap[userId] = updated;
    return updated;
  },
};
