import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import { deleteImages, editData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const EditSubCategory = () => {
  const context = useContext(MyContext);
  const { id: paramId } = useParams();

  // Subcategory ID: either from fullscreen panel context or route param
  const subCatId = context.isOpenFullScreenPanel?.subCatId || paramId;

  const [formFields, setFormFields] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // ✅ Load subcategory and all categories
  useEffect(() => {
    if (subCatId) {
      fetchSubCategoryData();
    } else {
      setLoading(false);
    }
    fetchCategories();
  }, [subCatId]);

  // Fetch single subcategory data - FIXED ENDPOINT
  const fetchSubCategoryData = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: Use correct endpoint for subcategory
      const res = await fetchDataFromApi(`/api/category/subcategory/${subCatId}`);
      console.log('📡 Subcategory API Response:', res);
      
      if (res && res.success) {
        const subCat = res.subCategory || res.data; // ✅ handle both response formats
        console.log('📋 Subcategory data:', subCat);
        
        setFormFields({
          name: subCat?.name || '',
          categoryId: subCat?.parentId?._id || subCat?.parentId || '', // ✅ handle both populated and ID
          categoryName: subCat?.parentId?.name || '',
          images: subCat?.images || [],
        });
      } else {
        context.openAlertBox({ 
          type: 'error', 
          msg: res?.message || 'Failed to fetch subcategory data' 
        });
      }
    } catch (err) {
      console.error('❌ Error fetching subcategory:', err);
      context.openAlertBox({ 
        type: 'error', 
        msg: 'Error loading subcategory: ' + err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await fetchDataFromApi('/api/category');
      console.log('📡 Categories API Response:', res);
      
      if (res && res.success) {
        // ✅ Handle different response formats
        const categoriesData = res.categories || res.data || [];
        console.log('📋 Categories found:', categoriesData.length);
        setCategories(categoriesData);
      } else {
        console.error('❌ Categories API error:', res);
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      context.openAlertBox({ 
        type: 'error', 
        msg: 'Error loading categories' 
      });
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload from UploadBox
  const handleImageUpload = (newImages) => {
    if (!newImages || newImages.length === 0) return;
    
    // ✅ Flatten array and filter out null/undefined
    const flattenedImages = newImages.flat().filter(img => img);
    
    setFormFields(prev => ({
      ...prev,
      images: [...(prev.images || []), ...flattenedImages]
    }));
  };

  // Remove uploaded image
  const removeImage = async (index) => {
    const imageUrl = formFields.images?.[index];
    if (!imageUrl) return;

    try {
      // ✅ Only delete from server if it's a hosted image (not base64)
      if (imageUrl.startsWith('http')) {
        await deleteImages('/api/subcategory/deleteImage', { image: imageUrl });
        console.log('🗑️ Image deleted from server');
      }
    } catch (err) {
      console.error('❌ Failed to delete image from server:', err);
      // Continue with local removal even if server deletion fails
    }

    // ✅ Always remove from local state
    setFormFields(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!formFields.name.trim()) {
      context.openAlertBox({ 
        type: 'error', 
        msg: 'Please enter a subcategory name' 
      });
      return;
    }

    if (!formFields.categoryId) {
      context.openAlertBox({ 
        type: 'error', 
        msg: 'Please select a parent category' 
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // ✅ FIXED: Use correct update endpoint and payload
      const res = await editData(`/api/category/updateCategory/${subCatId}`, {
        name: formFields.name.trim(),
        parentId: formFields.categoryId,
        images: formFields.images,
        level: 2 // ✅ Assuming subcategories are level 2
      });

      console.log('📡 Update API Response:', res);

      if (res && res.success) {
        context.openAlertBox({ 
          type: 'success', 
          msg: 'Subcategory updated successfully!' 
        });
        
        // ✅ Close panel if opened in fullscreen
        if (context.setIsOpenFullScreenPanel) {
          context.setIsOpenFullScreenPanel({ open: false });
        }
        
        // ✅ Optional: Refresh parent component instead of full reload
        setTimeout(() => {
          if (window.location.pathname.includes('/edit/')) {
            // If on edit page, go back to list
            window.history.back();
          } else {
            // If in modal, just close it (already done above)
          }
        }, 1000);
        
      } else {
        context.openAlertBox({ 
          type: 'error', 
          msg: res?.message || 'Failed to update subcategory' 
        });
      }
    } catch (err) {
      console.error('❌ Error updating subcategory:', err);
      context.openAlertBox({ 
        type: 'error', 
        msg: 'Error updating subcategory: ' + err.message 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // UI: loading state
  if (loading) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <div className='text-center'>
            <p className='text-lg mb-2'>Loading subcategory data...</p>
            <p className='text-sm text-gray-500'>ID: {subCatId}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!subCatId) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <div className='text-center'>
            <p className='text-lg text-red-500 mb-2'>No subcategory selected</p>
            <p className='text-sm text-gray-500'>Please select a subcategory to edit</p>
          </div>
        </div>
      </section>
    );
  }

  // UI: main form
  return (
    <section className='p-5 bg-gray-50'>
      <div className='mb-4'>
        <h2 className='text-[24px] font-bold'>Edit Subcategory</h2>
        <p className='text-gray-600 text-sm'>Update subcategory name, category, and images</p>
        <p className='text-xs text-gray-400 mt-1'>ID: {subCatId}</p>
      </div>

      <form className='form py-3 px-8 bg-white rounded-lg shadow-md' onSubmit={handleSubmit}>
        <div className='scroll max-h-[65vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>
            
            {/* Debug Info */}
            <div className='mb-4 p-3 bg-blue-50 rounded-md'>
              <p className='text-sm text-blue-700'>
                Images: <strong>{formFields.images?.length || 0}</strong> | 
                Categories: <strong>{categories.length}</strong>
              </p>
            </div>

            {/* Subcategory Name */}
            <div className="grid grid-cols-1 mb-3">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Subcategory Name *</h3>
                <input
                  type='text'
                  name='name'
                  value={formFields.name}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                  placeholder='Enter subcategory name'
                  required
                />
              </div>
            </div>

            {/* Parent Category */}
            <div className="grid grid-cols-1 mb-5">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Parent Category *</h3>
                <select
                  name='categoryId'
                  value={formFields.categoryId}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-2 text-sm bg-white'
                  required
                >
                  <option value=''>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {cat.level ? `(Level ${cat.level})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <h3 className='text-[18px] font-[700] mb-1 text-black'>Subcategory Images</h3>
            <p className='text-sm text-gray-500 mb-3'>
              Upload or manage subcategory images ({formFields.images?.length || 0} uploaded)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Existing Images */}
              {formFields.images?.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative group'>
                  <span
                    onClick={() => removeImage(index)}
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer hover:bg-red-700 transition opacity-90'
                    title='Remove image'
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>
                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full bg-gray-100'>
                    <LazyLoadImage
                      className='w-full h-full object-contain'
                      alt={`Subcategory image ${index + 1}`}
                      effect='blur'
                      src={img}
                      onError={(e) => {
                        e.target.src = '/no-image.jpg';
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Upload new image */}
              <UploadBox
                multiple={true}
                url='/api/subcategory/uploadImage'
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <hr className='my-5' />
        <div className='flex gap-3'>
          <Button
            type='button'
            onClick={() => context.setIsOpenFullScreenPanel?.({ open: false })}
            className='btn-lg gap-2 !bg-gray-500 !text-white hover:!bg-gray-600'
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            disabled={submitting || !formFields.name.trim() || !formFields.categoryId}
            type='submit'
            className='btn-blue btn-lg flex-1 gap-2'
            variant="contained"
          >
            {submitting ? 'Updating...' : 'Update Subcategory'} 
            <MdCloudUpload className='text-[18px]' />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditSubCategory;