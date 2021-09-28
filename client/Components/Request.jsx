import React, {useState} from 'react';

const Request = (props) => {
  return (
    <div className='request'>
      <div className='requests-name'>{props.sourceName}</div>
      <div className='requests-body'>{props.requestBody}</div>  
    </div>
  );
};

export default Request;