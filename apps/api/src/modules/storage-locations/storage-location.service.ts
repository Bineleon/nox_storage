import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import type { StorageLocationInput } from "@deco/shared";
import { StorageLocationRepository } from "./storage-location.repository.js";

export class StorageLocationConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageLocationConflictError";
  }
}

export class StorageLocationNotFoundError extends Error {
  constructor() {
    super("Storage location not found");
    this.name = "StorageLocationNotFoundError";
  }
}

export class StorageLocationService {
  private readonly repository: StorageLocationRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new StorageLocationRepository(prisma);
  }

  list() {
    return this.repository.findMany();
  }

  async create(input: StorageLocationInput) {
    try {
      return await this.repository.create(this.toCreateData(input));
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async update(id: string, input: StorageLocationInput) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new StorageLocationNotFoundError();
    }
    try {
      return await this.repository.update(id, this.toUpdateData(input));
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async delete(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new StorageLocationNotFoundError();
    }
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  private toCreateData(input: StorageLocationInput): Prisma.StorageLocationCreateInput {
    return {
      name: input.name,
      description: input.description ?? null,
      addressLine: input.addressLine,
      postalCode: input.postalCode,
      city: input.city
    };
  }

  private toUpdateData(input: StorageLocationInput): Prisma.StorageLocationUpdateInput {
    return this.toCreateData(input);
  }

  private mapPrismaError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003" || error.code === "P2014") {
        return new StorageLocationConflictError(
          "This storage location is used by inventory items and cannot be deleted."
        );
      }
    }
    throw error;
  }
}
