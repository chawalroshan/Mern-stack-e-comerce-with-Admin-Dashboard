import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import { AiOutlineMenuFold } from "react-icons/ai";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { FaRegBell } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import {MyContext} from '../../App'
import { fetchDataFromApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';



const Header = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };

    const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const context = useContext (MyContext);

const navigate = useNavigate();

const handleSignIn = () =>{
  navigate('/login');
}


const logout = () => {
  setAnchorEl(null);

  fetchDataFromApi('/api/user/logout', { withCredentials: true })
      .then((res) => {
          console.log(res);
          if (res?.error === false) {
              context.setIsLogin(false);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              navigate('/');
          } else {
              context.openAlertBox({ type: 'error', msg: res.message || 'Logout failed' });
          }
      })
      .catch(err => {
          console.error('Logout error:', err);
          context.openAlertBox({ type: 'error', msg: 'Something went wrong during logout' });
      });
};

  return (
    <header className={`w-full h-[auto] py-2 ${context.isSidebarOpen=== true ? 'pl-64' : 'pl-5'} shadow-md pr-7 bg-white flex items-center justify-between transition-all `}>
        <div className='part1 z-10 left-10 relative'>
        <Button className='!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)] !text-[18px]' onClick={() => context.setIsSidebarOpen(!context.isSidebarOpen)}>
          {
            context.isSidebarOpen===true ? <AiOutlineMenuFold className='!text-[18px] !text-[rgba(0,0,0,0.8)] '/> : <AiOutlineMenuUnfold className='!text-[18px] !text-[rgba(0,0,0,0.8)]' />
          }
           </Button>
        </div>

        <div className="part2 w-[40px] flex items-center justify-end gap-5">
          <IconButton aria-label="cart">
      <StyledBadge badgeContent={4} color="secondary">
        <FaRegBell />
      </StyledBadge>
    </IconButton>

    {
      context.isLogin === true ?

      <div className="relative">
        <div className=' w-[35px] h-[35px] rounded-full' onClick={handleClick}>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJzJUCo-RpJB0V8hJcNhjHSbddEkvk5hZJw&s' alt='user avtar' className='w-full h-full object-cover overflow-hidden cursor-pointer rounded-full'/>

    </div>
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
        <MenuItem onClick={handleClose} className='bg-white'>
          <div className='flex items-center gap-3'>
             <div className='!rounded-full w-[35px] h-[35px] ' >
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIJzJUCo-RpJB0V8hJcNhjHSbddEkvk5hZJw&s' alt='user avtar' className='w-full h-full object-cover overflow-hidden cursor-pointer rounded-full'/>

    </div>
          </div>
          <div className="info">
            <h3 className='text-[15px] font-[500] leading-5'>{context?.userData?.name}</h3>
            <p className='text-[13px] font-[400] opacity-70'>{context?.userData?.email}</p>
          </div>
        </MenuItem>
        <Divider/>

        <MenuItem onClick={handleClose} className='flex items-center gap-3'>
          <FaRegUser className='text-[16px]'/><span className='text-[14px] '>Profile</span>
        </MenuItem>
     
        <MenuItem onClick={logout} className='flex items-center gap-3'> 
          <IoIosLogOut className='text-[18px]'/><span className='text-[14px] '>Sign Out</span>
        </MenuItem>
        
      </Menu>
    </div>

        :

        <Button className='btn btn-blue btn-sm !rounded-full !text-[12px] ' onClick={handleSignIn}>Sign In</Button>

    }

    
        </div>
      
    </header>
  )
}

export default Header
