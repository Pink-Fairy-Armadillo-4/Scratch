import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import axios from 'axios';
import './Chat.css';

const Chat = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const online = {};

  // 3) get all online users
  socket.on('online users', (onlineUsers) => {
    setOnlineUsers(onlineUsers);
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

  const anchi = {
    name: 'Anchi',
    email: 'hello@anchi.com',
  };

  return (
    <div>
      <ul>
        <li>
          <button
            onClick={(e) => {
              socket.emit('private message', {
                content: 'Hello from Yochi',
                to: anchi.email,
                from: currentUser.email,
              });
            }}
          >
            {anchi.name}
          </button>
        </li>
        <li>
          <button>Harrold</button>
        </li>{' '}
        <li>
          <button>Rob</button>
        </li>{' '}
      </ul>
    </div>
  );
};

export default Chat;
