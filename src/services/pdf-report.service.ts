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

const ACCENT: [number, number, number] = [22, 163, 74]; // verde AgroGuard
const DARK: [number, number, number] = [15, 23, 42]; // slate-900
const GRAY_TEXT: [number, number, number] = [100, 116, 139]; // slate-500
const LIGHT_ROW: [number, number, number] = [241, 245, 249]; // slate-100

const fmtBR = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function formatCell(value: unknown, format?: string): string {
  if (value === null || value === undefined || value === '') return '—';
  switch (format) {
    case 'currency': {
      const n = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d,.-]/g, '').replace(',', '.'));
      return Number.isFinite(n) ? money.format(n) : String(value);
    }
    case 'percentage':
      return `${value}%`;
    default:
      return String(value);
  }
}

export async function generateReportPdf(tableData: ReportTableData, options: PdfReportOptions): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14; // margem

  const visibleCols = tableData.columns.filter(c => c.visible);
  const today = fmtBR.format(new Date());
  const org = options.organizationName || 'AgroGuard · Gestão de Ativos';

  const drawHeaderBand = () => {
    // Faixa superior escura
    doc.setFillColor(...DARK);
    doc.rect(0, 0, pageW, 26, 'F');
    // Acento verde
    doc.setFillColor(...ACCENT);
    doc.rect(0, 26, pageW, 1.4, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(options.reportName, M, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text(`${org}  ·  ${options.periodText || 'Período completo'}`, M, 19);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.text(today, pageW - M, 12, { align: 'right' });
    if (options.userName) {
      doc.setTextColor(148, 163, 184);
      doc.text(`Emitido por: ${options.userName}`, pageW - M, 19, { align: 'right' });
    }
  };

  const drawFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(M, pageH - 10, pageW - M, pageH - 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY_TEXT);
      doc.text(`AgroGuard · Relatório gerado automaticamente em ${today}`, M, pageH - 6);
      doc.text(`Página ${i} de ${pageCount}`, pageW - M, pageH - 6, { align: 'right' });
    }
  };

  // ===== Página 1: cabeçalho + resumo =====
  drawHeaderBand();

  const summaryCards: { label: string; value: string }[] = [
    { label: 'Registros', value: String(tableData.totalRows ?? tableData.rows.length) },
    ...visibleCols
      .filter(c => c.format === 'currency' || c.format === 'number')
      .slice(0, 3)
      .map(c => {
        const nums = tableData.rows
          .map(r => (typeof r[c.id] === 'number' ? (r[c.id] as number) : parseFloat(String(r[c.id] ?? '').replace(/[^\d,.-]/g, '').replace(',', '.'))))
          .filter(Number.isFinite);
        const sum = nums.reduce((a, b) => a + b, 0);
        return { label: `Total ${c.label}`, value: c.format === 'currency' ? money.format(sum) : String(sum) };
      }),
  ];

  // Cards de resumo
  let cx = M;
  const cardW = Math.min(58, (pageW - M * 2 - 6 * (summaryCards.length - 1)) / summaryCards.length);
  summaryCards.forEach(card => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(cx, 34, cardW, 16, 1.5, 1.5, 'F');
    doc.setFillColor(...ACCENT);
    doc.rect(cx, 34, 1.2, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY_TEXT);
    doc.text(card.label.toUpperCase(), cx + 4, 40);
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(card.value, cx + 4, 46.5);
    cx += cardW + 6;
  });

  // ===== Tabela =====
  autoTable(doc, {
    startY: 58,
    margin: { left: M, right: M, top: 32 },
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
      if (doc.getCurrentPageInfo().pageNumber > 1) drawHeaderBand();
    },
  });

  drawFooter();

  const fileName = `${options.reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
