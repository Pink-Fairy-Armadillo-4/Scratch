import React, {useState} from 'react';

const SkillAdmin = (props) => {

  const buttonClicked = (e) => {
    props.handleClick(e.target.id);
  };

  return (
    <div className='skill-admin'>
      <div className='skill-name-container'> {props.name} </div>
      <button type='button' className='skill-admin-delete' id={props.name} onClick={buttonClicked}> D</button>
    </div>
  );
};

export default SkillAdmin;