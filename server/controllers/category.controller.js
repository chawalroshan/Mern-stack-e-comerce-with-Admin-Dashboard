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



export async function uploadImages(request, response) {
    try {
        const imagesArr = []; // ✅ Move inside function
        const images = request.files;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < (images?.length || 0); i++) {
            const uploadResult = await cloudinary.uploader.upload(images[i].path, options);
            imagesArr.push(uploadResult.secure_url);
            fs.unlinkSync(`uploads/${images[i].filename}`);
        }

        return response.status(200).json({
            images: imagesArr,
            success: true // ✅ Add success flag
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// create category
export async function createCategory(request, response) {
    try {
        let category = new CategoryModel({
            name: request.body.name,
            images: request.body.images || [], // ✅ Get images from request body
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        });

        category = await category.save();

        return response.status(201).json({
            message: 'Category created',
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

//get category
export async function getCategory(request, response){
    try {
        const categories = await CategoryModel.find();
        const categoryMap = {};

        categories.forEach(cat =>{
            categoryMap[cat._id] = { ...cat._doc, children: []}
        })

        const rootCategories = [];

        categories.forEach(cat => {
            if (cat.parentId){
                categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
            }else{
                rootCategories.push(categoryMap[cat._id]);
            }
        });

        return response.status(200).json({
            message: '',
            error: false,
            success: true,
            data : rootCategories,
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

//get category count
export async function getCategoriesCount(request, response){
    try {
        const categoryCount = await CategoryModel.countDocuments({ parentId : undefined});
        if(!categoryCount){
            response.satus(500).json({
                success : false,
                error: true
            })
        }else{
            response.send({
                categoryCount: categoryCount,
            })
        }
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        }); 
    }

}

// get sub category count
export async function getSubCategoriesCount(request, response) {
    try {
        const categories = await CategoryModel.find();

        if (!categories) {
            return response.status(500).json({
                success: false,
                error: true
            });
        }

        const subCatList = [];
        for (let cat of categories) {
            if (cat.parentId) { // has a parent -> subcategory
                subCatList.push(cat);
            }
        }

        return response.status(200).json({
            subCategoryCount: subCatList.length, // just count
            subCategories: subCatList // optional: return list too
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// get single category by ID
export async function getCategoryById(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id);

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


//Remove image from cloudinary

export async function removeImageFromClodinary(request, response) {
    try {
        const imgUrl = request.query.img;
        if (!imgUrl) {
            return response.status(400).json({ message: 'Image URL is required' });
        }

        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split('.')[0]; // public_id expected by Cloudinary

        if (!imageName) {
            return response.status(400).json({ message: 'Invalid image URL' });
        }
        const result = await cloudinary.uploader.destroy(imageName);

        return response.status(200).json({
            message: 'Image deleted successfully',
            result: result.result,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Failed to delete image',
        });
    }
}

//delete category
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

        const images = category.images || [];

        for (let img of images) {
            const urlArr = img.split('/');
            const image = urlArr[urlArr.length - 1];
            const imageName = image.split('.')[0];

            cloudinary.uploader.destroy(imageName, (error, result) => {
                // console.log(error, result);
            });
        }

        const subcategory = await CategoryModel.find({
            parentId: request.params.id
        });

        for (let i = 0; i < subcategory.length; i++) {
            const thirdsubCategory = await CategoryModel.find({
                parentId: subcategory[i]._id
            });

            for (let j = 0; j < thirdsubCategory.length; j++) {
                await CategoryModel.findByIdAndDelete(thirdsubCategory[j]._id);
            }

            await CategoryModel.findByIdAndDelete(subcategory[i]._id);
        }

        const deletedCat = await CategoryModel.findByIdAndDelete(request.params.id);

        if (!deletedCat) {
            return response.status(404).json({
                message: 'Category not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Category deleted successfully',
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

//update category
export async function updatedCategory(request, response){
    try {
        const category = await CategoryModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
                images: request.body.images, // ✅ Get from request body
                parentId: request.body.parentId,
                parentCatName: request.body.parentCatName,
            },
            {
                new: true
            }
        );

        if(!category){
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
