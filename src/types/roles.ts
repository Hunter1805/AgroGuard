import type { ModulePermission } from './permissions';

export interface AccessRole {
  id: string;
  code: string;
  name: string;
  description?: string;

  permissions: ModulePermission[];

  systemRole: boolean;
  editable: boolean;
  active: boolean;

  userCount: number;

  createdAt: string;
  updatedAt: string;
}
