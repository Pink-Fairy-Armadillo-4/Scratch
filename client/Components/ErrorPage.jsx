import React from 'react';

/*
  Component renders when visiting not existing route
*/

const ErrorPage = (props) => {
  return(
    <div className="errorPage">
      <p className="404">404</p>
      <p className='pageNotFound'> Page Not Found</p>
    </div>
  );
};



export default ErrorPage;