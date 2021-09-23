import React from 'react';

const PopUp = (props) => {
  const handleClick = () => {
    props.toggle();
  };

  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={handleClick}>
            &times;
        </span>
        <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi maxime, sapiente laudantium tempora dicta ullam minus quasi adipisci nemo ratione, voluptatibus modi quam necessitatibus inventore excepturi quae quod laboriosam nostrum optio, ipsum animi quia cumque non. Rerum, enim consequuntur reprehenderit ipsa dolor delectus officiis consectetur aliquid nobis laboriosam esse eius explicabo nulla illo et quia blanditiis placeat dolorum libero modi assumenda. Atque libero nihil fuga quia, quas natus ex necessitatibus consequatur soluta! Et illo velit officia quam adipisci soluta at quod, repudiandae ab possimus sunt, eaque perspiciatis. Reiciendis deleniti omnis beatae eius? Aliquid dolor numquam, ratione accusamus nihil totam id sunt repellat ab praesentium! Corporis, similique. Sapiente veniam minus, voluptas dolor voluptate labore recusandae in tempora dicta impedit quo nostrum nobis temporibus hic placeat culpa ipsa. Mollitia atque porro eaque magni exercitationem praesentium vitae quas perspiciatis ratione sint consequatur cumque suscipit rem error eligendi tempore voluptatibus enim, minus velit?
        </div>
      </div>
    </div>
  );
};

export default PopUp;

