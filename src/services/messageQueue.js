const amqp = require('amqplib');

const QUEUE_NAME = 'code_execution_queue';

async function sendToQueue(language, payload) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  const message = {
    language,
    code: payload.code,
    requestId: payload.requestId,
    userId: payload.userId
  };

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });

  setTimeout(() => {
    channel.close();
    conn.close();
  }, 500);
}

module.exports = sendToQueue;
