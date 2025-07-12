import express from "express";
import {
  getAllProducts,
  getSellerProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController.js";
import { isSeller, requireSignIn } from "../middlewares/authMiddleware.js";
// import {
//   requireSignIn,
//   isSeller,
//   authorizeRoles,
// } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/get-products", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProduct);

// Seller routes (require authentication and seller role)
router.get("/seller/my-products", requireSignIn, isSeller, getSellerProducts);
router.post("/seller/create-product", requireSignIn, isSeller, createProduct);
router.put(
  "/seller/update-product/:id",
  requireSignIn,
  isSeller,
  updateProduct
);
router.delete(
  "/seller/delete-product/:id",
  requireSignIn,
  isSeller,
  deleteProduct
);

export default router;
