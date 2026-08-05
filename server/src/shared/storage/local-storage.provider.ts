import fs from 'fs';
import path from 'path';
import type { FileStorageProvider, UploadFileInput, StoredFile } from './storage.provider';

export class LocalFileStorageProvider implements FileStorageProvider {
  private uploadDir: string;

  constructor(uploadDir = './uploads') {
    this.uploadDir = path.resolve(uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(input: UploadFileInput): Promise<StoredFile> {
    const subfolder = input.folder ? path.join(this.uploadDir, input.folder) : this.uploadDir;
    if (!fs.existsSync(subfolder)) {
      fs.mkdirSync(subfolder, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${input.filename}`;
    const filePath = path.join(subfolder, uniqueName);

    await fs.promises.writeFile(filePath, input.buffer);

    const storageKey = input.folder ? `${input.folder}/${uniqueName}` : uniqueName;
    return {
      storageKey,
      publicUrl: `/uploads/${storageKey}`,
    };
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    return `/uploads/${storageKey}`;
  }

  async delete(storageKey: string): Promise<void> {
    const filePath = path.join(this.uploadDir, storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, storageKey);
    return fs.existsSync(filePath);
  }
}
