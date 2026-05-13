import { promises as fs } from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type { StorageService, StoredFile } from "./storage.interface.js";

export class LocalStorageService implements StorageService {
  constructor(private readonly baseDir: string, private readonly publicBaseUrl: string) {}

  async saveFile(input: {
    buffer: Uint8Array;
    originalName: string;
    mimeType: string;
    directory: string;
  }): Promise<StoredFile> {
    const folder = path.join(this.baseDir, input.directory);
    await fs.mkdir(folder, { recursive: true });

    const extension = path.extname(input.originalName);
    const filename = `${nanoid()}${extension}`;
    const filePath = path.join(folder, filename);

    await fs.writeFile(filePath, input.buffer);

    const urlPath = path.posix.join("uploads", input.directory, filename).replace(/\\/g, "/");
    return {
      filename,
      mimeType: input.mimeType,
      path: filePath,
      url: `${this.publicBaseUrl.replace(/\/$/, "")}/${urlPath}`
    };
  }

  async saveFiles(inputs: Array<{
    buffer: Uint8Array;
    originalName: string;
    mimeType: string;
    directory: string;
  }>): Promise<StoredFile[]> {
    const storedFiles: StoredFile[] = [];
    for (const input of inputs) {
      storedFiles.push(await this.saveFile(input));
    }
    return storedFiles;
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.rm(filePath, { force: true });
  }
}
