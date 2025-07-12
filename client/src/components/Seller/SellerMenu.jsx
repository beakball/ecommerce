import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingBag, ChevronRight, Menu, X } from "lucide-react";

const SellerMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: "Create Product",
      path: "/seller/dashboard/create-product",
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: "All Products",
      path: "/seller/dashboard/all-products",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Seller Dashboard</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop and mobile */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:block bg-white rounded-lg shadow-md overflow-hidden mb-6`}
      >
        <div className="hidden lg:block p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Seller Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your products</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="flex-1">{item.title}</span>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      isActive(item.path) ? "text-indigo-700" : "text-gray-400"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              S
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Seller Account
              </p>
              <p className="text-xs text-gray-500">seller@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerMenu;
