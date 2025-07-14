import React, { useRef, useState } from 'react';

const OtpBox = ({ length = 6, onOtpChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  // Handle change
  const handleChange = (element, index) => {
    const val = element.value.replace(/\D/, ''); // Only digits
    
    const newOtp = [...otp];
    newOtp[index] = val ? val[0] : ''; // Allow empty value
    setOtp(newOtp);

    // Focus next input if there's a value, or previous if backspace
    if (val && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Notify parent
    onOtpChange(newOtp.join(''));
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move focus to previous input and clear it
        inputsRef.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        onOtpChange(newOtp.join(''));
      } else if (otp[index]) {
        // Clear current input but keep focus
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onOtpChange(newOtp.join(''));
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = [...otp];
    
    for (let i = 0; i < length; i++) {
      newOtp[i] = data[i] || '';
    }

    setOtp(newOtp);
    onOtpChange(newOtp.join(''));

    // Focus next empty field
    const firstEmpty = newOtp.findIndex(v => !v);
    if (firstEmpty !== -1) {
      inputsRef.current[firstEmpty].focus();
    } else {
      inputsRef.current[length - 1].focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {otp.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          ref={(el) => (inputsRef.current[idx] = el)}
          style={{
            width: '40px',
            height: '40px',
            fontSize: '24px',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  );
};

export default OtpBox;