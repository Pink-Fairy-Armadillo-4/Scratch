import React from 'react';  
import io from 'socket.io-client';

const ChatBox = ({props}) => {

  const chatroomId = props.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  const socket = io('http://localhost:8080',{
    query:{
      token:localStorage.getItem("isToken"),//check the token variable:isToken or token? 10/7
    }
  });

  React.useEffect(() => {
    const token = localStorage.getItem("isToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Put Chatroom Name Here</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              {/* <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "} */}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
             
            />
          </div>
          <div>
            <button className="join" >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;