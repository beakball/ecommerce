import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '../../utils/types';
import { useCart } from '../../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(item.product.id);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border">
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{item.product.category}</p>
        <p className="text-lg font-semibold text-gray-900">${item.product.price}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
      
      <button
        onClick={() => removeFromCart(item.product.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartItem;