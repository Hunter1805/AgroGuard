import type { FileStorageProvider } from './storage.provider';
import { LocalFileStorageProvider } from './local-storage.provider';
import { SupabaseStorageProvider } from './supabase-storage.provider';

export function getFileStorageProvider(): FileStorageProvider {
  const provider = process.env.UPLOAD_PROVIDER || 'local';

  if (provider === 'supabase') {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'agroguard-files';

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('⚠️ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes. Utilizando LocalFileStorageProvider como fallback de segurança.');
      return new LocalFileStorageProvider(process.env.UPLOAD_PATH || './uploads');
    }

    return new SupabaseStorageProvider(supabaseUrl, serviceRoleKey, bucket);
  }

  return new LocalFileStorageProvider(process.env.UPLOAD_PATH || './uploads');
}
