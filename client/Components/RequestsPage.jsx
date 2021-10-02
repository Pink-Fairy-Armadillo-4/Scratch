import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Request from "./Request"
import { CircularProgress } from "@material-ui/core"
import scratchLogo from "../images/logo-graph.png"

const RequestsPage = (props) => {
  localStorage.removeItem("newMessage")
  const isAdmin = localStorage.getItem("admin")
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getData()
  }, [])

  const email = localStorage.getItem("email")

  const handleClick = async (arg) => {
    try {
      const response = await fetch("/api/delMessage", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ messageID: arg, targetEmail: email }),
      })
      const newReq = await response.json()
      setRequests(newReq)
    } catch (err) {
      console.log(err)
    }
  }

  const getData = async () => {
    try {
      const resp = await fetch("/api/messages/" + email)
      const data = await resp.json()
      setRequests(data)
    } finally {
      setIsLoading(false)
    }
  }
  console.log("requests are", requests)

  return (
    <div className="requestspage">
      <section className="navbar">
        <div className="main-navbuttoncontainer2">Logo</div>
        <div className="navbuttoncontainer22">
          <Link to="/">
            <img src={scratchLogo} alt="scratchLogo" />
          </Link>
          {isAdmin === "true" && <span className="isadmin">ADMIN</span>}
        </div>
        <div className="navbuttoncontainer2">
          <Link to="/requests">
            <button className="requestsbutton">Requests</button>
          </Link>
        </div>
        <div className="navbuttoncontainer2">
          <Link to="/settings">
            <button className="btn">Settings</button>
          </Link>{" "}
        </div>
        <div className="navbuttoncontainer3">
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
      </section>
      <section className="requests-main">
        {isLoading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <div>
            {!requests.length && (
              <div className="norequests">
                There are no requests at this time
              </div>
            )}
            <div className="requests-inner">
              <div className="page-title">REQUESTS</div>
              <div className="requests-container">
                {requests.map((request) => {
                  return (
                    <Request
                      isRead={request.isRead}
                      handleClick={handleClick}
                      id={request._id}
                      key={request._id}
                      time={request.createdAt}
                      sourceName={request.sourceName}
                      requestBody={request.messageBody}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default RequestsPage
