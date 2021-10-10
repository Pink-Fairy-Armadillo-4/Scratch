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

 
  socket.on('sendMessage',(msg)=>{

   
    
    socket.emit('receiveMessage >>',msg);
   
   

    console.log('receiveMessage',msg);
  });

  socket.on('disconnect', () => {
    io.emit('user left', `${socket.user.firstName} left`);
  });
});

module.exports = server;
