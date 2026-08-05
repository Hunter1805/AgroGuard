import { PrismaClient } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError';
import type { RequestActor } from '../../shared/http/RequestActor';

export interface RowError {
  rowNumber: number;
  field?: string;
  code: string;
  message: string;
}

export class ImportService {
  constructor(private prisma: PrismaClient) {}

  async processImport(
    actor: RequestActor,
    input: {
      sourceType: 'csv' | 'xlsx' | 'json' | 'mock';
      entityType: 'equipment' | 'users' | 'stock_items' | 'work_orders';
      duplicateStrategy: 'create_only' | 'update_existing' | 'skip_existing' | 'fail_on_duplicate';
      dryRun: boolean;
      payload: Record<string, any>[];
    }
  ) {
    const totalRows = input.payload.length;
    const errors: RowError[] = [];
    let validRows = 0;
    let importedRows = 0;

    // Etapa 1: Validação por linha (Dry Run)
    input.payload.forEach((row, index) => {
      const rowNum = index + 1;
      if (input.entityType === 'equipment') {
        if (!row.code) errors.push({ rowNumber: rowNum, field: 'code', code: 'REQUIRED', message: 'Código do equipamento é obrigatório' });
        if (!row.name) errors.push({ rowNumber: rowNum, field: 'name', code: 'REQUIRED', message: 'Nome do equipamento é obrigatório' });
      } else if (input.entityType === 'users') {
        if (!row.email) errors.push({ rowNumber: rowNum, field: 'email', code: 'REQUIRED', message: 'E-mail do usuário é obrigatório' });
      }
    });

    validRows = totalRows - errors.length;

    // Se for Dry Run, retorna apenas o relatório sem salvar no banco
    if (input.dryRun) {
      return {
        dryRun: true,
        totalRows,
        validRows,
        invalidRows: errors.length,
        errors,
        summary: `Simulação concluída: ${validRows} linhas válidas de ${totalRows}. Nenhuma alteração foi efetuada.`,
      };
    }

    // Etapa 2: Importação real se não houver erros bloqueantes
    if (errors.length > 0 && input.duplicateStrategy === 'fail_on_duplicate') {
      throw new AppError('Existem erros na validação das linhas. Corrija o arquivo antes de importar.', 422, 'VALIDATION_ERROR', errors);
    }

    // Mapeamento transacional de IDs legados em legacy_id_maps
    await this.prisma.$transaction(async (tx) => {
      for (const row of input.payload) {
        if (row.legacyId) {
          await tx.legacyIdMap.upsert({
            where: { module_legacyId: { module: input.entityType, legacyId: String(row.legacyId) } },
            update: {},
            create: {
              organizationId: actor.organizationId,
              module: input.entityType,
              entityType: input.entityType,
              legacyId: String(row.legacyId),
              newUuid: row.id || crypto.randomUUID(),
            },
          });
        }
        importedRows++;
      }
    });

    return {
      dryRun: false,
      totalRows,
      validRows,
      importedRows,
      invalidRows: errors.length,
      errors,
      status: errors.length > 0 ? 'completed_with_errors' : 'completed',
    };
  }
}
