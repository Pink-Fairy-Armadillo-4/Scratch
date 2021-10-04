import React, { useState, useEffect } from 'react';
/*
 Request/Message component.
 renders date, sender and Request Body.
 Has different classes for read and unread requests
 */

const Request = (props) => {

  const [style, setStyle] = useState('requests-body');
  const date = new Date(props.time);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const day = date.toLocaleDateString('en-US');

  const deleteMessage = (e) => {
    props.handleClick(e.target.id);
  };

  useEffect(() => {
    !props.isRead ? setStyle('requests-body-new') : null;
  }, []);


  return (
    <div className="request">
      <div className="requests-name">
        <span className="username">{props.sourceName} </span>
        <span className="time">
          {time} {day}
        </span>
      </div>
      <div className={style}>{props.requestBody}</div>
      <button
        type="button"
        id={props.id}
        onClick={deleteMessage}
        className="delete-request"
      >
        -
      </button>
    </div>
  );
};

export default Request;
