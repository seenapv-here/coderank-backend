const amqp = require('amqplib');
const executeCode = require('../services/codeExecutor');

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'code_execution';
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    const { language, code } = JSON.parse(msg.content.toString());
    console.log(`Received message: ${language}`);

    try {
      const output = await executeCode(language, code);
      console.log('Execution Output:', output);
      // TODO: Save result to DB or use another queue for response
    } catch (err) {
      console.error('Error in execution:', err);
    }

    channel.ack(msg);
  });
}

startConsumer().catch(console.error);
