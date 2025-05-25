const amqp = require('amqplib');

async function sendToQueue(language, message) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queueName = language.toLowerCase(); // Match what consumers use

  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

  console.log(`Message sent to ${queueName}:`, message);

  await channel.close();
  await connection.close();
}

module.exports = { sendToQueue };
