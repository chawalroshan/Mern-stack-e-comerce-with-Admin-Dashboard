import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isPasswordShow2, setIsPasswordShow2] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // Handle password change logic here
        console.log("New Password:", newPassword);
    };

    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10' style={{ backgroundColor: '#f5f5f5' }}>
                    <h3 className='text-center text-[18px] font-[600]'> Forget Password</h3>
                    <form className='w-full mt-5' onSubmit={handleSubmit}>
                        <div className='form-group w-full mb-5 relative'>
                            <TextField 
                                type={isPasswordShow ? 'text' : 'password'} 
                                id="password" 
                                label="New Password" 
                                variant="outlined" 
                                className='w-full' 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Button 
                                type='button' 
                                className='!absolute top-[14px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                                onClick={() => setIsPasswordShow(!isPasswordShow)}
                            >
                                {isPasswordShow ? <IoMdEye className='text-[20px] opacity-75' /> : <IoEyeOff className='text-[20px] opacity-75' />}
                            </Button>
                        </div>

                        <div className='form-group w-full mb-5 relative'>
                            <TextField 
                                type={isPasswordShow2 ? 'text' : 'password'} 
                                id="confirm_password" 
                                label="Confirm Password" 
                                variant="outlined" 
                                className='w-full' 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button 
                                type='button' 
                                className='!absolute top-[14px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                                onClick={() => setIsPasswordShow2(!isPasswordShow2)}
                            >
                                {isPasswordShow2 ? <IoMdEye className='text-[20px] opacity-75' /> : <IoEyeOff className='text-[20px] opacity-75' />}
                            </Button>
                        </div>

                        <div className='flex items-center w-full mt-3 mb-3'>
                            <Button type='submit' className='btn-org btn-lg w-full'>
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgetPassword;