// const mongoose = require('mongoose');

// const journalEntrySchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   fileUrl: { type: String, required: true },
//   isReviewed: { type: Boolean, default: false },
//   // Add more fields as needed
// }, { timestamps: true });

// module.exports = mongoose.model('JournalEntry', journalEntrySchema);


// models/JournalEntry.js

const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pdfFilename: { type: String, required: true },
  isReviewed: { type: Boolean, default: false },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewComments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
