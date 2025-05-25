const amqp = require('amqplib');
const executeCode = require('../services/codeExecutor'); 
const CodeSnippet = require('../models/CodeSnippet'); 

async function startConsumer(queueName, io) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  console.log(`Waiting for messages in queue: ${queueName}`);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const { code, language, userId, requestId } = JSON.parse(msg.content.toString());
      console.log(`Received from queue "${queueName}":`, { code });

      try {
        const output = await executeCode(language, code);

        // Update DB record
        await CodeSnippet.findOneAndUpdate(
          { requestId },
          { output, status: 'completed' }
        );

        // Emit real-time result to frontend
        if (io) {
          io.to(requestId).emit('execution-complete', {
            requestId,
            status: 'completed',
            output,
          });
          console.log(`WebSocket emit done for requestId: ${requestId}`);
        }

        console.log(`Execution result: ${output}`);
      } catch (err) {
        const errorMsg = `Error: ${err.message}`;

        // Update DB with error
        await CodeSnippet.findOneAndUpdate(
          { requestId },
          { output: errorMsg, status: 'error' }
        );

        // Emit error via WebSocket
        if (io) {
          io.to(requestId).emit('execution-complete', {
            requestId,
            status: 'error',
            output: errorMsg,
          });
        }

        console.error('Execution failed:', errorMsg);
      }

      channel.ack(msg);
    }
  });
}

module.exports = startConsumer;
