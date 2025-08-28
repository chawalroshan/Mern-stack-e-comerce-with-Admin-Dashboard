import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const ForgetPassword = () => {
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isPasswordShow2, setIsPasswordShow2] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [formFields, setFormFields] = useState({
        email: '',
        
    })

    const context = useContext(MyContext);

    const navigate = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            context.openAlertBox({ type: 'error', msg: "Passwords do not match!" });
            return;
        }
    
        const userEmail = localStorage.getItem('userEmail');
    
        if (!userEmail) {
            context.openAlertBox({ type: 'error', msg: "User email not found!" });
            return;
        }
    setLoading(true);

        postData("/api/user/reset-password", {
            email: userEmail,
            newPassword: newPassword,
            confirmpassword: confirmPassword
        }).then((res) => {
            if (res?.error === false) {
                localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
                context.openAlertBox({ type: 'success', msg: res.message || "Password reset successfully!" });
                navigate("/login");
            } else {
                context.openAlertBox({ type: 'error', msg: res.message || "Something went wrong!" });
            }
        }).catch((err) => {
            console.error("Reset Password Error:", err);
            context.openAlertBox({ type: 'error', msg: "Something went wrong!" });
        });
    };
    
    


    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10' style={{ backgroundColor: '#f5f5f5' }}>
                    <h3 className='text-center text-[18px] font-[600]'> Forgot Password</h3>
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
                            <Button 
                                type='submit' 
                                className='btn-org btn-lg w-full'
                                disabled={loading} 
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'} 
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgetPassword;