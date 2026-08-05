import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { FileStorageProvider, UploadFileInput, StoredFile } from './storage.provider';

export class SupabaseStorageProvider implements FileStorageProvider {
  private client: SupabaseClient;
  private bucket: string;

  constructor(supabaseUrl: string, serviceRoleKey: string, bucket = 'agroguard-files') {
    this.client = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    this.bucket = bucket;
  }

  async upload(input: UploadFileInput): Promise<StoredFile> {
    const folderPath = input.folder ? `${input.folder}/` : '';
    const uniqueName = `${folderPath}${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${input.filename}`;

    const { data, error } = await this.client.storage
      .from(this.bucket)
      .upload(uniqueName, input.buffer, {
        contentType: input.mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Falha no upload para o Supabase Storage: ${error.message}`);
    }

    return {
      storageKey: data.path,
    };
  }

  async getDownloadUrl(storageKey: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(storageKey, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`Falha ao gerar URL assinada do Supabase: ${error?.message}`);
    }

    return data.signedUrl;
  }

  async delete(storageKey: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .remove([storageKey]);

    if (error) {
      throw new Error(`Falha ao remover arquivo do Supabase: ${error.message}`);
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    const folder = storageKey.includes('/') ? storageKey.substring(0, storageKey.lastIndexOf('/')) : '';
    const filename = storageKey.includes('/') ? storageKey.substring(storageKey.lastIndexOf('/') + 1) : storageKey;

    const { data, error } = await this.client.storage
      .from(this.bucket)
      .list(folder, { search: filename });

    if (error || !data) return false;
    return data.some(item => item.name === filename);
  }
}
