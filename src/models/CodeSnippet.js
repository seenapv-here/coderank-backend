const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  output: { type: String },
  requestId: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodeSnippet', CodeSnippetSchema);
