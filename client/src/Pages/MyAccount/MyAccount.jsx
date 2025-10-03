import { Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import {Collapse} from 'react-collapse';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { editData, postData } from '../../utils/api';


const MyAccount = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [userId, setUserId] = useState('');
    const [isChangePasswordFromShow, setIsChangePasswordFromShow] = useState(false);

    const context = useContext(MyContext);
   

    const navigate = useNavigate();

    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        mobile: ''
    })

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
    };

    const onChangePasswordInput = (e) => {
        const { name, value } = e.target;
        setChangePassword({
            ...changePassword,
            [name]: value
        });
    };

    const validValue = Object.values(formFields).every(el => el);

    const [changePassword, setChangePassword] = useState({
        newPassword: '',
        confirmPassword: ''
    })

    const validValue2 = Object.values(changePassword).every(el => el);

    const handleSubmitChangePassword = (e) => {
        e.preventDefault();
        if (changePassword.newPassword === '') {
            context.openAlertBox({
                type: 'error',
                msg: 'Please enter New password'
            });
            return false;
        }

        if (changePassword.confirmPassword === '') {
            context.openAlertBox({
                type: 'error',
                msg: 'Please enter confirm password'
            });
            return false;
        }

        if (changePassword.newPassword !== changePassword.confirmPassword) {
            context.openAlertBox({
                type: 'error',
                msg: 'New password and confirm password do not match'
            });
            return false;
        }

        setIsLoading2(true);

        // Get email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail) {
            context.openAlertBox({
                type: 'error',
                msg: 'User email not found. Please login again.'
            });
            return false;
        }
        
        // Prepare data for the API call
        const passwordData = {
            email: userEmail,
            newPassword: changePassword.newPassword,
            confirmPassword: changePassword.confirmPassword
        };

        console.log("Sending password data:", passwordData);
        console.log("User email from localStorage:", userEmail);

        postData(`/api/user/reset-password`, passwordData)
            .then((response) => {
                console.log("Change Password Response:", response);

                if (response.success) {
                    context.openAlertBox({ type: 'success', msg: response.message });
                            setChangePassword({
            newPassword: '',
            confirmPassword: ''
        });
                } else {
                    context.openAlertBox({ type: 'error', msg: response.message || 'Password change failed!' });
                }
            })
            .catch((err) => {
                console.error("Change Password Error:", err);
                context.openAlertBox({ type: 'error', msg: err.response?.data?.message || 'Something went wrong during password change.' });
            })
            .finally(() => {
                setIsLoading2(false);
            });
    };



    const handleSubmit = (e) => {
        e.preventDefault();


        if (formFields.name === '') {
            context.openAlertBox({
                type: 'error',
                msg: 'Please add name'
            });
            return false;
        }

        if (formFields.email === '') {
            context.openAlertBox({
                type: 'error',
                msg: 'Please enter email'
            });
            return false;
        }

        if (formFields.mobile === '') {
            context.openAlertBox({
                type: 'error',
                msg: 'Please enter mobile number'
            });
            return false;
        }
        setIsLoading(true); // ✅ start loading

        editData(`/api/user/${userId}`, formFields)

            .then((response) => {
                console.log("Login Response:", response);

                // Check if login was successful
                if (response.success) {
                    context.openAlertBox({ type: 'success', msg: response.message });

                    if (response.data) {
                        localStorage.setItem("userEmail", formFields.email);
                        localStorage.setItem("accessToken", response.data.accessToken);  // make sure response.data exists
                        localStorage.setItem("refreshToken", response.data.refreshToken);
                    }

                    // Set global auth state so Header updates immediately
                    context.setIsLogin(true);

                    // Redirect only on successful login
                    navigate("/");
                } else {
                    // Show backend error message
                    context.openAlertBox({ type: 'error', msg: response.message || 'Login failed!' });
                }
            })
            .catch((err) => {
                console.error("Login Error:", err);
                // Use backend error message if available
                context.openAlertBox({ type: 'error', msg: err.response?.data?.message || 'Something went wrong during login.' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token === null) {
            navigate('/');
        }
    }, [context?.isLogin, navigate])

    useEffect(() => {
        if (context?.userData?._id) {
            setUserId(context.userData._id);
            setFormFields({
                name: context.userData.name || "",
                email: context.userData.email || "",
                mobile: context.userData.mobile || ""
            });
            setChangePassword({
                newPassword: "",
                confirmPassword: ""
            });
            
            // Also set the email in localStorage if not already there
            if (context.userData.email && !localStorage.getItem('userEmail')) {
                localStorage.setItem('userEmail', context.userData.email);
            }
            
            console.log("User data loaded:", context.userData);
            console.log("Email in localStorage:", localStorage.getItem('userEmail'));
        }
    }, [context?.userData?._id]);

    return (
        <section className='py-10 w-full'>
            <div className='container flex gap-5'>
                <div className='col1 w-[20%]'>

                    <AccountSidebar />
                </div>

                <div className="col2 w-[50%]">
                    <div className="card bg-white p-5 shadow-md rounded-md mb-5">
                        <div className='flex items-center pb-3'>
                            <h2 className='pb-3'>My Profile</h2>
                            <Button className='!ml-auto' onClick={()=>setIsChangePasswordFromShow(!isChangePasswordFromShow)}>Change Password</Button>
                        </div>
                        <hr />
                        <form className='mt-8' onSubmit={handleSubmit}>
                            <div className='flex items-center gap-5'>
                                <div className='w-[50%]'>
                                    <TextField
                                        label="Full Name"
                                        variant="outlined"
                                        size='small'
                                        name='name'
                                        value={formFields.name}
                                        disabled={isLoading}
                                        className='w-full'
                                        onChange={onChangeInput}
                                    />

                                </div>

                                <div className='w-[50%]'>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        size='small'
                                        name='email'
                                        value={formFields.email}
                                        disabled={isLoading}
                                        className='w-full'
                                        onChange={onChangeInput}
                                    />

                                </div>



                            </div>
                            <div className='flex items-center mt-4 gap-5'>
                                <div className='w-[50%]'>
                                    <TextField
                                        label="Phone Number"
                                        variant="outlined"
                                        size='small'
                                        name='mobile'
                                        value={formFields.mobile}
                                        disabled={isLoading}
                                        className='w-full'
                                        onChange={onChangeInput}
                                    />

                                </div>



                            </div>
                            <br />

                            <div className='flex items-center gap-4'>
                                <Button
                                    type='submit'
                                    disabled={!validValue || isLoading}
                                    className='btn-org btn-lg w-[100px]'
                                >
                                    {isLoading ? (
                                        <>
                                            <CircularProgress size={20} color="inherit" />
                                            Save
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </Button>
                                <Button className='btn-org btn-border btn-lg w-[100px]'>Cancel</Button>
                            </div>
                        </form>
                    </div>


                    {/* change password */}
                    {
                        isChangePasswordFromShow === true && 
                    
                    <Collapse isOpened={isChangePasswordFromShow} className='mb-3'>
                    <div className="card bg-white p-5 shadow-md rounded-md">
                        <div className='flex items-center pb-3'>
                            <h2 className='pb-3'>Change Password</h2>
                        </div>
                        <div className='text-sm text-gray-600 mb-3'>
                            Changing password for: <strong>{localStorage.getItem('userEmail') || 'Loading...'}</strong>
                            {!localStorage.getItem('userEmail') && (
                                <span className='text-red-500 ml-2'>⚠️ Email not found in localStorage</span>
                            )}
                        </div>
                        <hr />
                        <form className='mt-8' onSubmit={handleSubmitChangePassword}>
                            <div className='flex items-center gap-5'>
                                

                                <div className='w-[50%]'>
                                    <TextField
                                        label="New Password"
                                        variant="outlined"
                                        size='small'
                                        name='newPassword'
                                        value={changePassword.newPassword}
                                        disabled={isLoading2}
                                        className='w-full'
                                        onChange={onChangePasswordInput}
                                    />
                                </div>
                            </div>

                            <div className='flex items-center mt-4 gap-5'>
                                <div className='w-[50%]'>
                                    <TextField
                                        label="Confirm Password"
                                        variant="outlined"
                                        size='small'
                                        name='confirmPassword'
                                        value={changePassword.confirmPassword}
                                        disabled={isLoading2}
                                        className='w-full'
                                        onChange={onChangePasswordInput}
                                    />
                                </div>
                            </div>

                            <br />

                            <div className='flex items-center gap-4'>
                                <Button
                                    type='submit'
                                    disabled={!validValue2 || isLoading2}
                                    className='btn-org btn-lg w-[100px] cursor-pointer'
                                >
                                    {isLoading2 ? (
                                        <>
                                            <CircularProgress size={20} color="inherit" />
                                            &nbsp;Save
                                        </>
                                    ) : (
                                        "Change Password"
                                    )}
                                </Button>
                                <Button
                                    type='button'
                                    className='btn-org btn-border btn-lg w-[100px]'
                                    onClick={() => setChangePassword({ newPassword: "", confirmPassword: "" })}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                    </Collapse>
}


                </div>

            </div>
        </section>
    )
}

export default MyAccount
