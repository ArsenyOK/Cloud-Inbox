require("dotenv").config();
const { connectMongo } = require("../db/mongo");
const { Task } = require("../models/task.model");
const { createQueue } = require("../queue");

const queue = createQueue();

async function processMessage(msg) {
  const { taskId } = JSON.parse(msg.Body);

  const task = await Task.findById(taskId);
  if (!task) return;

  // idempotency check
  if (task.status !== "PENDING") return;

  task.status = "PROCESSING";
  await task.save();

  // simulate processing
  await new Promise((r) => setTimeout(r, 1500));

  task.status = "DONE";
  task.result = {
    processedAt: new Date(),
    info: "Processed by MongoQueue worker",
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
