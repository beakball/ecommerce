import React, { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { categories } from "../../data/mockProducts";
import axios from "axios";
import SellerMenu from "../../components/Seller/SellerMenu";

const CreateProduct = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    tags: "",
    inStock: true,
  });
  const [loading, setLoading] = useState(false);

  const handleAddProduct = () => {
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), // Local preview
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // const handleImageUpload = async (e) => {
  //   const files = Array.from(e.target.files);

  //   const uploadedImages = [];

  //   for (let file of files) {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", "your_upload_preset"); // Replace this with your Cloudinary preset
  //     formData.append("cloud_name", "your_cloud_name"); // Replace this with your Cloudinary cloud name

  //     try {
  //       const res = await axios.post(
  //         "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary URL
  //         formData
  //       );

  //       uploadedImages.push(res.data.secure_url);
  //     } catch (err) {
  //       console.error("Image upload failed:", err);
  //     }
  //   }

  //   // Append new images
  //   setImages((prev) => [...prev, ...uploadedImages]);
  // };

  const removeImage = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].url);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmZmZTVjMzk3MmQ1YjVkYjc4YjM5OSIsImlhdCI6MTc1MjIyNjY5MCwiZXhwIjoxNzUyODMxNDkwfQ.eGcWRsZe-zbptLu3tU1TmG6AEP7jLnQxhVdlMCzAjqk";

  const { name, description, price, originalPrice, category, tags, inStock } =
    formData;

  /**
   * The handleSubmit function is used to handle form submission in a React component, sending a POST
   * request to create a new product with the form data.
   */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // Submit logic here
  //   const { data } = await axios.post(
  //     "/api/v1/products/seller/create-product",
  //     {
  //       name,
  //       images,
  //       price,
  //       originalPrice,
  //       description,
  //       category,
  //       tags: tags.split(",").map((t) => t.trim()),
  //       inStock,
  //     },
  //     { headers: { Authorization: `Bearer ${token}` } }
  //   );
  //   console.log(data);
  //   console.log({ ...formData, images });
  //   setIsFormOpen(false);
  //   setFormData({
  //     title: "",
  //     description: "",
  //     price: "",
  //     category: "",
  //     tags: "",
  //     inStock: true,
  //   });
  //   setImages([]);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrls = [];

      for (let img of images) {
        const imgFormData = new FormData();
        imgFormData.append("file", img.file);
        imgFormData.append("upload_preset", "Ecomm_preset"); // 🔁 Replace this
        imgFormData.append("cloud_name", "dplsiqv75"); // 🔁 Replace this

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dplsiqv75/image/upload", // 🔁 Replace this
          imgFormData
        );

        uploadedImageUrls.push(res.data.secure_url);
      }

      const { data } = await axios.post(
        "/api/v1/products/seller/create-product",
        {
          ...formData,
          images: uploadedImageUrls,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(data);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        tags: "",
        inStock: true,
      });
      setImages([]);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error submitting product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:flex lg:gap-8">
        {/* Seller Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <SellerMenu />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image.url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 5 images. First image will be the cover.
                </p>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g. organic, cotton, sustainable"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="inStock"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    In Stock
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
