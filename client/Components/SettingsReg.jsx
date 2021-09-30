import React, {useEffect, useState} from 'react';
import SkillAdmin from './SkillAdmin';

const SettingsReg = (props) => {
  const [newSkills, setNewSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);


  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState(false);
  const [errorExist, setErrorExist] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [wrongEmail, setWrongEmail] = useState(false);
  const emailLS = localStorage.getItem('email');
  const [email, setNewEmail] = useState('');


  function validateEmail(str) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(str).toLowerCase());
  }


  useEffect(() => {
    setNewEmail(emailLS);
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

  useEffect(() => { 
    if (errorEmail === true) {
      setTimeout(() => {
        setErrorEmail(false);
      }, 1500);}
  }
  , [errorEmail]);

  useEffect(() => { 
    if (wrongEmail === true) {
      setTimeout(() => {
        setWrongEmail(false);
      }, 1500);}
  }
  , [wrongEmail]);

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
      newReq.sort((a, b) => (a.name > b.name) ? 1 : -1);

      //setAllSkills(newReq);
    }
    catch (err) {console.log(err);}
  };

  const fetchData = async() => {
    try{
      const res = await fetch('/api/allSkills/all');
      const response = await res.json();
      response.sort((a, b) => (a.name > b.name) ? 1 : -1);
      const availableSkills = [];
      const thisSkills = [];
      for (let i = 0; i < response.length; i++ ) {
        for (let j = 0; j < response[i].teachers.length; j++) {
          if (response[i].teachers[j].email === emailLS) {
            thisSkills.push(response[i]); 
            break;
          }
        }
        if (thisSkills.length === 0) {
          availableSkills.push(response[i]);
        }
        else if(thisSkills[thisSkills.length - 1].name !== response[i].name) {
          availableSkills.push(response[i]);
        }
      }
      setNewSkills(availableSkills);
      setUserSkills(thisSkills);
    }
    catch(err) {
      console.log(err);
    }
  };

  const emailTyped = (e) => {
    setNewEmail(e.target.value);
  };

  const updateEmail = async() => {
    try{

      if(!validateEmail(email) || email === emailLS) {
        setWrongEmail(true);
        return;
      }
      const res = await fetch('api/updateemail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email': email})
      });
      const data = await res.json();
      if (data === true) {
        localStorage.removeItem('email');
        localStorage.setItem('email', email);
        setNewEmail(email);
      }
      else {
        setErrorEmail(true);
      }
    }
    catch (err) {console.log(err);}
  };


  const addNewSkill = async (arg) => {
    try {
      const res = await fetch('api/adduserskill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'skillName': newSkill, email: email})
      });  
      const response = await res.json();
      response.sort((a, b) => (a.name > b.name) ? 1 : -1);
      const availableSkills = [];
      const thisSkills = [];
      for (let i = 0; i < response.length; i++ ) {
        for (let j = 0; j < response[i].teachers.length; j++) {
          if (response[i].teachers[j].email === emailLS) {
            thisSkills.push(response[i]); 
            break;
          }
        }
        if (thisSkills.length === 0) {
          availableSkills.push(response[i]);
        }
        else if(thisSkills[thisSkills.length - 1].name !== response[i].name) {
          availableSkills.push(response[i]);
        }
      }
      setNewSkills(availableSkills);
      setUserSkills(thisSkills);
    }
    catch (err) {
      console.log(err);
    }
  };

  const deleteUserSkill = async (arg) => {
    try {
      const res = await fetch('api/deleteuserskill', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'skillName': newSkill, email: email})
      });  
      const response = await res.json();
      response.sort((a, b) => (a.name > b.name) ? 1 : -1);
      const availableSkills = [];
      const thisSkills = [];
      for (let i = 0; i < response.length; i++ ) {
        for (let j = 0; j < response[i].teachers.length; j++) {
          if (response[i].teachers[j].email === emailLS) {
            thisSkills.push(response[i]); 
            break;
          }
        }
        if (thisSkills.length === 0) {
          availableSkills.push(response[i]);
        }
        else if(thisSkills[thisSkills.length - 1].name !== response[i].name) {
          availableSkills.push(response[i]);
        }
      }
      setNewSkills(availableSkills);
      setUserSkills(thisSkills);
    }
    catch (err) {
      console.log(err);
    }
  }; 

  return (
    <div className='admin-settings-internal'>

      <div className='updateEmail'>
        <div className='form-title'>UPDATE EMAIL
        </div>
        {errorEmail && 
          <div className='skill-add-error'>
           Technical error occured. Please contact Support 
          </div>}
        {wrongEmail && 
          <div className='skill-add-error'>
              Please enter correct email
          </div>}
        <form>
          <input type="password" className="form-control-admin" placeholder={`current email: ${email}`} onChange={emailTyped} />
          <button type='button' className="sendmessage" onClick={updateEmail}>Upd</button>
        </form>   
      </div>


      <div className='user-settings-newskills'>
        <div className='form-title'>ADD SKILLS TO TEACH</div>
        {newSkills.length === 0 &&  
        <div className='noskills'> 
        No new skills at this time
        </div>}
        <div className='listofskills'> 
          {newSkills.map(skill => {
            return <SkillAdmin key={skill._id} handleClick={addNewSkill} functionality='+' name={skill.name} />;
          })}
        </div>
      </div>
      <div className='user-settings-newskills'>
        <div className='form-title'>SKILLS YOU TEACH</div>
        {userSkills.length === 0 &&  
        <div className='noskills'> 
        No data to display at this time
        </div>}
        <div className='listofskills'> 
          {userSkills.map(skill => {
            return <SkillAdmin key={skill._id} functionality='-' handleClick={deleteUserSkill} name={skill.name} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsReg;
