import type { FastifyInstance } from "fastify";
import { StorageLocationController } from "./storage-location.controller.js";
import { StorageLocationService } from "./storage-location.service.js";

export async function storageLocationRoutes(app: FastifyInstance): Promise<void> {
  const service = new StorageLocationService(app.prisma);
  const controller = new StorageLocationController(service);

  app.get("/storage-locations", controller.list);
  app.post("/storage-locations", controller.create);
  app.put("/storage-locations/:id", controller.update);
  app.delete("/storage-locations/:id", controller.delete);
}
