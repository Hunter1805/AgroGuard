export function formatCurrency(value?: string | number): string {
  if (value === undefined || value === null) return 'R$ 0,00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(num) ? 0 : num);
}

export function formatQuantity(value?: string | number, decimals = 2): string {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(isNaN(num) ? 0 : num);
}

export function formatMeterReading(value?: string | number, unit = 'h'): string {
  if (value === undefined || value === null) return `0 ${unit}`;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(isNaN(num) ? 0 : num)} ${unit}`;
}
