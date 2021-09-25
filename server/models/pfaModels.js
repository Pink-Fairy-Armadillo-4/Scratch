const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// sets a schema for the 'user' collection
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  userGroup: { type: String, default: 'user' },
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
userSchema.pre('save', async function save (next){
  try{
    const SALT_WORK_FACTOR = 10;
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  }
  catch(err){
    return next(err);
  }
});

//cannot access password with arrow func
userSchema.methods.verify = async function (password) {
  const check = bcrypt.compare(password, this.password);
  return check;
};


const User = mongoose.model('user', userSchema);

// sets a schema for the 'userGroup' collection
const userGroupSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String },
});

const UserGroup = mongoose.model('userGroup', userGroupSchema);

// sets a schema for the 'skill' collection
const skillSchema = new Schema({
  name: { type: String, required: true },
  skillGroup: { type: String, default: 'skill' },
  teachers: [
    {
      firstName: String,
      lastName: String,
      email: String,
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
});

const Skill = mongoose.model('skill', skillSchema);

// sets a schema for the 'userGroup' collection
const skillGroupSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String },
});

const SkillGroup = mongoose.model('skillGroup', skillGroupSchema);

module.exports = { User, UserGroup, Skill, SkillGroup };
