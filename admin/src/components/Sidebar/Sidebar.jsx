import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { Collapse } from 'react-collapse';

const Sidebar = () => {
    const [submenuIndex, setSubmenuIndex] = useState(null);

    const isOpenSubMenu = (index) => {
        setSubmenuIndex(submenuIndex === index ? null : index);
    };

    return (
        <div className='sidebar fixed top-0 left-0 bg-[#f1f1f1] w-[15%] h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-3'>
            <div className='py-2 w-full'>
                <Link to='/'>
                    <img src='https://ecme-react.themenate.net/img/logo/logo-light-full.png' className='w-[120px]' alt="Logo" />
                </Link>
            </div>

            <ul className='list-none mt-4'>
                <li>
                    <Button className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]'>
                        <RxDashboard className='text-[18px]' />
                        <span>Dashboard</span>
                    </Button>
                </li>

                <li>
                    <Button 
                        className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]'
                        onClick={() => isOpenSubMenu(1)}
                    >
                        <FaRegImage className='text-[18px]' />
                        <span>Home Slides</span>
                        <span className='ml-auto flex items-center justify-center w-[30px] h-[30px]'>
                            <FaAngleDown className={`transition-all ${submenuIndex ===1 ? 'rotate-180 ' : ''}` }/>
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 1} className='w-full'>
                        <ul className='w-full pl-4 mt-2 list-none'>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    Home Banner List
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    Add Home Banner Slide
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                <li>
                    <Button className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]'>
                        <FiUsers className='text-[18px]' />
                        <span>Users</span>
                    </Button>
                </li>

                <li>
                    <Button className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]' onClick={() => isOpenSubMenu(3)}>
                        <RiProductHuntLine className='text-[18px]' />
                        <span>Products</span>
                        <span className='ml-auto flex items-center justify-center w-[30px] h-[30px]'><FaAngleDown className={`transition-all ${submenuIndex === 3 ? 'rotate-180 ' : ''}` }/></span>
                        
                    </Button>
                    <Collapse isOpened={submenuIndex === 3} className='w-full'>
                        <ul className='w-full pl-4 mt-2 list-none'>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    product List
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    product upload
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                <li>
                    <Button className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]' onClick={() => isOpenSubMenu(4)}>
                        <TbCategory className='text-[18px]' />
                        <span>Category</span>
                        <span className='ml-auto flex items-center justify-center w-[30px] h-[30px]'><FaAngleDown  className={`transition-all ${submenuIndex === 4 ? 'rotate-180 ' : ''}` }/></span>
                    </Button>
                     <Collapse isOpened={submenuIndex === 4} className='w-full'>
                        <ul className='w-full pl-4 mt-2 list-none'>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    Category list 
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    add a category
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                   sub category
                                </Button>
                            </li>
                            <li className='w-full'>
                                <Button className='!text-[rgba(0,0,0,0.8)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3'>
                                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] '></span>
                                    add a sub category
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                <li>
                    <Button className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]'>
                        <IoBagCheckOutline className='text-[18px]' />
                        <span>Orders</span>
                    </Button>
                </li>

                <li>
                    <Button className='w-full !capitalize !justify-start flex items-center !gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] !py-2 hover:!bg-[#f1f1f1]'>
                        <IoIosLogOut className='text-[18px]' />
                        <span>Logout</span>
                    </Button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
