
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Zap, Clock } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onBuyNow, onViewDetails }) => {
  const [timeLeft, setTimeLeft] = useState(product.expiryMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div 
      className="group relative bg-[#12121A] border border-white/5 rounded-xl overflow-hidden hover:border-[#39FF14]/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(57,255,20,0.15)] cursor-pointer flex flex-col"
      onClick={() => onViewDetails(product)}
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-20 bg-[#39FF14] text-black text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter animate-bounce shadow-lg">
        {discount}% OFF
      </div>

      {/* Verified Badge */}
      <div className="absolute top-3 right-3 z-20 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
        <Zap size={10} fill="currentColor" /> VERIFIED SELLER
      </div>

      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-125 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Countdown Overlay */}
        <div className="absolute bottom-2 left-2 right-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 p-1.5 rounded flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 text-red-400">
            <Clock size={12} className="animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Ending Soon</span>
          </div>
          <span className="text-red-400 text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="p-4 space-y-3 relative z-10 bg-[#12121A] flex-1 flex flex-col">
        <h3 className="font-bold text-white line-clamp-2 leading-tight h-10 group-hover:text-[#39FF14] transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-2xl font-black font-mono text-[#39FF14] tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-slate-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2.5 rounded-lg border border-white/10 transition-colors"
          >
            <ShoppingCart size={14} /> + CART
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="flex items-center justify-center bg-[#39FF14] hover:bg-[#32E611] text-black text-xs font-black py-2.5 rounded-lg transition-colors uppercase tracking-widest shadow-[0_4px_10px_rgba(57,255,20,0.3)] active:scale-95"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
