import React, { useEffect, useState,useRef } from 'react';
import socket from '../socket';
import './Chat.css';


const Chat = ({ currentUser}) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageSent,setMessageSent] = useState([]);
 
  const [typing,setTyping] = useState('');
  const messageRef = useRef();

  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  
  const setRoomHandler = (e) => {
    setRoom(e.target.value);
  };

  const joinRoom = () => {
    if (currentUser.firstName !== '' && room !== '') {
      socket.emit("joinRoom", room);
      // setShowChat(true);
    }
  };

  
  
  
  useEffect(() => {
   
    console.log('in useEffect for users');
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

  //Get message texts
  const typeMessage = (e) =>{
    setTyping(e.target.value);
    
  };

  //sending message
  const message = async() =>{
    if (typing !== ''){
      const messageData = {
        room: room,
        author: currentUser.firstName,
        message: typing,
        time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      };
  
      //emit message to server(socket.js);
      await socket.emit('sendMessage',messageData);
      setMessageSent((list) => [...list, messageData]);
      console.log('look',messageSent)
      setTyping('');

    }
  };

  useEffect(()=>{
   
    console.log('in useEffect 2 for messages');
    // Message from server
    socket.on('receiveMessage',data=>{
    //come back as an obj
     
      setMessageSent((list) => [...list, data]);
       
    });
    console.log('data in useEffect 2',messageSent);
    socket.connect();

  },[socket]);

  

  
  console.log('onlineUsers',onlineUsers);
  console.log('messageSent',messageSent);
  
  
 
  //display chat
  const output = (list) => {

    return list.map(messageContent=>{
      return (
        <div key='outputMessage'
          className="message"
         
        >
          <div>
            <div className="message-meta">
              <p id="time">{messageContent.author} {messageContent.time}</p>
              
            </div>
            <div className="message-content">
              <p>{messageContent.message}</p>
            </div>
           
          </div>
        </div>
      );
    });

    
  };

  
  //get all online users displayed
  const allOnlineUsers = (users) =>{
    
    return users.map(user=>{
      return (
        <div key={user}>
          <ul > {user.firstName} </ul>
        </div>
      );
    });
  };

  //leave chat
  const disconnect = () => {
    socket.disconnect();
  };

  return (
    <>
      <div className='joinRoom'>
        <input
          type="text"
          placeholder="Room ID..."
          onChange={setRoomHandler}
        />
        <button onClick={joinRoom}>Join A Room</button>
      </div>
     
      <div className='chat-container'>
        <main className="chat-main" >
          <div className='sidebar'>
            <h3> Room Name:</h3>
          
            <h3> Users:{allOnlineUsers(onlineUsers)}</h3>
            <ul id="users"></ul>
          </div>
          <div className="chat-messages">
           messages should display here
            {output(messageSent)}
      
        
          </div>
     
        </main>
      </div>

      
      
     
      <div>
        <input
          onChange={typeMessage}
          value={typing}
          type="text"
          placeholder="Enter Message"
          required
          onKeyPress={(event) => {
            event.key === "Enter" && message();
          }}
        />
        <button onClick={message}> Send</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
      

      
    </>
    
  );
};

export default Chat;
