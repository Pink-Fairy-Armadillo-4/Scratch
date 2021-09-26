import React, {useState} from 'react';

const SendMessage = (props) => {
  const [email, setEmail] = useState('');
  const [statusReceived, setStatusReceived] = useState(false);
  const emailEntered = (e) => {
    setEmail(e.target.value);
  };

  const sendMessage = async () => {
    try{
      const sourceName = localStorage.getItem('name');
      const sourceEmail = localStorage.getItem('email');
      const data = {
        emailToGetContacted: email,
        sourceName,
        sourceEmail,
        targetEmail: props.selectedUser.email,
        targetName: props.selectedUser.id,
        skill: props.graphData.skills[0]
      };
      console.log(data);
      const sent = await fetch('/api/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response = await sent.json();
      setStatusReceived(true);
    }
    catch(err) {
      console.log(err);
    }
  };

  return (
    <div className="messenger">
      <div className='internal-messenger'>
        <span className="close" onClick={props.cancelMessage}>
            &times;
        </span>
        {!statusReceived && 
        <div>
          <p>Hi <span className="recepientname">{props.selectedUser.id}</span>, I am looking forward to learning {props.graphData.skills[0]} from you </p>
          <p>Here is my contact info: </p>
          <div className='form-wrapperdiv'>
            <form>
              <input type="password" className="form-control-messenger" placeholder="Enter email" onChange={emailEntered} />
              <button type='button' className="sendmessage" onClick={sendMessage}>Send</button>
            </form>
          </div>
        </div>
        }
        {statusReceived && 
        <div>
          <p><span className="recepientname">{props.selectedUser.id}</span> has received your message and should reply shortly </p>
        </div>
        }
      </div>
    </div>
  );
};

export default SendMessage;