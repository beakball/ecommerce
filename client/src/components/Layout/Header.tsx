import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import LoginForm from '../User/LoginForm';
import CartSidebar from '../Cart/CartSidebar';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const { getCartItemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopHub
              </h1>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Hello, {user?.name}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={User}
                  onClick={() => setIsLoginOpen(true)}
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center justify-between text-gray-600 hover:text-gray-900"
                >
                  <span className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Cart
                  </span>
                  {getCartItemsCount() > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>

                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-700">Hello, {user?.name}</span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={User}
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Login to Your Account"
      >
        <LoginForm onClose={() => setIsLoginOpen(false)} />
      </Modal>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;