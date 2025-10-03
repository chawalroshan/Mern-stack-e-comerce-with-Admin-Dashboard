import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { MdCloudUpload } from "react-icons/md";
import { fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App';

const AddAddress = () => {
  const context = useContext(MyContext); // Assuming it has user info or token
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'



  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ['address_line', 'city', 'state', 'pincode', 'country', 'mobile'];
    for (let field of requiredFields) {
      if (!formFields[field]) {
        alert(`Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    setIsLoading(true);
    setStatus(null);

    try {
      // Example of sending userId from context if available
      const payload = {
        ...formFields,
        userId: context?.userId || null,
      };

      const res = await postData('/api/address/add', payload, { withCredentials: true });
      console.log('Address added:', res);
      setStatus('success');
      setFormFields({
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        mobile: "",
      });
    } catch (err) {
      console.error('Error adding address:', err);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'address_line', label: 'Address Line', placeholder: 'Enter your street address' },
    { name: 'city', label: 'City', placeholder: 'Enter city' },
    { name: 'state', label: 'State', placeholder: 'Enter state' },
    { name: 'pincode', label: 'Pincode', placeholder: 'Enter pincode' },
    { name: 'country', label: 'Country', placeholder: 'Enter country' },
    { name: 'mobile', label: 'Mobile', placeholder: 'Enter mobile number', type: 'number' },
  ];

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 px-8" onSubmit={handleSubmit}>
        <div className="scroll max-h-[75vh] overflow-y-scroll pr-4">
          <div className="grid grid-cols-1 gap-4">
            {fields.map(({ name, label, placeholder, type = 'text' }) => (
              <div key={name}>
                <h3 className="text-[14px] font-[500] mb-1 text-black">{label}</h3>
                <input
                  type={type}
                  name={name}
                  value={formFields[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="my-5" />

        {status === 'success' && <p className="text-green-600 mb-3">Address added successfully!</p>}
        {status === 'error' && <p className="text-red-600 mb-3">Failed to add address. Try again.</p>}

        <Button
          type="submit"
          className="btn-blue btn-lg w-full gap-2"
          disabled={isLoading}
        >
          {isLoading ? 'Publishing...' : 'Publish and View'} <MdCloudUpload className="text-[18px]" />
        </Button>
      </form>
    </section>
  );
};

export default AddAddress;
