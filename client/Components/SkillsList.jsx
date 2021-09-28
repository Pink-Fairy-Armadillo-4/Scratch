import React, {useState, useEffect} from 'react';

const SkillsList = (props) => {
  const [allSkills, setAllSkills] = useState(props.graphData.skills);
  const [classname, setClassName] = useState('skillslist-button');
  const [selectedSkill, setSelectedSkill] = useState('');
  const email = localStorage.getItem('email');
  const handleClick = async (e) => {
    try{
    
      props.setSelectedUser({});
      if (selectedSkill !== e.target.id) {
        setSelectedSkill(e.target.id);
        console.log('selectedSkill', selectedSkill);
        const resp = await fetch('/api/nodes/' + e.target.id);
        const data = await resp.json();
        console.log('data', data);
        props.setGraphData(data);
      }
      else if (selectedSkill === e.target.id) {
        setSelectedSkill('');
        // props.setSelectedUser({});
        const resp = await fetch('/api/nodes/all');
        const data = await resp.json();
        props.setGraphData(data);
      }
      const container = document.querySelector('.skills-inner');
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        (button.id === e.target.id && button.className === classname) ? button.className = 'skillslist-button-a' : button.className = classname;}); 
    }
    catch(err) {
      console.log(err);
    }
  };

  return (
    <div className='skills-container'>
      <div>
        Please select a skill to find out who can help you learn it
      </div>
      
      <div className='skills-inner'>
        {allSkills.map(skill => 
          <button type='button' id={skill} className={classname} onClick={handleClick} key={skill}>{skill}</button>
        )}    
      </div>
    </div>
  );
};

export default SkillsList;