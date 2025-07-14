import React from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { Button } from '@mui/material';

const AccountSidebar = () => {
  return (
     <div className="card bg-white shadow-md rounded-md sticky top-[10px]">
                    <div className='w-full p-5 flex items-center justify-center flex-col'>
                        <div className='w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group'>
                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJzJUCo-RpJB0V8hJcNhjHSbddEkvk5hZJw&s' className='w-full h-full object-cover '/>

                            <div className="overlay w-[100%] h-[100%] absolute top-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
                            <FaCloudUploadAlt className='text-[#fff] text-[25px]'/>
                            <input type='file' className='absolute top-0 left-0 w-full h-full opacity-0'/>
                            </div>

                        </div>

                        <h3 className=''>Aaish</h3>
                        <h6 className='text-[13px] font-[500]'>chawalroshan@gmail.com</h6>

                    </div>

                    <ul className='list-none pb-5 bg-[#f1f1f1] myAccountTabs'>
                        <li className='w-full'>
                            <NavLink to='/my-account' className={({ isActive }) => isActive ? "active" : ""} >
                            <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <FaRegUser className='text-[15px]'/>My Profile</Button>
                        </NavLink>
                        </li>

                        <li className='w-full'>
                            <NavLink to='/my-list' className={({ isActive }) => isActive ? "active" : ""} >
                            <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <FaRegHeart className='text-[16px]'/> My List</Button>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to='/orders' className={({ isActive }) => isActive ? "active" : ""} >
                            <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <IoBagCheckOutline className='text-[16px]'/>My Order</Button>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to='/logout' className={({ isActive }) => isActive ? "active" : ""} >
                            <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <IoIosLogOut className='text-[18px]'/>Logout</Button>
                            </NavLink>
                        </li>
                        
                    </ul>

                </div>
  )
}

export default AccountSidebar
