import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress } from  '@material-ui/core';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import './index.scss';
import AccountPage from './components/AccountPage';
import ErrorPage from './components/ErrorPage';

const App = (props) => {   
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    dataSync();
  }, []);

  const dataSync = async() => {
    try{
      const result = '6';
    } 
    finally {
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