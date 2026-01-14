import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { 
  createCategory, 
  getCategoriesCount, 
  getCategory, 
  uploadImages, 
  getSubCategoriesCount, 
  getCategoryById, 
  removeImageFromClodinary, 
  deleteCategory, 
  updatedCategory,
  getCategoriesByLevel,
  getCategoryPath,
  getCategoryTree,
  getSubCategories
} from "../controllers/category.controller.js";

const categoryRouter = Router();

// Image upload
categoryRouter.post('/uploadImage', auth, upload.array('images'), uploadImages);

// CRUD operations
categoryRouter.post('/create', auth, createCategory);
categoryRouter.get('/', getCategory);
categoryRouter.get('/tree', getCategoryTree); // Flat tree for dropdowns
categoryRouter.get('/by-level', getCategoriesByLevel);
categoryRouter.get('/path/:id', getCategoryPath);
categoryRouter.get('/get/count', getCategoriesCount);
categoryRouter.get('/get/count/subCat', getSubCategoriesCount);
categoryRouter.get('/subcategories', getSubCategories);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.delete('/deleteImage', auth, removeImageFromClodinary);
categoryRouter.delete('/deleteCategory/:id', auth, deleteCategory);
categoryRouter.put('/updateCategory/:id', auth, updatedCategory);

export default categoryRouter;