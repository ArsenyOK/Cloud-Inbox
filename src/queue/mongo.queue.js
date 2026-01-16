const { QueueMessage } = require("../models/queueMessage.model");

class MongoQueue {
  async send(message) {
    await QueueMessage.create({ body: message });
  }

  async receive() {
    const doc = await QueueMessage.findOneAndUpdate(
      { status: "NEW" },
      { status: "PROCESSING", lockedAt: new Date() },
      { sort: { createdAt: 1 }, new: true }
    ).lean();

    if (!doc) return [];

    return [
      {
        Body: JSON.stringify(doc.body),
        ReceiptHandle: doc._id.toString(),
      },
    ];
  }

  async delete(message) {
    await QueueMessage.deleteOne({ _id: message.ReceiptHandle });
  }
}

module.exports = { MongoQueue };
