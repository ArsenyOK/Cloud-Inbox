const express = require("express");
const { z } = require("zod");
const { Task } = require("../models/task.model");

const taskRouter = express.Router();

const CreateTaskSchema = z.object({
  title: z.string().min(1, "title is required"),
  storageKey: z.string().optional(),
});

taskRouter.post("/", async (req, res, next) => {
  try {
    const body = CreateTaskSchema.parse(req.body);

    const task = await Task.create({
      title: body.title,
      storageKey: body.storageKey,
      status: "PENDING",
    });

    res.status(201).json({
      id: task._id.toString(),
      status: task.status,
    });
  } catch (err) {
    next(err);
  }
});

taskRouter.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({
      id: task._id.toString(),
      title: task.title,
      status: task.status,
      storageKey: task.storageKey,
      result: task.result,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = { taskRouter };
