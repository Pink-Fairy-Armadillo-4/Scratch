import React, { useState, useEffect } from 'react';
import Request from './Request';
import { CircularProgress } from '@material-ui/core';
import Navbar from './Navbar';

/*
fetches data on mount and renders Request Components;
handleClick sends delete request and receives new data, updates requests state and rerenders component with new data.
 */

const RequestsPage = (props) => {

  localStorage.removeItem('newMessage');
  const isAdmin = localStorage.getItem('admin');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const newMessage = null;

  useEffect(() => {
    getData();
  }, []);

  const email = localStorage.getItem('email');

  const handleClick = async (arg) => {
    try {
      const response = await fetch('/api/delMessage', {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ messageID: arg, targetEmail: email }),
      });
      const newReq = await response.json();
      setRequests(newReq);
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    try {
      const resp = await fetch('/api/messages/' + email);
      const data = await resp.json();
      setRequests(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="requestspage">

      <Navbar 
        isAdmin={isAdmin}
        newMessage={newMessage}
        setAuth={props.setAuth} />
      
      <section className="requests-main">
        {isLoading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <div>
            {!requests.length && (
              <div className="norequests">
                There are no requests at this time
              </div>
            )}
            <div className="requests-inner">
              <div className="page-title">REQUESTS</div>
              <div className="requests-container">
                {requests.map((request) => {
                  return (
                    <Request
                      isRead={request.isRead}
                      handleClick={handleClick}
                      id={request._id}
                      key={request._id}
                      time={request.createdAt}
                      sourceName={request.sourceName}
                      requestBody={request.messageBody}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default RequestsPage;
