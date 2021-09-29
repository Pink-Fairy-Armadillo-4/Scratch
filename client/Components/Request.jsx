import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, Trash } from '@fortawesome/free-solid-svg-icons';



const Request = (props) => {
  const[style, setStyle] = useState('requests-body');
  console.log(props.id);

  const deleteMessage = (e) => {
    props.handleClick(e.target.id);
  };

  useEffect(() => {
    !props.isRead ? setStyle('requests-body-new') : null;
  }, []);

  useEffect(() => { 
    if (style === 'requests-body-new') {
      setTimeout(() => {
        setStyle('requests-body');
      }, 5000);}
  }
  , [style]);

  

  return (
    <div className='request'>
      <div className='requests-name'>{props.sourceName}</div>
      <div className={style}>{props.requestBody}</div>  
      <button type='button' id={props.id} onClick={deleteMessage} className='delete-request'>
        <FontAwesomeIcon className="navIcons" icon={faTrashAlt}/>
      </button>
    </div>
  );
};

export default Request;