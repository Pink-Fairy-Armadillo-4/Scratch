const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    // info stored on login
    sourceName: { type: String, required: true },
    sourceEmail: { type: String, required: true },
    contactEmail: { type: String, required: true },
    // info stored on node
    targetName: { type: String, required: true },
    targetEmail: { type: String, required: true },
    // message generate on click node and send message functionality
    messageBody: { type: String, required: true },
    skill: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
