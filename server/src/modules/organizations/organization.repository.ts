import { PrismaClient } from '@prisma/client';

export class OrganizationRepository {
  constructor(private prisma: PrismaClient) {}

  async findOrganizations(organizationId: string) {
    if (!organizationId) return [];
    return this.prisma.organization.findMany({
      where: { id: organizationId },
      include: {
        companies: {
          include: {
            units: {
              include: {
                farms: true,
              },
            },
          },
        },
      },
    });
  }

  async findOrganizationById(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        companies: {
          include: {
            units: {
              include: {
                farms: true,
              },
            },
          },
        },
      },
    });
  }

  async createCompany(data: { organizationId: string; code: string; name: string; corporateName?: string; tradeName?: string; cnpj?: string }) {
    return this.prisma.company.create({
      data,
    });
  }
}
