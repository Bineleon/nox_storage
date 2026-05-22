import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import type { CategoryInput } from "@deco/shared";
import { CategoryRepository } from "./category.repository.js";

export class CategoryConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryConflictError";
  }
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super("Category not found");
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryService {
  private readonly repository: CategoryRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new CategoryRepository(prisma);
  }

  list() {
    return this.repository.findMany();
  }

  async create(input: CategoryInput) {
    try {
      return await this.repository.create(input.name);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async update(id: string, input: CategoryInput) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new CategoryNotFoundError();
    }
    try {
      return await this.repository.update(id, input.name);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async delete(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new CategoryNotFoundError();
    }
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  private mapPrismaError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new CategoryConflictError("A category with this name already exists.");
      }
      if (error.code === "P2003" || error.code === "P2014") {
        return new CategoryConflictError(
          "This category is used by inventory items and cannot be deleted."
        );
      }
    }
    throw error;
  }
}
