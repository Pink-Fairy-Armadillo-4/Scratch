import React, { useState } from 'react';
import Graph from './Graph';

const MainPage = (props) => {

  return (
    <div className='mainpage'>
      <div className='navbar'>
        <div className='navbuttoncontainer1'>
          <button className='aboutbutton'>
          About
          </button>
        </div>
        <div className='navbuttoncontainer2'>
          <button className='authbutton'>
          Settings
          </button>
        </div>
        <div className='navbuttoncontainer3'>
          <button className='authbutton' onClick={ (e) => {localStorage.removeItem('token'); localStorage.removeItem('admin'); localStorage.removeItem('name'); props.setAuth(false); }}>
          Logout
          </button>
        </div>
      </div>
      <Graph />
    </div>
  );
};

export default MainPage;