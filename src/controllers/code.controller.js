// controllers/code.controller.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const executeCode = require('../services/codeExecutor');
const CodeSnippet = require('../models/CodeSnippet');
const { v4: uuidv4 } = require('uuid');
const sendToQueue = require('../services/messageQueue'); // adjust path if needed

router.post('/execute', authMiddleware, async (req, res) => {
  const { language, code } = req.body;
  const userId = req.userId;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  const requestId = uuidv4();

  try {
    // Save the code snippet with "pending" status
    const snippet = new CodeSnippet({
      userId,
      language,
      code,
      result: 'Pending...',
      requestId
    });

    await snippet.save();

    // Send message to queue
    await sendToQueue(language, { code, requestId, userId });

    res.status(202).json({
      message: 'Code sent for execution',
      requestId
    });
  } catch (err) {
    console.error('Queue send error:', err);
    res.status(500).json({ error: 'Failed to queue code for execution' });
  }
});


router.get('/snippets', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const snippets = await CodeSnippet.find({ userId }).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});

module.exports = router;
