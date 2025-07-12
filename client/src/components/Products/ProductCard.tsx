import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../../utils/types';
import { useCart } from '../../hooks/useCart';
import Button from '../Common/Button';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleViewDetails = () => {
    onViewDetails(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={handleViewDetails}
        />
        {product.originalPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            SALE
          </span>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="primary"
            size="sm"
            icon={Eye}
            onClick={handleViewDetails}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Quick View
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            <span className="text-sm text-gray-400 ml-1">({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" onClick={handleViewDetails}>
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            icon={ShoppingCart}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;