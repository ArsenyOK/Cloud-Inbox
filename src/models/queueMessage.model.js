const mongoose = require("mongoose");

const QueueMessageSchema = new mongoose.Schema(
  {
    body: { type: Object, required: true },

    status: {
      type: String,
      enum: ["NEW", "PROCESSING"],
      default: "NEW",
      index: true,
    },

    lockedAt: { type: Date },
  },
  { timestamps: true }
);

const QueueMessage = mongoose.model("QueueMessage", QueueMessageSchema);

module.exports = { QueueMessage };
