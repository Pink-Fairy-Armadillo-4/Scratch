import React, { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';
import Graph from './Graph';
import SendMessage from './SendMessage';
import SkillsList from './SkillsList';

const MainPage = (props) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [graphData, setGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const email = localStorage.getItem('email');
  console.log('graphdata', graphData);

  const getNodeInfo = (nodeInfo) => {
    setSelectedUser(nodeInfo);
  };

  const dataFetch = async () => {
    try {
      const resp = await fetch('/api/nodes/all' + '&' + email);
      const data = await resp.json();
      console.log('data', data);
      setGraphData(data);
      
      //uncomment after request works
      props.setRequests(data.messages);
      data.messages.forEach(message => {if(message.isRead === false){props.setIsRead(false);}});
 
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
            <button className={props.isRead ? 'requestsbutton' : 'requestsbutton-a'}>
            R
            </button>
          </Link>
        </div>
        <div className="navbuttoncontainer2">
          <Link to="/settings">
            <button className="authbutton">Settings</button>
          </Link>
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
      {isLoading && 
      <div className='loading'>
        <CircularProgress />
      </div>
      }
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
