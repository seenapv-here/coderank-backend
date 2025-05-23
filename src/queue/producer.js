const amqp = require('amqplib');

async function sendToQueue(language, code) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'code_execution';
  await channel.assertQueue(queue, { durable: true });

  const message = JSON.stringify({ language, code });
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

  console.log(`Message sent to queue: ${message}`);

  setTimeout(() => {
    connection.close();
  }, 500);
}

module.exports = sendToQueue;
