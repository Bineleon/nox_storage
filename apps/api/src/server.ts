import { createApp } from "./app.js";

const app = await createApp();

const start = async (): Promise<void> => {
  const address = await app.listen({
    port: app.config.apiPort,
    host: "0.0.0.0"
  });

  app.log.info(`API listening on ${address}`);
};

start().catch(async error => {
  app.log.error(error);
  await app.close();
  process.exit(1);
});
