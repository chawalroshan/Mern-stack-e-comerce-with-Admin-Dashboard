import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createproduct,
     deleteProducts,
     getAllFeaturedProducts,
     getAllProducts,
      getAllProductsByCatId,
       getAllProductsByCatName,
        getAllProductsByPrice,
         getAllProductsByRating,
         getAllProductsByThirdCatId,
          getAllProductsByThirdCatName,
           getAllProductsCount,
           getAllProductsSubByCatId,
            getAllProductSubByCatName,
             getProduct,
             removeImageFromClodinary,
             updateProduct,
             uploadImages } from "../controllers/product.controller.js";

const productRouter = Router ()
productRouter.post('/uploadImages',auth,upload.array('images'), uploadImages)
productRouter.post('/create-product',auth, createproduct)
productRouter.get('/getAllProducts', getAllProducts)
productRouter.get('/getAllProductsByCatId/:id', getAllProductsByCatId)
productRouter.get('/getAllProductsByCatName', getAllProductsByCatName)
productRouter.get('/getAllProductsSubByCatId/:id', getAllProductsSubByCatId)
productRouter.get('/getAllProductSubByCatName', getAllProductSubByCatName)
productRouter.get('/getAllProductsByThirdCatId/:id', getAllProductsByThirdCatId)
productRouter.get('/getAllProductsByThirdCatName', getAllProductsByThirdCatName)
productRouter.get('/getAllProductsByPrice', getAllProductsByPrice)
productRouter.get('/getAllProductsByRating', getAllProductsByRating)
productRouter.get('/getAllProductsCount', getAllProductsCount)
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts)
productRouter.delete('/delete/id:',auth, deleteProducts)
productRouter.delete('/id:', getProduct)
productRouter.delete('/deleteImage',auth, removeImageFromClodinary)
productRouter.put('/updateProduct',auth, updateProduct)


export default productRouter
