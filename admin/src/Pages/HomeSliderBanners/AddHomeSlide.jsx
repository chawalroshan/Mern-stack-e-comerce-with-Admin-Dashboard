import React, { useState, useContext } from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';

const AddHomeSlide = () => {
  const context = useContext(MyContext);
  const [formFields, setFormFields] = useState({
    title: '',
    link: '',
    status: 'true', // Use string for Select component
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (images) => {
    console.log('Uploaded images:', images); // Debug log
    if (images && images.length > 0) {
      setImageFile(images[0]); // Store the actual file
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit clicked'); // Debug log
    
    if (!imageFile) {
      context?.openAlertBox?.({ type: 'error', msg: 'Please upload an image' });
      return;
    }

    try {
      setSubmitting(true);
      console.log('Starting submission...'); // Debug log
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', formFields.title);
      formData.append('link', formFields.link);
      formData.append('status', formFields.status);

      console.log('FormData created:', { // Debug log
        title: formFields.title,
        link: formFields.link,
        status: formFields.status,
        image: imageFile.name
      });

      // Use fetch directly for FormData to ensure proper content-type
      const res = await postData('/api/sliders', formData);
      console.log('API Response:', res); // Debug log

      if (res && res.success) {
        context?.openAlertBox?.({ type: 'success', msg: 'Home slide created successfully!' });
        context?.setIsOpenFullScreenPanel?.({ open: false });
        
        // Reset form
        setFormFields({
          title: '',
          link: '',
          status: 'true',
        });
        setImageFile(null);
      } else {
        context?.openAlertBox?.({ type: 'error', msg: res?.message || 'Failed to create home slide' });
      }
    } catch (error) {
      console.error('Error creating home slide:', error);
      context?.openAlertBox?.({ type: 'error', msg: 'Error creating home slide: ' + error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = imageFile !== null;

  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8' onSubmit={handleSubmit}>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          
          {/* Title Field */}
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Slide Title</h3>
              <TextField
                name="title"
                value={formFields.title}
                onChange={handleInputChange}
                fullWidth
                size="small"
                placeholder="Enter slide title (optional)"
              />
            </div>
          </div>

          {/* Link Field */}
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Slide Link</h3>
              <TextField
                name="link"
                value={formFields.link}
                onChange={handleInputChange}
                fullWidth
                size="small"
                placeholder="Enter link URL (optional)"
              />
            </div>
          </div>

          {/* Status Field */}
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Status</h3>
              <Select
                name="status"
                value={formFields.status}
                onChange={handleInputChange}
                fullWidth
                size="small"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className='col w-full p-5 px-0'>
            <h3 className='text-[18px] font-[700] mb-3 text-black'>Slide Image *</h3>

            <div className="mb-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {imageFile ? '✅ Image uploaded' : '⚠️ Please upload an image'}
              </p>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {imageFile && (
                <div className='uploadboxWrapper relative'>
                  <span 
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'
                    onClick={handleRemoveImage}
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>

                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt='slide-image'
                      effect='blur'
                      src={typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile)}
                    />
                  </div>
                </div>
              )}

              {!imageFile && (
                <UploadBox 
                  multiple={false} 
                  onChange={handleImageUpload}
                  // url="/api/sliders" 
                />
              )}
            </div>
          </div>
        </div>

        <hr className='my-5' />

        <Button 
          type='submit' 
          disabled={submitting || !isFormValid}
          className='btn-blue btn-lg w-full gap-2'
        >
          {submitting ? 'Publishing...' : 'Publish Slide'} <MdCloudUpload className='text-[18px]' />
        </Button>

        {/* Debug info - remove in production */}
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <p>Form Valid: {isFormValid ? 'Yes' : 'No'}</p>
          <p>Image: {imageFile ? imageFile.name : 'None'}</p>
          <p>Submitting: {submitting ? 'Yes' : 'No'}</p>
        </div>
      </form>
    </section>
  );
};

export default AddHomeSlide;