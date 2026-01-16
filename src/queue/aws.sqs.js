const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");

const client = new SQSClient({
  region: process.env.AWS_REGION,
});

class AwsSqsQueue {
  constructor(queueUrl) {
    this.queueUrl = queueUrl;
  }

  async send(message) {
    const cmd = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    });

    await client.send(cmd);
  }

  async receive() {
    const cmd = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10,
    });

    const res = await client.send(cmd);
    return res.Messages || [];
  }

  async delete(message) {
    const cmd = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    });

    await client.send(cmd);
  }
}

module.exports = { AwsSqsQueue };
