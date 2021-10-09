const mongoose = require('mongoose');
const { Schema } = mongoose;

// sets a schema for the 'skill' collection
const skillSchema = new Schema({
  name: { type: String, required: true },
  skillGroup: { type: String, default: 'skill' },
  teachers: [
    {
      firstName: String,
      lastName: String,
      email: String,
      userGroup: { type: String, default: 'user' },
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
});

const Skill = mongoose.model('skill', skillSchema);

module.exports = Skill;
