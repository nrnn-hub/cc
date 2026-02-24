
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  expiryMinutes: number;
  category: string;
  seller: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  name?: string;
  password?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  cryptoAddress: string;
}

export type AppView = 'grid' | 'checkout' | 'reveal' | 'product' | 'orders';
export type AuthMode = 'login' | 'signup' | null;
