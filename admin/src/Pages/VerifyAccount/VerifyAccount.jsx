import Button from '@mui/material/Button'
import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiLoginCircleLine } from "react-icons/ri"
import { FaRegUser } from "react-icons/fa6"
import OtpBox from '../../components/OtpBox/OtpBox'
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App'
import { postData } from '../../utils/api'


const VerifyAccount = () => {

  const [otp, setOtp] = useState('');
  const handleChange = (value) => {
    setOtp(value);
  };

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const verifyOTP = (e) => {
    e.preventDefault();
  
    const actionType = localStorage.getItem('actionType');
    const userEmail = localStorage.getItem('userEmail') || '';
  
    if (!userEmail) {
      context.openAlertBox({ type: 'error', msg: 'User email not found' });
      return;
    }

    // Add debugging
    console.log('Sending verification request:', {
      email: userEmail,
      otp: otp,
      actionType: actionType
    });
  
    if (actionType !== 'forgot-password') {
      setIsLoading(true); // ✅ start loading
      postData('/api/user/verifyEmail', { email: userEmail, otp: otp.toString() })
        .then((res) => {
          console.log('Verification response:', res);
          context.openAlertBox({
            type: res?.error ? 'error' : 'success',
            msg: res?.message || "OTP Verified Successfully!"
          });
          if (!res?.error) {
            localStorage.removeItem('userEmail');
            navigate('/login');
          }
        })
        .catch((err) => {
          console.error("OTP Verification Error:", err);
          context.openAlertBox({ type: 'error', msg: "Something went wrong, please try again." });
        })
        .finally(() => {
          setIsLoading(false);
      });
    } else {
      postData('/api/user/verify-forgot-password-otp', { email: userEmail, otp })
        .then((res) => {
          console.log('Forgot password verification response:', res);
          context.openAlertBox({
            type: res?.error ? 'error' : 'success',
            msg: res?.message || "OTP Verified Successfully!" 
          });
          if (!res?.error) {
            // localStorage.removeItem('userEmail');
            navigate('/reset-password');
          }
        })
        .catch((err) => {
          console.error("OTP Verification Error:", err);
          context.openAlertBox({ type: 'error', msg: "Something went wrong, please try again." });
        });
    }
  };

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
            <span className='text-primary font-bold'> {localStorage.getItem('userEmail')}</span>
          </p>
        </div>
        <form onSubmit={verifyOTP}>
        <div className='flex items-center justify-center mt-4'>
          <OtpBox length={6} onOtpChange={(handleChange)} />
        </div>
        <br />
        <Button type='submit' className='btn-blue w-full mt-3'>Verify OTP</Button>
        </form>


        

        


      </div>
    </section>
  )
}

export default VerifyAccount
