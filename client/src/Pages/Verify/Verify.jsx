import React, { useContext, useState } from 'react'
import { Button } from '@mui/material';
import OtpBox from '../../components/OtpBox/OtpBox'
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const context = useContext(MyContext)

  const handleChange = (value) => {
    setOtp(value);
  };

  const verifyOTP = (e) => {
    e.preventDefault();
  
    const actionType = localStorage.getItem('actionType');
    const userEmail = localStorage.getItem('userEmail') || '';
  
    if (!userEmail) {
      context.openAlertBox({ type: 'error', msg: 'User email not found' });
      return;
    }
  
    if (actionType !== 'forgot-password') {
      postData('/api/user/verifyEmail', { email: userEmail, otp })
        .then((res) => {
          context.openAlertBox({
            type: res?.error ? 'error' : 'success',
            msg: res?.message || "OTP Verified Successfully!"
          });
          if (!res?.error) {
            localStorage.removeItem('userEmail');
            navigate('/login');
          }
        })
        .catch((err) => {
          console.error("OTP Verification Error:", err);
          context.openAlertBox({ type: 'error', msg: "Something went wrong, please try again." });
        });
    } else {
      postData('/api/user/verify-forgot-password-otp', { email: userEmail, otp })
        .then((res) => {
          context.openAlertBox({
            type: res?.error ? 'error' : 'success',
            msg: res?.message || "OTP Verified Successfully!"
          });
          if (!res?.error) {
            // localStorage.removeItem('userEmail');
            navigate('/forgot-password');
          }
        })
        .catch((err) => {
          console.error("OTP Verification Error:", err);
          context.openAlertBox({ type: 'error', msg: "Something went wrong, please try again." });
        });
    }
  };
  

  return (
    <section className='section py-10'>
      <div className='container'>
        <div className='card shadow-md w-[400px] m-auto !rounded-md !bg-white p-5 px-10' style={{ backgroundColor: '#f5f5f5' }}>
          <div className="text-center flex items-center justify-center">
            <img src='/verify.png' width='50' alt="Verify OTP" />
          </div>
          <h3 className='text-center text-[18px] font-[600] mt-3 mb-1'> Verify OTP</h3>

          <p className='text-center mt-0 mb-4'>
            OTP sent to <span className='text-primary font-bold'>{localStorage.getItem('userEmail')}</span>
          </p>

          <form onSubmit={verifyOTP}>
            <div className='flex items-center justify-center'>
              <OtpBox length={6} onOtpChange={handleChange} />
            </div>

            <div className='flex items-center justify-center mt-5 px-3'>
              <Button type='submit' className='w-full btn-lg btn-org'>Verify OTP</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Verify;
