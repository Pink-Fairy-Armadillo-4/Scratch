import React, { useEffect, useState } from 'react';
import socket from '../socket';
import './Chat.css';

const Chat = ({ currentUser}) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageSent,setMessageSent] = useState([]);
  const [typing,setTyping]=useState("");


  let i = 0;
  
  useEffect(() => {
    i++;
    console.log('in useEffect',i)
    // Retrieve all online users
    socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user._id === currentUser._id;
      });

      setOnlineUsers(users);
    });

    socket.auth = { user: currentUser };

   
    


    

    socket.connect();




  }, [messageSent]);

  useEffect(()=>{
    i++;
    console.log('in useEffect 2',i)
     // Message from server
     socket.on('receiveMessage',msg=>{
      console.log('client message sent back from back end   >>>',msg); //come back as array
      const newMessages = [...msg, msg];
      // setMessageSent((list) => [...list, msg]);
      setMessageSent(newMessages);
      
    });

  },[messageSent]);

  const disconnect = () => {
    socket.disconnect();
  };

  
  console.log('onlineUsers',onlineUsers);
  console.log('messageSent',messageSent)


  //Get message texts;
  const message = (e) =>{
    
    let msg = e.target.value;

    msg = msg.trim();

    if (!msg) {
      return false;
    }
    console.log('msg in message',msg);

    const messageData = {
      
      author: currentUser.firstName,
      message: msg,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    //emit message to server(socket.js);
    socket.emit('sendMessage',messageData);
    setMessageSent((list) => [...list, messageData]);
    setTyping("");

    
  };

  //display chat
  const output = () => {

    return messageSent.map(messageContent=>{
      return (
        <div key={i}
          className="message"
         
        >
          <div>
            <div className="message-content">
              <p>{messageContent.message}</p>
            </div>
            <div className="message-meta">
              <p id="time">{messageContent.time}</p>
              <p id="author">{messageContent.author}</p>
            </div>
          </div>
        </div>
    );
  });

    
  };


  

  


  

  
  
  console.log('text here',messageSent);

  
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

  return (
    <>
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
          onChange={message}
          id="msg"
          type="text"
          placeholder="Enter Message"
          required
          
        />
        <button onClick={message}> Send</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
      

      
    </>
    
  );
};

export default Chat;
