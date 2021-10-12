import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import axios from 'axios';
import './Chat.css';
import genRoomId from '../utils/genRoomId';

const Chat = ({ currentUser }) => {
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const online = {};

  // 3) get all online users
  socket.on('online users', (onlineUsers) => {
    setOnlineUsers(onlineUsers);
  });

  // JUST FOR TESTING!!!
  socket.on('Hello from chat room', (content) => {
    console.log(content);
  });

  useEffect(async () => {
    try {
      // 1) Get all users
      const res = await axios.get('/api/allUsers');

      setUsers(res.data.users);
      // 2) connect to socket.io
      socket.auth = { user: currentUser };
      socket.connect();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="Chat">
      <ul>
        <li id="self">
          <div>Some really important message</div>
        </li>{' '}
        <li>
          <div>Some really important message</div>
        </li>{' '}
        <li id="self">
          <div>Some really important message</div>
        </li>{' '}
        <li>
          <div>Some really important message</div>
        </li>
      </ul>
      <form>
        <input />
        <button>send</button>
      </form>
    </div>
  );

  // return (
  //   <div>
  //     <ul>
  //       <li>
  //         <button
  //           onClick={(e) => {
  //             socket.emit('enter chat room', {
  //               room: genRoomId('hello@john.com', 'hello@anchi.com'),
  //             });
  //           }}
  //         >
  //           Anchi
  //         </button>
  //       </li>
  //     </ul>
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         socket.emit(
  //           'message',
  //           JSON.stringify({
  //             from: 'hello@john.com',
  //             to: 'hello@anchi.com',
  //             content: text,
  //           }),
  //         );
  //       }}
  //     >
  //       <input
  //         value={text}
  //         onChange={(e) => {
  //           setText(e.target.value);
  //         }}
  //       />
  //       <button>Send Message</button>
  //     </form>
  //   </div>
  // );
};

export default Chat;
