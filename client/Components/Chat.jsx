import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import axios from 'axios';
import './Chat.css';
import genRoomId from '../utils/genRoomId';
import { Hidden } from '@material-ui/core';
import formatDate from '../utils/formatDate';

const Chat = ({ currentUser, recipient, setRecipient }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  // const [onlineUsers, setOnlineUsers] = useState([]);

  const closeChat = (e) => {
    setRecipient(null);
    socket.disconnect();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text) return;

    // Add message to sender's messages
    const message = {
      from: currentUser.email,
      to: recipient.email,
      content: text,
      sentAt: Date.now(),
    };
    setMessages([...messages, message]);

    // Send message to recipient
    socket.emit('message', JSON.stringify(message));

    setText('');
  };

  // SOCKET IO EVENT LISTENERS
  // // 1) get all online users
  // socket.on('online users', (onlineUsers) => {
  //   setOnlineUsers(onlineUsers);
  // });

  socket.on('message', (message) => {
    setMessages([...messages, JSON.parse(message)]);
  });

  socket.on('messages', (data) => {
    const messages = JSON.parse(data);
    // console.log('messages:', messages);
    setMessages(messages);
  });

  // Connect to socket io on component mount
  useEffect(async () => {
    socket.auth = { user: currentUser, room: genRoomId(currentUser.email, recipient.email) };
    socket.connect();
  }, []);

  const messageList = messages.map(({ content, from, to, sentAt }, i) => {
    // Check if message is from current user
    const self = from === currentUser.email;
    const side = self ? 'right' : 'left';
    const name = self ? currentUser.name : recipient.name;

    return (
      <div key={i} className={`msg ${side}-msg`}>
        <div className="msg-bubble">
          <div className="msg-info">
            <div className="msg-info-name">{name}</div>
            <div className="msg-info-time">{formatDate(sentAt)}</div>
          </div>

          <div className="msg-text">{content}</div>
        </div>
      </div>
    );
  });

  return (
    <section className="msger">
      <header className="msger-header">
        <div className="msger-header-title">
          <i className="fas fa-comment-alt"></i>{' '}
          {recipient.name === currentUser ? currentUser.name : recipient.name}
        </div>
        <div onClick={closeChat} className="msgr-close">
          <ion-icon name="close"></ion-icon>
        </div>
        {/* <div className="msger-header-options">
          <span>
            <i className="fas fa-cog"></i>
          </span>
        </div> */}
      </header>

      <main className="msger-chat">{messageList}</main>

      <form className="msger-inputarea" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="msger-input"
          placeholder="Enter your message..."
        />
        <button type="submit" className="msger-send-btn">
          Send
        </button>
      </form>
    </section>
  );
};

export default Chat;
