import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Styles
import GlobalStyles from './GlobalStyles';
import './index.scss';
import { CircularProgress } from '@material-ui/core';

//lazy loading components to split bundle.js into chunks
const LandingPage = lazy(() => import('./Components/LandingPage'));
const MainPage = lazy(() => import('./Components/MainPage'));
const ErrorPage = lazy(() => import('./Components/ErrorPage'));
const RequestsPage = lazy(() => import('./Components/RequestsPage'));
const Settings = lazy(() => import('./Components/Settings'));

const App = (props) => {
  //state updated on login, signup
  const [auth, setAuth] = useState(false);
  //token stored upon successful auth to replace sessions.
  const authToken = localStorage.getItem('token');

  const [isLoading, setIsLoading] = useState(true);

  //verifying token from localStorage on mount and auth to avoid hacked localStorage
  //checked every time we refresh browser or load one of urls in browser

  useEffect(() => {
    fetchData();
    console.log('useeffect called in app.jsx');
  }, [auth]);

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
        <Suspense
          fallback={
            <div className="loading">
              <CircularProgress />
            </div>
          }
        >
          <Switch>
            {/*
            if authorized upon visiting one of the routes will be loaded component,
            otherwise will be redirected to landing page
             */}

            <Route exact path="/">
              {auth ? (
                <Redirect to="/main" />
              ) : (
                <LandingPage auth={auth} setAuth={setAuth} />
              )}
            </Route>

            <Route exact path="/main">
              {auth ? (
                <MainPage auth={auth} setAuth={setAuth} />
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
                <Settings auth={auth} setAuth={setAuth} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>

            <Route path="/404" component={ErrorPage} />
            <Redirect to="/404" />
          </Switch>
        </Suspense>
      )}
      <GlobalStyles />
    </div>
  );
};

export default App;
