import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, ShieldCheck, Star, Clock, Zap, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  product, 
  onBack, 
  onAddToCart, 
  onBuyNow 
}) => {
  const [timeLeft, setTimeLeft] = useState(product.expiryMinutes * 60);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-[#39FF14] transition-colors mb-8 font-mono text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Return to Marketplace
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#12121A] group">
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 z-20 bg-[#39FF14] text-black text-xs font-black px-3 py-1.5 rounded-sm uppercase tracking-tighter shadow-lg">
              {discount}% OFF
            </div>

            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Countdown Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-red-500/30 p-3 rounded-lg flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-red-400">
                <Clock size={16} className="animate-spin-slow" />
                <span className="text-xs font-bold uppercase tracking-widest">Offer Expires In</span>
              </div>
              <span className="text-red-400 text-lg font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-yellow-500/80 leading-relaxed font-mono">
              WARNING: High demand detected. 47 users are currently viewing this item. 
              Stock is not guaranteed until checkout is complete.
            </p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-slate-400 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                <Zap size={12} fill="currentColor" /> Verified Seller
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-slate-400 ml-1">({product.reviews} reviews)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <ShieldCheck size={16} className="text-[#39FF14]" />
                Seller: <span className="text-white font-mono">{product.seller}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#12121A] border border-white/5 space-y-4">
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black font-mono text-[#39FF14] tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xl text-slate-500 line-through mb-1">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-colors uppercase tracking-widest"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button 
              onClick={() => onBuyNow(product)}
              className="flex items-center justify-center gap-2 bg-[#39FF14] hover:bg-[#32E611] text-black font-black py-4 rounded-xl transition-colors uppercase tracking-widest shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
            >
              <Zap size={18} fill="currentColor" /> Buy Now
            </button>
          </div>

          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border transition-colors uppercase tracking-widest text-sm font-bold ${
              isWishlisted 
                ? 'bg-pink-500/10 border-pink-500/50 text-pink-500' 
                : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/30'
            }`}
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} /> 
            {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Security Info */}
          <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <ShieldCheck size={16} className="text-[#39FF14]" /> Escrow Protection
              </div>
              <p className="text-xs text-slate-500 pl-6">Funds held until delivery confirmed</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <Zap size={16} className="text-[#39FF14]" /> Instant Delivery
              </div>
              <p className="text-xs text-slate-500 pl-6">Automated dispatch system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
