import React from 'react'

const ProgressBar = (props) => {

    let colorClass = 'bg-primary';
  if (props.status === 'success') colorClass = 'bg-green-700';
  else if (props.status === 'error') colorClass = 'bg-red-500';
  else if (props.status === 'warning') colorClass = 'bg-yellow-500';
  else if (props.status === 'info') colorClass = 'bg-blue-700';

  return (
    <div className='w-[100px] h-auto bg-gray-200 rounded-full overflow-hidden'>
      <span
        className={`flex items-center h-[8px] ${colorClass}`}
        style={{ width: `${props.value}%` }}
      ></span>
    </div>
  )
}

export default ProgressBar
