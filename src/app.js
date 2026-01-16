const express = require("express");
const pinoHttp = require("pino-http");

const { errorHandler } = require("./middleware/error");
const { healthRouter } = require("./routes/health.routes");

function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp());

  app.use("/health", healthRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };