const mongoose = require('mongoose');

const dbConnect = (uri = process.env.DB_URI) => {
  mongoose
    .connect(uri, {
      // options for the connect method to parse the URI
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // set the name of the DB our collections are part of
      dbName: 'pfa',
    })
    .then(() => console.log('Connected to MongoDB.'))
    .catch((err) => console.log(err));
};

module.exports = dbConnect;
