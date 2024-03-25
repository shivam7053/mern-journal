// models/Comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entry: { type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
