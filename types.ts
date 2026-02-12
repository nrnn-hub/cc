
export interface Product {
  id: string;
  title: string;
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

export type AppView = 'grid' | 'checkout' | 'reveal';
