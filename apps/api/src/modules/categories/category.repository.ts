import type { PrismaClient } from "@prisma/client";

export class CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findMany() {
    return this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  create(name: string) {
    return this.prisma.category.create({ data: { name } });
  }

  update(id: string, name: string) {
    return this.prisma.category.update({ where: { id }, data: { name } });
  }

  delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
