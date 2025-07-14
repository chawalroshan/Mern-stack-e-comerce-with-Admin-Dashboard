import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { RiMenu2Fill } from "react-icons/ri";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { FaRegBell } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";



const Header = () => {


     const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

    const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

  return (
    <header className='w-full py-2 pl-64 pr-7 bg-[#ffffff] flex items-center border-b border-[rgba(0,0,0,0.1)] justify-between shadow-md'>
        <div className='part1'>
        <Button className='!w-[40px] !h-[40px] !rounded-full !min-w-[40px]'><RiMenu2Fill className='text-[18px] !text-[rgba(0,0,0,0.8)]'/> </Button>
        </div>

        <div className="part2 w-[40px] flex items-center justify-end gap-5">
          <IconButton aria-label="cart">
      <StyledBadge badgeContent={4} color="secondary">
        <FaRegBell />
      </StyledBadge>
    </IconButton>

    <div className="relative">
        <div className=' w-[35px] h-[35px] rounded-full' onClick={handleClickMyAcc}>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJzJUCo-RpJB0V8hJcNhjHSbddEkvk5hZJw&s' alt='user avtar' className='w-full h-full object-cover overflow-hidden cursor-pointer rounded-full'/>

    </div>
    <Menu
        anchorEl={anchorMyAcc}
        id="account-menu"
        open={openMyAcc}
        onClose={handleCloseMyAcc}
        onClick={handleCloseMyAcc}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCloseMyAcc} className='bg-white'>
          <div className='flex items-center gap-3'>
             <div className='!rounded-full w-[35px] h-[35px] ' >
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJzJUCo-RpJB0V8hJcNhjHSbddEkvk5hZJw&s' alt='user avtar' className='w-full h-full object-cover overflow-hidden cursor-pointer rounded-full'/>

    </div>
          </div>
          <div className="info">
            <h3 className='text-[15px] font-[500] leading-5'>Aiish</h3>
            <p className='text-[13px] font-[400] opacity-70'>admin@gmail.com</p>
          </div>
        </MenuItem>
        <Divider/>

        <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
          <FaRegUser className='text-[16px]'/><span className='text-[14px] '>Profile</span>
        </MenuItem>
     
        <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'> 
          <IoIosLogOut className='text-[18px]'/><span className='text-[14px] '>Sign Out</span>
        </MenuItem>
        
      </Menu>
    </div>
        </div>
      
    </header>
  )
}

export default Header
