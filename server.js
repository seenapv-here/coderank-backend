const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const codeRoutes = require('./src/routes/code.routes');
const authRoutes = require('./src/routes/auth.routes');


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Set up Socket.IO
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // Update this in production
    methods: ['GET', 'POST']
  }
});

// ✅ Make `io` available in routes/middleware/consumer
app.set('io', io);

// ✅ Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (requestId) => {
    socket.join(requestId);
    console.log(`Socket ${socket.id} joined room: ${requestId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startConsumers = require('./startConsumers');
startConsumers(io); // Pass io here

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10  // limit each IP to 10 requests per minute
});
app.use(limiter);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
