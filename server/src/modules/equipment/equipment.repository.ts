import { PrismaClient } from '@prisma/client';
import { parsePagination, type PaginationInput } from '../../shared/utils/pagination';

export class EquipmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findEquipments(organizationId: string, pagination: PaginationInput, query?: string) {
    const { skip, take, page, pageSize } = parsePagination(pagination);
    const where = {
      organizationId,
      archivedAt: null,
      ...(query ? { OR: [{ code: { contains: query, mode: 'insensitive' as const } }, { name: { contains: query, mode: 'insensitive' as const } }] } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.equipment.findMany({
        where,
        skip,
        take,
        include: {
          equipmentType: true,
          model: { include: { brand: true } },
          meters: true,
        },
        orderBy: { code: 'asc' },
      }),
      this.prisma.equipment.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string, organizationId: string) {
    return this.prisma.equipment.findFirst({
      where: { id, organizationId },
      include: {
        equipmentType: true,
        model: { include: { brand: true } },
        meters: { include: { meterReadings: { take: 10, orderBy: { readingDate: 'desc' } } } },
      },
    });
  }

  async findByCode(code: string, organizationId: string) {
    return this.prisma.equipment.findFirst({ where: { code, organizationId } });
  }

  async createEquipment(organizationId: string, data: { companyId: string; unitId: string; farmId?: string; equipmentTypeId: string; modelId: string; code: string; name: string; serialNumber?: string; manufactureYear?: number }) {
    const equipment = await this.prisma.equipment.create({
      data: {
        organizationId,
        companyId: data.companyId,
        unitId: data.unitId,
        farmId: data.farmId,
        equipmentTypeId: data.equipmentTypeId,
        modelId: data.modelId,
        code: data.code,
        name: data.name,
        serialNumber: data.serialNumber,
        manufactureYear: data.manufactureYear,
        status: 'operacional',
      },
    });

    // Medidor inicial: horímetro zerado (padrão da frota agrícola)
    await this.prisma.equipmentMeter.create({
      data: { equipmentId: equipment.id, meterType: 'horimetro', currentValue: 0, unit: 'h' },
    });

    return equipment;
  }

  async updateEquipment(id: string, data: { code?: string; name?: string; serialNumber?: string | null; manufactureYear?: number | null; status?: string; farmId?: string | null }) {
    return this.prisma.equipment.update({
      where: { id },
      data: {
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.serialNumber !== undefined ? { serialNumber: data.serialNumber } : {}),
        ...(data.manufactureYear !== undefined ? { manufactureYear: data.manufactureYear } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.farmId !== undefined ? { farmId: data.farmId } : {}),
      },
    });
  }

  async archiveEquipment(id: string, _reason?: string) {
    return this.prisma.equipment.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  }

  async createReadingTransaction(equipmentId: string, meterId: string, value: number, userId: string, version: number) {
    return this.prisma.$transaction(async (tx) => {
      const meter = await tx.equipmentMeter.findUnique({ where: { id: meterId } });
      if (!meter) throw new Error('Medidor não encontrado.');

      // Atualiza o valor do medidor e incrementa a versão (concorrência otimista)
      const updatedMeter = await tx.equipmentMeter.updateMany({
        where: { id: meterId, version },
        data: {
          currentValue: value,
          version: { increment: 1 },
        },
      });

      if (updatedMeter.count === 0) {
        throw new Error('OPTIMISTIC_LOCK_ERROR');
      }

      const reading = await tx.meterReading.create({
        data: {
          equipmentId,
          meterId,
          readingValue: value,
          readingDate: new Date(),
          readByUserId: userId,
        },
      });

      return { meter: updatedMeter, reading };
    });
  }
}
