import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RiLoginCircleLine } from "react-icons/ri"
import { FaRegUser } from "react-icons/fa6"
import OtpBox from '../../../../client/src/components/OtpBox/OtpBox'


const VerifyAccount = () => {

  const [otp, setOtp] = useState('');
  const handleChange = (value) => {
    setOtp(valaue);
  }

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
            Please Verify your Email
          </span>
        </h1>

        <div className='flex items-center justify-center'>
          <p className='text-[15px]'>OTP send to
            <span className='text-primary font-bold'> chawalroshan@gmail.com</span>
          </p>
        </div>
        <div className='flex items-center justify-center mt-4'>
          <OtpBox length={6} onOtpChange={(handleChange)} />
        </div>


        <br />

        <Button className='btn-blue w-full mt-3'>Verify OTP</Button>


      </div>
    </section>
  )
}

export default VerifyAccount
