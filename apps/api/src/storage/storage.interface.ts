export interface StoredFile {
  filename: string;
  mimeType: string;
  path: string;
  url: string;
}

export interface StorageService {
  saveFile(input: {
    buffer: Uint8Array;
    originalName: string;
    mimeType: string;
    directory: string;
  }): Promise<StoredFile>;
  saveFiles(inputs: Array<{
    buffer: Uint8Array;
    originalName: string;
    mimeType: string;
    directory: string;
  }>): Promise<StoredFile[]>;
  deleteFile(filePath: string): Promise<void>;
}
