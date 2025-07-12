import React from 'react';
import { Filter, X } from 'lucide-react';
import { categories } from '../../data/mockProducts';

interface ProductFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  isOpen,
  onToggle
}) => {
  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0`}>
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.name}
                  checked={selectedCategory === category.name}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Min: ${priceRange[0]}</span>
              <span className="text-sm text-gray-600">Max: ${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;