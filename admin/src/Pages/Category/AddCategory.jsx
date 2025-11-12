import React, { useContext, useState } from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import { deleteImages, postData } from '../../utils/api';
import { MyContext } from '../../App';

const AddCategory = () => {

  const context = useContext(MyContext); // ✅ Get context
  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    parentCatName: '',
    parentId: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
    const res = await postData('/api/category/create', {
      name: formFields.name.trim(),
      images: formFields.images,
      parentId: formFields.parentId || null,
      parentCatName: formFields.parentCatName || ''
    });
    if (res && res.success) {
      setFormFields({ name: '', images: [], parentCatName: '', parentId: '' });
      context.openAlertBox({ type: 'success', msg: 'Category created successfully!' });
      context.setIsOpenFullScreenPanel({ open: false }); // ✅ Close dialog
      window.location.reload(); // ✅ Refresh to show new category
    } else {
      context.openAlertBox({ type: 'error', msg: res.message || 'Failed to create category' });
    }
  } catch (err) {
    console.error('Error creating category:', err);
    context.openAlertBox({ type: 'error', msg: 'Error creating category' });
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

  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8' onSubmit={handleSubmit}>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>
            <div className="grid grid-cols-1 mb-3">
              <div className="col w-[25%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Category Name</h3>
                <input
                  type='text'
                  name='name'
                  value={formFields.name}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                />
              </div>
            </div>

            <br />
            <h3 className='text-[18px] font-[700] mb-1 text-black'>Category Image</h3>
            <br />

            {/* Image Grid */}
            <div className="grid grid-cols-7 gap-4">
              {/* Show all uploaded images */}
              {formFields.images?.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative'>
                  <span
                    onClick={() => removeImage(index)}
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>

                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt='image'
                      effect='blur'
                      wrapperProps={{
                        style: { transitionDelay: "0.5s" },
                      }}
                      src={img}
                    />
                  </div>
                </div>
              ))}

              {/* Always-visible Upload Box */}
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

        <Button
          disabled={submitting || !formFields.name.trim()}
          type='submit'
          className='btn-blue btn-lg w-full gap-2'
        >
          Publish and View <MdCloudUpload className='text-[18px]' />
        </Button>
      </form>
    </section>
  );
};

export default AddCategory;
