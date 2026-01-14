import Slider from '../models/homeSlider.model.js';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration (make sure this is set up in your app)
cloudinary.config({ 
  cloud_name: process.env.cloudinary_Config_Cloud_Name, 
  api_key: process.env.cloudinary_Config_api_key, 
  api_secret: process.env.cloudinary_Config_api_secret, 
  secure: true,
});

// Create slider
export const createSlider = async (req, res, next) => {
  try {
    const file = (req.file || (req.files && req.files[0]));
    if (!file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const { title, link, status } = req.body;

    // Upload image to Cloudinary
    let imageUrl = '';
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'home_sliders', // Optional: organize in folder
        use_filename: true,
        unique_filename: false,
        overwrite: false
      });
      imageUrl = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to upload image to cloud storage' 
      });
    }

    const slider = new Slider({
      title: title || '',
      link: link || '',
      status: status === 'false' ? false : true,
      image: imageUrl, // Store Cloudinary URL instead of filename
    });

    await slider.save();

    return res.status(201).json({ 
      success: true, 
      message: 'Slider created successfully', 
      slider 
    });
  } catch (err) {
    next(err);
  }
};

// Get all sliders (admin)
export const getSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, sliders });
  } catch (err) {
    next(err);
  }
};

// Get active sliders (client)
export const getActiveSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find({ status: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, sliders });
  } catch (err) {
    next(err);
  }
};

// Update slider
export const updateSlider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, link, status } = req.body;

    const slider = await Slider.findById(id);
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    // If new image provided, upload to Cloudinary and delete old one
    const file = (req.file || (req.files && req.files[0]));
    if (file) {
      // Upload new image to Cloudinary
      let newImageUrl = '';
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'home_sliders',
          use_filename: true,
          unique_filename: false,
          overwrite: false
        });
        newImageUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to upload new image' 
        });
      }

      // Delete old image from Cloudinary if it exists
      if (slider.image) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = slider.image.split('/');
          const filenameWithExtension = urlParts[urlParts.length - 1];
          const publicId = `home_sliders/${filenameWithExtension.split('.')[0]}`;
          
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error('Error deleting old image from Cloudinary:', deleteError);
          // Continue with update even if deletion fails
        }
      }

      slider.image = newImageUrl;
    }

    // Update other fields
    if (title !== undefined) slider.title = title;
    if (link !== undefined) slider.link = link;
    if (status !== undefined) slider.status = (status === 'false' ? false : status === 'true' ? true : status);

    await slider.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Slider updated successfully', 
      slider 
    });
  } catch (err) {
    next(err);
  }
};

// Delete slider and Cloudinary image
export const deleteSlider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findById(id);
    
    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    // Delete image from Cloudinary if it exists
    if (slider.image) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = slider.image.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `home_sliders/${filenameWithExtension.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if image deletion fails
      }
    }

    await Slider.findByIdAndDelete(id);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Slider deleted successfully' 
    });
  } catch (err) {
    next(err);
  }
};