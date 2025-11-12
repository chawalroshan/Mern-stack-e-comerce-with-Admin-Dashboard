import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { editData, postData, fetchDataFromApi, uploadImages } from '../../utils/api';
import { MyContext } from '../../App';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Collapse } from 'react-collapse';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Radio from '@mui/material/Radio';


const Profile = () => {

    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [address, setAddress] = useState([]);
    const [userId, setUserId] = useState('');
    const [isChangePasswordFromShow, setIsChangePasswordFromShow] = useState(false);
    const [phone, setPhone] = useState('');

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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

    const [selectedAddress, setSelectedAddress] = useState('');

    const handleAddressChange = (event) => {
      setSelectedAddress(event.target.value);
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

    // Function to fetch addresses
    const fetchAddresses = async () => {
        if (context?.userData?._id) {
            try {
                const res = await fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`);
                console.log('Addresses fetched:', res);
                if (res.success && res.data) {
                    setAddress(res.data);
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        }
    };

    // Function to refresh addresses (can be called from other components)
    const refreshAddresses = () => {
        fetchAddresses();
    };

    useEffect(() => {
        if (context?.userData?._id) {
            fetchAddresses();
            setUserId(context.userData._id);
            setFormFields({
                name: context.userData.name || "",
                email: context.userData.email || "",
                mobile: context.userData.mobile || ""
            });

            // Normalize phone to Nepal by default to avoid auto-detecting other countries (e.g., +98 Iran)
            const rawMobile = context.userData.mobile;
            let normalizedPhone = "+977";
            if (rawMobile != null && String(rawMobile).trim() !== "") {
                let s = String(rawMobile).trim();
                if (!s.startsWith('+')) {
                    // if no country code, assume Nepal and strip non-digits
                    s = '+977' + s.replace(/[^0-9]/g, '');
                }
                // If it somehow starts with Iran code, switch to Nepal code by default
                if (s.startsWith('+98')) {
                    s = '+977' + s.slice(3);
                }
                normalizedPhone = s;
            }
            setPhone(normalizedPhone);


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


    useEffect(() => {
        if (context?.userData?.avatar) {
            setPreviews([context.userData.avatar]);
        } else {
            setPreviews([]); // fallback if no avatar
        }
    }, [context?.userData?.avatar]);


    let img_arr = [];
    let uniqueArray = [];
    let selectedImages = [];

    const formdata = new FormData();

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            setPreviews([]);
            const files = e.target.files;
            setUploading(true);

            const formData = new FormData();  // ✅ this is correct
            let selectedImages = [];

            for (let i = 0; i < files.length; i++) {
                if (
                    files[i] &&
                    (files[i].type === "image/jpeg" ||
                        files[i].type === "image/jpg" ||
                        files[i].type === "image/png" ||
                        files[i].type === "image/webp")
                ) {
                    const file = files[i];
                    selectedImages.push(file);
                    formData.append("avatar", file); // ✅ appending file correctly

                    const previewUrl = URL.createObjectURL(file);
                    setPreviews((prev) => [...prev, previewUrl]);
                } else {
                    context.openAlertBox({ type: "error", msg: "Please select a valid image format" });
                    setUploading(false);
                    return;
                }
            }

            uploadImages('/api/user/user-avatar', formData, true).then((response) => {
                setUploading(false);
                let avatar = [];
                avatar.push(response.data.avatar);
                setPreviews
                console.log(response);
            });


        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };
    return (
        <>
            <div className="card my-4 shadow-md bg-white p-5 rounded-md w-[70%] ">
                <div className='flex items-center justify-between'>
                    <h2 className='text-[18px] font-bold'>
                        Users Profile
                    </h2>

                    <Button className='!ml-auto' onClick={() => setIsChangePasswordFromShow(!isChangePasswordFromShow)}>Change Password</Button>
                </div>
                <br />

                <div className='w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200'>
                    {
                        uploading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                {previews.length > 0 ? (
                                    previews.map((img, index) => (
                                        <img
                                            src={img}
                                            key={index}
                                            className="w-full h-full object-cover"
                                        />
                                    ))
                                ) : (
                                    <img
                                        src={'/Sample_User_Icon.png'}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </>
                        )
                    }

                    <div className="overlay w-[100%] h-[100%] absolute top-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
                        <FaCloudUploadAlt className='text-[#fff] text-[25px]' />
                        <input
                            type='file'
                            accept='image/*'
                            className='absolute top-0 left-0 w-full h-full opacity-0'
                            onChange={(e) =>
                                onChangeFile(e, "/api/user/user-avatar")
                            }
                            name='avatar'
                        />
                    </div>

                </div>


                <form className='mt-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-5'>
                        <div className='w-[50%]'>
                            <input type='name' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name='name'
                                value={formFields.name}
                                disabled={isLoading}
                                placeholder='Full Name'
                                onChange={onChangeInput} />

                        </div>

                        <div className='w-[50%]'>
                            <input type='email' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name='email'
                                value={formFields.email}
                                disabled={isLoading}
                                placeholder='Email'
                                onChange={onChangeInput} />

                        </div>



                    </div>
                    <div className='flex items-center mt-4 gap-5'>
                        <div className='w-[50%]'>
                            <PhoneInput
                                defaultCountry="np"
                                forceDialCode
                                value={typeof phone === 'string' ? phone : (phone == null ? '' : String(phone))}
                                disabled={isLoading}
                                onChange={(phone) => {
                                    setPhone(phone);
                                    setFormFields({
                                        ...formFields,
                                        mobile: phone
                                    });
                                }}
                            />
                        </div>



                    </div>
                    <br />

                    <div className='flex items-center justify-center p-5 border border-dashed border-[rgba(0,0,0,0.2)] rounded-md bg-[#f1f1f1] hover:bg-[#f5f5f5] cursor-pointer'><span className='text-sm font-[500]' onClick={() => {
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Add New Address'
                                        });
                                        // Refresh addresses after modal closes (you might want to add a callback)
                                        setTimeout(() => {
                                            fetchAddresses();
                                        }, 1000);
                                    }}>Add Address</span></div>


                                <div className='flex flex-col gap-3 mt-4'>
                                    {
                                        address?.length > 0 ? address?.map((addressItem, index) => {
                                            return(
                                                <label key={addressItem._id || index} className='addressBox bg-[#f1f1f1] p-4 rounded-md cursor-pointer w-full border-2 transition-all hover:border-blue-300 hover:bg-blue-50'>
                                                    <div className='flex items-start gap-3'>
                                                        <Radio 
                                                            {...label}  
                                                            name='address' 
                                                            value={addressItem._id || index}
                                                            checked={selectedAddress === (addressItem._id || index)}
                                                            onChange={handleAddressChange}
                                                            color="primary"
                                                        />
                                                        <div className='flex-1'>
                                                            <div className='text-[14px] font-medium text-gray-800 mb-1'>
                                                                {addressItem?.address_line}
                                                            </div>
                                                            <div className='text-[12px] text-gray-600'>
                                                                {addressItem?.city}, {addressItem?.state} - {addressItem?.pincode}
                                                            </div>
                                                            <div className='text-[12px] text-gray-600'>
                                                                {addressItem?.country}
                                                            </div>
                                                            <div className='text-[12px] text-gray-600 mt-1'>
                                                                📱 {addressItem?.mobile}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            )
                                        }) : (
                                            <div className='text-center text-gray-500 py-4'>
                                                No addresses added yet. Click "Add Address" to add your first address.
                                            </div>
                                        )
                                    }
                                    </div>

                    {/* Selected Address Display */}
                    {selectedAddress && (
                        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
                            <div className='text-sm font-medium text-blue-800 mb-2'>Selected Address:</div>
                            {(() => {
                                const selectedAddr = address.find(addr => (addr._id || address.indexOf(addr)) === selectedAddress);
                                return selectedAddr ? (
                                    <div className='text-sm text-blue-700'>
                                        <div className='font-medium'>{selectedAddr.address_line}</div>
                                        <div>{selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}</div>
                                        <div>{selectedAddr.country} | 📱 {selectedAddr.mobile}</div>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    )}

                    <br />

                    <div className='flex items-center gap-4'>
                        <Button
                            type='submit'
                            disabled={!validValue || isLoading}
                            className='btn-blue btn-lg'
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
                        <Button className='btn-blue btn-border btn-lg w-[100px]'>Cancel</Button>
                    </div>
                </form>

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
                                        className='btn-blue btn-lg w-[100px] cursor-pointer'
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
        </>
    )
}

export default Profile
