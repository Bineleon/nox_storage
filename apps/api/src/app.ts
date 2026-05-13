import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import envPlugin from "./plugins/env.js";
import prismaPlugin from "./plugins/prisma.js";
import uploadPlugin from "./plugins/upload.js";
import { inventoryRoutes } from "./modules/inventory/inventory.routes.js";

export async function createApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024,
      files: 10
    }
  });
  await app.register(envPlugin);
  await app.register(prismaPlugin);
  await app.register(uploadPlugin);
  await app.register(inventoryRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
