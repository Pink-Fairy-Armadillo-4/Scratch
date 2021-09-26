import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

const Requests = (props) => {
  return (
    <div className='requestspage'>
      <div className="navbar">
        <div className="main-navbuttoncontainer1">Logo</div>
        <div className="navbuttoncontainer2">
          <button className="requestsbutton" >
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
        Here will be requests
    </div>
  );
};

export default Requests;