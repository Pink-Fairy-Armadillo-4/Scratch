import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log('----- socket dev logging -----');
  console.log(event, args);
  console.log('------------------------------');
});

export default socket;
