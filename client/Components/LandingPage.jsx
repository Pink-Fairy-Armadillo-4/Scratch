import React, { useState, useEffect } from 'react';
import PopUpLog from './PopUpLog';
import PopUpReg from './PopUpReg';

const LandingPage = (props) => {
  //states to open/close modal, passed as props to PopUpLog, PopUpReg components;
  const [seenLog, setSeenLog] = useState(false);
  const [seenSignUp, setSeenSignUp] = useState(false);

  // functions on click to modify state of PopUpLog, PopUpReg 
  // and open/close modals. condit rendering
  const togglePopLog = () => {
    seenLog ? setSeenLog(false) : setSeenLog(true);
    seenSignUp ? setSeenSignUp(false) : null;
  };
  const togglePopReg = () => {
    seenSignUp ? setSeenSignUp(false) : setSeenSignUp(true);
    seenLog ? setSeenLog(false) : null;
  };

  return (
    <div className="parent landing-page-bg">
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
  );
};

export default LandingPage;
