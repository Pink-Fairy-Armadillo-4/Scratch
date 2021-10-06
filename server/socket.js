const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected! 🎉');
});

module.exports = server;
