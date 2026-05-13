import type { FastifyInstance } from "fastify";
import { InventoryController } from "./inventory.controller.js";
import { InventoryService } from "./inventory.service.js";

export async function inventoryRoutes(app: FastifyInstance): Promise<void> {
  const service = new InventoryService(app.prisma, app.storageService, app.config.hardCodedOwnerId);
  const controller = new InventoryController(service);

  app.get("/categories", async (_request, reply) => {
    const rows = await app.prisma.category.findMany({ orderBy: { name: "asc" } });
    reply.send(rows);
  });

  app.get("/storage-locations", async (_request, reply) => {
    const rows = await app.prisma.storageLocation.findMany({ orderBy: { name: "asc" } });
    reply.send(rows);
  });

  app.get("/inventory-items", controller.list);
  app.get("/inventory-items/:id", controller.getById);
  app.post("/inventory-items", controller.create);
  app.put("/inventory-items/:id", controller.update);
  app.delete("/inventory-items/:id", controller.delete);
  app.post("/inventory-items/:id/photos", controller.uploadPhotos);
}
