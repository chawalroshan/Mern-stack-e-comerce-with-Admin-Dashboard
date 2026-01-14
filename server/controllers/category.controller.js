import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloudinary_Config_Cloud_Name, 
    api_key: process.env.cloudinary_Config_api_key, 
    api_secret: process.env.cloudinary_Config_api_secret, 
    secure : true,
});

// ================= Upload Images =================
export async function uploadImages(request, response) {
    try {
        const imagesArr = [];
        const images = request.files;

        if (!images || images.length === 0) {
            return response.status(400).json({
                message: "No images uploaded",
                success: false
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < images.length; i++) {
            const uploadResult = await cloudinary.uploader.upload(images[i].path, options);
            imagesArr.push(uploadResult.secure_url);
            fs.unlinkSync(`uploads/${images[i].filename}`);
        }

        return response.status(200).json({
            images: imagesArr,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Create Category (supports any level) =================
export async function createCategory(request, response) {
    try {
        const { name, images, parentId } = request.body;
        
        if (!name || !name.trim()) {
            return response.status(400).json({
                message: 'Category name is required',
                error: true,
                success: false
            });
        }

        let level = 1;
        let path = '';

        if (parentId) {
            const parentCategory = await CategoryModel.findById(parentId);
            if (!parentCategory) {
                return response.status(404).json({
                    message: 'Parent category not found',
                    error: true,
                    success: false
                });
            }
            level = parentCategory.level + 1;
            path = parentCategory.path ? `${parentCategory.path}/${parentId}` : parentId;
            
            // Limit nesting to 4 levels max
            if (level > 4) {
                return response.status(400).json({
                    message: 'Maximum category nesting level (4) exceeded',
                    error: true,
                    success: false
                });
            }
        }

        const category = new CategoryModel({
            name: name.trim(),
            images: images || [],
            parentId: parentId || null,
            level,
            path,
            isActive: true
        });

        await category.save();

        // Populate parent info for response
        const populatedCategory = await CategoryModel.findById(category._id)
            .populate('parentId', 'name level');

        return response.status(201).json({
            message: `Category created successfully (Level ${level})`,
            error: false,
            success: true,
            category: populatedCategory
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Get Categories with Nested Structure =================
export async function getCategory(request, response) {
    try {
        const categories = await CategoryModel.find({ isActive: true })
            .sort({ level: 1, name: 1 })
            .populate('parentId', 'name level');

        // Build nested structure
        const categoryMap = {};
        const rootCategories = [];

        categories.forEach(category => {
            categoryMap[category._id] = { 
                ...category.toObject(), 
                children: [] 
            };
        });

        categories.forEach(category => {
            if (category.parentId && categoryMap[category.parentId._id]) {
                categoryMap[category.parentId._id].children.push(categoryMap[category._id]);
            } else if (!category.parentId) {
                rootCategories.push(categoryMap[category._id]);
            }
        });

        return response.status(200).json({
            message: 'Categories fetched successfully',
            error: false,
            success: true,
            data: rootCategories,
            categories: categories
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Get Categories by Level (for dropdowns) =================
export async function getCategoriesByLevel(request, response) {
    try {
        const { level, parentId } = request.query;
        let query = { isActive: true };

        if (level) query.level = parseInt(level);
        if (parentId) query.parentId = parentId;

        const categories = await CategoryModel.find(query)
            .select('name level parentId images')
            .sort({ level: 1, name: 1 })
            .populate('parentId', 'name');

        return response.status(200).json({
            message: 'Categories fetched successfully',
            error: false,
            success: true,
            categories
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Get Category Breadcrumb Path =================
export async function getCategoryPath(request, response) {
    try {
        const categoryId = request.params.id;
        const path = [];
        
        let currentCategory = await CategoryModel.findById(categoryId);
        
        if (!currentCategory) {
            return response.status(404).json({
                message: 'Category not found',
                error: true,
                success: false
            });
        }

        while (currentCategory) {
            path.unshift({
                _id: currentCategory._id,
                name: currentCategory.name,
                level: currentCategory.level
            });
            
            if (currentCategory.parentId) {
                currentCategory = await CategoryModel.findById(currentCategory.parentId);
            } else {
                currentCategory = null;
            }
        }

        return response.status(200).json({
            message: 'Category path fetched successfully',
            error: false,
            success: true,
            path
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Get Category Count =================
export async function getCategoriesCount(request, response) {
    try {
        const categoryCount = await CategoryModel.countDocuments({ 
            parentId: null,
            isActive: true 
        });
        
        return response.status(200).json({
            categoryCount: categoryCount,
            success: true
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        }); 
    }
}

// ================= Get Sub Category Count =================
export async function getSubCategoriesCount(request, response) {
    try {
        const subCategoryCount = await CategoryModel.countDocuments({ 
            parentId: { $ne: null },
            isActive: true 
        });

        return response.status(200).json({
            subCategoryCount: subCategoryCount,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Get Sub Category =================
export async function getSubCategories(request, response) {
    try {
        // Get all categories with level 2 and above (subcategories)
        const subCategories = await CategoryModel.find({ 
            level: { $gte: 2 },
            isActive: true 
        }).populate('parentId', 'name level').sort({ level: 1, name: 1 });

        return response.status(200).json({
            message: "Subcategories fetched successfully",
            error: false,
            success: true,
            subCategories: subCategories
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Get Single Category by ID =================
export async function getCategoryById(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id)
            .populate('parentId', 'name level');

        if (!category) {
            return response.status(404).json({
                message: 'The category with the given ID was not found.',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Category found successfully',
            error: false,
            success: true,
            category: category
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// ================= Remove Image from Cloudinary =================
export async function removeImageFromClodinary(request, response) {
    try {
        const imgUrl = request.query.img;
        if (!imgUrl) {
            return response.status(400).json({ 
                message: 'Image URL is required',
                success: false 
            });
        }

        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split('.')[0];

        if (!imageName) {
            return response.status(400).json({ 
                message: 'Invalid image URL',
                success: false 
            });
        }

        const result = await cloudinary.uploader.destroy(imageName);

        return response.status(200).json({
            message: 'Image deleted successfully',
            result: result.result,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Failed to delete image',
            success: false
        });
    }
}

// ================= Delete Category =================
export async function deleteCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id);

        if (!category) {
            return response.status(404).json({
                message: 'Category not found',
                error: true,
                success: false
            });
        }

        // Delete images from Cloudinary
        const images = category.images || [];
        for (let img of images) {
            const urlArr = img.split('/');
            const image = urlArr[urlArr.length - 1];
            const imageName = image.split('.')[0];

            if (imageName) {
                await cloudinary.uploader.destroy(imageName);
            }
        }

        // Recursively delete all child categories
        const deleteChildren = async (parentId) => {
            const children = await CategoryModel.find({ parentId: parentId });
            for (let child of children) {
                // Delete child's images
                const childImages = child.images || [];
                for (let img of childImages) {
                    const urlArr = img.split('/');
                    const image = urlArr[urlArr.length - 1];
                    const imageName = image.split('.')[0];
                    if (imageName) {
                        await cloudinary.uploader.destroy(imageName);
                    }
                }
                // Recursively delete grandchildren
                await deleteChildren(child._id);
                // Delete the child category
                await CategoryModel.findByIdAndDelete(child._id);
            }
        };

        // Start recursive deletion from the current category
        await deleteChildren(request.params.id);

        // Delete the main category
        await CategoryModel.findByIdAndDelete(request.params.id);

        return response.status(200).json({
            message: 'Category and all subcategories deleted successfully',
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

// ================= Update Category =================
export async function updatedCategory(request, response) {
    try {
        const { name, images, parentId } = request.body;

        // If changing parent, recalculate level and path
        let updateData = {
            name: name?.trim(),
            images: images || []
        };

        if (parentId) {
            const parentCategory = await CategoryModel.findById(parentId);
            if (!parentCategory) {
                return response.status(404).json({
                    message: 'Parent category not found',
                    error: true,
                    success: false
                });
            }

            const newLevel = parentCategory.level + 1;
            if (newLevel > 4) {
                return response.status(400).json({
                    message: 'Maximum category nesting level (4) exceeded',
                    error: true,
                    success: false
                });
            }

            updateData.level = newLevel;
            updateData.path = parentCategory.path ? `${parentCategory.path}/${parentId}` : parentId;
            updateData.parentId = parentId;
        }

        const category = await CategoryModel.findByIdAndUpdate(
            request.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('parentId', 'name level');

        if (!category) {
            return response.status(404).json({
                message: 'Category not found or cannot be updated!',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Category updated successfully',
            error: false,
            success: true,
            category: category
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

// ================= Get Category Tree (Flat list with hierarchy) =================
export async function getCategoryTree(request, response) {
    try {
        const categories = await CategoryModel.find({ isActive: true })
            .sort({ level: 1, name: 1 })
            .populate('parentId', 'name');

        const categoryTree = categories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            level: cat.level,
            parentId: cat.parentId,
            parentName: cat.parentId?.name || '',
            images: cat.images,
            indent: '--'.repeat(cat.level - 1) + ' ' + cat.name
        }));

        return response.status(200).json({
            message: 'Category tree fetched successfully',
            error: false,
            success: true,
            categories: categoryTree
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}