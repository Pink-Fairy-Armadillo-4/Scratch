import React, { useState } from "react"
import { useEffect } from "react"
import Graph from "./Chart/Graph"

const MainPage = (props) => {
  const [requestPop, setRequestPop] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})

  const getNodeInfo = (nodeInfo) => {
    console.log("nodeInfo: ", nodeInfo)
    setSelectedUser(nodeInfo)
  }

  console.log("selectUser is", selectedUser)

  const togglePop = () => {
    requestPop ? setRequestPop(false) : setRequestPop(true)
  }

  const [graphData, setGraphData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const dataFetch = async () => {
    try {
      const resp = await fetch("/api/nodes")
      const data = await resp.json()
      console.log("data", data)
      setGraphData(data)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  console.log(graphData)

  useEffect(() => {
    console.log("called")
    dataFetch()
  }, [])
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
              localStorage.removeItem("token")
              localStorage.removeItem("admin")
              localStorage.removeItem("name")
              props.setAuth(false)
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {graphData.nodes !== undefined && (
        <Graph getNodeInfo={getNodeInfo} graphData={graphData} />
      )}
      {requestPop && <div className="messenger"> </div>}
    </div>
  )
}

export default MainPage
