import React, {useState} from 'react';

const SkillButton = (props) => {
  const [stat, setStat] = useState('inactiveskillbutton');
  const clicked = (e) => {
    console.log('ejeje', e.target.id);
    props.onClick(e.target.id);
    stat === 'inactiveskillbutton' ? setStat('activeskillbutton') : setStat('inactiveskillbutton');
  };
  return (
    <button type='button' id={props.id} className={stat} onClick ={clicked}>{props.skill}</button>
  );
};

export default SkillButton;