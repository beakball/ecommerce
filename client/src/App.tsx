import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./hooks/useCart";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import ProductList from "./components/Products/ProductList";
import ProductFilter from "./components/Products/ProductFilter";
import ProductDetail from "./components/Products/ProductDetail";
import Modal from "./components/Common/Modal";
import { mockProducts } from "./data/mockProducts";
import { Product } from "./utils/types";
import SellerDashboard from "./pages/Seller/CreateProduct";
import AllProduct from "./pages/Seller/AllProduct";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<"home" | "products">("home");

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && currentPage === "home") {
      setCurrentPage("products");
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout onSearch={handleSearch} searchQuery={searchQuery}>
            <Routes>
              <Route
                path="/"
                element={
                  currentPage === "home" ? (
                    <Home
                      products={mockProducts}
                      onViewDetails={handleViewDetails}
                    />
                  ) : (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-64">
                          <ProductFilter
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            isOpen={isFilterOpen}
                            onToggle={() => setIsFilterOpen(!isFilterOpen)}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">
                              Products
                            </h1>
                            <p className="text-gray-600 mt-2">
                              Showing {sortedProducts.length} products
                            </p>
                          </div>
                          <ProductList
                            products={sortedProducts}
                            onViewDetails={handleViewDetails}
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
              />
              <Route
                path="/products"
                element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-64">
                        <ProductFilter
                          selectedCategory={selectedCategory}
                          onCategoryChange={setSelectedCategory}
                          priceRange={priceRange}
                          onPriceRangeChange={setPriceRange}
                          sortBy={sortBy}
                          onSortChange={setSortBy}
                          isOpen={isFilterOpen}
                          onToggle={() => setIsFilterOpen(!isFilterOpen)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-6">
                          <h1 className="text-3xl font-bold text-gray-900">
                            Products
                          </h1>
                          <p className="text-gray-600 mt-2">
                            Showing {sortedProducts.length} products
                          </p>
                        </div>
                        <ProductList
                          products={sortedProducts}
                          onViewDetails={handleViewDetails}
                        />
                      </div>
                    </div>
                  </div>
                }
              />
              <Route
                path="/seller/dashboard/create-product"
                element={<SellerDashboard />}
              />
              <Route
                path="/seller/dashboard/all-products"
                element={<AllProduct />}
              />
            </Routes>
          </Layout>

          {/* Product Detail Modal */}
          <Modal
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            title="Product Details"
            size="xl"
          >
            {selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            )}
          </Modal>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
