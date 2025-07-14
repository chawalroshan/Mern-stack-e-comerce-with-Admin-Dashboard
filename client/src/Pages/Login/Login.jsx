import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from '../../App';

const Login = () => {

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormFields] = useState ({
        email:'',
        password:''
    })

    const context = useContext(MyContext);

    const history = useNavigate();


    const forgetPassword = ()=>{
        // if (formFields.email !=='')
            context.openAlertBox('sucess', 'OTP send');
        history.push('/verify');
        
    }


    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10' style={{ backgroundColor: '#f5f5f5' }}>
                    <h3 className='text-center text-[18px] font-[600]'> Login to your account</h3>
                    <form className='w-full mt-5'>
                        <div className='form-group w-full mb-5'>
                            <TextField type='email' id="email" label="Email Id" variant="outlined" className='w-full' name='name'/>
                        </div>
                        <div className='form-group w-full mb-5 relative'>
                            <TextField type={isPasswordShow===false ? 'password' :'text'} id="password" label="Password" variant="outlined" className='w-full' name='password'/>
                            <Button type='submit' className='!absolute top-[14px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black ' style={{ color: 'black' }} onClick={() => setIsPasswordShow(!isPasswordShow)}>
                                {
                                    isPasswordShow===false ? <IoMdEye className='text-[20px] opacity-75' /> :
                                    < IoEyeOff className='text-[20px] opacity-75' />
                                }
                                
                            </Button>
                        </div>

                        <a className='link cursor-pointer text-[14px] font-[600]' onClick={forgetPassword}>
                            Forget Password?
                        </a>

                        <div className='flex items-center w-full mt-3 mb-3'>
                            <Button className='btn-org btn-lg w-full'>Login</Button>

                        </div>
                        <div className='mt-5'>
                        <p className='text-center'>Not registerd? <Link className='link text-[14px] font[600] !text-primary' to="/register">Sign Up</Link></p>
                        </div>
                        
                        <p className='text-center font-[500]'>Or continue with social account</p>
                        <Button className='flex gap-3 w-full !bg-[#eeeeee] btn-lg  !text-black !font-[600]'><FcGoogle className='text-[20px]'/>Login with Google</Button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login