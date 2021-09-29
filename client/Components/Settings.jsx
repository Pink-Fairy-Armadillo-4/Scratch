import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import SettingsAdmin from './SettingsAdmin';
import SettingsReg from './SettingsReg';

const Settings = (props) => {
  const isAdmin = localStorage.getItem('admin');
  return (
    <div className='requestspage'>
      <div className="navbar">
        <div className="main-navbuttoncontainer2">Logo</div>
        <div className="navbuttoncontainer22">
          <Link to='/'>
            <button className="authbutton" >
            Main
            </button>
          </Link>
        </div>
        <div className="navbuttoncontainer2">
          <Link to='/requests'>
            <button className={props.isRead ? 'requestsbutton' : 'requestsbutton-a'} >
            R
            </button>
          </Link>
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
      {isAdmin === 'true' &&
      <SettingsAdmin />
      }
      {isAdmin !== 'true' && 
      <SettingsReg />
      }
    </div>
  );
};

export default Settings;