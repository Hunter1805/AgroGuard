import type { StockItem } from '../types/parts';

export const stockCalculationService = {
  /**
   * Calcula a quantidade disponível (Atual - Reservada)
   */
  calculateAvailableQuantity(currentQuantity: number, reservedQuantity: number): number {
    const available = currentQuantity - reservedQuantity;
    return available < 0 ? 0 : available;
  },

  /**
   * Calcula o novo Custo Médio Ponderado na entrada de mercadoria:
   * Novo Custo Médio = (Valor Atual do Estoque + Valor da Nova Entrada) / (Quantidade Atual + Quantidade Entrada)
   */
  calculateNewAverageCost(
    currentQuantity: number,
    currentAverageCost: number,
    entryQuantity: number,
    entryUnitCost: number
  ): number {
    const totalCurrentValue = currentQuantity * currentAverageCost;
    const totalEntryValue = entryQuantity * entryUnitCost;
    const totalQuantity = currentQuantity + entryQuantity;

    if (totalQuantity <= 0) return entryUnitCost;

    const newAverageCost = (totalCurrentValue + totalEntryValue) / totalQuantity;
    return Number(newAverageCost.toFixed(4));
  },

  /**
   * Valida se uma quantidade pode ser movimentada considerando se o item aceita decimais
   */
  validateQuantity(item: StockItem, quantity: number): { valid: boolean; message?: string } {
    if (quantity <= 0) {
      return { valid: false, message: 'A quantidade deve ser maior que zero.' };
    }

    if (!item.allowsFractionalQuantity && !Number.isInteger(quantity)) {
      return { valid: false, message: `O item ${item.name} não permite quantidades fracionadas.` };
    }

    return { valid: true };
  },

  /**
   * Valida se há saldo disponível suficiente para uma saída ou reserva
   */
  validateOutputAvailability(item: StockItem, requestedQuantity: number): { valid: boolean; message?: string } {
    if (item.status === 'bloqueado' || item.status === 'arquivado') {
      return { valid: false, message: `O item ${item.name} está ${item.status.toUpperCase()} e não pode ser movimentado.` };
    }

    if (requestedQuantity > item.availableQuantity) {
      return {
        valid: false,
        message: `Quantidade solicitada (${requestedQuantity} ${item.controlUnit}) supera o estoque disponível (${item.availableQuantity} ${item.controlUnit}).`,
      };
    }

    return { valid: true };
  },

  /**
   * Atualiza os campos calculados de um item (disponível, valor total do estoque, status automático)
   */
  updateCalculatedItemFields(item: StockItem): StockItem {
    const availableQuantity = this.calculateAvailableQuantity(item.currentQuantity, item.reservedQuantity);
    const totalStockValue = Number((item.currentQuantity * item.averageCost).toFixed(2));

    let status = item.status;
    if (status !== 'bloqueado' && status !== 'descontinuado' && status !== 'arquivado' && status !== 'inativo') {
      if (item.currentQuantity <= 0) {
        status = 'sem_estoque';
      } else if (item.currentQuantity <= item.minimumQuantity) {
        status = 'estoque_baixo';
      } else {
        status = 'ativo';
      }
    }

    return {
      ...item,
      availableQuantity,
      totalStockValue,
      status,
      updatedAt: new Date().toISOString(),
    };
  },
};
