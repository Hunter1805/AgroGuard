import type { FileStorageProvider } from './storage.provider';
import { LocalFileStorageProvider } from './local-storage.provider';
import { SupabaseStorageProvider } from './supabase-storage.provider';
import { env } from '../../config/env';

export function getFileStorageProvider(): FileStorageProvider {
  const provider = process.env.UPLOAD_PROVIDER || 'local';

  if (provider === 'supabase') {
    const supabaseUrl = env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'agroguard-files';

    // Fail-fast: apenas os NOMES das variáveis ausentes são reportados — nunca valores.
    if (!supabaseUrl || !serviceRoleKey) {
      const missing: string[] = [];
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      throw new Error(
        `CRITICAL CONFIGURATION ERROR: provider de storage 'supabase' requer as variáveis: ${missing.join(', ')}. ` +
          'Nenhum fallback para chaves anon é aplicado.'
      );
    }

    return new SupabaseStorageProvider(supabaseUrl, serviceRoleKey, bucket);
  }

  return new LocalFileStorageProvider(process.env.UPLOAD_PATH || './uploads');
}
