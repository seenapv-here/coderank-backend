const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  requestId: { type: String }, 
  status: { type: String, enum: ['pending', 'completed', 'error'], default: 'pending' },
  outputPath: String, // <-- Store file path or S3 key here
}, { timestamps: true }); //This adds createdAt and updatedAt

module.exports = mongoose.model('CodeSnippet', CodeSnippetSchema);
