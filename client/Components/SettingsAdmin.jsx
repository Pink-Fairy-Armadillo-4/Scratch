import React, {useEffect, useState} from 'react';
import SkillAdmin from './SkillAdmin';

const SettingsAdmin = (props) => {
  //handles all skills received on mount from fetch,
  const [allSkills, setAllSkills] = useState([]);
  //holds newSkill state that is set on Change of input value;
  const [newSkill, setNewSkill] = useState('');
  // state updates if newSkill is not set but submit clicked. 
  // conditionally renders error div
  const [error, setError] = useState(false);
  //state updates if newSkill is already existing in list of allSkills
  //conditionally renders error div
  const [errorExist, setErrorExist] = useState(false);

  //triggers func to fetch all skills on mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => { 
    if (error === true) {
      setTimeout(() => {
        setError(false);
      }, 1500);}
  }
  , [error]);

  useEffect(() => { 
    if (errorExist === true) {
      setTimeout(() => {
        setErrorExist(false);
      }, 1500);}
  }
  , [errorExist]);

  // func to delete skill, triggered in SkillAdmin component, 
  // receives new skills and sets state to hold all skills, rerenders component
  // sorts all skills in ascending order 
  const handleClick = async (arg) => {
    try{
      const response = await fetch('/api/delSkill', {
        method: 'DELETE', 
        headers: {
          'Content-type': 'application/json' 
        },
        body: JSON.stringify({'skillName': arg})
      });
      const newReq = await response.json();
      newReq.sort((a, b) => (a.name > b.name) ? 1 : -1);

      setAllSkills(newReq);
    }
    catch (err) {console.log(err);}
  };

  // receives new skills and sets state to hold all skills, rerenders component on mount
  // sorts all skills in ascending order 
  const fetchData = async() => {
    try{
      const res = await fetch('/api/allSkills/all');
      const response = await res.json();
      console.log('skillsinsettings', response);
      response.sort((a, b) => (a.name > b.name) ? 1 : -1);
      setAllSkills(response);
    }
    catch(err) {
      console.log(err);
    }
  };

  const skillTyped = (e) => {
    setNewSkill(e.target.value);
  };
  
  // func to add skill, receives skill from state that is set as value of input on change
  // receives new skills and sets state to hold all skills, rerenders component
  // sorts all skills in ascending order 
  const addSkill = async () => {
    try {
      if (!newSkill) {
        setError(true);
        return;
      }
      for (let i = 0; i < allSkills.length; i++) {
        if(allSkills[i].name.toLowerCase() === newSkill.toLowerCase()) {
          setErrorExist(true);
          return;
        }
      }
      const res = await fetch('api/addSkill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'skillName': newSkill})
      });

      const data = await res.json();
      data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      setAllSkills(data);
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='admin-settings-internal'>
      <div className='admin-settings-skills'>
        <div className='form-title'>LIST OF SKILLS</div>
        <div className='listofskills'> 
          {allSkills.map(skill => {
            return <SkillAdmin key={skill._id} functionality='-' handleClick={handleClick} name={skill.name} />;
          })}
        </div>
      </div>
      <div className='admin-settings-addskill'>
        <div className='admin-settings-addcontainer'>
          <div className='form-title'>ADD NEW SKILL</div>
          {error && 
          <div className='skill-add-error'>
              Please enter skill to add to the system
          </div>}
          {errorExist && 
          <div className='skill-add-error'>
              This skill already exists in the system
          </div>}
          <form className='password-form'> 
            <input type="text" className="form-control-admin" placeholder="Enter skill" onChange={skillTyped} />
            <button type='button' className="skill-admin-add" onClick={addSkill}>+</button>
          </form>      
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;