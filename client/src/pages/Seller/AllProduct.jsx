import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, X, Upload } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { categories } from "../../data/mockProducts";
import SellerMenu from "../../components/Seller/SellerMenu";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    tags: "",
    inStock: true,
  });
  const [editImages, setEditImages] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Temporary token - in a real app, get this from auth context
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmZmZTVjMzk3MmQ1YjVkYjc4YjM5OSIsImlhdCI6MTc1MjIyNjY5MCwiZXhwIjoxNzUyODMxNDkwfQ.eGcWRsZe-zbptLu3tU1TmG6AEP7jLnQxhVdlMCzAjqk";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        baseURL + "/api/v1/products/seller/my-products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          baseURL + `/api/v1/products/seller/delete-product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || "",
      category: product.category,
      tags: product.tags ? product.tags.join(", ") : "",
      inStock: product.inStock,
    });
    setEditImages(
      product.images.map((img) => (typeof img === "string" ? img : img.url))
    );
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setEditImages([...editImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...editImages];
    if (newImages[index].url) {
      URL.revokeObjectURL(newImages[index].url);
    }
    newImages.splice(index, 1);
    setEditImages(newImages);
  };

  // const handleUpdateProduct = async (e) => {
  //   e.preventDefault();
  //   setUpdateLoading(true);

  //   try {
  //     const uploadedImageUrls = [];

  //     for (let img of editImages) {
  //       const imgFormData = new FormData();
  //       imgFormData.append("file", img.file);
  //       imgFormData.append("upload_preset", "Ecomm_preset"); // 🔁 Replace this
  //       imgFormData.append("cloud_name", "dplsiqv75"); // 🔁 Replace this

  //       const res = await axios.post(
  //         "https://api.cloudinary.com/v1_1/dplsiqv75/image/upload", // 🔁 Replace this
  //         imgFormData
  //       );

  //       uploadedImageUrls.push(res.data.secure_url);
  //     }

  //     const {
  //       name,
  //       description,
  //       price,
  //       originalPrice,
  //       category,
  //       tags,
  //       inStock,
  //     } = editFormData;

  //     const { data } = await axios.put(
  //       `/api/v1/products/seller/update-product/${editingProduct._id}`,
  //       {
  //         name,
  //         description,
  //         price,
  //         originalPrice: originalPrice || undefined,
  //         category,
  //         tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  //         inStock,
  //         images: [...uploadedImageUrls, ...editImages],
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setIsEditModalOpen(false);
  //     fetchProducts();
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //   } finally {
  //     setUpdateLoading(false);
  //   }
  // };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const uploadedImageUrls = [];

      for (let img of editImages) {
        if (typeof img === "string" && img.startsWith("http")) {
          // Already uploaded image
          uploadedImageUrls.push(img);
        } else if (img.file) {
          const imgFormData = new FormData();
          imgFormData.append("file", img.file);
          imgFormData.append("upload_preset", "Ecomm_preset"); // Replace with your actual preset
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dplsiqv75/image/upload",
            imgFormData
          );
          uploadedImageUrls.push(res.data.secure_url);
        }
      }

      const {
        name,
        description,
        price,
        originalPrice,
        category,
        tags,
        inStock,
      } = editFormData;

      await axios.put(
        baseURL +
          `/api/v1/products/seller/update-product/${editingProduct._id}`,
        {
          name,
          description,
          price,
          originalPrice: originalPrice || undefined,
          category,
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
          inStock,
          images: uploadedImageUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Your Products</h1>
            <Link
              to="/seller/dashboard/create-product"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Product
            </Link>
          </div>

          {/* Search and filter */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No products found.</p>
              <Link
                to="/seller/dashboard/create-product"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Product Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-semibold">Edit Product</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="p-6">
                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                      {editImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                        >
                          <img
                            src={typeof image === "string" ? image : image.url}
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
                        <span className="text-sm text-gray-500">
                          Upload Image
                        </span>
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
                        id="name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
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
                        value={editFormData.description}
                        onChange={handleEditFormChange}
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
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="originalPrice"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Original Price ($){" "}
                        <span className="text-gray-500 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        min="0"
                        step="0.01"
                        value={editFormData.originalPrice}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
                        value={editFormData.category}
                        onChange={handleEditFormChange}
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
                        value={editFormData.tags}
                        onChange={handleEditFormChange}
                        placeholder="e.g. organic, cotton, sustainable"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inStock"
                        name="inStock"
                        checked={editFormData.inStock}
                        onChange={handleEditFormChange}
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
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                    >
                      {updateLoading && (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
