import type { PrismaClient } from "@prisma/client";
import type { StorageService } from "../storage/storage.interface.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    storageService: StorageService;
    config: {
      nodeEnv: string;
      apiPort: number;
      databaseUrl: string;
      uploadDir: string;
      publicBaseUrl: string;
      hardCodedOwnerId: string;
    };
  }
}

export {};
