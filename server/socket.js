const app = require('./app');
const server = require('http').createServer(app);
// const jwt = require('jsonwebtoken');
const cors = require('cors');
const Message = require('./models/messageModel');
const Chat = require('./models/chatModel');
const genRoomId = require('./utils/genRoomId');

app.use(cors());

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use((socket, next) => {
  const { user, room } = socket.handshake.auth;
  console.log(user, room);
  socket.user = user;
  socket.room = room;

  next();
});

//io is socket io server, 2nd arg socket is client socket
io.on('connection', async (socket) => {
  // console.log('Connected: ' + socket.user._id);
  const { room, user } = socket;

  try {
    const users = [];

    // for (const [id, socket] of io.of('/').sockets) {
    //   users.push({
    //     ...socket.user,
    //   });
    // }

    // // Send a list of all online users to socket
    // socket.emit('online users', users);

    let chat;
    // Check if room exists
    chat = await Chat.findOne({ room: room }).populate('messages');
    // If room does not exist, create a new one
    if (!chat) {
      chat = await Chat.create({ room: room });
    }

    // Join the room
    socket.join(room);

    // Send chat history to client
    if (chat.messages) socket.emit('messages', JSON.stringify(chat.messages));

    // Listen for message
    socket.on('message', async (data) => {
      // console.log(data);
      const { from, to, content } = JSON.parse(data);

      // Store message (in database)
      const message = await Message.create({ from, to, content, room });

      // Send message to room

      socket.to(room).emit('message', JSON.stringify(message));
    });
  } catch (err) {
    console.log(err);
  }

  //
});

module.exports = server;
