import React, { useState } from 'react'
import { Button } from '@mui/material';
import OtpBox from '../../components/OtpBox/OtpBox'

const Verify = () => {

    const [otp, setOtp] = useState('');
    const handleChange = (value) => {
        setOtp(valaue);
    }

    const verifyOTP = (e) => {
        e.preventDefault();
        alert(otp);
    }
    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10' style={{ backgroundColor: '#f5f5f5' }}>
                    <div className="text-center flex items-center justify-center">
                        <img src='/public/verify.png' width='50' />
                    </div>
                    <h3 className='text-center text-[18px] font-[600] mt-3 mb-1'> Verify OTP</h3>

                    <p className='text-center mt-0 mb-4'>OTP send to <span className='text-primary font-bold'>chawalroshan@gmail.com</span></p>
                    <form onSubmit={verifyOTP}>
                        <div className='flex items-center justify-center'>
                            <OtpBox length={6} onOtpChange={(handleChange)} />
                        </div>

                        <div className='flex items-center justify-center mt-5 px-3'>
                            <Button type='submit' className='w-full btn-lg btn-org'>Verify OTP</Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Verify
