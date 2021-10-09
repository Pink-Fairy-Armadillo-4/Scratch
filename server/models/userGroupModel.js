const mongoose = require('mongoose');
const { Schema } = mongoose;

// sets a schema for the 'userGroup' collection
const userGroupSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String },
});

const UserGroup = mongoose.model('userGroup', userGroupSchema);
