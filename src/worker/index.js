require("dotenv").config();
const { connectMongo } = require("../db/mongo");
const { Task } = require("../models/task.model");
const { createQueue } = require("../queue");
const { createStorage } = require("../storage");

const queue = createQueue();
const storage = createStorage();

async function processMessage(msg) {
  const { taskId } = JSON.parse(msg.Body);

  const task = await Task.findById(taskId);
  if (!task) return;

  // idempotency check
  if (task.status !== "PENDING") return;

  task.status = "PROCESSING";
  await task.save();

  let fileInfo = null;
  let preview = null;

  if (task.storageKey) {
    // 1) read blob metadata
    fileInfo = await storage.getBlobInfo(task.storageKey);

    // 2) if it's a text file, download a small preview
    if ((fileInfo.contentType || "").startsWith("text/")) {
      preview = await storage.downloadTextPreview(task.storageKey, 200);
    }
  }

  task.status = "DONE";
  task.result = {
    processedAt: new Date(),
    info: "Processed uploaded file",
    file: fileInfo,
    preview,
  };

  await task.save();
}

async function startWorker() {
  await connectMongo();
  console.log("👷 Worker started (MongoQueue)");

  while (true) {
    const messages = await queue.receive();

    for (const msg of messages) {
      try {
        await processMessage(msg);
        await queue.delete(msg);
      } catch (err) {
        console.error("Worker error:", err);
      }
    }

    await new Promise((r) => setTimeout(r, 300));
  }
}

startWorker().catch((err) => {
  console.error(err);
  process.exit(1);
});
