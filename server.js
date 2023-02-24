const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const client = new MongoClient('mongodb://localhost:27017/my-database', {
  useUnifiedTopology: true,
});

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

const db = client.db();

connectToDatabase();

// Serve static files
app.use(express.static('public'));

// Route for serving the add.html page
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

// API endpoint
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await db.collection('data').find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    next(error);
  }
});

// API endpoint for adding data
app.post('/api/data', async (req, res, next) => {
  try {
    const { name, age } = req.body;

    // Validate that the name and age are present
    if (!name || !age) {
      res.status(400).json({ error: 'Please provide both name and age' });
      return;
    }

    // Validate that the age is a number
    if (isNaN(age)) {
      res.status(400).json({ error: 'Age must be a number' });
      return;
    }

    // Insert the data into MongoDB
    const result = await db.collection('data').insertOne({ name, age });

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
