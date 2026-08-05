import { PrismaClient } from '@prisma/client';
import { parsePagination, type PaginationInput } from '../../shared/utils/pagination';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findUsers(pagination: PaginationInput, query?: string) {
    const { skip, take, page, pageSize } = parsePagination(pagination);
    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { email: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createUser(data: { name: string; email: string; employeeCode?: string; type?: string }) {
    return this.prisma.user.create({ data });
  }

  async findRoles() {
    return this.prisma.role.findMany({ where: { active: true } });
  }
}
