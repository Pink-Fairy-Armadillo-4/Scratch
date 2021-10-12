const app = require('./app');
const server = require('http').createServer(app);
// const jwt = require('jsonwebtoken');
const { SocketAddress } = require('net');
const cors = require('cors');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');
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

  socket.emit('online users', users);

  //* io.emit send to all users 😎
  // io.emit('hello', `${socket.user.firstName} just joined`);

  // socket.on('sendMessage', (data) => {
  //   socket.to(data.room).emit('receiveMessage', data);

  //   console.log('receiveMessage', data);
  // });

  // socket.on('joinRoom', (data) => {
  //   socket.join(data);
  //   console.log(`User: ${socket.user.firstName} joined room: ${data}`);
  // });

  // socket.on('disconnect', () => {
  //   io.emit('user left', `${socket.user.firstName} left`);
  // });
});

module.exports = server;
