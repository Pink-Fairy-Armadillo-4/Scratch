const app = require('./app');
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
  },
});


io.use(async(socket,next)=>{
  try {
    const token = socket.handshake.query.token;//match socket in ChatBox
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    console.log('err in io.use in socket.js and the err is' + err);
  }

});

//io is socket io server, 2nd arg socket is client socket 
io.on('connection', (socket) => {
  //io.emit('user connected')
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  
  
});



module.exports = server;
