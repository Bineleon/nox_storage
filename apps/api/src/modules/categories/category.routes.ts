import type { FastifyInstance } from "fastify";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";

export async function categoryRoutes(app: FastifyInstance): Promise<void> {
  const service = new CategoryService(app.prisma);
  const controller = new CategoryController(service);

  app.get("/categories", controller.list);
  app.post("/categories", controller.create);
  app.put("/categories/:id", controller.update);
  app.delete("/categories/:id", controller.delete);
}
