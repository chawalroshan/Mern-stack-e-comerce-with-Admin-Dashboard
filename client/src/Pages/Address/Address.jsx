import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Radio, Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from '@mui/material';
import { Collapse } from 'react-collapse';
import { IoMdClose } from "react-icons/io";
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import { postData, fetchDataFromApi } from '../../utils/api';

const Address = () => {
  // Modal state
  const [isOpenModal, setIsOpenModal] = useState({
    open: false,
    model: ''
  });

  // State for change password
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] = useState(false);
  const [changePassword, setChangePassword] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // State for address management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressForm, setAddressForm] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: ''
  });

  // Loading states
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Validation states
  const [validValue2, setValidValue2] = useState(false);
  const [status, setStatus] = useState(null);

  // User ID state
  const [userId, setUserId] = useState('');

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // Load user ID on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId);
  }, []);

  // Load user addresses
  const loadAddresses = async () => {
    setIsLoadingAddress(true);
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await fetchDataFromApi('/api/address/get', { userId });
        if (response.success) {
          setAddresses(response.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Handle address form input changes
  const onChangeAddressInput = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address selection
  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsLoadingAddress(true);
      try {
        // Add delete address API call here
        console.log('Delete address:', addressId);
        loadAddresses(); // Reload addresses
      } catch (error) {
        console.error('Error deleting address:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    }
  };

  // Handle change password input changes
  const onChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePassword(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate password confirmation
    if (name === 'confirmPassword') {
      setValidValue2(value === changePassword.newPassword && value.length >= 6);
    } else if (name === 'newPassword') {
      setValidValue2(value === changePassword.confirmPassword && value.length >= 6);
    }
  };

  // Handle change password submission
  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading2(true);
    // Add change password logic here
    setTimeout(() => {
      setIsLoading2(false);
      setChangePassword({ newPassword: '', confirmPassword: '' });
      setIsChangePasswordFromShow(false);
    }, 1000);
  };

  // Handle address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['address_line', 'city', 'state', 'pincode', 'country', 'mobile'];
    for (let field of requiredFields) {
      if (!addressForm[field]) {
        alert(`Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    setIsLoadingAddress(true);
    setStatus(null);

    try {
      const payload = {
        ...addressForm,
        mobile: parseInt(addressForm.mobile)
      };

      const response = await postData('/api/address/add', payload);
      
      if (response.success) {
        setStatus('success');
        setAddressForm({
          address_line: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
          mobile: ''
        });
        loadAddresses(); // Reload addresses
        // Close modal after successful submission
        setTimeout(() => {
          setIsOpenModal({ open: false, model: '' });
          setStatus(null);
        }, 1000);
      } else {
        setStatus('error');
        // Clear error message after 5 seconds
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      setStatus('error');
    } finally {
      setIsLoadingAddress(false);
    }
  };



  return (
    <section className='py-10 w-full'>
      <div className='container flex gap-5'>
        <div className='col1 w-[20%]'>
          <AccountSidebar />
        </div>

        <div className="col2 w-[80%]">
          {/* Address Management Card */}
          <div className="card bg-white p-5 shadow-md rounded-md mb-5">
            <div className='flex items-center justify-between'>
              <h2 className='text-[18px] font-bold'>My Addresses</h2>
              <Button className='!ml-auto' onClick={()=>setIsChangePasswordFromShow(!isChangePasswordFromShow)}>
                Change Password
              </Button>
            </div>
            <br />

            {/* Add Address Button */}
            <div className='flex items-center justify-center p-5 border border-dashed border-[rgba(0,0,0,0.2)] rounded-md bg-[#f1f1f1] hover:bg-[#f5f5f5] cursor-pointer'>
              <span className='text-sm font-[500]' onClick={() => {
                setIsOpenModal({
                  open: true,
                  model: 'Add New Address'
                });
              }}>Add Address</span>
            </div>

            {/* Address List with Radio Selection */}
            <div className='flex flex-col gap-3 mt-4'>
              {
                addresses?.length > 0 ? addresses?.map((addressItem, index) => {
                  return(
                    <div key={addressItem._id || index} className='addressBox bg-[#f1f1f1] p-4 rounded-md w-full border-2 transition-all hover:border-blue-300 hover:bg-blue-50'>
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
                        <div className='flex gap-2 ml-4'>
                          <Button 
                            size='small' 
                            className='btn-org btn-border'
                            onClick={() => {
                              // Edit functionality can be added here
                              console.log('Edit address:', addressItem._id);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size='small' 
                            className='btn-red btn-border'
                            onClick={() => handleDeleteAddress(addressItem._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
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
                  const selectedAddr = addresses.find(addr => (addr._id || addresses.indexOf(addr)) === selectedAddress);
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
          </div>


          {/* Change Password Section */}
          {isChangePasswordFromShow === true && (
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
                        type='password'
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
                        type='password'
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
                      className='btn-org btn-lg w-[140px] cursor-pointer'
                    >
                      {isLoading2 ? (
                        <>
                          <CircularProgress size={20} color="inherit" />
                          &nbsp;Saving...
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
          )}
        </div>
      </div>

      {/* Modal for Adding Address */}
      <Dialog
        fullScreen
        open={isOpenModal.open}
        onClose={() => setIsOpenModal({ open: false, model: '' })}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setIsOpenModal({ open: false, model: '' })}
              aria-label="close"
            >
              <IoMdClose />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {isOpenModal?.model}
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Address Form in Modal */}
        <section className="p-5 bg-gray-50">
          <form className="form py-3 px-8" onSubmit={handleAddressSubmit}>
            <div className="scroll max-h-[75vh] overflow-y-scroll pr-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-[14px] font-[500] mb-1 text-black">Address Line</h3>
                  <input
                    type="text"
                    name="address_line"
                    value={addressForm.address_line}
                    onChange={onChangeAddressInput}
                    placeholder="Enter your street address"
                    className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-[500] mb-1 text-black">City</h3>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={onChangeAddressInput}
                    placeholder="Enter city"
                    className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-[500] mb-1 text-black">State</h3>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={onChangeAddressInput}
                    placeholder="Enter state"
                    className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-[500] mb-1 text-black">Pincode</h3>
                  <input
                    type="text"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={onChangeAddressInput}
                    placeholder="Enter pincode"
                    className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-[500] mb-1 text-black">Country</h3>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={onChangeAddressInput}
                    placeholder="Enter country"
                    className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-[500] mb-1 text-black">Mobile</h3>
                  <input
                    type="number"
                    name="mobile"
                    value={addressForm.mobile}
                    onChange={onChangeAddressInput}
                    placeholder="Enter mobile number"
                    className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <hr className="my-5" />

            {status === 'success' && <p className="text-green-600 mb-3">Address added successfully!</p>}
            {status === 'error' && <p className="text-red-600 mb-3">Failed to add address. Try again.</p>}

            <Button
              type="submit"
              className="btn-org btn-lg w-full gap-2"
              disabled={isLoadingAddress}
            >
              {isLoadingAddress ? 'Adding Address...' : 'Add Address'}
            </Button>
          </form>
        </section>
      </Dialog>
    </section>
  )
}

export default Address