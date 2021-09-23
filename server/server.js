const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

const db = require('./models/pfaModels.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/api/getname', (req, res) => {
  res.status(200).json('Robert');
});

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
