import ProductModel from "../models/product.model.js";

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloudinary_Config_Cloud_Name, 
    api_key: process.env.cloudinary_Config_api_key, 
    api_secret: process.env.cloudinary_Config_api_secret, 
    secure : true,
});

//Image upload
var imagesArr = [];

export async function uploadImages(request, response) {
    try {
        // let imagesArr = [];
        const images = request.files; // multiple file uploads

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        // Upload new images
        for (let i = 0; i < (images?.length || 0); i++) {
            const uploadResult = await cloudinary.uploader.upload(images[i].path, options);
            imagesArr.push(uploadResult.secure_url);

            // Delete file from local uploads folder
            fs.unlinkSync(`uploads/${images[i].filename}`);
        }

        return response.status(200).json({
            images : imagesArr
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//create product

export async function createproduct(request, response){
    try {
        const product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: imagesArr,
            brand: request.body.brand,
            price: request.body.price,
            oldePrice: request.body.oldePrice,
            catName: request.body.catName,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            thirdsubCat: request.body.thirdsubCat,
            thirdsubCatId: request.body.thirdsubCatId,
            category:request.body.category,
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productRam: request.body.productRam,
            size: request.body.size,
            productWeight: request.body.productWeight,
            dateCreated: request.body.dateCreated,

        })

        const savedProduct = await product.save();

        if(!savedProduct){
            return response.status(500).json({
                message: 'Product not created',
                error: true,
                success: false
            });
        }

        imagesArr = [];

        return response.status(200).json({
            message: 'Product created sucessfully',
            error: true,
            success: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//get all product 
export async function getAllProducts(request, response){
    try {

        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt (request.query.perPage);
        const totoalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totoalPosts/ perPage);

        if(page > totalPages){
            return response.status(404).json(
                {
                    message: 'Page not found',
                    sucess: false,
                    error: true
            })
        }


        const products = await ProductModel.find().populate('category')
        .skip((page-1)* perPage)
        .limit(perPage)
        .exec();

        if(!products){
            return response.status(500).json({
                message: 'product not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Product found',
            error: false,
            success: true,
            products : products,
            totalPages : totalPages,
            page : page,
        });  
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//get all products by cat Id
export async function getAllProductsByCatId(request, response){
    try {

        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt (request.query.perPage);
        const totoalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totoalPosts/ perPage);

        if(page > totalPages){
            return response.status(404).json(
                {
                    message: 'Page not found',
                    sucess: false,
                    error: true
            })
        }


        const products = await ProductModel.find({
            catId:request.params.id
        }).populate('category')
        .skip((page-1)* perPage)
        .limit(perPage)
        .exec();

        if(!products){
            return response.status(500).json({
                message: 'product not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Product found',
            error: false,
            success: true,
            products : products,
            totalPages : totalPages,
            page : page,
        });  
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//get all product by category name
export async function getAllProductsByCatName(request, response){
    try {

        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt (request.query.perPage);
        const totoalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totoalPosts/ perPage);

        if(page > totalPages){
            return response.status(404).json(
                {
                    message: 'Page not found',
                    sucess: false,
                    error: true
            })
        }


        const products = await ProductModel.find({
            catId : request.query.catname
        }).populate('category')
        .skip((page-1)* perPage)
        .limit(perPage)
        .exec();

        if(!products){
            return response.status(500).json({
                message: 'product not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Product found',
            error: false,
            success: true,
            products : products,
            totalPages : totalPages,
            page : page,
        });  
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//get all products by sub cat Id
export async function getAllProductsSubByCatId(request, response){
    try {

        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt (request.query.perPage);
        const totoalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totoalPosts/ perPage);

        if(page > totalPages){
            return response.status(404).json(
                {
                    message: 'Page not found',
                    sucess: false,
                    error: true
            })
        }


        const products = await ProductModel.find({
            subCatId:request.params.id
        }).populate('category')
        .skip((page-1)* perPage)
        .limit(perPage)
        .exec();

        if(!products){
            return response.status(500).json({
                message: 'product not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Product found',
            error: false,
            success: true,
            products : products,
            totalPages : totalPages,
            page : page,
        });  
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//get all product by sub category name
export async function getAllProductSubByCatName(request, response){
    try {

        const page = parseInt (request.query.page) || 1;
        const perPage = parseInt (request.query.perPage);
        const totoalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totoalPosts/ perPage);

        if(page > totalPages){
            return response.status(404).json(
                {
                    message: 'Page not found',
                    sucess: false,
                    error: true
            })
        }


        const products = await ProductModel.find({
            subCat:request.query.subCat
        }).populate('category')
        .skip((page-1)* perPage)
        .limit(perPage)
        .exec();

        if(!products){
            return response.status(500).json({
                message: 'product not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Product found',
            error: false,
            success: true,
            products : products,
            totalPages : totalPages,
            page : page,
        });  
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all products by third category Id
export async function getAllProductsByThirdCatId(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.perPage);
      const totalPosts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalPosts / perPage);
  
      if (page > totalPages) {
        return response.status(404).json({
          message: 'Page not found',
          success: false,
          error: true,
        });
      }
  
      const products = await ProductModel.find({
        thirdCatId: request.params.id, // 👈 use thirdCatId here
      })
        .populate('category')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
  
      if (!products) {
        return response.status(500).json({
          message: 'Product not found',
          error: true,
          success: false,
        });
      }
  
      return response.status(200).json({
        message: 'Products found',
        error: false,
        success: true,
        products,
        totalPages,
        page,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  }

  
  // get all products by third category name
export async function getAllProductsByThirdCatName(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.perPage);
      const totalPosts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalPosts / perPage);
  
      if (page > totalPages) {
        return response.status(404).json({
          message: 'Page not found',
          success: false,
          error: true,
        });
      }
  
      const products = await ProductModel.find({
        thirdCat: request.query.thirdCat, // 👈 use thirdCat here
      })
        .populate('category')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
  
      if (!products) {
        return response.status(500).json({
          message: 'Product not found',
          error: true,
          success: false,
        });
      }
  
      return response.status(200).json({
        message: 'Products found',
        error: false,
        success: true,
        products,
        totalPages,
        page,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  }


  // get all Products by price
export async function getAllProductsByPrice(request, response) {
    try {
      let productList = [];
  
      if (request.query.catId) {
        productList = await ProductModel.find({
          catId: request.query.catId,
        }).populate('category');
      }
  
      if (request.query.subCatId) {
        productList = await ProductModel.find({
          subCatId: request.query.subCatId,
        }).populate('category');
      }
  
      if (request.query.thirdCatId) { // 👈 fixed name
        productList = await ProductModel.find({
          thirdCatId: request.query.thirdCatId,
        }).populate('category');
      }
  
      const filteredProducts = productList.filter((product) => {
        if (request.query.minPrice && product.price < parseInt(request.query.minPrice)) {
          return false;
        }
        if (request.query.maxPrice && product.price > parseInt(request.query.maxPrice)) {
          return false;
        }
        return true;
      });
  
      return response.status(200).json({
        products: filteredProducts,
        totalPages: 0, // pagination not handled here
        page: 0,
        error: false,
        success: true,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  }
  

  // get all Products by rating and categories
export async function getAllProductsByRating(request, response) {
    try {
      let query = {};
  
      // Category filters
      if (request.query.catId) {
        query.catId = request.query.catId;
      }
      if (request.query.subCatId) {
        query.subCatId = request.query.subCatId;
      }
      if (request.query.thirdsubCatId) {   // ✅ fixed field name
        query.thirdsubCatId = request.query.thirdsubCatId;
      }
  
      // Rating filter
      if (request.query.minRating) {
        query.rating = { $gte: parseFloat(request.query.minRating) };
      }
      if (request.query.maxRating) {
        query.rating = {
          ...query.rating,
          $lte: parseFloat(request.query.maxRating),
        };
      }
  
      // Pagination
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Fetch products
      const productList = await ProductModel.find(query)
        .populate('category')
        .skip(skip)
        .limit(limit);
  
      const totalCount = await ProductModel.countDocuments(query);
  
      return response.status(200).json({
        products: productList,
        totalPages: Math.ceil(totalCount / limit),
        page,
        totalCount,
        error: false,
        success: true,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  }
  

  //get all products count
export async function getAllProductsCount(request, response){
    try {
        const productsCount = await ProductModel.countDocuments();

        if(!productsCount){
            return response.status(500).json({
                error: true,
                success: false,
              });
        }

        return response.status(200).json({
            error: false,
            success: true,
            productsCount: productsCount
          });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
          });
    }
}


// Get all Featured Products
export async function getAllFeaturedProducts(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const products = await ProductModel.find({ isFeatured: true })
        .populate("category")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // latest featured first
  
      const totalCount = await ProductModel.countDocuments({ isFeatured: true });
  
      return response.status(200).json({
        products,
        totalPages: Math.ceil(totalCount / limit),
        page,
        totalCount,
        error: false,
        success: true,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  }

// Delete Product
export async function deleteProducts(request, response) {
    try {
      const product = await ProductModel.findById(request.params.id);
  
      if (!product) {
        return response.status(404).json({
          message: "Product not found",
          error: true,
          success: false,
        });
      }
  
      // Delete images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imgUrl of product.images) {
          // Extract public_id from URL
          const publicId = imgUrl.split('/').pop().split('.')[0]; 
          await cloudinary.uploader.destroy(publicId);
        }
      }
  
      // Delete product from DB
      await ProductModel.findByIdAndDelete(request.params.id);
  
      return response.status(200).json({
        message: "Product and images deleted successfully",
        error: false,
        success: true,
      });
  
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Something went wrong",
        error: true,
        success: false,
      });
    }
  }

 //get single product
export async function getProduct(request, response) {
  try {
    const { id } = request.params;

    const product = await ProductModel.findById(id).populate('category');

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product fetched successfully",
      error: false,
      success: true,
      data: product,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
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

// Update Product
export async function updateProduct(request, response) {
    try {
      const { id } = request.params;
  
      // Find the product first
      let product = await ProductModel.findById(id);
      if (!product) {
        return response.status(404).json({
          message: "Product not found",
          error: true,
          success: false,
        });
      }
  
      // Update images if new files are uploaded
      if (request.files && request.files.length > 0) {
        const uploadedImages = [];
        for (let i = 0; i < request.files.length; i++) {
          const result = await cloudinary.uploader.upload(request.files[i].path, {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });
          uploadedImages.push(result.secure_url);
          fs.unlinkSync(request.files[i].path);
        }
        product.images = uploadedImages; // replace old images
      }
  
      // Update other fields
      product.name = request.body.name || product.name;
      product.description = request.body.description || product.description;
      product.brand = request.body.brand || product.brand;
      product.price = request.body.price || product.price;
      product.oldePrice = request.body.oldePrice || product.oldePrice;
      product.catName = request.body.catName || product.catName;
      product.catId = request.body.catId || product.catId;
      product.subCatId = request.body.subCatId || product.subCatId;
      product.subCat = request.body.subCat || product.subCat;
      product.thirdsubCat = request.body.thirdsubCat || product.thirdsubCat;
      product.thirdsubCatId = request.body.thirdsubCatId || product.thirdsubCatId;
      product.category = request.body.category || product.category;
      product.countInStock = request.body.countInStock || product.countInStock;
      product.rating = request.body.rating || product.rating;
      product.isFeatured = request.body.isFeatured ?? product.isFeatured;
      product.discount = request.body.discount || product.discount;
      product.productRam = request.body.productRam || product.productRam;
      product.size = request.body.size || product.size;
      product.productWeight = request.body.productWeight || product.productWeight;
  
      // Save the updated product
      const updatedProduct = await product.save();
  
      return response.status(200).json({
        message: "Product updated successfully",
        error: false,
        success: true,
        data: updatedProduct,
      });
  
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Something went wrong",
        error: true,
        success: false,
      });
    }
  }

  
  