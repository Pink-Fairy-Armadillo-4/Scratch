import React, { useEffect, useState } from 'react';
import socket from '../socket';

const Chat = ({ currentUser }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    // Retrieve all online users
    socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user._id === currentUser._id;
      });

      setOnlineUsers(users);
    });

    socket.auth = { user: currentUser };

    socket.connect();
  }, [currentUser]);

  const disconnect = () => {
    socket.disconnect();
  };

  console.log(onlineUsers);

  return (
    <div>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};

export default Chat;
