// controllers/code.controller.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const CodeSnippet = require('../models/CodeSnippet');
const { v4: uuidv4 } = require('uuid');
const { sendToQueue } = require('../queue/producer'); // Make sure this path is correct

// POST /execute — Send code to RabbitMQ
router.post('/execute', authMiddleware, async (req, res) => {
  const { language, code } = req.body;
  const userId = req.userId;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  const requestId = uuidv4();

  try {
    // Save snippet to DB with 'Pending...' result
    const snippet = new CodeSnippet({
      userId,
      language,
      code,
      output: 'Pending...',
      status: 'pending',
      requestId,
    });

    await snippet.save();

    console.log(`Sending to queue: ${language}, with requestId: ${requestId}`);

    // Send to RabbitMQ queue
    await sendToQueue(language, { language, code, requestId, userId });
    console.log(`Sent to queue: ${language}, with requestId: ${requestId}`);

    res.status(202).json({
      message: 'Code sent for execution',
      requestId,
    });
  } catch (err) {
    console.error('Queue send error:', err);
    res.status(500).json({ error: 'Failed to queue code for execution' });
  }
});

// GET /snippets — Return all user snippets
router.get('/snippets', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const snippets = await CodeSnippet.find({ userId }).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});

// GET /status/:requestId — check execution status by requestId
router.get('/status/:requestId', authMiddleware, async (req, res) => {
  const { requestId } = req.params;
  const userId = req.userId;
  console.log(`Checking status for requestId: ${requestId}, userId: ${userId}`);

  try {
    const snippet = await CodeSnippet.findOne({ requestId, userId });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    res.json({
      status: snippet.status,
      output: snippet.output
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const snippets = await CodeSnippet.find({ userId })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
