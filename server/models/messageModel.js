const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    from: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'A message must have an origin'],
    },
    to: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'A message must have a destination'],
    },
    message: { type: String, required: [true, 'Message cannot be empty'] },
    sentAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
