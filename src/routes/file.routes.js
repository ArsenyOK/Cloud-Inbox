const express = require("express");
const { z } = require("zod");
const crypto = require("crypto");
const { createStorage } = require("../storage");

const fileRouter = express.Router();
const storage = createStorage();

const PresignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

fileRouter.post("/presign", async (req, res, next) => {
  try {
    const body = PresignSchema.parse(req.body);

    const safeName = body.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const id = crypto.randomUUID();
    const storageKey = `uploads/${id}-${safeName}`;

    await storage.ensureContainerExists();

    const uploadUrl = await storage.createUploadUrl(
      storageKey,
      body.contentType
    );

    res.json({ uploadUrl, storageKey });
  } catch (err) {
    next(err);
  }
});

module.exports = { fileRouter };
