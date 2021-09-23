import React, { useState, useEffect } from 'react';

const App = (props) => {   
  const [name, setName] = useState('');
  useEffect(() => {
    dataSync();
  }, []);

  const dataSync = async() => {
    try{
      const result = await fetch('/api/getname');
      const data = await result.json();
      setName(data);
    } 
    catch(err) {
      console.log(err);
    }
  };
  return(
    <div>
      <h1>Hello, {name}</h1>
    </div>
  );
  
};

export default App;