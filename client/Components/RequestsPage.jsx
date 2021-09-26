import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
const RequestsPage = (props) => {
  props.setIsRead(true);
  console.log('requests are', props.requests);
  return (
    <div className='requestspage'>
      <section className="navbar">
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
            <button className="requestsbutton" >
            R
            </button>
          </Link>
        </div>
        <div className="navbuttoncontainer2">
          <Link to="/settings">
            <button className="authbutton">Settings</button>
          </Link>        </div>
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
      </section>
      <section className='requests-main'>
        {!props.requests.length && 
        <div className='norequests'> 
          There is no requests at this time
        </div>
        }
      </section>
    
    </div>
  );
};

export default RequestsPage;