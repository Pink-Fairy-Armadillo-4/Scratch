import React from 'react';

const PopUpReg = (props) => {
  const handleClick = () => {
    props.toggleReg();
  };

  return (
    <div className="modal">
      <div className="modal_content_login">
        <span className="close" onClick={handleClick}>
            &times;
        </span>
        <div>
          <h4>Signup</h4> 
        </div>
      </div>
    </div>
  );
};

export default PopUpReg;

