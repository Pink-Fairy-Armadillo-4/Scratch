import React, { useState } from 'react';
import Graph from './Graph';

const MainPage = (props) => {
  const [requestPop, setRequestPop] = useState(false);
  const togglePop = () => {
    requestPop ? setRequestPop(false) : setRequestPop(true);
  };

  return (
    <div className='mainpage'>
      <div className='navbar'>
        <div className='main-navbuttoncontainer1'>
          Logo
        </div>
        <div className='navbuttoncontainer2'>
          <button className='requestsbutton' onClick={togglePop}>
          R
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
      {requestPop && <div className='messenger'> </div>}
    </div>
  );
};

export default MainPage;