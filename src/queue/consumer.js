const amqp = require('amqplib');
const executeCode = require('../services/codeExecutor'); 
const CodeSnippet = require('../models/CodeSnippet'); 

async function startConsumer(queueName) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  console.log(`Waiting for messages in queue: ${queueName}`);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      //const { code, language, userId } = JSON.parse(msg.content.toString());
      const { code, language, userId, requestId } = JSON.parse(msg.content.toString());
      console.log(`Received from queue "${queueName}":`, { code });

      try {
        const output = await executeCode(language, code);
        
        // Optionally save to DB
        if (userId) {
            const requestId = JSON.parse(msg.content.toString()).requestId;

            console.log(`Updating DB for userId: ${userId}, requestId: ${requestId}`);
            
            // Update the DB record with the result
            await CodeSnippet.findOneAndUpdate(
                { requestId },
                { output }
            );
        }

        console.log(`Execution result: ${output}`);
      } catch (err) {
        console.error('Execution failed:', err.message);
      }

      channel.ack(msg);
    }
  });
}

module.exports = startConsumer;
