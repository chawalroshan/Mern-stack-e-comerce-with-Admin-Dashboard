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

const EditCategory = () => {
  const context = useContext(MyContext);
  const { id: paramId } = useParams();

  // Category ID: either from dialog context or URL
  const categoryId = context.isOpenFullScreenPanel?.categoryId || paramId;

  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    parentCatName: '',
    parentId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Category ID:', categoryId);
    if (categoryId) fetchCategoryData();
    else setLoading(false); // No category selected, stop loading
  }, [categoryId]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const res = await fetchDataFromApi(`/api/category/${categoryId}`);
      console.log('API response:', res);
      if (res && res.success) {
        const category = res.category;
        setFormFields({
          name: category.name || '',
          images: category.images || [],
          parentCatName: category.parentCatName || '',
          parentId: category.parentId || '',
        });
      } else {
        context.openAlertBox({ type: 'error', msg: res?.message || 'Failed to fetch category data' });
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      context.openAlertBox({ type: 'error', msg: 'Error loading category' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) return;

    try {
      setSubmitting(true);
      const res = await editData(`/api/category/updateCategory/${categoryId}`, {
        name: formFields.name.trim(),
        images: formFields.images,
        parentId: formFields.parentId || null,
        parentCatName: formFields.parentCatName || ''
      });

      if (res && res.success) {
        context.openAlertBox({ type: 'success', msg: 'Category updated successfully!' });
        context.setIsOpenFullScreenPanel({ open: false });
        window.location.reload(); // Or better: refresh parent state
      } else {
        context.openAlertBox({ type: 'error', msg: res.message || 'Failed to update category' });
      }
    } catch (err) {
      console.error('Error updating category:', err);
      context.openAlertBox({ type: 'error', msg: 'Error updating category' });
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = async (index) => {
    const image = formFields.images?.[index];
    if (!image) return;

    try {
      const res = await deleteImages('/api/category/deleteImage', { image });
      console.log('Image deleted:', res);
    } catch (err) {
      console.error('Failed to delete image:', err);
    }

    setFormFields((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-lg'>Loading category data...</p>
        </div>
      </section>
    );
  }

  if (!categoryId) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-lg text-red-500'>No category selected</p>
        </div>
      </section>
    );
  }

  return (
    <section className='p-5 bg-gray-50'>
      <div className='mb-4'>
        <h2 className='text-[24px] font-bold'>Edit Category</h2>
        <p className='text-gray-600 text-sm'>Update category information and images</p>
      </div>

      <form className='form py-3 px-8 bg-white rounded-lg shadow-md' onSubmit={handleSubmit}>
        <div className='scroll max-h-[65vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>
            <div className="grid grid-cols-1 mb-3">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Category Name</h3>
                <input
                  type='text'
                  name='name'
                  value={formFields.name}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                  placeholder='Enter category name'
                  required
                />
              </div>
            </div>

            <br />
            <h3 className='text-[18px] font-[700] mb-1 text-black'>Category Images</h3>
            <p className='text-sm text-gray-500 mb-3'>Upload or manage category images</p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {formFields.images?.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative'>
                  <span
                    onClick={() => removeImage(index)}
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer hover:bg-red-700 transition'
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>
                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt={`Category image ${index + 1}`}
                      effect='blur'
                      wrapperProps={{ style: { transitionDelay: "0.5s" } }}
                      src={img}
                    />
                  </div>
                </div>
              ))}

              <UploadBox
                multiple={true}
                url='/api/category/uploadImage'
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
        <div className='flex gap-3'>
          <Button
            type='button'
            onClick={() => context.setIsOpenFullScreenPanel({ open: false })}
            className='btn-lg gap-2 !bg-gray-500 !text-white hover:!bg-gray-600'
          >
            Cancel
          </Button>
          <Button
            disabled={submitting || !formFields.name.trim()}
            type='submit'
            className='btn-blue btn-lg flex-1 gap-2'
          >
            {submitting ? 'Updating...' : 'Update Category'} <MdCloudUpload className='text-[18px]' />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditCategory;
