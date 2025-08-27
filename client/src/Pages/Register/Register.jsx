import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);   // ✅ added state

    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        password: ""
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

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

        if (formFields.name === '') {
            context.openAlertBox({
                type: 'error',
                msg: 'Please add full name'
            });
            return false;
        }

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


        setIsLoading(true); // ✅ start loading

        postData('/api/user/register', formFields)
            .then((response) => {
                console.log("Registration Response:", response);

                // Check if registration was successful
                if (response.success) {
                    context.openAlertBox({ type: 'success', msg: response.message });

                    if (response.user) {
                        localStorage.setItem("userEmail", response.user.email);
                    }

                    // Redirect only on successful registration
                    navigate("/verify");
                } else {
                    // Show backend error message
                    context.openAlertBox({ type: 'error', msg: response.message || 'Registration failed!' });
                }
            })
            .catch((err) => {
                console.error("Registration Error:", err);
                // Use backend error message if available
                context.openAlertBox({ type: 'error', msg: err.response?.data?.message || 'Something went wrong during registration.' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10' style={{ backgroundColor: '#f5f5f5' }}>
                    <h3 className='text-center text-[18px] !font-bold text-[rgba(0,0,0,8)] '> Register with new account</h3>
                    <form className='w-full mt-5' onSubmit={handleSubmit}>

                        {/* Full Name */}
                        <div className='form-group w-full mb-5'>
                            <TextField
                                type='text'
                                id="name"
                                name='name'
                                value={formFields.name}
                                disabled={isLoading}
                                label="Full name"
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            />
                        </div>

                        {/* Email */}
                        <div className='form-group w-full mb-5'>
                            <TextField
                                type='email'
                                id="email"
                                name='email'
                                value={formFields.email}
                                disabled={isLoading}
                                label="Email Id"
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            />
                        </div>

                        {/* Password */}
                        <div className='form-group w-full mb-5 relative'>
                            <TextField
                                type={isPasswordShow ? 'text' : 'password'}
                                id="password"
                                name='password'
                                value={formFields.password}
                                disabled={isLoading}
                                label="Password"
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            />
                            <Button
                                type="button"
                                className='!absolute top-[14px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black'
                                style={{ color: 'black' }}
                                onClick={() => setIsPasswordShow(!isPasswordShow)}
                                disabled={isLoading}
                            >
                                {isPasswordShow ? (
                                    <IoEyeOff className='text-[20px] opacity-75' />
                                ) : (
                                    <IoMdEye className='text-[20px] opacity-75' />
                                )}
                            </Button>
                        </div>

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
                                        Register
                                    </>
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </div>


                        <div className='mt-5'>
                            <p className='text-center'>
                                Already have an account?{" "}
                                <Link className='link text-[14px] !font[600] !text-primary' to="/login">
                                    Login
                                </Link>
                            </p>
                        </div>

                        <p className='text-center font-[500]'>Or continue with social account</p>
                        <Button className='flex gap-3 w-full !bg-[#e0e0e0] btn-lg  !text-black !font-[600]'>
                            <FcGoogle className='text-[20px]' />Login with Google
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Register;
