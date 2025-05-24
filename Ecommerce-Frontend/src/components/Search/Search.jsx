
import React from 'react'
import Button from '@mui/material/Button';
import { IoIosSearch } from "react-icons/io";
import '../Search/style.css';

const Search = () => {
  return (
    <div className='searchBox w-full h-[50px] bg-[#e5e5e5]  relative p-2'>
      <input
  type='text'
  placeholder='Search for products...'
  className='w-full h-[35px] p-2 text-[15px] bg-inherit focus:outline-none border-none !rounded-full'
/>

      <Button
        className='!absolute top-[5px] right-[5px] z-50 !w-[37px] !min-w-[37px] !h-[37px] !rounded-full !text-black'
      >
        <IoIosSearch className='text-[#4e4e4e] text-[22px]' />
      </Button>
    </div>
  );
};

export default Search;

