import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import { BsFillBagCheckFill } from "react-icons/bs";

import MyListItems from './MyListItems';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';


const MyList = () => {



    return (

        <section className='py-10 w-full'>
            <div className='container flex gap-5'>
                <div className='col1 w-[20%]'>

                    <AccountSidebar />
                </div>

                <div className="col2 w-[70%]">
                    <div className='shadow-md rounded-md p-1 bg-white mt-3'>
                        <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.1)]'>
                            <h2>Your List</h2>
                            <p className='mt-0'>There are <span className='font-bold text-primary'>2</span> products in your List.</p>
                        </div>

                        <MyListItems size='s' qty={1} />
                        <MyListItems size='s' qty={1} />
                        <MyListItems size='s' qty={1} />
                        <MyListItems size='s' qty={1} />



                    </div>

                </div>

            </div>
        </section>


    )

}

export default MyList;