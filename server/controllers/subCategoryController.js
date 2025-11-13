import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// ================= Upload SubCategory Images =================
export async function uploadSubCatImages(req, res) {
  try {
    const imagesArr = [];
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
        success: false,
      });
    }

    const options = { use_filename: true, unique_filename: false, overwrite: false };

    for (let i = 0; i < images.length; i++) {
      const uploadResult = await cloudinary.uploader.upload(images[i].path, options);
      imagesArr.push(uploadResult.secure_url);
      fs.unlinkSync(`uploads/${images[i].filename}`);
    }

    return res.status(200).json({
      images: imagesArr,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to upload images", success: false });
  }
}

// ================= Create SubCategory =================
export async function createSubCategory(req, res) {
  try {
    const { categoryId, name, images } = req.body;

    if (!categoryId || !name) {
      return res.status(400).json({ message: "Category ID and Subcategory name are required", success: false });
    }

    const subCategory = new CategoryModel({
      name: name.trim(),
      images: images || [],
      parentId: categoryId, // parent category reference
    });

    await subCategory.save();

    return res.status(201).json({
      message: "Subcategory created successfully",
      success: true,
      subCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create subcategory", success: false });
  }
}

// ================= Get All SubCategories =================
export async function getAllSubCategories(req, res) {
  try {
    // ✅ populate parentId to get category name
    const subCategories = await CategoryModel.find({ parentId: { $exists: true, $ne: null } })
      .populate('parentId', 'name');

    return res.status(200).json({
      message: "Subcategories fetched successfully",
      success: true,
      subcategories: subCategories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch subcategories", success: false });
  }
}

// Inside subCategoryController.js
export async function getSubCategoryById(req, res) {
    try {
      const subCategory = await CategoryModel.findById(req.params.id).populate('parentId', 'name');
  
      if (!subCategory) {
        return res.status(404).json({ message: "Subcategory not found", success: false });
      }
  
      return res.status(200).json({
        message: "Subcategory fetched successfully",
        success: true,
        subCategory,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || "Failed to fetch subcategory", success: false });
    }
  }
  

// ================= Update SubCategory =================
export async function updateSubCategory(req, res) {
  try {
    const { name, images, parentId } = req.body;

    const subCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, images, parentId },
      { new: true }
    ).populate('parentId', 'name');

    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found or cannot be updated", success: false });
    }

    return res.status(200).json({
      message: "Subcategory updated successfully",
      success: true,
      subCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update subcategory", success: false });
  }
}

// ================= Delete SubCategory =================
export async function deleteSubCategory(req, res) {
  try {
    const subCategory = await CategoryModel.findById(req.params.id);
    if (!subCategory) return res.status(404).json({ message: "Subcategory not found", success: false });

    const images = subCategory.images || [];
    for (let img of images) {
      const filename = img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(filename);
    }

    await CategoryModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Subcategory deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete subcategory", success: false });
  }
}
