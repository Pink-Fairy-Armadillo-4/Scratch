import React, { useState, useEffect } from 'react';

/*
login popup component
 */

const PopUpLog = ({ auth, setAuth, toggleLog }) => {

  //data to set initial state
  const info = {
    email: null,
    password: null,
  };
  const [login, setLogin] = useState(info);
  const [errorOnLogin, setErrorOnLogin] = useState(false);

  // func to extract right cookie with token from response;
  const findCookie = (cookies) => {
    let res = cookies.split('; ');
    let rightCookie = '';
    for (let i = 0; i < res.length; i++) {
      if (res[i].includes('ssid=')) {
        rightCookie = res[i].trim();
      }
    }
    res = rightCookie.split('=')[1];
    return res;
  };

  // submitting request to verify user,
  // if success - set auth to true, this will trigger rerender of App component and redirect from landing to main page;
  // if success - set user name in localStorage,
  // if admin - set user status in localStorage,
  // if new messages available - set newMessage property in localStorage
  // get cookie and store in localStorage,

  const submitInfo = async (e) => {
    try {
      const data = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      });
      const resp = await data.json();
      // console.log('resp on log is', resp);
      if (!resp.hasLogged) {
        setErrorOnLogin(true);
      } else if (resp.hasLogged) {
        const rightCookie = findCookie(document.cookie);
        localStorage.setItem('email', `${login.email}`);
        if (rightCookie) {
          localStorage.setItem('token', rightCookie);
          localStorage.setItem(
            'name',
            `${resp.userInfo.firstName} ${resp.userInfo.lastName}`
          );
        }
        if (resp.userInfo.isAdmin) {
          localStorage.setItem('admin', 'true');
        }
        if (resp.userInfo.newMessage === true) {
          localStorage.setItem('newMessage', 'true');
        }
        setAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // if error state changed and error div rendered change it back in 3 sec
  useEffect(() => {
    if (errorOnLogin) {
      setTimeout(() => {
        setErrorOnLogin(false);
      }, 3000);
    }
  }, [errorOnLogin]);
  // func to close popup window
  const handleClick = () => {
    toggleLog();
  };
  // changing state to send in request
  const emailEntered = (e) => {
    setLogin((login) => ({ ...login, email: e.target.value }));
  };
  // changing state to send in request
  const passwordEntered = (e) => {
    setLogin((login) => ({ ...login, password: e.target.value }));
  };

  return (
    <div className="modal">
      <div className="modal_content_login">
        <span className="close" onClick={handleClick}>
          &times;
        </span>
        <div>
          <h4>LOGIN</h4>
          {errorOnLogin && (
            <div className="loginerror-message">
              Information you provided does not match our records.
            </div>
          )}
          <form className="loginform">
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={emailEntered}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={passwordEntered}
              />
            </div>
            <div className="form-group">
              <button
                type="button"
                className="loginbutton"
                onClick={submitInfo}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUpLog;
