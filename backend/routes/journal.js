const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Create a new journal entry
router.post('/entries', authMiddleware, upload.single('pdf'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const fileUrl = req.file.path;
    const author = req.userId; // Extracted from JWT token in authMiddleware
    const entry = new JournalEntry({ title, content, author, fileUrl });
    await entry.save();
    res.status(201).json({ message: 'Journal entry created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all journal entries
router.get('/entries', async (req, res) => {
  try {
    const entries = await JournalEntry.find().populate('author', 'username');
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
