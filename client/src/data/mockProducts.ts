import { Product, Category } from '../utils/types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: 'Smartphone' },
  { id: '2', name: 'Clothing', icon: 'Shirt' },
  { id: '3', name: 'Books', icon: 'Book' },
  { id: '4', name: 'Home', icon: 'Home' },
  { id: '5', name: 'Sports', icon: 'Activity' },
  { id: '6', name: 'Beauty', icon: 'Sparkles' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.',
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.5,
    reviews: 128,
    tags: ['wireless', 'bluetooth', 'noise-cancelling']
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 299.99,
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone integration in a sleek design.',
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 256,
    tags: ['smartwatch', 'fitness', 'health']
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 24.99,
    originalPrice: 34.99,
    description: 'Comfortable, sustainable organic cotton t-shirt available in multiple colors and sizes.',
    category: 'Clothing',
    images: [
      'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.2,
    reviews: 89,
    tags: ['organic', 'cotton', 'sustainable']
  },
  {
    id: '4',
    name: 'Professional Chef Knife',
    price: 89.99,
    description: 'High-carbon stainless steel chef knife with ergonomic handle, perfect for professional and home cooking.',
    category: 'Home',
    images: [
      'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1843266/pexels-photo-1843266.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 342,
    tags: ['kitchen', 'chef', 'stainless-steel']
  },
  {
    id: '5',
    name: 'Yoga Mat Premium',
    price: 49.99,
    description: 'Non-slip premium yoga mat with excellent grip and cushioning for all yoga practices.',
    category: 'Sports',
    images: [
      'https://images.pexels.com/photos/3822166/pexels-photo-3822166.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.4,
    reviews: 167,
    tags: ['yoga', 'fitness', 'non-slip']
  },
  {
    id: '6',
    name: 'The Art of Programming',
    price: 39.99,
    description: 'Comprehensive guide to modern programming practices and software development methodologies.',
    category: 'Books',
    images: [
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.6,
    reviews: 94,
    tags: ['programming', 'development', 'education']
  },
  {
    id: '7',
    name: 'Luxury Skincare Set',
    price: 124.99,
    originalPrice: 149.99,
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer made with natural ingredients.',
    category: 'Beauty',
    images: [
      'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/3685538/pexels-photo-3685538.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.3,
    reviews: 203,
    tags: ['skincare', 'natural', 'luxury']
  },
  {
    id: '8',
    name: 'Minimalist Desk Lamp',
    price: 69.99,
    description: 'Modern LED desk lamp with adjustable brightness and wireless charging pad base.',
    category: 'Home',
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1571746/pexels-photo-1571746.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    inStock: true,
    rating: 4.5,
    reviews: 78,
    tags: ['led', 'wireless-charging', 'modern']
  }
];