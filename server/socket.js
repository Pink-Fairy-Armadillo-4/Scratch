const app = require('./app');
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const { SocketAddress } = require('net');
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.query.token; //match socket in ChatBox
//     const payload = await jwt.verify(token, process.env.SECRET);
//     socket.userId = payload.id;
//     next();
//   } catch (err) {
//     console.log('err in io.use in socket.js and the err is' + err);
//   }
// });

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

  socket.emit('users', users);

  //* io.emit send to all users 😎
  io.emit('hello', `${socket.user.firstName} just joined`);

  socket.on('disconnect', () => {
    io.emit('user left', `${socket.user.firstName} left`);
  });

  // socket.on('joinRoom', ({ chatroomId }) => {
  //   socket.join(chatroomId);
  //   console.log('A user joined chatroom: ' + chatroomId);
  // });

  // socket.on('leaveRoom', ({ chatroomId }) => {
  //   socket.leave(chatroomId);
  //   console.log('A user left chatroom: ' + chatroomId);
  // });
});

module.exports = server;
