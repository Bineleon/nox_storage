import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import envPlugin from "./plugins/env.js";
import prismaPlugin from "./plugins/prisma.js";
import uploadPlugin from "./plugins/upload.js";
import { categoryRoutes } from "./modules/categories/category.routes.js";
import { inventoryRoutes } from "./modules/inventory/inventory.routes.js";
import { storageLocationRoutes } from "./modules/storage-locations/storage-location.routes.js";

export async function createApp() {
  const app = Fastify({ logger: true });

  // Some clients send Content-Type: application/json on DELETE with no body; Fastify rejects that.
  app.addHook("onRequest", async request => {
    if (
      (request.method === "DELETE" || request.method === "GET" || request.method === "HEAD") &&
      request.headers["content-type"]?.includes("application/json") &&
      (!request.headers["content-length"] || request.headers["content-length"] === "0")
    ) {
      delete request.headers["content-type"];
    }
  });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  });
  await app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024,
      files: 10
    }
  });
  await app.register(envPlugin);
  await app.register(prismaPlugin);
  await app.register(uploadPlugin);
  await app.register(categoryRoutes);
  await app.register(storageLocationRoutes);
  await app.register(inventoryRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
