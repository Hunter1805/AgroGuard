export interface EffectivePermission {
  module: string;
  action: string;
  allowed: boolean;
}

export interface AuthenticatedActor {
  authUserId: string;
  userId: string;
  organizationId: string;

  companyIds: string[];
  unitIds: string[];
  farmIds: string[];
  workshopIds: string[];
  warehouseIds: string[];

  roleIds: string[];
  permissions: EffectivePermission[];

  sessionId?: string;
}
