import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RiLoginCircleLine } from "react-icons/ri"
import { FaRegUser } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc"
import { BsFacebook } from "react-icons/bs"
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

const Login = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingFacebook, setLoadingFacebook] = useState(false)

  return (
    <section className='bg-white w-full h-full fixed top-0 left-0'>
 
      <header className='w-full fixed top-0 left-0 px-6 py-4 flex items-center justify-between z-50 bg-white shadow'>
        <Link to='/'>
          <img src='/mannerLogo.png' className='w-[180px]' alt='Logo' />
        </Link>
        <div className='flex items-center gap-3'>
          <NavLink to='/login'>
            <Button className='rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1'>
              Login <RiLoginCircleLine className='text-[18px]' />
            </Button>
          </NavLink>
          <NavLink to='/signup'>
          <Button className='rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1'>
            Sign Up <FaRegUser className='text-[15px]' />
          </Button>
          </NavLink>
        </div>
      </header>

      <img
        src='https://static.vecteezy.com/system/resources/previews/001/838/299/non_2x/abstract-silver-metallic-join-lines-on-white-background-geometric-triangle-gradient-shape-pattern-luxury-style-vector.jpg'
        className='w-full fixed top-0 left-0 opacity-10 object-cover'
        alt='background'
      />

      <div className="loginBox card w-[90%] md:w-[45%] mx-auto mt-32 p-8 rounded-lg shadow relative z-50 bg-white">
        <div className='text-center mb-4'>
          <img
            src='https://img.freepik.com/free-photo/shopping-cart-ecommerce-shop-online-store-cartoon-website-icon-sign-symbol-illustration-3d-rendering_56104-1273.jpg'
            className='mx-auto w-[150px] h-[100px]'
            alt='shopping-cart'
          />
        </div>

        <h1 className='text-center text-[35px] font-bold'>
          Welcome Back! <br />
          <span className='font-extrabold text-[#0088de]'>
            Sign in with your credentials.
          </span>
        </h1>

        <div className='flex flex-wrap items-center justify-center mt-6 gap-4'>
          <Button
            size="small"
            onClick={() => setLoadingGoogle(true)}
            startIcon={<FcGoogle className='!text-[14px] '/>}
            loading={loadingGoogle}
            variant="outlined"
            className='!text-[16px] !capitalize !px-5 !text-[rgba(0,0,0,0.8)]'
          >
            Sign In with Google
          </Button>

          <Button
            size="small"
            onClick={() => setLoadingFacebook(true)}
            startIcon={<BsFacebook className='text-[#0866fe]' />}
            loading={loadingFacebook}
            variant="outlined"
            className='!text-[16px] !capitalize !px-5 !text-[rgba(0,0,0,0.8)]'
          >
            Sign In with Facebook
          </Button>
        </div>

        <div className='w-full flex items-center justify-center gap-3 mt-6'>
          <span className='flex-grow h-[1px] bg-[rgba(0,0,0,0.2)]'></span>
          <span className='text-[14px] font-medium whitespace-nowrap'>Or, Sign in with your email</span>
          <span className='flex-grow h-[1px] bg-[rgba(0,0,0,0.2)]'></span>
        </div>


        <form className='w-full mt-6 space-y-4 relative'>

          <div>
            <label className='block text-[14px] font-medium mb-1'>Email</label>
            <input
              type='email'
              className='w-full border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.5)] focus:outline-none px-3 py-2'
            />
          </div>

          <div className='relative'>
            <label className='block text-[14px] font-medium mb-1'>Password</label>
            <input
              type={isPasswordShow ? 'text' : 'password'}
              className='w-full border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.5)] focus:outline-none px-3 py-2'
            />
            <Button
              onClick={() => setIsPasswordShow(!isPasswordShow)}
              className='!absolute top-[35px] right-[10px] z-10 !rounded-full !min-w-[35px] !p-0'
            >
              {isPasswordShow ? (
                <FaRegEyeSlash className='text-[rgba(0,0,0,0.8)] w-[20px] h-[18px] ' />
              ) : (
                <FaRegEye className='text-[rgba(0,0,0,0.8)] w-[20px] h-[18px]' />
              )}
            </Button>
          </div>

          <div className='flex items-center justify-between'>
            <FormControlLabel control={<Checkbox />} label="Remember Me" />
            <Link to='/forgot-password' className='text-primary font-bold text-[15px] hover:underline hover:text-gray-700'>
              Forget Password ?
            </Link>
          </div>

          <Button className='btn-blue w-full btn-lg'>Sign In</Button>
        </form>
      </div>
    </section>
  )
}

export default Login
