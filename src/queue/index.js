/* Need to connect when AWS connected */

// const { AwsSqsQueue } = require("./aws.sqs");

// function createQueue() {
//   if (process.env.CLOUD === "aws") {
//     return new AwsSqsQueue(process.env.AWS_SQS_QUEUE_URL);
//   }

//   throw new Error("Queue provider not configured");
// }

const { MongoQueue } = require("./mongo.queue");

// Using MongoDB as queue provider
function createQueue() {
  return new MongoQueue();
}

module.exports = { createQueue };
