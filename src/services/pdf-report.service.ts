/**
 * Serviço de geração de PDF profissional para relatórios.
 * Layout corporativo: capa com título em destaque, faixa colorida,
 * cards de resumo, tabela zebrada e rodapé paginado.
 * jsPDF/jspdf-autotable são importados dinamicamente (code-splitting).
 */
import type { ReportTableData } from '../types/reports';

export interface PdfReportOptions {
  reportName: string;
  periodText?: string;
  userName?: string;
  organizationName?: string;
}

/** Card de resumo exibido abaixo da faixa de cabeçalho. */
interface SummaryCard {
  label: string;
  value: string;
}

const ACCENT: [number, number, number] = [22, 163, 74]; // verde AgroGuard
const DARK: [number, number, number] = [15, 23, 42]; // slate-900
const GRAY_TEXT: [number, number, number] = [100, 116, 139]; // slate-500
const LIGHT_ROW: [number, number, number] = [241, 245, 249]; // slate-100
const M = 14; // margem
const HEADER_BAND_H = 26;
const TABLE_START_Y = 58;
const CARD_TOP_Y = 34;
const CARD_H = 16;
const CARD_GAP = 6;

const fmtBR = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function parseCurrencyValue(value: unknown): number {
  if (typeof value === 'number') return value;
  return parseFloat(String(value ?? '').replace(/[^\d,.-]/g, '').replace(',', '.'));
}

function formatCell(value: unknown, format?: string): string {
  if (value === null || value === undefined || value === '') return '—';
  switch (format) {
    case 'currency': {
      const n = parseCurrencyValue(value);
      return Number.isFinite(n) ? money.format(n) : String(value);
    }
    case 'percentage':
      return `${value}%`;
    default:
      return String(value);
  }
}

/**
 * Monta os cards de resumo a partir dos dados da tabela: total de registros
 * mais a soma das primeiras 3 colunas numéricas/monetárias.
 */
export function buildSummaryCards(tableData: ReportTableData): SummaryCard[] {
  const numericCols = tableData.columns
    .filter(c => c.visible)
    .filter(c => c.format === 'currency' || c.format === 'number')
    .slice(0, 3);

  return [
    { label: 'Registros', value: String(tableData.totalRows ?? tableData.rows.length) },
    ...numericCols.map(c => {
      const sum = tableData.rows
        .map(r => parseCurrencyValue(r[c.id]))
        .filter(Number.isFinite)
        .reduce((a, b) => a + b, 0);
      return {
        label: `Total ${c.label}`,
        value: c.format === 'currency' ? money.format(sum) : String(sum),
      };
    }),
  ];
}

/** Desenha a faixa escura de cabeçalho com título, organização e data. */
function drawHeaderBand(
  doc: any,
  pageW: number,
  title: string,
  subtitle: string,
  dateText: string,
  userName?: string
): void {
  // Faixa superior escura
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, HEADER_BAND_H, 'F');
  // Acento verde
  doc.setFillColor(...ACCENT);
  doc.rect(0, HEADER_BAND_H, pageW, 1.4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title, M, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(subtitle, M, 19);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text(dateText, pageW - M, 12, { align: 'right' });
  if (userName) {
    doc.setTextColor(148, 163, 184);
    doc.text(`Emitido por: ${userName}`, pageW - M, 19, { align: 'right' });
  }
}

/** Desenha os cards de resumo a partir da margem esquerda. */
function drawSummaryCards(doc: any, pageW: number, cards: SummaryCard[]): void {
  if (cards.length === 0) return;

  const cardW = Math.min(58, (pageW - M * 2 - CARD_GAP * (cards.length - 1)) / cards.length);
  let cx = M;

  cards.forEach(card => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(cx, CARD_TOP_Y, cardW, CARD_H, 1.5, 1.5, 'F');
    doc.setFillColor(...ACCENT);
    doc.rect(cx, CARD_TOP_Y, 1.2, CARD_H, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(card.label.toUpperCase(), cx + 4, 40);
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(card.value, cx + 4, 46.5);
    cx += cardW + CARD_GAP;
  });
}

/** Desenha a linha e a paginação no rodapé de todas as páginas. */
function drawFooter(doc: any, pageW: number, pageH: number, dateText: string): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(M, pageH - 10, pageW - M, pageH - 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(`AgroGuard · Relatório gerado automaticamente em ${dateText}`, M, pageH - 6);
    doc.text(`Página ${i} de ${pageCount}`, pageW - M, pageH - 6, { align: 'right' });
  }
}

/** Slug seguro para o nome do arquivo (sem acentos, barras ou espaços). */
function toFileSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Gera e baixa o PDF do relatório. Apenas orquestra: monta os dados,
 * desenha as faixas/cards/tabela e salva o arquivo.
 */
export async function generateReportPdf(tableData: ReportTableData, options: PdfReportOptions): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const visibleCols = tableData.columns.filter(c => c.visible);
  const today = fmtBR.format(new Date());
  const org = options.organizationName || 'AgroGuard · Gestão de Ativos';
  const subtitle = `${org}  ·  ${options.periodText || 'Período completo'}`;

  const drawHeader = () => drawHeaderBand(doc, pageW, options.reportName, subtitle, today, options.userName);

  // ===== Página 1: cabeçalho + resumo =====
  drawHeader();
  drawSummaryCards(doc, pageW, buildSummaryCards(tableData));

  // ===== Tabela =====
  autoTable(doc, {
    startY: TABLE_START_Y,
    margin: { left: M, right: M, top: HEADER_BAND_H + 6 },
    head: [visibleCols.map(c => c.label)],
    body: tableData.rows.map(row => visibleCols.map(c => formatCell(row[c.id], c.format))),
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.2,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: DARK,
    },
    headStyles: {
      fillColor: DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 2.6,
    },
    alternateRowStyles: { fillColor: LIGHT_ROW },
    tableLineColor: [226, 232, 240],
    // Repete a faixa de cabeçalho em cada página
    didDrawPage: () => {
      if (doc.getCurrentPageInfo().pageNumber > 1) drawHeader();
    },
  });

  drawFooter(doc, pageW, pageH, today);

  const slug = toFileSlug(options.reportName);
  doc.save(`${slug || 'relatorio'}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
