import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import MainPage from './Components/MainPage';
import './index.scss';
import ErrorPage from './Components/ErrorPage';
import RequestsPage from './Components/RequestsPage';
import Settings from './Components/Settings';

const App = (props) => {   
  const [auth, setAuth] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isRead, setIsRead] = useState(true);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  });

  const fetchData = async() => {
    try {
      if (authToken) {
        const isToken = await fetch('auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'token': authToken})
        });
        const isTokenVerif = await isToken.json();
        if (isTokenVerif === true) {
          setAuth(true);
        } else {
          localStorage.removeItem('token');
          setAuth(false);
        }
      }
      else {
        setAuth(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  return(
    <div className='maindiv'>
      <Switch >

        <Route exact path='/'>
          {auth ? <Redirect to='/main' /> 
            : <LandingPage 
              auth={auth}
              setAuth={setAuth}
            />}
        </Route>

        <Route exact path='/main'>
          {auth ? <MainPage  
            auth={auth}
            setAuth={setAuth}
            setRequests={setRequests}
            isRead={isRead}
            setIsRead={setIsRead}
          /> : <Redirect to='/' />}
        </Route>

        <Route exact path='/requests'>
          {auth ? <RequestsPage  
            auth = {auth}
            setAuth = {setAuth}
            requests={requests}
            setIsRead={setIsRead}
          /> : <Redirect to='/' />}
        </Route>

        <Route exact path='/settings'>
          {auth ? <Settings  
            auth = {auth}
            setAuth = {setAuth}
            isRead={isRead}
          /> : <Redirect to='/' />}
        </Route>

        <Route path="/404" component={ErrorPage} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;