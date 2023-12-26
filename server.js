// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./router/users');
const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
// Event handlers for MongoDB connection
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.use(bodyParser.json());
app.use('/api', usersRouter)
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {db, app, mongoose, server};