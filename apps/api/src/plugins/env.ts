import fp from "fastify-plugin";
import { envSchema } from "../utils/env.js";

export default fp(async fastify => {
  const parsedEnv = envSchema.parse(process.env);
  fastify.decorate("config", {
    nodeEnv: parsedEnv.NODE_ENV,
    apiPort: parsedEnv.API_PORT,
    databaseUrl: parsedEnv.DATABASE_URL,
    uploadDir: parsedEnv.UPLOAD_DIR,
    publicBaseUrl: parsedEnv.PUBLIC_BASE_URL,
    hardCodedOwnerId: parsedEnv.HARD_CODED_OWNER_ID
  });
});
