import type { LegacyChecklistItem, ChecklistSession, ChecklistDashboardStats } from '../types/checklist';
import { checklistExecutionService } from './checklist-execution.service';
import { checklistNonConformityService } from './checklist-nonconformity.service';
import { checklistTemplateService } from './checklist-template.service';
import { isExplicitMockMode } from '../config/data-source.config';

// ─────────────────────────────────────────────────────────────────────────────
// Módulo de Checklists — Serviço Unificado & Dashboard (Fase 4)
// ─────────────────────────────────────────────────────────────────────────────

export const checklistService = {
  // Novo Método: Indicadores gerais em tempo real da Fase 4
  async getChecklistDashboard(): Promise<ChecklistDashboardStats> {
    await new Promise((r) => setTimeout(r, 150));

    const executions = await checklistExecutionService.getChecklistExecutions();
    const ncs = await checklistNonConformityService.getNonConformities();
    const templates = await checklistTemplateService.getChecklistTemplates({ active: true });

    const today = new Date().toISOString().slice(0, 10);

    // Contagens
    const previstosHoje = isExplicitMockMode ? 6 : 0;
    const concluidosHoje = executions.filter((ex) => ex.completedAt && ex.completedAt.startsWith(today)).length;
    const atrasados = isExplicitMockMode ? 2 : 0;
    const execucoesComNaoConformidades = executions.filter((ex) => ex.status === 'concluido_com_nao_conformidade').length;

    const naoConformidadesCriticas = ncs.filter((nc) => nc.criticality === 'critica' && nc.status !== 'resolvida' && nc.status !== 'cancelada').length;
    const equipamentosBloqueados = ncs.filter((nc) => nc.blockedEquipment && nc.status !== 'resolvida' && nc.status !== 'cancelada').length;

    // Taxa de conformidade do mês (%)
    const totalConcluded = executions.filter((ex) => ex.status.startsWith('concluido')).length;
    const cleanConcluded = executions.filter((ex) => ex.status === 'concluido').length;
    const taxaConformidade = totalConcluded > 0 ? Math.round((cleanConcluded / totalConcluded) * 100) : 0;

    return {
      previstosHoje,
      concluidosHoje,
      atrasados,
      execucoesComNaoConformidades,
      naoConformidadesCriticas,
      equipamentosBloqueados,
      taxaConformidade,
      modelosAtivos: templates.length,
    };
  },

  // ─── Métodos Legados (Preservados para Retrocompatibilidade com testes antigos) ───
  async getItems(): Promise<LegacyChecklistItem[]> {
    if (!isExplicitMockMode) return [];
    return Promise.resolve([...checklistItems]);
  },

  async getSessions(equipmentId?: string): Promise<ChecklistSession[]> {
    if (!isExplicitMockMode) return [];
    if (equipmentId) {
      return Promise.resolve(mockSessions.filter((s) => s.equipmentId === equipmentId || s.equipmentId.includes(equipmentId)));
    }
    return Promise.resolve([...mockSessions]);
  },

  async createSession(session: ChecklistSession): Promise<ChecklistSession> {
    mockSessions.unshift(session);
    return Promise.resolve(session);
  },
};

// ─── Dados de Transição Legados ──────────────────────────────────────────────
export const checklistItems: LegacyChecklistItem[] = [
  { id: 1, description: 'Verificar nível de óleo do motor.', supply: 'Óleo 15W40', frequency: 'daily' },
  { id: 2, description: 'Verificação do nível do líquido do radiador.', supply: undefined, frequency: 'daily' },
  { id: 3, description: 'Verificar o nível de óleo de transmissão / sistema hidráulico.', supply: undefined, frequency: 'daily' },
  { id: 4, description: 'Drenar água e sujeira do filtro de combustível.', supply: undefined, frequency: 'daily' },
  { id: 5, description: 'Limpeza válvula de descarga de pó do filtro de ar.', supply: undefined, frequency: 'daily' },
  { id: 6, description: 'Limpe a grade frontal, o radiador, os resfriadores e o condensador do ar-condicionado.', supply: 'Ar ou água', frequency: 'daily' },
  { id: 7, description: 'Lubrifique o engate traseiro de três pontos (se equipado).', supply: 'Graxa NLGI 2', frequency: 'daily' },
  { id: 8, description: 'Verifique a condição dos pneus e da pressão de calibração.', supply: undefined, frequency: 'daily' },
  { id: 9, description: 'Verifique todas as luzes indicadoras e alarmes sonoros quanto ao funcionamento.', supply: undefined, frequency: 'daily' },
  { id: 10, description: 'O Ar condicionado estava desligado?', supply: undefined, frequency: 'daily' },
  { id: 11, description: 'Abastecimento foi realizado no dia anterior?', supply: undefined, frequency: 'daily' },
  { id: 12, description: 'Realize a limpeza da cabine.', supply: undefined, frequency: 'daily' },
  { id: 13, description: 'Calibrar pressão dos pneus.', supply: 'Tabela de pressão', frequency: 'weekly', weeklyNote: 'Segunda-Feira' },
  { id: 14, description: 'Verifique o aperto dos parafusos e porcas das rodas.', supply: undefined, frequency: 'weekly', weeklyNote: 'Segunda-Feira' },
];

const mockSessions: ChecklistSession[] = [
  {
    id: 'CHK-001',
    equipmentId: '1',
    equipmentName: 'TRATOR MASSEY 265 01 4x2',
    date: '2026-08-03',
    horimeter: 6798,
    timeSpentMinutes: 22,
    operatorName: 'João da Silva',
    responsibleName: 'Carlos Melo',
    items: checklistItems.map((item) => ({ itemId: item.id, status: 'ok' as const })),
    status: 'concluido',
  },
];
