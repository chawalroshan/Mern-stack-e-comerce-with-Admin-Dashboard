import React from 'react'
import { IoMdTime } from "react-icons/io";
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";


const BlogItem = () => {
  return (
    <div className='blogItem group'>
      <div className='imageWrapper w-full overflow-hidden rounded-md cursor-pointer relative'>
        <img src='https://serviceapi.spicezgold.com/download/1741758993155_6-4.jpg'  className='w-full transition-all group-hover:scale-105' alt='Blog'/>

        <span className='flex items-center justify-center !text-white absolute bottom-[15px] right-[15px] z-50 bg-primary rounded-md p-1 text-[12px] font-[500]'>
            <IoMdTime className='text-[16px] gap-2' /> 5April, 2023
        </span>
      </div>

      <div className='info py-4'>
        
        <h2 className='text-[15px] font-[600]'>
           <Link to='/' className='link'> Explore sustainable living through cutting-edge prefabricated homes </Link>
        </h2>
        <p className='text-[13px] font-[400] '>Give lady of they such they sure it. Me contained explained my education. Vulgar as hearts by g...</p>
        <Link to='/' className='link font-[500] text-[14px] flex items-center gap-1'>Read More <IoIosArrowForward />
    </Link>
      </div>

      
    </div>
  )
}

export default BlogItem
