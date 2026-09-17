#!/usr/bin/env node
/**
 * Fase 17S — Verificação de segurança do bundle frontend.
 *
 * Falha (exit 1) se o bundle em `dist/` contiver indicadores de credencial
 * administrativa ou segredos. NÃO imprime os valores encontrados — apenas o
 * nome do arquivo e o padrão violado, para não vazar segredos em CI/logs.
 *
 * Uso:  node scripts/verify-bundle-secrets.mjs
 * Requer que `npm run build` tenha sido executado antes.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Padrões PROIBIDOS no bundle web do frontend.
// Cada item: rótulo (sem valor) + regex.
const FORBIDDEN = [
  { label: 'payload service_role', re: /"role"\s*:\s*"service_role"/ },
  { label: 'nome de var administrativa', re: /SUPABASE_SERVICE_ROLE_KEY/ },
  { label: 'string service_role', re: /service_role/ },
];

const distDir = join(process.cwd(), 'dist');
if (!existsSync(distDir)) {
  console.error('❌ Diretório "dist" não encontrado. Rode `npm run build` primeiro.');
  process.exit(1);
}

function collectJsFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectJsFiles(full, acc);
    else if (/\.(js|mjs|cjs)$/.test(entry)) acc.push(full);
  }
  return acc;
}

const files = collectJsFiles(distDir);
const violations = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  for (const { label, re } of FORBIDDEN) {
    if (re.test(content)) {
      // Nunca logar o conteúdo — apenas o arquivo e o rótulo.
      violations.push(`${file.replace(distDir, 'dist')} → ${label}`);
    }
  }
}

if (violations.length > 0) {
  console.error('❌ Bundle contém indicadores proibidos:');
  for (const v of violations) console.error(`   - ${v}`);
  console.error('\nAção: verifique as variáveis de build do frontend. NUNCA inclua service_role nele.');
  process.exit(1);
}

console.log(`✅ Bundle limpo: ${files.length} arquivo(s) JS verificado(s), nenhum segredo administrativo encontrado.`);
process.exit(0);
