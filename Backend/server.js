const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb+srv://hemasrikandula801:hema%4093471@cluster2.ekv5n.mongodb.net/';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define the Question schema and model
const questionSchema = new mongoose.Schema({
  _id: String,
  solution: String,
  isCorrectAnswer: String,
  text: String,
  options: String,
  title: String,
  type: String,
});
const Question = mongoose.model('Question', questionSchema);

// Load initial data into the database
app.post('/api/load', async (req, res) => {
  try {
    const questions = req.body;
    await Question.insertMany(questions);
    res.status(201).send('Questions loaded successfully');
  } catch (error) {
    res.status(500).send('Error loading questions: ' + error);
  }
});

// Search API
// Search API with pagination
app.get('/api/search', async (req, res) => {
    const query = req.query.q || '';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 10;
  
    try {
      const results = await Question.find({
        title: { $regex: query, $options: 'i' },
      })
        .skip((page - 1) * limit)
        .limit(limit);
  
      const total = await Question.countDocuments({
        title: { $regex: query, $options: 'i' },
      });
  
      res.status(200).json({
        results,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({ error: 'Error during search: ' + error.message });
    }
  });
  
// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


