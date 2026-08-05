import { describe, it, expect } from 'vitest';
import { LocalFileStorageProvider } from '../src/shared/storage/local-storage.provider';
import fs from 'fs';
import path from 'path';

describe('LocalFileStorageProvider Tests', () => {
  const testDir = './uploads-test';
  const provider = new LocalFileStorageProvider(testDir);

  it('deve realizar upload de arquivo e gerar chave de storage', async () => {
    const result = await provider.upload({
      filename: 'teste-foto.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-content'),
      folder: 'equipment',
    });

    expect(result.storageKey).toContain('equipment/');
    expect(await provider.exists(result.storageKey)).toBe(true);

    // Cleanup
    await provider.delete(result.storageKey);
    expect(await provider.exists(result.storageKey)).toBe(false);

    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
});
