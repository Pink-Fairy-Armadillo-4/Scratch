const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// sets a schema for the 'user' collection
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  userGroup: {
    name: String,
    id: { type: Schema.Types.ObjectId, ref: 'userGroup' },
  },
  teach: [
    {
      name: String,
      id: {
        type: Schema.Types.ObjectId,
        ref: 'skill',
      },
    },
  ],
  learn: [
    {
      name: String,
      id: {
        type: Schema.Types.ObjectId,
        ref: 'skill',
      },
    },
  ],
});

const User = mongoose.model('user', userSchema);

// sets a schema for the 'userGroup' collection
const userGroupSchema = new Schema({
  name: { type: String, required: true },
});

const UserGroup = mongoose.model('userGroup', userGroupSchema);

// sets a schema for the 'skill' collection
const skillSchema = new Schema({
  name: { type: String, required: true },
  skillGroup: {
    name: String,
    id: { type: Schema.Types.ObjectId, ref: 'skillGroup' },
  },
  teachers: [
    {
      firstName: String,
      lastName: String,
      email: String,
      id: {
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
});

const SkillGroup = mongoose.model('skillGroup', skillGroupSchema);

module.exports = { User, UserGroup, Skill, SkillGroup };
