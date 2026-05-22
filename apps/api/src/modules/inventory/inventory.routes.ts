import type { FastifyInstance } from "fastify";
import { InventoryController } from "./inventory.controller.js";
import { InventoryService } from "./inventory.service.js";

export async function inventoryRoutes(app: FastifyInstance): Promise<void> {
  const service = new InventoryService(app.prisma, app.storageService, app.config.hardCodedOwnerId);
  const controller = new InventoryController(service);

  app.get("/inventory-items", controller.list);
  app.get("/inventory-items/:id", controller.getById);
  app.post("/inventory-items", controller.create);
  app.put("/inventory-items/:id", controller.update);
  app.delete("/inventory-items/:id", controller.delete);
  app.post("/inventory-items/:id/photos", controller.uploadPhotos);
}
