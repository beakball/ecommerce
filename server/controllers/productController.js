import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dplsiqv75",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicId = (url) => {
  if (!url || typeof url !== "string") return null;
  const parts = url.split("/");
  const filename = parts.pop(); // abc123.jpg
  const folder = parts.pop(); // Ecomm
  if (!filename || !folder) return null;
  return `${folder}/${filename.split(".")[0]}`; // Ecomm/abc123
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    if (!products.length) {
      return res.status(400).send({
        success: false,
        message: "Products not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching products",
      error,
    });
  }
};

// Get products by seller
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user;
    const products = await Product.find({ seller: sellerId });
    res.status(200).send({
      success: true,
      message: "Seller products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching seller products",
      error,
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("seller", "name email");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching product",
      error,
    });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      category,
      images,
      inStock,
      tags,
    } = req.body;
    console.log(req.body);

    // Validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Product name is required",
      });
    }
    if (!price || price <= 0) {
      return res.status(400).send({
        success: false,
        message: "Valid price is required",
      });
    }
    if (!description) {
      return res.status(400).send({
        success: false,
        message: "Product description is required",
      });
    }
    if (!category) {
      return res.status(400).send({
        success: false,
        message: "Product category is required",
      });
    }

    const product = new Product({
      name,
      price,
      originalPrice,
      description,
      category,
      images: images || [],
      inStock: inStock !== undefined ? inStock : true,
      tags: tags || [],
      seller: req.user,
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating product",
      error,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      originalPrice,
      description,
      category,
      images: updatedImagesFromClient,
      inStock,
      tags,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user is the seller of this product
    if (product.seller.toString() !== req.user) {
      return res.status(403).send({
        success: false,
        message: "Access denied. You can only update your own products",
      });
    }

    // Step 1: Find deleted images
    const existingImages = product.images || [];
    const deletedImages = existingImages.filter((img) => {
      const imageUrl = typeof img === "string" ? img : img.url;
      return !updatedImagesFromClient.includes(imageUrl);
    });

    // Step 2: Delete from Cloudinary
    for (const img of deletedImages) {
      const publicId = extractPublicId(typeof img === "string" ? img : img.url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        price: price || product.price,
        originalPrice: originalPrice || product.originalPrice,
        description: description || product.description,
        category: category || product.category,
        images: updatedImagesFromClient || product.images,
        inStock: inStock !== undefined ? inStock : product.inStock,
        tags: tags || product.tags,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user is the seller of this product
    if (product.seller.toString() !== req.user) {
      return res.status(403).send({
        success: false,
        message: "Access denied. You can only delete your own products",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting product",
      error,
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).populate(
      "seller",
      "name email"
    );

    res.status(200).send({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching products by category",
      error,
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).send({
        success: false,
        message: "Search query is required",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    }).populate("seller", "name email");

    res.status(200).send({
      success: true,
      message: "Search results fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error searching products",
      error,
    });
  }
};
