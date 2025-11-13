import React, { useState, useEffect, useContext } from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { postData, deleteImages, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const AddSubCategory = () => {
  const context = useContext(MyContext);
  const [categories, setCategories] = useState([]);
  const [formFields, setFormFields] = useState({
    categoryId: '',
    subCatName: '',
    images: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetchDataFromApi('/api/category');
      if (res && res.success && Array.isArray(res.categories)) {
        // ✅ Only top-level categories (no parentId)
        const topCategories = res.categories.filter(cat => !cat.parentId);
        setCategories(topCategories);
      } else {
        context.openAlertBox({ type: 'error', msg: 'Failed to fetch categories' });
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      context.openAlertBox({ type: 'error', msg: 'Error loading categories' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const removeImage = async (index) => {
    const image = formFields.images[index];
    if (!image) return;
    try {
      await deleteImages('/api/subcategory/deleteImage', { image }); // ✅ SubCategory delete API
    } catch (err) {
      console.error('Error deleting image:', err);
    }
    setFormFields(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.subCatName.trim() || !formFields.categoryId) return;

    try {
      setSubmitting(true);

      const res = await postData('/api/subcategory/create', {
        categoryId: formFields.categoryId, // ObjectId
        name: formFields.subCatName.trim(),
        images: formFields.images,
      });

      if (res && res.success) {
        context.openAlertBox({ type: 'success', msg: 'Subcategory created successfully!' });
        context.setIsOpenFullScreenPanel({ open: false });
        window.location.reload();
      } else {
        context.openAlertBox({ type: 'error', msg: res.message || 'Failed to create subcategory' });
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox({ type: 'error', msg: 'Error creating subcategory' });
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-lg'>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8' onSubmit={handleSubmit}>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>

            <div className="grid grid-cols-2 gap-5 mb-3">
              <div className="col">
                <h3 className='text-[14px] font-[500] mb-1'>Select Category</h3>
                <Select
                  id="categorySelect"
                  name='categoryId'
                  className='w-full'
                  size='small'
                  value={formFields.categoryId}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                  
                  ))}
                </Select>

              </div>

              <div className="col">
                <h3 className='text-[14px] font-[500] mb-1'>Sub Category Name</h3>
                <input
                  type='text'
                  name='subCatName'
                  value={formFields.subCatName}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                />
              </div>
            </div>

            <h3 className='text-[16px] font-[700] mb-3 mt-4 text-black'>Subcategory Image</h3>

            <div className="grid grid-cols-7 gap-4">
              {formFields.images.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative'>
                  <span
                    onClick={() => removeImage(index)}
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>
                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] bg-gray-100'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt='subcategory'
                      effect='blur'
                      src={img}
                    />
                  </div>
                </div>
              ))}

              <UploadBox
                multiple={true}
                url='/api/subcategory/uploadSubCatImages' // ✅ Correct URL
                onChange={(images) =>
                  setFormFields(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...(images || []).flat()]
                  }))
                }
              />

            </div>
          </div>
        </div>

        <hr className='my-5' />

        <Button
          disabled={submitting || !formFields.subCatName.trim() || !formFields.categoryId}
          type='submit'
          className='btn-blue btn-lg w-full gap-2'
        >
          {submitting ? 'Publishing...' : 'Publish and View'} <MdCloudUpload className='text-[18px]' />
        </Button>
      </form>
    </section>
  );
};

export default AddSubCategory;
