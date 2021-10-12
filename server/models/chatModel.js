const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: { type: String, required: [true, 'Chat must have an ID'] },
});

chatSchema.virtual('messages', {
  ref: 'Message',
  localField: 'room',
  foreignField: 'room',
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
