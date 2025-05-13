// controllers/code.controller.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const executeCode = require('../services/codeExecutor');
const CodeSnippet = require('../models/CodeSnippet');

router.post('/execute', authMiddleware, async (req, res) => {
  const { language, code } = req.body;
  const userId = req.userId;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  try {
    const result = await executeCode(language, code);

    const snippet = new CodeSnippet({
      userId,
      language,
      code,
      result,
    });

    await snippet.save();

    res.json({ output: result });
  } catch (err) {
    console.error('Execution error:', err);
    res.status(500).json({ error: 'Code execution failed' });
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
