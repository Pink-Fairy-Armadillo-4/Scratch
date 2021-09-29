import React, {useEffect, useState} from 'react';
import SkillAdmin from './SkillAdmin';

const SettingsAdmin = (props) => {
  const [allSkills, setAllSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState(false);
  const [errorExist, setErrorExist] = useState(false);


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

  const handleClick = async (arg) => {
    try{
      console.log('arg', arg);
      const response = await fetch('/api/delSkill', {
        method: 'DELETE', 
        headers: {
          'Content-type': 'application/json' 
        },
        body: JSON.stringify({'skillName': arg})
      });
      const newReq = await response.json();
      setAllSkills(newReq);
    }
    catch (err) {console.log(err);}
  };

  const fetchData = async() => {
    try{
      const res = await fetch('/api/allSkills/all');
      const response = await res.json();
      console.log('skillsinsettings', response);
      setAllSkills(response);
    }
    catch(err) {
      console.log(err);
    }
  };

  const skillTyped = (e) => {
    setNewSkill(e.target.value);
  };
  
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
      const res = await fetch('api/addskill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'skill': newSkill})
      });

      const data = res.json();
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
            return <SkillAdmin key={skill._id} handleClick={handleClick} name={skill.name} />;
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
          <form>
            <input type="password" className="form-control-admin" placeholder="Enter skill" onChange={skillTyped} />
            <button type='button' className="sendmessage" onClick={addSkill}>Add</button>
          </form>      
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;