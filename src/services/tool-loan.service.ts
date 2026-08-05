import type { ToolLoan, ToolLoanFilter, ToolLoanItem } from '../types/tool-loan';
import { toolsService } from './tools.service';

let mockLoans: ToolLoan[] = [
  {
    id: 'LOAN-001',
    code: 'EMP-2026-001',
    status: 'atrasado',
    borrowerName: 'Carlos Silva (Mecânico)',
    borrowerTeam: 'Equipe de Manutenção Pesada',
    workOrderId: 'OS-2026-089',
    workOrderCode: 'OS-089',
    equipmentName: 'TRATOR MASSEY FERGUSON 265 01',
    locationOfUse: 'Oficina Central — Campo 04',
    checkoutDate: '2026-07-28T08:00:00Z',
    expectedReturnDate: '2026-08-01T17:00:00Z', // Vencido em 01/08
    responsibleCheckoutId: 'RESP-01',
    responsibleCheckoutName: 'Roberto Alves',
    items: [
      {
        id: 'LITEM-001',
        toolId: 'TOOL-002',
        toolCode: 'FER-002',
        toolName: 'Multímetro Digital Automotivo CAT III',
        quantity: 1,
        returnedQuantity: 0,
        conditionAtCheckout: 'boa',
      },
    ],
    notes: 'Retirada para diagnóstico de falha no alternador',
  },
  {
    id: 'LOAN-002',
    code: 'EMP-2026-002',
    status: 'ativo',
    borrowerName: 'Marcos Souza (Operador)',
    borrowerTeam: 'Equipe de Colheita',
    workOrderId: 'OS-2026-092',
    workOrderCode: 'OS-092',
    equipmentName: 'COLHEDEIRA JOHN DEERE S680',
    locationOfUse: 'Frente de Colheita — Talhão 12',
    checkoutDate: '2026-08-04T07:30:00Z',
    expectedReturnDate: '2026-08-06T18:00:00Z',
    responsibleCheckoutId: 'RESP-01',
    responsibleCheckoutName: 'Roberto Alves',
    items: [
      {
        id: 'LITEM-002',
        toolId: 'TOOL-003',
        toolCode: 'FER-003',
        toolName: 'Jogo de Chave Combinada (6mm a 32mm)',
        quantity: 2,
        returnedQuantity: 0,
        conditionAtCheckout: 'boa',
      },
    ],
    notes: 'Aperto de esteiras e facas da plataforma',
  },
];

export const toolLoanService = {
  async getToolLoans(filter?: ToolLoanFilter): Promise<ToolLoan[]> {
    let result = [...mockLoans];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        l =>
          l.code.toLowerCase().includes(q) ||
          l.borrowerName.toLowerCase().includes(q) ||
          (l.workOrderCode && l.workOrderCode.toLowerCase().includes(q)) ||
          l.items.some(i => i.toolName.toLowerCase().includes(q) || i.toolCode.toLowerCase().includes(q))
      );
    }

    if (filter?.status && filter.status !== 'todos') {
      result = result.filter(l => l.status === filter.status);
    }

    if (filter?.workOrderId) {
      result = result.filter(l => l.workOrderId === filter.workOrderId);
    }

    if (filter?.overdueOnly) {
      const nowStr = new Date().toISOString();
      result = result.filter(l => l.status !== 'concluido' && l.status !== 'cancelado' && l.expectedReturnDate < nowStr);
    }

    return Promise.resolve(result);
  },

  async getToolLoanById(id: string): Promise<ToolLoan | undefined> {
    const loan = mockLoans.find(l => l.id === id || l.code === id);
    return Promise.resolve(loan ? { ...loan } : undefined);
  },

  async createToolLoan(params: {
    borrowerName: string;
    borrowerTeam?: string;
    workOrderId?: string;
    workOrderCode?: string;
    equipmentId?: string;
    equipmentName?: string;
    locationOfUse?: string;
    expectedReturnDate: string;
    responsibleCheckoutName: string;
    items: { toolId: string; quantity: number; notes?: string }[];
    notes?: string;
  }): Promise<ToolLoan> {
    const loanId = `LOAN-${String(mockLoans.length + 1).padStart(3, '0')}`;
    const code = `EMP-2026-${String(mockLoans.length + 1).padStart(3, '0')}`;

    const loanItems: ToolLoanItem[] = [];

    for (const itemParam of params.items) {
      const tool = await toolsService.getToolById(itemParam.toolId);
      if (!tool) throw new Error(`Ferramenta ID ${itemParam.toolId} não encontrada.`);

      if (tool.availableQuantity < itemParam.quantity) {
        throw new Error(`Quantidade indisponível para a ferramenta ${tool.name}. Disponível: ${tool.availableQuantity}`);
      }

      if (tool.status === 'baixada' || tool.status === 'perdida' || tool.status === 'em_manutencao') {
        throw new Error(`A ferramenta ${tool.name} está indisponível para empréstimo (Status: ${tool.status}).`);
      }

      // Atualiza disponibilidade da ferramenta
      const newAvail = Math.max(0, tool.availableQuantity - itemParam.quantity);
      const newStatus = tool.controlType === 'individual' ? 'emprestada' : newAvail === 0 ? 'emprestada' : tool.status;

      await toolsService.updateTool(tool.id, {
        availableQuantity: newAvail,
        status: newStatus,
        currentResponsibleName: params.borrowerName,
      });

      loanItems.push({
        id: `LITEM-${Date.now()}-${Math.random()}`,
        toolId: tool.id,
        toolCode: tool.code,
        toolName: tool.name,
        quantity: itemParam.quantity,
        returnedQuantity: 0,
        conditionAtCheckout: tool.condition,
        notes: itemParam.notes,
      });
    }

    const newLoan: ToolLoan = {
      id: loanId,
      code,
      status: 'ativo',
      borrowerName: params.borrowerName,
      borrowerTeam: params.borrowerTeam,
      workOrderId: params.workOrderId,
      workOrderCode: params.workOrderCode,
      equipmentId: params.equipmentId,
      equipmentName: params.equipmentName,
      locationOfUse: params.locationOfUse,
      checkoutDate: new Date().toISOString(),
      expectedReturnDate: params.expectedReturnDate,
      responsibleCheckoutId: 'RESP-01',
      responsibleCheckoutName: params.responsibleCheckoutName,
      items: loanItems,
      notes: params.notes,
    };

    mockLoans.unshift(newLoan);
    return Promise.resolve(newLoan);
  },

  async registerToolReturn(params: {
    loanId: string;
    responsibleReturnName: string;
    itemsReturn: { itemId: string; returnedQuantity: number; conditionAtReturn: string; hasDamage?: boolean; hasLoss?: boolean; notes?: string }[];
    notes?: string;
  }): Promise<ToolLoan> {
    const loan = await this.getToolLoanById(params.loanId);
    if (!loan) throw new Error('Empréstimo não encontrado.');

    let allFullyReturned = true;

    for (const ret of params.itemsReturn) {
      const item = loan.items.find(i => i.id === ret.itemId);
      if (item) {
        item.returnedQuantity += ret.returnedQuantity;
        item.conditionAtReturn = ret.conditionAtReturn;

        const tool = await toolsService.getToolById(item.toolId);
        if (tool) {
          const restoredQty = Math.min(tool.totalQuantity, tool.availableQuantity + ret.returnedQuantity);
          let newStatus = tool.status;

          if (ret.hasDamage) {
            newStatus = 'danificada';
          } else if (ret.hasLoss) {
            newStatus = 'perdida';
          } else if (restoredQty > 0 && tool.status === 'emprestada') {
            newStatus = 'disponivel';
          }

          await toolsService.updateTool(tool.id, {
            availableQuantity: restoredQty,
            status: newStatus,
            currentResponsibleName: undefined,
          });
        }

        if (item.returnedQuantity < item.quantity) {
          allFullyReturned = false;
        }
      }
    }

    loan.status = allFullyReturned ? 'concluido' : 'parcialmente_devolvido';
    loan.actualReturnDate = new Date().toISOString();
    loan.responsibleReturnName = params.responsibleReturnName;

    return Promise.resolve(loan);
  },

  async extendToolLoan(loanId: string, newExpectedDate: string, notes?: string): Promise<ToolLoan> {
    const loan = await this.getToolLoanById(loanId);
    if (!loan) throw new Error('Empréstimo não encontrado.');

    loan.expectedReturnDate = newExpectedDate;
    if (loan.status === 'atrasado') {
      loan.status = 'ativo';
    }
    loan.notes = `${loan.notes || ''} [Prorrogado até ${new Date(newExpectedDate).toLocaleDateString('pt-BR')}: ${notes || ''}]`;

    return Promise.resolve(loan);
  },
};
