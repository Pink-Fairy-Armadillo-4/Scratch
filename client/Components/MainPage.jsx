import React, { useState } from "react"
import { useEffect } from "react"
import { ForceGraph } from "./ForceGraph/ForceGraph"
import { CircularProgress } from "@material-ui/core"
import { Link } from "react-router-dom"
import SendMessage from "./SendMessage"
import SkillsList from "./SkillsList"
import scratchLogo from "../images/logo-graph.png"

const MainPage = (props) => {
  const [selectedUser, setSelectedUser] = useState({})
  const [graphData, setGraphData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeStyle, setActiveStyle] = useState("text-active")
  const newMessage = localStorage.getItem("newMessage")
  const isAdmin = localStorage.getItem("admin")

  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.name}</div>`
  }, [])

  function getNodeInfo(nodeInfo) {
    return setSelectedUser(nodeInfo)
  }

  const dataFetch = async () => {
    try {
      const resp = await fetch("/api/nodes/all")
      const data = await resp.json()
      console.log("Fetch ", data)
      setGraphData(data)

      //uncomment after request works
      //props.setRequests(data.messages);
      // data.messages.forEach(message => {if(message.isRead === false){props.setIsRead(false);}});
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (activeStyle === "text-inactive") setActiveStyle("text-active")
    }, 2000)
  }, [activeStyle])

  useEffect(() => {
    // console.log("called")
    dataFetch()
  }, [])

  const cancelMessage = () => {
    setSelectedUser({})
  }

  console.log("Graph data", graphData)
  return (
    <div className="mainpage">
      <div className="navbar">
        <div className="main-navbuttoncontainer1">
          <img src={scratchLogo} alt="scratchLogo" />
        </div>
        {/* <div className="navbuttoncontainer2"> */}
        <div>
          {isAdmin === "true" && <div className="btn isadmin-main">ADMIN</div>}
        </div>
        <Link to="/requests">
          <button
            className={
              newMessage === null ? "requestsbutton" : "requestsbutton-a"
            }
          >
            Requests
          </button>
        </Link>
        {/* </div> */}
        <Link to="/settings">
          <button className="btn btn-text">Settings</button>
        </Link>
        <button
          className="btn accent"
          onClick={(e) => {
            localStorage.clear()
            props.setAuth(false)
          }}
        >
          Logout
        </button>
      </div>
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
      {/* <section className="Main">
        {graphData.nodes !== undefined && (
        )}
      </section> */}
      {/* {graphData.nodes !== undefined && (
        <ForceGraph
          getNodeInfo={getNodeInfo}
          setActiveStyle={setActiveStyle}
          activeStyle={activeStyle}
          graphData={graphData}
        />
      )} */}
      {selectedUser.id && graphData.skills.length === 1 && (
        <SendMessage
          selectedUser={selectedUser}
          graphData={graphData}
          cancelMessage={cancelMessage}
        />
      )}
    </div>
  )
}

export default MainPage
