const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;
const mongoURI = 'mongodb://localhost:27017';
const dbName = '';

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
let db;

MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');
  db = client.db(dbName);
});

// Endpoint to get all players
app.get('/players', (req, res) => {
  db.collection('lakers').find().toArray((err, players) => {
    if (err) {
      console.error('Failed to get players:', err);
      res.status(500).send('Failed to get players');
      return;
    }

    res.json(players);
  });
});

// Endpoint to add a new player
app.post('/players', (req, res) => {
  const player = req.body;

  db.collection('lakers').insertOne(player, (err) => {
    if (err) {
      console.error('Failed to add player:', err);
      res.status(500).send('Failed to add player');
      return;
    }

    res.sendStatus(201);
  });
});

// Endpoint to update a player
app.put('/players/:name', (req, res) => {
  const name = req.params.name;
  const update = req.body;

  db.collection('lakers').updateOne({ name }, { $set: update }, (err, result) => {
    if (err) {
      console.error('Failed to update player:', err);
      res.status(500).send('Failed to update player');
      return;
    }

    if (result.modifiedCount === 0) {
      res.status(404).send('Player not found');
      return;
    }

    res.sendStatus(204);
  });
});

// Endpoint to delete a player
app.delete('/players/:name', (req, res) => {
  const name = req.params.name;

  db.collection('lakers').deleteOne({ name }, (err, result) => {
    if (err) {
      console.error('Failed to delete player:', err);
      res.status(500).send('Failed to delete player');
      return;
    }

    res.sendStatus(204);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
