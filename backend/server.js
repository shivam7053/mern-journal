// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const journalRoutes = require('./routes/journal');
// const authMiddleware = require('./middleware/auth');

// dotenv.config();
// const app = express();
// app.use(express.json());

// app.use('/auth', authRoutes);
// app.use(authMiddleware); // Apply auth middleware for routes below
// app.use('/journal', journalRoutes);

// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch(error => console.error('Error connecting to MongoDB:', error.message));



// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const path = require('path');
const JournalEntry = require('./models/JournalEntry');
const cors = require('cors');




const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Authentication middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };


// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
  });
  
  // Multer file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
  };
  
const upload = multer({ storage, fileFilter });



// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Journal App API');
});

// User registration
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/upload', upload.single('pdf'), (req, res) => {
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  });

// Create journal entry
app.post('/journal/create', verifyToken, async (req, res) => {
    try {
      const { title, content, pdfFilename } = req.body;
      const newEntry = new JournalEntry({
        title,
        content,
        author: req.userData.userId,
        pdfFilename,
      });
      await newEntry.save();
      res.status(201).json({ message: 'Journal entry created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Fetch journal entries
app.get('/journal', async (req, res) => {
    try {
      const entries = await JournalEntry.find().populate('author', 'username').exec();
      res.json(entries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Mark entry for review
app.put('/journal/:id/mark-review', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { reviewedBy } = req.body;
  
      const entry = await JournalEntry.findByIdAndUpdate(id, { $set: { isReviewed: true, reviewedBy } }, { new: true });
  
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
  
      res.json({ message: 'Entry marked for review successfully', entry });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Approve entry
app.put('/journal/:id/approve', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findByIdAndUpdate(id, { $set: { isApproved: true } }, { new: true });
  
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
  
      res.json({ message: 'Entry approved successfully', entry });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Reject entry
  app.put('/journal/:id/reject', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { reviewComments } = req.body;
  
      const entry = await JournalEntry.findByIdAndUpdate(id, { $set: { isReviewed: false, reviewComments } }, { new: true });
  
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
  
      res.json({ message: 'Entry rejected successfully', entry });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Add comment to entry
app.post('/journal/:id/comments', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
  
      const newComment = new Comment({
        content,
        author: req.userData.userId,
        entry: id
      });
  
      await newComment.save();
      res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Fetch comments of entry
app.get('/journal/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await Comment.find({ entry: id }).populate('author', 'username').exec();
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
