import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from '../../App';
  
import { postData } from '../../utils/api';

const Login = () => {

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: ''
    })

    const context = useContext(MyContext);

    const navigate = useNavigate();


    const forgetPassword = () => {
        if (formFields.email === '') {
            context.openAlertBox({ type: 'error', msg: 'Please enter email' });
            return;
        }
    
        context.openAlertBox({ type: 'success', msg: `OTP sent to ${formFields.email}` });
        localStorage.setItem('userEmail', formFields.email);
        localStorage.setItem('actionType', 'forgot-password');
    
        postData("/api/user/forgot-password", { email: formFields.email })
            .then((response) => {
                if (response?.error === false) {
                    context.openAlertBox({ type: 'success', msg: response?.message });
                    navigate('/verify');
                    return;
                } else {
                    context.openAlertBox({ type: 'error', msg: response?.message });
                }
            })
            .catch((err) => {
                console.error("Forgot Password Error:", err);
                context.openAlertBox({ type: 'error', msg: 'Something went wrong' });
            });
    };
    
    
    // Remove this incorrect console.log line
        


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

        console.log("Login attempt started");

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

        postData('/api/user/login', formFields, { withCredentials: true })
            .then((response) => {
                console.log("Login Response:", response);

                // Check if login was successful
                if (response.success) {
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
                        navigate("/");
                    }, 100);
                } else {
                    // Show backend error message
                    context.openAlertBox({ type: 'error', msg: response.message || 'Login failed!' });
                }
            })
            .catch((err) => {
                console.error("Login Error:", err);
                // Use backend error message if available
                const errorMsg = err.response?.data?.message || 'Something went wrong during login.';
                context.openAlertBox({ type: 'error', msg: errorMsg });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    return (
        <section className='section py-10 min-h-screen overflow-y-auto'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10 mb-10' style={{ backgroundColor: '#f5f5f5' }}>
                    <h3 className='text-center text-[18px] font-[600]'> Login to your account</h3>
                    <form className='w-full mt-5' onSubmit={handleSubmit}>
                        <div className='form-group w-full mb-5'>
                            <TextField
                                type='email'
                                id="email"
                                label="Email Id"
                                variant="outlined"
                                name='email'
                                value={formFields.email}
                                disabled={isLoading}
                                className='w-full'
                                onChange={onChangeInput}
                            />
                        </div>
                        <div className='form-group w-full mb-5 relative'>
                            <TextField
                                type={isPasswordShow === false ? 'password' : 'text'} id="password"
                                label="Password"
                                variant="outlined"
                                name='password'
                                value={formFields.password}
                                disabled={isLoading}
                                className='w-full'
                                onChange={onChangeInput}
                            />
                            <Button type='button' className='!absolute top-[14px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black ' style={{ color: 'black' }} onClick={() => setIsPasswordShow(!isPasswordShow)}>
                                {
                                    isPasswordShow === false ? <IoMdEye className='text-[20px] opacity-75' /> :
                                        < IoEyeOff className='text-[20px] opacity-75' />
                                }

                            </Button>
                        </div>

                        <a className='link cursor-pointer text-[14px] font-[600]' onClick={forgetPassword}>
                            Forget Password?
                        </a>

                        {/* Submit */}
                        <div className='flex items-center w-full mt-3 mb-3'>
                            <Button
                                type='submit'
                                disabled={!validValue || isLoading}
                                className='btn-org btn-lg w-full gap-3'
                            >
                                {isLoading ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" />
                                        Login
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </div>

                        <div className='mt-5'>
                            <p className='text-center'>Not registerd? <Link className='link text-[14px] font[600] !text-primary' to="/register">Sign Up</Link></p>
                        </div>

                        <p className='text-center font-[500]'>Or continue with social account</p>
                        <Button className='flex gap-3 w-full !bg-[#eeeeee] btn-lg  !text-black !font-[600]'><FcGoogle className='text-[20px]' />Login with Google</Button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login