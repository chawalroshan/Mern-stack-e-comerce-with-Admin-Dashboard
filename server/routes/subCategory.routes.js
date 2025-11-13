import express from "express";
import { createSubCategory, getAllSubCategories, deleteSubCategory, updateSubCategory, getSubCategoryById, uploadSubCatImages } from "../controllers/subCategoryController.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const SubCategoryRouter = express.Router();

SubCategoryRouter.post('/uploadSubCatImages',auth,upload.array('images'), uploadSubCatImages)
// Create
SubCategoryRouter.post("/create", createSubCategory);


// Get all
SubCategoryRouter.get("/", getAllSubCategories);

// Delete
SubCategoryRouter.delete("/delete/:id", deleteSubCategory);


SubCategoryRouter.get("/:id", getSubCategoryById);
SubCategoryRouter.put("/update/:id", updateSubCategory);


export default SubCategoryRouter;
