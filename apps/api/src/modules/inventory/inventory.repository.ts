import type { Prisma, PrismaClient } from "@prisma/client";

export class InventoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findMany(where: Prisma.InventoryItemWhereInput = {}) {
    return this.prisma.inventoryItem.findMany({
      where,
      include: {
        category: true,
        storageLocation: true,
        photos: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  findById(id: string) {
    return this.prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        category: true,
        storageLocation: true,
        photos: true
      }
    });
  }

  create(data: Prisma.InventoryItemCreateInput) {
    return this.prisma.inventoryItem.create({
      data,
      include: {
        category: true,
        storageLocation: true,
        photos: true
      }
    });
  }

  update(id: string, data: Prisma.InventoryItemUpdateInput) {
    return this.prisma.inventoryItem.update({
      where: { id },
      data,
      include: {
        category: true,
        storageLocation: true,
        photos: true
      }
    });
  }

  delete(id: string) {
    return this.prisma.inventoryItem.delete({ where: { id } });
  }

  addPhotos(inventoryItemId: string, urls: string[]) {
    return this.prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: {
        photos: {
          create: urls.map(url => ({ url }))
        }
      },
      include: {
        category: true,
        storageLocation: true,
        photos: true
      }
    });
  }
}
