
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
      className="group relative bg-[#0A0A0F] border border-[#39FF14]/20 rounded-none overflow-hidden hover:border-[#39FF14] transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:-translate-y-1 hover:scale-[1.01] cursor-pointer flex flex-col font-mono"
      onClick={() => onViewDetails(product)}
    >
      {/* Hover Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        <div className="w-full h-1 bg-[#39FF14]/20 absolute top-0 animate-[scan_3s_linear_infinite]"></div>
      </div>

      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-20 bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] font-black px-2 py-1 uppercase tracking-widest shadow-lg">
        [{discount}% OFF]
      </div>

      {/* Verified Badge */}
      <div className="absolute top-3 right-3 z-20 bg-black/80 border border-[#39FF14]/30 text-[#39FF14] text-[10px] font-bold px-2 py-1 flex items-center gap-1">
        <Zap size={10} fill="currentColor" /> PGP VERIFIED
      </div>

      <div className="aspect-square overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
        <img 
          src={product.image} 
          alt={product.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* Countdown Overlay */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 border border-red-500/50 p-1.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 text-red-500">
            <Clock size={12} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Listing Expires</span>
          </div>
          <span className="text-red-500 text-xs font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="p-4 space-y-3 relative z-10 bg-[#0A0A0F] flex-1 flex flex-col border-t border-[#39FF14]/20">
        <h3 className="font-bold text-white line-clamp-2 leading-tight h-10 group-hover:text-[#39FF14] group-hover:drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] transition-all duration-300 text-sm">
          {'>'} {product.title}
        </h3>
        
        <div className="flex items-center gap-1">
          <div className="flex text-[#39FF14]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill="currentColor" />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">[{product.reviews} REVIEWS]</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-black text-[#39FF14] tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-slate-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center justify-center gap-2 bg-transparent hover:bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold py-2 border border-[#39FF14]/50 transition-colors uppercase"
          >
            <ShoppingCart size={14} /> ADD
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="flex items-center justify-center bg-[#39FF14] hover:bg-white text-black text-xs font-black py-2 transition-all duration-300 uppercase tracking-widest hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] hover:scale-105"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
