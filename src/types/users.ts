import type { UserPreferences } from './user-preferences';

export type UserStatus =
  | 'convite_pendente'
  | 'ativo'
  | 'inativo'
  | 'bloqueado'
  | 'afastado'
  | 'arquivado';

export type UserType =
  | 'interno'
  | 'terceirizado'
  | 'temporario'
  | 'consultor'
  | 'auditor';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  documentNumber?: string; // CPF ou registro

  type: UserType;
  status: UserStatus;

  roleIds: string[];
  primaryRoleId?: string;
  primaryRoleName?: string;

  companyIds: string[];
  unitIds: string[];
  farmIds: string[];
  teamIds: string[];

  specialtyIds: string[];

  jobTitle?: string;
  employeeCode?: string; // Matrícula

  avatarUrl?: string;

  lastAccessAt?: string;
  invitationSentAt?: string;
  invitationAcceptedAt?: string;

  blockedReason?: string;
  inactiveReason?: string;

  preferences?: UserPreferences;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
