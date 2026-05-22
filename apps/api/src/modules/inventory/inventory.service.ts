import type { PrismaClient } from "@prisma/client";
import type { InventoryItemInput, InventoryItemListQuery } from "@deco/shared";
import { InventoryRepository } from "./inventory.repository.js";
import type { StorageService } from "../../storage/storage.interface.js";

export class InventoryService {
  private readonly repository: InventoryRepository;

  constructor(
    prisma: PrismaClient,
    private readonly storageService: StorageService,
    private readonly ownerId: string
  ) {
    this.repository = new InventoryRepository(prisma);
  }

  list(query: InventoryItemListQuery) {
    return this.repository.findMany({
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.storageLocationId ? { storageLocationId: query.storageLocationId } : {}),
      ...(query.visibility ? { visibility: query.visibility } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
              { commentaire: { contains: query.search, mode: "insensitive" } },
              { operatingLocation: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    });
  }

  getById(id: string) {
    return this.repository.findById(id);
  }

  create(input: InventoryItemInput) {
    return this.repository.create({
      name: input.name,
      description: input.description ?? null,
      quantity: input.quantity,
      heightCm: input.heightCm ?? null,
      widthCm: input.widthCm ?? null,
      lengthCm: input.lengthCm ?? null,
      operatingLocation: input.operatingLocation ?? null,
      condition: input.condition,
      commentaire: input.commentaire ?? null,
      visibility: input.visibility,
      status: input.status,
      category: { connect: { id: input.categoryId } },
      storageLocation: { connect: { id: input.storageLocationId } },
      owner: { connect: { id: this.ownerId } }
    });
  }

  update(id: string, input: InventoryItemInput) {
    return this.repository.update(id, {
      name: input.name,
      description: input.description ?? null,
      quantity: input.quantity,
      heightCm: input.heightCm ?? null,
      widthCm: input.widthCm ?? null,
      lengthCm: input.lengthCm ?? null,
      operatingLocation: input.operatingLocation ?? null,
      condition: input.condition,
      commentaire: input.commentaire ?? null,
      visibility: input.visibility,
      status: input.status,
      category: { connect: { id: input.categoryId } },
      storageLocation: { connect: { id: input.storageLocationId } }
    });
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  async addPhotos(id: string, files: Array<{ buffer: Uint8Array; originalName: string; mimeType: string }>) {
    const storedFiles = await this.storageService.saveFiles(
      files.map(file => ({
        buffer: file.buffer,
        originalName: file.originalName,
        mimeType: file.mimeType,
        directory: "inventory-items"
      }))
    );

    return this.repository.addPhotos(id, storedFiles.map(file => file.url));
  }
}
