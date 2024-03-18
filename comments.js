// Create web server
const express = require('express');
const app = express();
const port = 3000;

// Create a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen to the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Path: comments.js
// Read from database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const Comment = mongoose.model('Comment', { name: String, text: String });

app.get('/comments', (req, res) => {
  Comment.find({}, (err, comments) => {
    res.send(comments);
  });
});

// Path: comments.js
// Create a new comment
app.post('/comments', (req, res) => {
  const comment = new Comment({ name: req.body.name, text: req.body.text });
  comment.save().then(() => res.send('Comment saved!'));
});

// Path: comments.js
// Update a comment
app.put('/comments/:id', (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, { text: req.body.text }, (err, comment) => {
    res.send('Comment updated!');
  });
});

// Path: comments.js
// Delete a comment
app.delete('/comments/:id', (req, res) => {
  Comment.findByIdAndDelete(req.params.id, (err, comment) => {
    res.send('Comment deleted!');
  });
});

// Path: comments.js
// Add middleware to parse JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Path: comments.js
// Add middleware to handle errors
app.use((err, req, res, next) => {
  res.status(500).send('Something went wrong!');
});

// Path: comments.js
// Add middleware to handle 404
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Path: comments.js
// Add middleware to log requests
app.use((req, res, next) => {
  console.log('Request received!');
  next();
});

// Path: comments.js
// Add middleware to log responses
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('Response sent!');