import React from 'react'

const Badge = (props) => {
  const getStatusClass = (status) => {
    const statusMap = {
      // Order statuses
      'placed': 'bg-blue-500 text-white',
      'confirmed': 'bg-green-500 text-white',
      'shipped': 'bg-purple-500 text-white',
      'delivered': 'bg-green-800 text-white',
      'cancelled': 'bg-red-500 text-white',
      // Payment statuses
      'pending': 'bg-yellow-500 text-white',
      'paid': 'bg-green-600 text-white',
      'failed': 'bg-red-600 text-white',
      // Legacy
      'confirm': 'bg-green-500 text-white'
    };
    return statusMap[status] || 'bg-gray-500 text-white';
  };

  return (
    <span
      className={`inline-block py-1 px-4 rounded-full text-[12px] capitalize ${getStatusClass(props.status)}`}
    >
      {props.status}
    </span>
  );
}

export default Badge;
