import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Carrega primeiro o .env da raiz (padrões compartilhados) e depois o .env do próprio
// server, que tem precedência — evita que o servidor use um DATABASE_URL local (Docker)
// quando a configuração real do backend (ex.: Supabase) está em server/.env.
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://agroguard:agroguard_dev_password@localhost:5432/agroguard_db?schema=public'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  API_BASE_URL: z.string().default('http://localhost:3333'),
  LOG_LEVEL: z.string().default('info'),
  UPLOAD_PROVIDER: z.enum(['local', 'supabase']).default('local'),
  SUPABASE_URL: z.string().optional(),
  // Fase 17S: nunca preencher por fallback. Obrigatória apenas quando operações
  // administrativas (Auth Admin / Storage privado) são realmente solicitadas.
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_ISSUER: z.string().optional(),
  SUPABASE_JWKS_URL: z.string().optional(),
  MOCK_ACTOR_ENABLED: z.string().transform((val) => val === 'true').default('false'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  // Não imprimir valores recebidos — apenas os nomes dos campos inválidos.
  const invalidKeys = Object.keys(_env.error.format()).filter((k) => k !== '_errors');
  console.error('❌ Variáveis de ambiente inválidas (campos):', invalidKeys.join(', '));
  throw new Error('Configuração de ambiente incorreta.');
}

if (_env.data.NODE_ENV === 'production' && _env.data.MOCK_ACTOR_ENABLED) {
  throw new Error('CRITICAL SECURITY ERROR: MOCK_ACTOR_ENABLED não pode estar ativado em ambiente de PRODUÇÃO.');
}

// Fase 17S — Postura fail-closed para a credencial administrativa:
//  * NÃO existe mais nenhum valor hardcoded.
//  * NÃO existe fallback para chaves anon (VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY).
//    Chave anon não concede privilégios de service_role e mascara má configuração.
//  * O valor é lido APENAS de SUPABASE_SERVICE_ROLE_KEY.
const serviceRoleKey = _env.data.SUPABASE_SERVICE_ROLE_KEY;

export const env = {
  ..._env.data,
  SUPABASE_URL: _env.data.SUPABASE_URL, // sem default hardcoded
  SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey, // sem fallback para chaves anon
};

/**
 * Indica se operações administrativas no Supabase (Auth Admin / Storage privado)
 * estão habilitadas — ou seja, URL e service_role foram explicitamente configuradas.
 *
 * Nunca lança nem imprime valores; apenas reflete a presença da configuração.
 */
export function hasAdminSupabaseConfig(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Fail-fast: verifica a presença das variáveis exigidas para operações administrativas
 * ANTES de executar a operação. Identifica apenas os NOMES ausentes — nunca os valores.
 */
export function assertAdminSupabaseConfig(context: string): void {
  const missing: string[] = [];
  if (!env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missing.length > 0) {
    throw new Error(
      `CRITICAL CONFIGURATION ERROR: operação administrativa do Supabase em '${context}' requer as variáveis: ${missing.join(', ')}. ` +
        'Configure-as no ambiente do servidor backend (nunca no bundle web do frontend).'
    );
  }
}
