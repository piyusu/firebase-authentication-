const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { MONGODB_URI, PORT } = process.env;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


