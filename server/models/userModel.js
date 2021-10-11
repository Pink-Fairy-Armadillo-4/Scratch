const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const capitalize = require('../utils/capitalize');
const { Schema } = mongoose;

// sets a schema for the 'user' collection
const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    // Name field created automatically based off firstName and Lastname
    name: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    userGroup: { type: String, default: 'user' },
    newMessage: { type: Boolean, required: true, default: false },
    teach: [
      {
        name: String,
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'skill',
        },
      },
    ],
    learn: [
      {
        name: String,
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'skill',
        },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
userSchema.pre('save', function (next) {
  this.firstName = capitalize(this.firstName);
  this.lastName = capitalize(this.lastName);
  this.name = `${this.firstName} ${this.lastName}`;

  next();
});

// Virtual populate
userSchema.virtual('messagesSent', {
  ref: 'Message',
  foreignField: 'from',
  localField: '_id',
});

userSchema.virtual('messagesReceived', {
  ref: 'Message',
  foreignField: 'to',
  localField: '_id',
});

//set up preprocess for encrypting password
userSchema.pre('save', async function save(next) {
  try {
    const SALT_WORK_FACTOR = 10;
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

//cannot access password with arrow func
userSchema.methods.verify = async function (password) {
  const check = bcrypt.compare(password, this.password);
  return check;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
