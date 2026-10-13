import { loadConfig } from "./config.mjs";
import { createServer } from "./app.mjs";
const config = loadConfig();
const server = createServer(config);
server.requestTimeout = 35000;
server.headersTimeout = 10000;
server.listen(config.port, config.production ? "0.0.0.0" : "127.0.0.1", () => {
  console.log(
    `Portfolio server listening on port ${config.port}; OpenAI ${config.apiKey ? "configured" : "not configured"}; model ${config.model}`,
  );
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    server.close();
    server.closeIdleConnections();
  });
