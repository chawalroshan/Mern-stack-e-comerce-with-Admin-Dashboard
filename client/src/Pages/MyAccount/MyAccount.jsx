import { Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { editData } from '../../utils/api';


const MyAccount = () => {

    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');

    const [formFields, setFormFields] = useState({
        name:'',
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

    const validValue = Object.values(formFields).every(el => el);

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

    useEffect(()=>{
        const token = localStorage.getItem('accessToken');
        if (token === null){
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
        }
    }, [context?.userData?._id]);
    
  return (
    <section className='py-10 w-full'>
        <div className='container flex gap-5'>
            <div className='col1 w-[20%]'>
               
        <AccountSidebar/>
            </div>

            <div className="col2 w-[50%]">
                <div className="card bg-white p-5 shadow-md rounded-md">
                    <h2 className='pb-3'>My Profile</h2>
                    <hr/>
                    <form className='mt-5' onSubmit={handleSubmit}>
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
                        <br/>

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

            </div>

        </div>
    </section>
  )
}

export default MyAccount
