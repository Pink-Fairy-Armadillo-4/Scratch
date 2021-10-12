const app = require('./app');
const server = require('http').createServer(app);
// const jwt = require('jsonwebtoken');
const { SocketAddress } = require('net');
const cors = require('cors');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');
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
  const { user } = socket.handshake.auth;

  socket.user = user;

  next();
});

//io is socket io server, 2nd arg socket is client socket
io.on('connection', (socket) => {
  // console.log('Connected: ' + socket.user._id);

  const users = [];

  for (const [id, socket] of io.of('/').sockets) {
    users.push({
      ...socket.user,
    });
  }

  // Send a list of all online users to socket
  socket.emit('online users', users);

  //

  socket.on('enter chat room', async ({ room }, next) => {
    try {
      let chat;
      // Check if room exists
      chat = await Chat.findOne({ room });
      // If room does not exist, create a new one
      if (!chat) {
        chat = await Chat.create({ room });
      }

      //TODO: Get all past messages from chat and send them

      // If everything is okay, join the room
      socket.join(room);

      // Listen for message
      socket.on('message', async (data) => {
        const { from, to, content } = JSON.parse(data);

        const room = genRoomId(from, to);
        try {
          // Store message (in database)
          const message = await Message.create({ from, to, content, room });

          io.to(room).emit('message', JSON.stringify({ from, to, content }));
        } catch (err) {
          // socket.emit('error', new Error('Something went wrong'));
          console.log(err);
        }
      });
    } catch (err) {
      // socket.emit('error', new Error('Something went wrong'));
    }
  });

  //
});

module.exports = server;
