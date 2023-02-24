const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const client = new MongoClient('mongodb://localhost:27017/my-database', {
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connectToDatabase();

// Serve static files
app.use(express.static('public'));

// API endpoint
app.get('/api/data', async (req, res, next) => {
  try {
    const db = client.db();
    const data = await db.collection('my-collection').find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
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
