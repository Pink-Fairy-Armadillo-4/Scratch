import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Request from './Request';
import { CircularProgress } from '@material-ui/core';


const RequestsPage = (props) => {
  console.log('requests rendered');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // useEffect(() =>   {props.setIsRead(true);}, []
  // );
  useEffect(() => {
    props.setIsRead(true);
    getData();
  },[]);

  const handleClick = async (arg) => {
    try{
      console.log(arg);
      const response = await fetch('/api/deletemessage', {
        method: 'DELETE', 
        headers: {
          'Content-type': 'application/json' 
        },
        body: JSON.stringify({'deleted': arg})
      });
      const newReq = response.json();
      setRequests(newReq);
    }
    catch (err) {console.log(err);}
  };



  const email = localStorage.getItem('email');

  const getData = async() => {
    try{
      const resp = await fetch('/api/messages/' + email);
      const data = await resp.json();
      setRequests(data);
    } 
    finally {setIsLoading(false);}
  };
  console.log('requests are', requests);

  return (
    <div className='requestspage'>
      <section className="navbar">
        <div className="main-navbuttoncontainer2">Logo</div>
        <div className="navbuttoncontainer22">
          <Link to='/'>
            <button className="authbutton" >
            Main
            </button>
          </Link>
        </div>
        <div className="navbuttoncontainer2">
          <Link to='/requests'>
            <button className="requestsbutton" >
            R
            </button>
          </Link>
        </div>
        <div className="navbuttoncontainer2">
          <Link to="/settings">
            <button className="authbutton">Settings</button>
          </Link>        </div>
        <div className="navbuttoncontainer3">
          <button
            className="authbutton"
            onClick={(e) => {
              localStorage.removeItem('token');
              localStorage.removeItem('admin');
              localStorage.removeItem('name');
              localStorage.removeItem('email');
              props.setAuth(false);
            }}
          >
            Logout
          </button>
        </div>
      </section>
      <section className='requests-main'>
        {isLoading && <div className='loading'>
          <CircularProgress />
        </div>}
        {!isLoading && <div>
          {!requests.length && 
        <div className='norequests'> 
          There is no requests at this time
        </div>
          }
          {requests.length && <div className='requests-inner'>
            {requests.map(request => {
              console.log(request);
              return <Request isRead={request.isRead} handleClick={handleClick} id={request._id} key={request._id} sourceName ={request.sourceName} requestBody={request.messageBody}/>;}
            )}
          </div>}
        </div>
        }
      </section>
    </div>
  );
};

export default RequestsPage;