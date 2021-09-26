import React, { useState } from 'react';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';
import Graph from './Graph';
import SendMessage from './SendMessage';
import SkillsList from './SkillsList';

const MainPage = (props) => {
  const [requestPop, setRequestPop] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getNodeInfo = (nodeInfo) => {
    setSelectedUser(nodeInfo);
  };

  const togglePop = () => {
    requestPop ? setRequestPop(false) : setRequestPop(true);
  };

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
          <Link to="/requests">
            <button className="requestsbutton">
            R
            </button>
          </Link>
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

      <section>
        {graphData.nodes !== undefined && 
        <SkillsList graphData={graphData} setGraphData={setGraphData}/>
        }
      </section>

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
