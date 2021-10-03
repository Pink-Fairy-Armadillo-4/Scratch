import React from 'react';
import scratchLogo from '../images/logo-graph.png';
import { Link } from 'react-router-dom';



const Navbar = (props) => {

  return (
    <div className="navbar">
      <div className="main-navbuttoncontainer1">
        <Link to="/">
          <img src={scratchLogo} alt="scratchLogo" />
        </Link>     
      </div>
      <div>
        {props.isAdmin === 'true' && <div className="btn isadmin-main">ADMIN</div>}
      </div>
      <Link to="/requests">
        <button
          className={
            props.newMessage === null ? 'requestsbutton' : 'requestsbutton-a'
          }
        >
            Requests
        </button>
      </Link>
      <Link to="/settings">
        <button className="btn btn-text">Settings</button>
      </Link>
      <button
        className="btn accent logout"
        onClick={(e) => {
          localStorage.clear();
          props.setAuth(false);
        }}
      >
          Logout
      </button>
    </div>  );
};

export default Navbar;