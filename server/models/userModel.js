const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

// sets a schema for the 'user' collection
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
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
