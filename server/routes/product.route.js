import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  createproduct,
  deleteProducts,
  deleteMultipleProducts,
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
  uploadImages,
  createProductWithImages,
} from "../controllers/product.controller.js";

const productRouter = Router();

// image upload for products
productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);

// create product
productRouter.post("/create-product", auth, createproduct);

// listing & filters
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);
productRouter.get("/getAllProductsSubByCatId/:id", getAllProductsSubByCatId);
productRouter.get("/getAllProductSubByCatName", getAllProductSubByCatName);
productRouter.get("/getAllProductsByThirdCatId/:id", getAllProductsByThirdCatId);
productRouter.get("/getAllProductsByThirdCatName", getAllProductsByThirdCatName);
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);
productRouter.get("/getAllProductsByRating", getAllProductsByRating);
productRouter.get("/getAllProductsCount", getAllProductsCount);
productRouter.get("/getAllFeaturedProducts", getAllFeaturedProducts);

// single product
productRouter.get("/:id", getProduct);

// delete product
productRouter.delete("/delete/:id", auth, deleteProducts);
productRouter.post("/deleteMany", auth, deleteMultipleProducts);

// delete single image from cloudinary (by URL)
productRouter.delete("/deleteImage", auth, removeImageFromClodinary);

// update product (with optional new images)
productRouter.put(
  "/updateProduct/:id",
  auth,
  upload.array("images"),
  updateProduct
);
productRouter.post("/create-product-with-images", auth, upload.array("images"), createProductWithImages);

export default productRouter;
