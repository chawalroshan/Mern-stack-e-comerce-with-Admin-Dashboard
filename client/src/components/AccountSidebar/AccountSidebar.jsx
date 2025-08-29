import React, { useContext, useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import { uploadImage } from '../../utils/api';


const AccountSidebar = () => {

    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const context = useContext(MyContext);

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

            uploadImage('/api/user/user-avatar', formData, true).then((response) => {
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
        <div className="card bg-white shadow-md rounded-md sticky top-[10px]">
            <div className='w-full p-5 flex items-center justify-center flex-col'>
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

                <h3 className=''>{context?.userData?.name}</h3>
                <h6 className='text-[13px] font-[500]'>{context?.userData?.email}</h6>

            </div>

            <ul className='list-none pb-5 bg-[#f1f1f1] myAccountTabs'>
                <li className='w-full'>
                    <NavLink to='/my-account' className={({ isActive }) => isActive ? "active" : ""} >
                        <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <FaRegUser className='text-[15px]' />My Profile</Button>
                    </NavLink>
                </li>

                <li className='w-full'>
                    <NavLink to='/my-list' className={({ isActive }) => isActive ? "active" : ""} >
                        <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <FaRegHeart className='text-[16px]' /> My List</Button>
                    </NavLink>
                </li>
                <li className='w-full'>
                    <NavLink to='/orders' className={({ isActive }) => isActive ? "active" : ""} >
                        <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <IoBagCheckOutline className='text-[16px]' />My Order</Button>
                    </NavLink>
                </li>
                <li className='w-full'>
                    <NavLink to='/logout' className={({ isActive }) => isActive ? "active" : ""} >
                        <Button className='w-full flex items-center gap-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-left !justify-start !px-5 !capitalize !py-2'>  <IoIosLogOut className='text-[18px]' />Logout</Button>
                    </NavLink>
                </li>

            </ul>

        </div>
    )
}

export default AccountSidebar
