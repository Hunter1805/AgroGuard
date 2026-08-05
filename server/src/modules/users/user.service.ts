import { UserRepository } from './user.repository';
import { AppError } from '../../shared/errors/AppError';
import { createPaginationMeta } from '../../shared/utils/pagination';

export class UserService {
  constructor(private repo: UserRepository) {}

  async listUsers(page?: number, pageSize?: number, query?: string) {
    const result = await this.repo.findUsers({ page, pageSize }, query);
    return {
      data: result.items,
      meta: createPaginationMeta(result.total, result.page, result.pageSize),
    };
  }

  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404, 'NOT_FOUND');
    }
    return user;
  }

  async createUser(data: { name: string; email: string; employeeCode?: string; type?: string }) {
    return this.repo.createUser(data);
  }

  async listRoles() {
    return this.repo.findRoles();
  }
}
