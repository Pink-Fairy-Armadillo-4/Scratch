import React, {useState, useEffect} from 'react';

const PopUpLog = ({auth, setAuth, toggleLog}) => {
  const info = {
    email: null,
    password: null
  };
  const [login, setLogin] = useState(info);
  const [errorOnLogin, setErrorOnLogin] = useState(false);
  console.log(login);

  const findCookie = (cookies) =>{
    let res = cookies.split('; ');
    let rightCookie = '';
    for (let i = 0; i < res.length; i++) {
      if (res[i].includes('ssid=')) {rightCookie = res[i].trim();}
    }
    res = rightCookie.split('=')[1];
    return res;
  };
    //  expect to receive an object with property haslogged: true || false  
    //  and property - {firstName, 
    //  lastName}
    //  expect cookie to be received with key SSID and value of token
    //  if login successfull

  // const resp = {status: false|| true, name: {firstName: 'dd', lastName: 'dd'}, isAdmin: 'fj'}
    

  const submitInfo = async (e) => {
    try{
      const data = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
      });
      const resp = await data.json();
      if (!resp.haslogged) {
        setErrorOnLogin(true);
      }
      else if (resp.haslogged) {
        const rightCookie = findCookie(document.cookie);
        if (rightCookie) {
          localStorage.setItem('token', rightCookie);
          localStorage.setItem('name', `${resp.name.firstName} ${resp.name.lastName}`);
        }
        setAuth(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if(errorOnLogin){
      setTimeout(() => {
        setErrorOnLogin(false);
      }, 3000);}
  }, [errorOnLogin]);

  const handleClick = () => {
    toggleLog();
  };

  const emailEntered = (e) => {
    setLogin(login => ({...login, email:e.target.value}));
  };

  const passwordEntered = (e) => {
    setLogin(login => ({...login, password:e.target.value}));
  };

  return (
    <div className="modal">
      <div className="modal_content_login">
        <span className="close" onClick={handleClick}>
            &times;
        </span>
        <div>
          <h4>Login</h4> 
          {errorOnLogin && <div className='loginerror-message'>
              Information you provided does not match our records.
          </div>}
          <form className='loginform'>
            <div className="form-group">
              <input type="email" className="form-control" placeholder="Enter email" onChange = {emailEntered}/>
            </div>
            <div className="form-group">
              <input type="password" className="form-control" placeholder="Enter password" onChange={passwordEntered} />
            </div>
            <button type="button" className="login-button" onClick={submitInfo}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUpLog;

