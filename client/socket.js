import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  const parsedData = args.map((arg) => (typeof arg === 'string' && JSON.parse(arg)) || arg);
  console.log('----- socket dev logging -----');
  console.log(event, parsedData);
  console.log('------------------------------');
});

export default socket;
