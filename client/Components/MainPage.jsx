import React, { useState } from 'react';
import { useEffect } from 'react';
import Graph from './Graph';

const MainPage = (props) => {
  const [requestPop, setRequestPop] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [email, setEmail] = useState('');

  const getNodeInfo = (nodeInfo) => {
    console.log('nodeInfo: ', nodeInfo);
    setSelectedUser(nodeInfo);
  };

  const togglePop = () => {
    requestPop ? setRequestPop(false) : setRequestPop(true);
  };

  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const dataFetch = async () => {
    try {
      const resp = await fetch('/api/nodes');
      const data = await resp.json();
      console.log('data', data);
      setGraphData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('called');
    dataFetch();
  }, []);

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
        targetEmail: selectedUser.email,
        targetName: selectedUser.id,
        skill: graphData.skills[0]
      };
      console.log('da ', data);
      const sent = await fetch('/api/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response = await sent.json();

    }
    catch(err) {
      console.log(err);
    }
  };

  const cancelMessage = () => {
    setSelectedUser({});
  };

  return (
    <div className="mainpage">
      <div className="navbar">
        <div className="main-navbuttoncontainer1">Logo</div>
        <div className="navbuttoncontainer2">
          <button className="requestsbutton" onClick={togglePop}>
            R
          </button>
        </div>
        <div className="navbuttoncontainer2">
          <button className="authbutton">Settings</button>
        </div>
        <div className="navbuttoncontainer3">
          <button
            className="authbutton"
            onClick={(e) => {
              localStorage.removeItem('token');
              localStorage.removeItem('admin');
              localStorage.removeItem('name');
              localStorage.removeItem('email');
              props.setAuth(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {graphData.nodes !== undefined && (
        <Graph getNodeInfo={getNodeInfo} graphData={graphData} />
      )}
      {(selectedUser.id) && <div className="messenger">
        Hi, {selectedUser.id}, I am looking forward to learning {graphData.skills[0]} from you.
        <form>
        Here is my contact info:
          <input type="password" className="form-control" placeholder="Enter email" onChange={emailEntered} />
        </form>
        <button onClick={sendMessage}> Submit</button>
        <button onClick={cancelMessage}>Cancel</button>
      </div>}
    </div>
  );
};

export default MainPage;
