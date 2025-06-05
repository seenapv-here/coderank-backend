// startConsumers.js
const startConsumer = require('./src/queue/consumer');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

module.exports = (io) => {
  startConsumer('python', io);
  startConsumer('javascript', io);
};
