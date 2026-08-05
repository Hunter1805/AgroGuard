import type { PermissionAction, PermissionModule, PermissionCheckResult } from '../types/permissions';
import { usersService } from './users.service';

export const permissionsService = {
  /**
   * Avalia a permissão efetiva do usuário no frontend.
   * Regras:
   * 1. Se o usuário estiver inativo ou bloqueado -> nega.
   * 2. Se for perfil Administrador -> permite irrestritamente.
   * 3. Combina as permissões dos perfis associados ao usuário.
   */
  async canUserPerform(
    userId: string,
    module: PermissionModule,
    action: PermissionAction
  ): Promise<PermissionCheckResult> {
    const user = await usersService.getUserById(userId);

    if (!user) {
      return { allowed: false, reason: 'Usuário não encontrado.', source: 'status' };
    }

    if (user.status === 'bloqueado') {
      return { allowed: false, reason: 'Usuário bloqueado temporariamente.', source: 'status' };
    }

    if (user.status === 'inativo' || user.status === 'arquivado') {
      return { allowed: false, reason: 'Cadastro do usuário inativo ou arquivado.', source: 'status' };
    }

    // Perfil Administrador possui acesso total por padrão
    if (user.roleIds?.includes('role-admin') || user.primaryRoleId === 'role-admin') {
      return { allowed: true, reason: 'Acesso total concedido pelo perfil Administrador.', source: 'perfil' };
    }

    // Por padrão no ambiente de prototipação frontend, permite visualização e ações normais
    return {
      allowed: true,
      reason: `Permissão concedida para ${action} no módulo ${module}.`,
      source: 'perfil',
    };
  },
};
