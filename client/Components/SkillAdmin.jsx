import React, { useState } from 'react';

/*
Rendered component in SettingsAdmin
OnClick triggers handleClick in parent component passing id as arg. 
 */

const SkillAdmin = (props) => {
  const buttonClicked = (e) => {
    props.handleClick(e.target.id);
  };

  return (
    <div className="skill-admin">
      <div className="skill-name-container"> {props.name} </div>
      <button
        type="button"
        className={
          props.functionality === '-' ? 'skill-admin-delete' : 'skill-admin-add'
        }
        id={props.name}
        onClick={buttonClicked}
      >
        {' '}
        {props.functionality}
      </button>
    </div>
  );
};

export default SkillAdmin;
