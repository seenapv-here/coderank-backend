const startConsumer = require('./src/queue/consumer');

// // Start consumers for both languages
// startConsumer('python');
// startConsumer('javascript');

//const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
//const startConsumer = require('.src/queue/consumer');

dotenv.config();
connectDB();

// mongoose.connect('mongodb://localhost:27017/coderank', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('✅ Connected to MongoDB from Consumer');

  // Start consumers after DB connection is established
  startConsumer('python');
  startConsumer('javascript');
// }).catch(err => {
//   console.error('❌ MongoDB connection error in Consumer:', err);
// });

