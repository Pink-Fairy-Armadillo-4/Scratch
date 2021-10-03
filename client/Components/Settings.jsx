import React from 'react';
import SettingsAdmin from './SettingsAdmin';
import SettingsReg from './SettingsReg';
import Navbar from './Navbar';


const Settings = (props) => {
  const isAdmin = localStorage.getItem('admin');
  const newMessage = localStorage.getItem('newMessage');

  return (
    <div className="requestspage">
      <Navbar 
        isAdmin={isAdmin}
        newMessage={newMessage}
        setAuth={props.setAuth} />

      {isAdmin === 'true' && <SettingsAdmin />}
      {isAdmin !== 'true' && <SettingsReg />}
    </div>
  );
};

export default Settings;
