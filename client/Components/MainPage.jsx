import React, { useState } from 'react';
import { useEffect } from 'react';
import { ForceGraph } from './ForceGraph/ForceGraph';
import { CircularProgress } from '@material-ui/core';
import SendMessage from './SendMessage';
import SkillsList from './SkillsList';
import Navbar from './Navbar';
import socket from '../socket';

const MainPage = (props) => {
  //state passed to nodes of ForceGraph to select user on click on node in graph
  //and pass to SendMessage component as prop
  const [selectedUser, setSelectedUser] = useState({});
  //state to hold all data fetched on mount and passed to ForceGraph
  const [graphData, setGraphData] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  //
  const [activeStyle, setActiveStyle] = useState('text-active');

  // checking if user has new messages/requests in localStorage
  // stored upon successful auth
  const newMessage = localStorage.getItem('newMessage');

  // checking if user is admin in localStorage
  // stored upon successful auth
  const isAdmin = localStorage.getItem('admin');

  // func to display tooltip on hover over node in ForceGraph.
  // passed as prop to ForceGraph
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.name}</div>`;
  }, []);

  //func triggered onclick on node in ForceGraph.
  //sets selectedUser state to render SendMessage component
  function getNodeInfo(nodeInfo) {
    return setSelectedUser(nodeInfo);
  }

  //fetches graphData on mount and updates state
  const dataFetch = async () => {
    try {
      const resp = await fetch('/api/nodes/all');
      const data = await resp.json();
      setGraphData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // updates class in SkillsList after 2 sec
  useEffect(() => {
    setTimeout(() => {
      if (activeStyle === 'text-inactive') setActiveStyle('text-active');
    }, 2000);
  }, [activeStyle]);

  useEffect(() => {
    dataFetch();
  }, []);
  //sets selectedUser to empty object to unmount SendMessage component on click on span in SendMessage component
  const cancelMessage = () => {
    setSelectedUser({});
  };

  return (
    <div className="mainpage">
      <Navbar isAdmin={isAdmin} newMessage={newMessage} setAuth={props.setAuth} />

      {isLoading && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <section>
          {graphData.nodes !== undefined && (
            <>
              <SkillsList
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                graphData={graphData}
                setGraphData={setGraphData}
                activeStyle={activeStyle}
                setActiveStyle={setActiveStyle}
              />
              <ForceGraph
                skillsData={graphData.skills}
                linksData={graphData.links}
                nodesData={graphData.nodes}
                nodeHoverTooltip={nodeHoverTooltip}
                getNodeInfo={getNodeInfo}
                setActiveStyle={setActiveStyle}
                activeStyle={activeStyle}
              />
            </>
          )}
        </section>
      )}

      {selectedUser.id && graphData.skills.length === 1 && (
        <SendMessage
          selectedUser={selectedUser}
          graphData={graphData}
          cancelMessage={cancelMessage}
        />
      )}
    </div>
  );
};

export default MainPage;
