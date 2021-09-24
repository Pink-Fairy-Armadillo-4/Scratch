const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const dbConnect = require('./db.js');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/auth', authRouter);
app.use('/api', apiRouter);
// app.get('*', function(req, res) {
//   res.sendFile(path.resolve(__dirname, '../dist/index.html'), function(err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

app.listen(PORT, () => {
  dbConnect();
  console.log(`Server listening on ${PORT}`);
});
