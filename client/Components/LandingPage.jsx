import React, { useState, useEffect } from "react"
import PopUp from "./PopUp"
import PopUpLog from "./PopUpLog"
import PopUpReg from "./PopUpReg"
import logo from "../images/landing-page.jpg"

const LandingPage = (props) => {
  // console.log('landing page rendered');
  const [seen, setSeen] = useState(false)
  const [seenLog, setSeenLog] = useState(false)
  const [seenSignUp, setSeenSignUp] = useState(false)

  const togglePop = () => {
    seen ? setSeen(false) : setSeen(true)
    seenLog ? setSeenLog(false) : null
    seenSignUp ? setSeenSignUp(false) : null
  }
  const togglePopLog = () => {
    seenLog ? setSeenLog(false) : setSeenLog(true)
    seen ? setSeen(false) : null
    seenSignUp ? setSeenSignUp(false) : null
  }
  const togglePopReg = () => {
    seenSignUp ? setSeenSignUp(false) : setSeenSignUp(true)
    seen ? setSeen(false) : null
    seenLog ? setSeenLog(false) : null
  }

  return (
    <div className="parent landing-page-bg">
      {seen && <PopUp toggle={togglePop} />}
      {seenLog && (
        <PopUpLog
          toggleLog={togglePopLog}
          auth={props.auth}
          setAuth={props.setAuth}
        />
      )}
      {seenSignUp && (
        <PopUpReg
          toggleReg={togglePopReg}
          auth={props.auth}
          setAuth={props.setAuth}
        />
      )}
      <div className="children">
        <main className="display-xl">
          Connect with your cohort. They have a lot to teach.
        </main>
        <div className="btn-group">
          <button className="btn" onClick={togglePopLog}>
            Login
          </button>
          <button className="btn" onClick={togglePopReg}>
            Signup
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
