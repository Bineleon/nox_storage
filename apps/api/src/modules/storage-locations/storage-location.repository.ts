import type { Prisma, PrismaClient } from "@prisma/client";

export class StorageLocationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findMany() {
    return this.prisma.storageLocation.findMany({ orderBy: { name: "asc" } });
  }

  findById(id: string) {
    return this.prisma.storageLocation.findUnique({ where: { id } });
  }

  create(data: Prisma.StorageLocationCreateInput) {
    return this.prisma.storageLocation.create({ data });
  }

  update(id: string, data: Prisma.StorageLocationUpdateInput) {
    return this.prisma.storageLocation.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.storageLocation.delete({ where: { id } });
  }
}
