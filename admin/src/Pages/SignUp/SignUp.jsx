import Button from '@mui/material/Button'
import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiLoginCircleLine } from "react-icons/ri"
import { FaRegUser } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc"
import { BsFacebook } from "react-icons/bs"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api'
import { MyContext } from '../../App'


const Signup = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingFacebook, setLoadingFacebook] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name:'',
    email: '',
    password: ''
})

const navigate = useNavigate();
const context = useContext(MyContext);

const onChangeInput = (e) => {
  const { name, value } = e.target;
  setFormFields({
      ...formFields,
      [name]: value
  });
};

const validValue = Object.values(formFields).every(el => el);

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("register attempt started");

  if (formFields.email === '') {
      context.openAlertBox({
          type: 'error',
          msg: 'Please add email address'
      });
      return false;
  }

  if (formFields.password === '') {
      context.openAlertBox({
          type: 'error',
          msg: 'Please enter password'
      });
      return false;
  }

  console.log("Form validation passed, making API call...");
  setIsLoading(true); // ✅ start loading
  postData('/api/user/register', formFields, { withCredentials: true })
            .then((response) => {
                console.log("Register Response:", response);

                // Check if register was successful
                if (response.success) {
                  localStorage.setItem("userEmail", formFields.email);
                    // Set localStorage first
                    if (response.data) {
                        localStorage.setItem("userEmail", formFields.email);
                        localStorage.setItem("accessToken", response.data.accessToken);
                        localStorage.setItem("refreshToken", response.data.refreshToken);
                    }

                    // Set global auth state
                    context.setIsLogin(true);
                    
                    // Show success message
                    context.openAlertBox({ type: 'success', msg: response.message });

                    // Wait a bit for context to update, then navigate
                    setTimeout(() => {
                        navigate("/verify-account");
                    });
                } else {
                    // Show backend error message
                    context.openAlertBox({ type: 'error', msg: response.message || 'Register failed!' });
                }
            })
            .catch((err) => {
                console.error("Login Error:", err);
                // Use backend error message if available
                const errorMsg = err.response?.data?.message || 'Something went wrong during register.';
                context.openAlertBox({ type: 'error', msg: errorMsg });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

  return (
    <section className='bg-white min-h-screen w-full relative overflow-y-auto'>
      <img
        src='https://static.vecteezy.com/system/resources/previews/001/838/299/non_2x/abstract-silver-metallic-join-lines-on-white-background-geometric-triangle-gradient-shape-pattern-luxury-style-vector.jpg'
        className='absolute inset-0 w-full h-full opacity-10 object-cover'
        alt='background'
      />

      <header className='w-full sticky top-0 left-0 px-6 py-4 flex items-center justify-between z-20 bg-white/90 backdrop-blur shadow'>
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

      <div className="loginBox card w-[90%] md:w-[45%] mx-auto mt-32 md:mt-36 mb-12 p-8 rounded-lg shadow relative z-10 bg-white">
        <div className='text-center mb-4'>
          <img
            src='https://img.freepik.com/free-photo/shopping-cart-ecommerce-shop-online-store-cartoon-website-icon-sign-symbol-illustration-3d-rendering_56104-1273.jpg'
            className='mx-auto w-[150px] h-[100px]'
            alt='shopping-cart'
          />
        </div>

        <h1 className='text-center text-[35px] font-extrabold text-[#0088de]'>
          Join us today! <br />
          <span className='font-bold text-black'>
            Get special benefits and stay up-to-date.
          </span>
        </h1>


        <div className='flex flex-wrap items-center justify-center mt-6 gap-4'>
          <Button
            size="small"
            onClick={() => setLoadingGoogle(true)}
            startIcon={<FcGoogle className='!text-[14px]' />}
            loading={loadingGoogle}
            variant="outlined"
            className='!text-[16px] !capitalize !px-5 !text-[rgba(0,0,0,0.8)]'
          >
            Sign Up with Google
          </Button>

          <Button
            size="small"
            onClick={() => setLoadingFacebook(true)}
            startIcon={<BsFacebook className='text-[#0866fe]' />}
            loading={loadingFacebook}
            variant="outlined"
            className='!text-[16px] !capitalize !px-5 !text-[rgba(0,0,0,0.8)]'
          >
            Sign Up with Facebook
          </Button>
        </div>

        <div className='w-full flex items-center justify-center gap-3 mt-6'>
          <span className='flex-grow h-[1px] bg-[rgba(0,0,0,0.2)]'></span>
          <span className='text-[14px] font-medium whitespace-nowrap'>Or, Sign up with email</span>
          <span className='flex-grow h-[1px] bg-[rgba(0,0,0,0.2)]'></span>
        </div>

        <form className='w-full mt-6 space-y-4 relative' onClick={handleSubmit}>

          <div>
            <label className='block text-[14px] font-medium mb-1'>Full Name</label>
            <input
              type='text'
              placeholder=''
              name='name'
                                value={formFields.name}
                                disabled={isLoading}
                                onChange={onChangeInput}
              className='w-full border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.5)] focus:outline-none px-3 py-2'
            />
          </div>

          <div>
            <label className='block text-[14px] font-medium mb-1'>Email</label>
            <input
              type='email'
              placeholder=''
              name='email'
                                value={formFields.email}
                                disabled={isLoading}
                                onChange={onChangeInput}
              className='w-full border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.5)] focus:outline-none px-3 py-2'
            />
          </div>

          <div className='relative'>
            <label className='block text-[14px] font-medium mb-1'>Password</label>
            <input
              type={isPasswordShow ? 'text' : 'password'}
              placeholder=''
              name='password'
                                value={formFields.password}
                                disabled={isLoading}
                                onChange={onChangeInput}
              className='w-full border border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.5)] focus:outline-none px-3 py-2'
            />
            <Button
              onClick={() => setIsPasswordShow(!isPasswordShow)}
              className='!absolute top-[35px] right-[10px] z-10 !rounded-full !min-w-[35px] !p-0'
            >
              {isPasswordShow ? (
                <FaRegEyeSlash className='text-[rgba(0,0,0,0.8)] w-[20px] h-[18px]' />
              ) : (
                <FaRegEye className='text-[rgba(0,0,0,0.8)] w-[20px] h-[18px]' />
              )}
            </Button>
          </div>

                            <Button
                                type='submit'
                                disabled={!validValue || isLoading}
                                className='btn-blue w-full btn-lg'
                            >
                                {isLoading ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" />
                                        Sign Up
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        
        </form>
      </div>
    </section>
  )
}

export default Signup
