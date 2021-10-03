import React, {useState} from 'react';

/*
rendered in PopUpReg component
onClick trigers OnClick of parent component passing it's id(skill id) 
and changes it's state to change class and render different style of component
 */

const SkillButton = (props) => {
  const [stat, setStat] = useState('inactiveskillbutton');
  const clicked = (e) => {
    props.onClick(e.target.id);
    stat === 'inactiveskillbutton' ? setStat('activeskillbutton') : setStat('inactiveskillbutton');
  };
  return (
    <button type='button' id={props.id} className={stat} onClick ={clicked}>{props.skill}</button>
  );
};

export default SkillButton;