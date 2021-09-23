const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // set the name of the DB our collections are part of
  dbName: 'pfa'
})
  .then(() => console.log('Connected to MongoDB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // group: { type: String, required: true },
  teach: [{
    name: String,
    id: {
      type: Schema.Types.ObjectId,
      ref: 'skill'
    },
  }],
  learn: [{
    name: String,
    id: {
      type: Schema.Types.ObjectId,
      ref: 'skill'
    },
  }],
  admin: { type: Boolean, default: false }
});

const User = mongoose.model('user', userSchema);

const skillSchema = new Schema({
  name: { type: String, required: true },
  // category
});

const Skill = mongoose.model('skill', skillSchema);

module.exports = { User, Skill };
