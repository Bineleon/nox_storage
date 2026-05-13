import type { FastifyReply, FastifyRequest } from "fastify";
import type { InventoryService } from "./inventory.service.js";
import { inventoryItemCreateSchema, inventoryItemIdParamsSchema, inventoryItemListQuery, inventoryItemUpdateSchema } from "./inventory.schemas.js";

export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  list = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = inventoryItemListQuery.parse(request.query ?? {});
    const items = await this.service.list(query);
    reply.send(items);
  };

  getById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = inventoryItemIdParamsSchema.parse(request.params);
    const item = await this.service.getById(id);
    if (!item) {
      reply.code(404).send({ message: "Inventory item not found" });
      return;
    }
    reply.send(item);
  };

  create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const input = inventoryItemCreateSchema.parse(request.body);
    const item = await this.service.create(input);
    reply.code(201).send(item);
  };

  update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = inventoryItemIdParamsSchema.parse(request.params);
    const input = inventoryItemUpdateSchema.parse(request.body);
    const item = await this.service.update(id, input);
    reply.send(item);
  };

  delete = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = inventoryItemIdParamsSchema.parse(request.params);
    await this.service.delete(id);
    reply.code(204).send();
  };

  uploadPhotos = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { id } = inventoryItemIdParamsSchema.parse(request.params);
    const files: Array<{ buffer: Uint8Array; originalName: string; mimeType: string }> = [];

    for await (const file of request.files()) {
      files.push({
        buffer: await file.toBuffer(),
        originalName: file.filename,
        mimeType: file.mimetype
      });
    }

    if (files.length === 0) {
      reply.code(400).send({ message: "At least one photo is required" });
      return;
    }

    const item = await this.service.addPhotos(id, files);
    reply.code(201).send(item);
  };
}
