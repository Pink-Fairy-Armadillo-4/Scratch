import React, {useState, useEffect} from 'react';
import PopUp from './PopUp';
import PopUpLog from './PopUpLog';
import PopUpReg from './PopUpReg';
import logo from '../images/logo.png' ;

const LandingPage = (props) => {
  console.log('landing page rendered');
  const [seen, setSeen] = useState(false);
  const [seenLog, setSeenLog] = useState(false);
  const [seenSignUp, setSeenSignUp] = useState(false);

  const togglePop = () => {
    seen ? setSeen(false) : setSeen(true); 
    seenLog ? setSeenLog(false) : null;
    seenSignUp ? setSeenSignUp(false) : null;

  };
  const togglePopLog = () => {
    seenLog ? setSeenLog(false) : setSeenLog(true); 
    seen ? setSeen(false) : null;
    seenSignUp ? setSeenSignUp(false) : null;
  };
  const togglePopReg = () => {
    seenSignUp ? setSeenSignUp(false) : setSeenSignUp(true); 
    seen ? setSeen(false) : null;
    seenLog ? setSeenLog(false) : null;
  };

  return (
    <div className='landingpage'>
      {seen && <PopUp toggle={togglePop}/>}
      {seenLog && <PopUpLog toggleLog={togglePopLog} auth={props.auth} setAuth={props.setAuth}/>}
      {seenSignUp && <PopUpReg toggleReg={togglePopReg} auth={props.auth} setAuth={props.setAuth} />}
      <div className='navbar'>
        <div className='navbuttoncontainer1'>
          <button className='aboutbutton' onClick={togglePop}>
          About
          </button>
        </div>
        <div className='navbuttoncontainer2'>
          <button className='authbutton' onClick={togglePopLog}>
          Login
          </button>
        </div>
        <div className='navbuttoncontainer3'>
          <button className='authbutton' onClick={togglePopReg}>
          Signup
          </button>
        </div>
      </div>
      <div className = 'logocontainer'>
        <img alt='intro' className='logoImg' src={logo} />
      </div>
    </div>
  );
};

export default LandingPage;