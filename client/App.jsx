import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './index.scss';
import { CircularProgress } from '@material-ui/core';


const LandingPage = lazy(() => import( './Components/LandingPage'));
const MainPage = lazy(() => import ('./Components/MainPage'));
const ErrorPage = lazy(() => import ('./Components/ErrorPage'));
const RequestsPage = lazy(() => import ('./Components/RequestsPage'));
const Settings = lazy(() => import ('./Components/Settings'));

const App = (props) => {
  console.log('app.jsx rendered');
  const [auth, setAuth] = useState(false);
  const authToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  //we will use useRef for storing isRead
  //we will pass it to landing page and update it there if

  useEffect(() => {
    fetchData();
    console.log('useeffect called in app.jsx');
  }, [auth]);

  useEffect(() => {
    //if auth true - we will send a request for
    //reading us
  }, []);

  const fetchData = async () => {
    try {
      if (authToken) {
        const res = await fetch('auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: authToken }),
        });
        const data = await res.json();
        if (data.verified === true) {
          setAuth(true);
          console.log(data);
        } else {
          localStorage.clear();
          setAuth(false);
        }
      } else {
        setAuth(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="maindiv">
      {isLoading && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <Suspense fallback = { <div className="loading">
          <CircularProgress />
        </div>} >
          <Switch>
            <Route exact path="/">
              {auth ? (
                <Redirect to="/main" />
              ) : (
                <LandingPage auth={auth} setAuth={setAuth} />
              )}
            </Route>

            <Route exact path="/main">
              {auth ? (
                <MainPage
                  auth={auth}
                  setAuth={setAuth}
                // isRead={isRead}
                />
              ) : (
                <Redirect to="/" />
              )}
            </Route>

            <Route exact path="/requests">
              {auth ? (
                <RequestsPage auth={auth} setAuth={setAuth} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>

            <Route exact path="/settings">
              {auth ? (
                <Settings
                  auth={auth}
                  setAuth={setAuth}
                // isRead={isRead}
                />
              ) : (
                <Redirect to="/" />
              )}
            </Route>

            <Route path="/404" component={ErrorPage} />
            <Redirect to="/404" />
          </Switch>
        </Suspense>
      )}
    </div>
  );
};

export default App;
