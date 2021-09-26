import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress } from  '@material-ui/core';
import LandingPage from './Components/LandingPage';
import MainPage from './Components/MainPage';
import './index.scss';
import AccountPage from './Components/AccountPage';
import ErrorPage from './Components/ErrorPage';
import Requests from './Components/Requests';

const App = (props) => {   
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };
  
  return(
    <div className='maindiv'>
      {isLoading && 
     <div className='loading'>
       <CircularProgress />
     </div>}
      {!isLoading && (
        <Switch >

          <Route exact path='/'>
            {auth ? <Redirect to='/main' /> 
              : <LandingPage 
                auth = {auth}
                setAuth = {setAuth}
              />}
          </Route>

          <Route exact path='/main'>
            {auth ? <MainPage  
              auth = {auth}
              setAuth = {setAuth}
            /> : <Redirect to='/' />}
          </Route>

          <Route exact path='/requests'>
            {auth ? <Requests  
              auth = {auth}
              setAuth = {setAuth}
            /> : <Redirect to='/' />}
          </Route>

          <Route exact path='/account'>
            {auth ? <AccountPage
            /> : <Redirect to='/' />}
          </Route>

          <Route path="/404" component={ErrorPage} />
          <Redirect to="/404" />
        </Switch>
      )}
    </div>
  );
};

export default App;