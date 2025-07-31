import React from 'react'
import { VscSearch } from "react-icons/vsc";

const SearchBox = () => {
  return (
    <div className='w-full h-[40px]  bg-[#f1f1f1] relative overflow-hidden '>
        <input type='text' className='w-full h-[40px] bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)] p-2 focus:outline-none focus:border-[rgba(0,0,0,0.5)] rounded-md text-[12px]  ' placeholder='search here...'/>
        <VscSearch className='absolute top-[13px] right-[10px] cursor-pointer z-50 opactiy-80'  />
      
    </div>
  )
}

export default SearchBox
