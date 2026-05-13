import fp from "fastify-plugin";
import staticPlugin from "@fastify/static";
import { promises as fs } from "node:fs";
import { LocalStorageService } from "../storage/local-storage.service.js";

export default fp(async fastify => {
  await fs.mkdir(fastify.config.uploadDir, { recursive: true });
  await fastify.register(staticPlugin, {
    root: fastify.config.uploadDir,
    prefix: "/uploads/"
  });

  const storageService = new LocalStorageService(fastify.config.uploadDir, fastify.config.publicBaseUrl);
  fastify.decorate("storageService", storageService);
});
