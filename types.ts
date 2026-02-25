
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  cryptoAddress: string;
  paymentId: string;
}

export type AppView = 'grid' | 'checkout' | 'reveal' | 'product' | 'orders' | 'admin';
export type AuthMode = 'login' | 'signup' | null;
