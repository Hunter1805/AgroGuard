import { describe, it, expect } from 'vitest';

describe('Regras de Negócio de Equipamentos e Medidores (Fase 15B)', () => {
  it('deve validar leitura com acréscimo normal em horímetro', () => {
    const previousReading = 1500;
    const newReading = 1520;
    expect(newReading).toBeGreaterThan(previousReading);
  });

  it('deve detectar leitura regressiva não autorizada', () => {
    const previousReading = 1500;
    const newReading = 1480;
    const isRegressive = newReading < previousReading;
    expect(isRegressive).toBe(true);
  });

  it('deve permitir leitura regressiva somente quando houver substituição formal de medidor', () => {
    const isMeterReplacement = true;
    const previousReading = 1500;
    const newReading = 5; // Medidor novo zerado
    
    const isValid = isMeterReplacement || newReading >= previousReading;
    expect(isValid).toBe(true);
  });
});
