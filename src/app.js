const express = require("express");
const pinoHttp = require("pino-http");

const { errorHandler } = require("./middleware/error");
const { healthRouter } = require("./routes/health.routes");
const { taskRouter } = require("./routes/task.routes");
const { fileRouter } = require("./routes/file.routes");
const { connectMongo } = require("./db/mongo");

async function createApp() {
  await connectMongo();

  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp());

  app.use("/", healthRouter);
  app.use("/tasks", taskRouter);
  app.use("/files", fileRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
