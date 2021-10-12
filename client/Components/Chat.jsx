import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import axios from 'axios';
import './Chat.css';
import genRoomId from '../utils/genRoomId';

const Chat = ({ currentUser, recipientEmail = 'hello@hot.com' }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const online = {};

  // 1) get all online users
  socket.on('online users', (onlineUsers) => {
    setOnlineUsers(onlineUsers);
  });

  socket.on('message', (message) => {
    setMessages([...messages, JSON.parse(message)]);
  });

  socket.on('messages', (data) => {
    const messages = JSON.parse(data);
    setMessages(messages);
  });

  useEffect(async () => {
    socket.auth = { user: currentUser, room: genRoomId('me@somewhere.com', recipientEmail) };
    socket.connect();
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add message to sender's messages
    const message = { from: currentUser.email, to: recipientEmail, content: text };
    setMessages([...messages, message]);

    // Send message to recipient
    socket.emit('message', JSON.stringify(message));

    setText('');
  };

  const messageList = messages.map(({ content, from, to }, i) => {
    // Check if message is from current user
    const self = from === currentUser.email;

    return (
      <li id={(self && 'self') || ''} key={i}>
        <div>{content}</div>
      </li>
    );
  });

  return (
    <div className="Chat">
      <ul>{messageList}</ul>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        />
        <button>send</button>
      </form>
    </div>
  );
};

export default Chat;
