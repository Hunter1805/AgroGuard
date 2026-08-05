export interface UploadFileInput {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  folder?: string;
}

export interface StoredFile {
  storageKey: string;
  publicUrl?: string;
}

export interface FileStorageProvider {
  upload(input: UploadFileInput): Promise<StoredFile>;
  getDownloadUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
  delete(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
}
