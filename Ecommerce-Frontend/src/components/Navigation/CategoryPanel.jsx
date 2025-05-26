import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
import { FaRegSquarePlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FiMinus } from "react-icons/fi";

const CategoryPanel = (props) => {
    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
    };

    // Submenu open states
    const [openSubmenus, setOpenSubmenus] = useState({
        fashion: false,
        outwear: false,
    });

    // Inner submenu open states
    const [openInnerSubmenus, setOpenInnerSubmenus] = useState({
        fashionAppreal: false,
        outwearAppreal: false,
    });

    const toggleSubmenu = (key) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleInnerSubmenu = (key) => {
        setOpenInnerSubmenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" className='catagoryPanel'>
            <h3 className='p-4 text-[16px] font-[500] flex items-center justify-between'>
                Shop By Categories
                <IoMdClose onClick={toggleDrawer(false)} className='cursor-pointer text-[20px]' />
            </h3>

            <div className="scroll">
                <ul className='w-full'>

                    {/* FASHION */}
                    <li className='list-none flex items-center relative flex-col'>
                        <Link to='/' className='w-full'>
                            <Button className='w-full text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Fashion</Button>
                        </Link>
                        {
                            openSubmenus.fashion
                                ? <FiMinus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleSubmenu('fashion')} />
                                : <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleSubmenu('fashion')} />
                        }

                        {openSubmenus.fashion && (
                            <ul className='submenu w-full pl-3'>
                                {/* FASHION > APPREAL */}
                                <li className='list-none relative'>
                                    <Link to='/' className='w-full'>
                                        <Button className='w-full text-left !text-[14px] !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Appreal</Button>
                                    </Link>
                                    {
                                        openInnerSubmenus.fashionAppreal
                                            ? <FiMinus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleInnerSubmenu('fashionAppreal')} />
                                            : <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleInnerSubmenu('fashionAppreal')} />
                                    }

                                    {openInnerSubmenus.fashionAppreal && (
                                        <ul className='inner_submenu w-full pl-3'>
                                            {['Smart Tablet', 'Crepe T-shirt', 'Leather Watch', 'Rolling Diamond'].map((item, idx) => (
                                                <li key={idx} className='list-none relative mb-1'>
                                                    <Link to='/' className='link w-full text-left !text-[14px] !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* OUTWEAR */}
                    <li className='list-none flex items-center relative flex-col'>
                        <Link to='/' className='w-full'>
                            <Button className='w-full text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Outwear</Button>
                        </Link>
                        {
                            openSubmenus.outwear
                                ? <FiMinus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleSubmenu('outwear')} />
                                : <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleSubmenu('outwear')} />
                        }

                        {openSubmenus.outwear && (
                            <ul className='submenu w-full pl-3'>
                                {/* OUTWEAR > APPREAL */}
                                <li className='list-none relative'>
                                    <Link to='/' className='w-full'>
                                        <Button className='w-full text-left !text-[14px] !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>Appreal</Button>
                                    </Link>
                                    {
                                        openInnerSubmenus.outwearAppreal
                                            ? <FiMinus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleInnerSubmenu('outwearAppreal')} />
                                            : <FaRegSquarePlus className='absolute top-[10px] right-[15px] cursor-pointer' onClick={() => toggleInnerSubmenu('outwearAppreal')} />
                                    }

                                    {openInnerSubmenus.outwearAppreal && (
                                        <ul className='inner_submenu w-full pl-3'>
                                            {['Smart Tablet', 'Crepe T-shirt', 'Leather Watch', 'Rolling Diamond'].map((item, idx) => (
                                                <li key={idx} className='list-none relative mb-1'>
                                                    <Link to='/' className='link w-full text-left !text-[14px] !justify-start !px-3 !text-[rgba(0,0,0,0.8)]'>
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        )}
                    </li>

                </ul>
            </div>
        </Box>
    );

    return (
        <div>
            <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};

export default CategoryPanel;
