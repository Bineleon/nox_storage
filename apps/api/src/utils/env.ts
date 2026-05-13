import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  UPLOAD_DIR: z.string().min(1).default("./uploads"),
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:4000"),
  HARD_CODED_OWNER_ID: z.string().uuid().default("00000000-0000-0000-0000-000000000001")
});

export type Env = z.infer<typeof envSchema>;
