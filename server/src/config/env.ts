import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_ISSUER: z.string().optional(),
  SUPABASE_JWKS_URL: z.string().optional(),
  MOCK_ACTOR_ENABLED: z.string().transform((val) => val === 'true').default('false'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Variáveis de ambiente inválidas:', _env.error.format());
  throw new Error('Configuração de ambiente incorreta.');
}

if (_env.data.NODE_ENV === 'production' && _env.data.MOCK_ACTOR_ENABLED) {
  throw new Error('CRITICAL SECURITY ERROR: MOCK_ACTOR_ENABLED não pode estar ativado em ambiente de PRODUÇÃO.');
}

export const env = {
  ..._env.data,
  SUPABASE_URL:
    _env.data.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://poihrnbinlgehvrbrkwu.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY:
    _env.data.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaWhybmJpbmxnZWh2cmJya3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTkzOTc4OSwiZXhwIjoyMTAxNTE1Nzg5fQ.p8pNlxpLNm047aTmsjaJmf5MH5lbcEjOUBVYgj-heEI',
};
