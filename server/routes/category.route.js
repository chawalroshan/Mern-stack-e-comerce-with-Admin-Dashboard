import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createCategory, getCategoriesCount, getCategory, uploadImages, getSubCategoriesCount, getCategoryById, removeImageFromClodinary, deleteCategory, updatedCategory } from "../controllers/category.controller.js";

const categoryRouter = Router ()
categoryRouter.post('/uploadImages',auth,upload.array('images'), uploadImages)
categoryRouter.post('/create',auth, createCategory)
categoryRouter.get('/', getCategory)
categoryRouter.get('/get/count', getCategoriesCount)
categoryRouter.get('/get/count/subCat', getSubCategoriesCount)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.delete('/deleteImage',auth, removeImageFromClodinary)
categoryRouter.delete('/deleteCategory/:id',auth, deleteCategory)
categoryRouter.put('/updateCategory/:id',auth, updatedCategory)

export default categoryRouter;