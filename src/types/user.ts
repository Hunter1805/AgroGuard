export interface UserProfile {
  id: string;
  name: string;
  role: string;
  unit: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  avatarUrl?: string;
}
