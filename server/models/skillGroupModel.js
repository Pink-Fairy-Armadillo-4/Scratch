const mongoose = require('mongoose');
const { Schema } = mongoose;

// sets a schema for the 'userGroup' collection
const skillGroupSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String },
});

const SkillGroup = mongoose.model('skillGroup', skillGroupSchema);

module.exports = SkillGroup;
