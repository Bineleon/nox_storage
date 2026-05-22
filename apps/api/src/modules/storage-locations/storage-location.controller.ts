import type { FastifyReply, FastifyRequest } from "fastify";
import {
  StorageLocationConflictError,
  StorageLocationNotFoundError,
  StorageLocationService
} from "./storage-location.service.js";
import {
  storageLocationIdParamsSchema,
  storageLocationInputSchema
} from "./storage-location.schemas.js";

export class StorageLocationController {
  constructor(private readonly service: StorageLocationService) {}

  list = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const rows = await this.service.list();
    reply.send(rows);
  };

  create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const input = storageLocationInputSchema.parse(request.body);
    try {
      const row = await this.service.create(input);
      reply.code(201).send(row);
    } catch (error) {
      this.handleError(error, reply);
    }
  };

  update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = storageLocationIdParamsSchema.parse(request.params);
    const input = storageLocationInputSchema.parse(request.body);
    try {
      const row = await this.service.update(id, input);
      reply.send(row);
    } catch (error) {
      this.handleError(error, reply);
    }
  };

  delete = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = storageLocationIdParamsSchema.parse(request.params);
    try {
      await this.service.delete(id);
      reply.code(204).send();
    } catch (error) {
      this.handleError(error, reply);
    }
  };

  private handleError(error: unknown, reply: FastifyReply): void {
    if (error instanceof StorageLocationNotFoundError) {
      reply.code(404).send({ message: error.message });
      return;
    }
    if (error instanceof StorageLocationConflictError) {
      reply.code(409).send({ message: error.message });
      return;
    }
    throw error;
  }
}
