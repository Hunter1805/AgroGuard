import { OrganizationRepository } from './organization.repository';
import { AppError } from '../../shared/errors/AppError';
import type { RequestActor } from '../../shared/http/RequestActor';

export class OrganizationService {
  constructor(private repo: OrganizationRepository) {}

  async listOrganizations(actor?: RequestActor) {
    const orgId = actor?.organizationId;
    if (!orgId) return [];
    return this.repo.findOrganizations(orgId);
  }

  async getOrganizationDetail(id: string, actor?: RequestActor) {
    if (!actor || actor.organizationId !== id) {
      throw new AppError('Acesso negado a recursos de outra organização.', 403, 'ACCESS_DENIED');
    }
    const org = await this.repo.findOrganizationById(id);
    if (!org) {
      throw new AppError('Organização não encontrada.', 404, 'NOT_FOUND');
    }
    return org;
  }
}
