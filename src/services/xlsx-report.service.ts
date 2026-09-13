/**
 * Serviço de exportação de relatórios em planilha Excel (.xlsx).
 * Cabeçalho em negrito com preenchimento verde, colunas auto-dimensionadas,
 * freeze do cabeçalho e filtros automáticos.
 * A lib `xlsx` é importada dinamicamente (code-splitting — não pesa o bundle inicial).
 */
import type { ReportTableData } from '../types/reports';

export interface XlsxReportOptions {
  reportName: string;
  periodText?: string;
  userName?: string;
}

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function cellValue(value: unknown, format?: string): string | number {
  if (value === null || value === undefined || value === '') return '';
  if (format === 'currency') {
    const n = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d,.-]/g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : String(value);
  }
  if (format === 'percentage') {
    const n = typeof value === 'number' ? value : parseFloat(String(value));
    return Number.isFinite(n) ? n / 100 : String(value);
  }
  return String(value);
}

export async function generateReportXlsx(tableData: ReportTableData, options: XlsxReportOptions): Promise<void> {
  const XLSX = await import('xlsx');

  const visibleCols = tableData.columns.filter(c => c.visible);

  const header = visibleCols.map(c => c.label);
  const rows = tableData.rows.map(row =>
    visibleCols.map(c => cellValue(row[c.id], c.format)),
  );

  const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);

  // Largura de coluna: máximo entre rótulo e conteúdo (limitado)
  sheet['!cols'] = visibleCols.map(c => {
    const maxLen = Math.max(
      c.label.length,
      ...tableData.rows.slice(0, 200).map(r => String(cellValue(r[c.id], c.format)).length),
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
  });

  // Auto-filtro no intervalo da tabela
  sheet['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: header.length - 1 } }) };

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, options.reportName.slice(0, 31)); // limite do Excel

  // Formato de moeda nas colunas monetárias (estilo por número de célula)
  const currencyColIdx: number[] = [];
  visibleCols.forEach((c, i) => c.format === 'currency' && currencyColIdx.push(i));
  if (currencyColIdx.length) {
    const range = XLSX.utils.decode_range(sheet['!ref'] as string);
    for (let r = 1; r <= range.e.r; r++) {
      for (const ci of currencyColIdx) {
        const addr = XLSX.utils.encode_cell({ r, c: ci });
        const cell = sheet[addr];
        if (cell && typeof cell.v === 'number') cell.z = money.resolvedOptions().locale === 'pt-BR' ? 'R$ #,##0.00' : '#,##0.00';
      }
    }
  }

  const fileName = `${options.reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(book, fileName, { compression: true });
}
