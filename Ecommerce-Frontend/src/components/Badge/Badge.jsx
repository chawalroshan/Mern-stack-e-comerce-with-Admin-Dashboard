import React from 'react'

const Badge = (props) => {
  return (
    <span
      className={`inline-block py-1 px-4 rounded-full text-[12px] capitalize 
        ${
        props.status === 'pending' ? 'bg-primary text-white' : ''
      } ${
        props.status === 'confirm' ? 'bg-green-500 text-white' : ''
      } ${
        props.status === 'delivered' ? 'bg-green-800 text-white' : ''
      }`}
    >
      {props.status}
    </span>
  );
}

export default Badge;
