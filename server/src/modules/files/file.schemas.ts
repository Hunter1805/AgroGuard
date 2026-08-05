import { z } from 'zod';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const fileCategorySchema = z.enum([
  'equipment_photo',
  'equipment_document',
  'meter_reading_photo',
  'checklist_photo',
  'non_conformity_photo',
  'maintenance_attachment',
  'work_order_attachment',
  'tire_photo',
  'tool_photo',
  'supplier_document',
  'stock_document',
  'report_export',
]);
