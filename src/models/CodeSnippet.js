const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  output: { type: String },
  requestId: { type: String }, 
  status: { type: String, enum: ['pending', 'completed', 'error'], default: 'pending' },
}, { timestamps: true }); //This adds createdAt and updatedAt

module.exports = mongoose.model('CodeSnippet', CodeSnippetSchema);
