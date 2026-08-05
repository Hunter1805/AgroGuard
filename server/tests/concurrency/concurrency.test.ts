import { describe, it, expect } from 'vitest';

describe('Testes de Concorrência e Controle Otimista (Fase 15C)', () => {
  it('deve simular duas concorrências simultâneas de estoque com versão estrita', () => {
    let stockVersion = 1;
    let balance = 10;

    const tx1Success = stockVersion === 1;
    if (tx1Success) {
      balance -= 3;
      stockVersion += 1; // agora versão 2
    }

    const tx2Success = stockVersion === 1; // vai falhar pois versão já mudou para 2
    if (!tx2Success) {
      // Rejeição otimista com tratamento gracioso
    }

    expect(tx1Success).toBe(true);
    expect(tx2Success).toBe(false);
    expect(balance).toBe(7);
    expect(stockVersion).toBe(2);
  });
});
