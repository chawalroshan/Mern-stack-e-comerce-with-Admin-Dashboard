import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";

import CategoryCollapse from '../CategoryCollapse/CategoryCollapse';

const CategoryPanel = (props) => {
    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
    };

    

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" className='catagoryPanel'>
            <h3 className='p-4 text-[16px] font-[500] flex items-center justify-between'>
                Shop By Categories
                <IoMdClose onClick={toggleDrawer(false)} className='cursor-pointer text-[20px]' />
            </h3>

            <CategoryCollapse/>
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
