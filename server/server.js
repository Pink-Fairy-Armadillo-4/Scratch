const server = require('./socket');

const dbConnect = require('./db.js');
require('dotenv').config();

const PORT = 3000;

// app.get('*', function(req, res) {
//   res.sendFile(path.resolve(__dirname, '../dist/index.html'), function(err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });
server.listen(PORT, () => {
  dbConnect();
  console.log(`Server listening on ${PORT}`);
});
