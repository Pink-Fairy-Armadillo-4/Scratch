const Chat = require('../models/chatModel');
const AppError = require('../utils/appError');

exports.getChatMessages = async (req, res, next) => {
  const { room } = req.body;

  const chat = await Chat.findOne({ room }).populate('messages');

  if (!chat) {
    return next(new AppError('This chat has no messages', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
};
