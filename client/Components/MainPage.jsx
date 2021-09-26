import React, { useState } from 'react';
import { useEffect } from 'react';
import Graph from './Graph';
import SendMessage from './SendMessage';

const MainPage = (props) => {
  const [requestPop, setRequestPop] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const getNodeInfo = (nodeInfo) => {
    console.log('nodeInfo: ', nodeInfo);
    setSelectedUser(nodeInfo);
  };
  console.log('selected user', selectedUser);

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
      {(selectedUser.id) && <SendMessage 
        selectedUser={selectedUser}
        graphData={graphData}
        cancelMessage={cancelMessage}
      />}
    </div>
  );
};

export default MainPage;
