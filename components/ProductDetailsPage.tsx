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
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500 font-mono">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-[#39FF14] transition-colors mb-8 text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Return to Marketplace
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="relative aspect-square border border-[#39FF14]/30 bg-[#0A0A0F] group p-2">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              <div className="w-full h-1 bg-[#39FF14]/20 absolute top-0 animate-[scan_3s_linear_infinite]"></div>
            </div>

            {/* Discount Badge */}
            <div className="absolute top-4 left-4 z-20 bg-red-500/20 border border-red-500/50 text-red-500 text-xs font-black px-3 py-1.5 uppercase tracking-widest shadow-lg">
              [{discount}% OFF]
            </div>

            <img 
              src={product.image} 
              alt={product.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
            
            {/* Countdown Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-red-500/50 p-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-red-500">
                <Clock size={16} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Listing Expires</span>
              </div>
              <span className="text-red-500 text-lg font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5 animate-pulse" size={18} />
            <p className="text-xs text-red-500/80 leading-relaxed">
              WARNING: High demand detected. 47 users are currently viewing this item. 
              Stock is not guaranteed until checkout is complete. Use PGP for comms.
            </p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-transparent border border-[#39FF14]/30 text-xs text-[#39FF14] uppercase tracking-wider">
                [{product.category}]
              </span>
              <div className="flex items-center gap-1.5 text-[#39FF14] bg-black/80 border border-[#39FF14]/30 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                <Zap size={12} fill="currentColor" /> PGP Verified
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight glitch-text" data-text={product.title}>
              {'>'} {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex text-[#39FF14]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-slate-400 ml-1">[{product.reviews} REVIEWS]</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#39FF14]/50"></div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <ShieldCheck size={16} className="text-[#39FF14]" />
                Vendor: <span className="text-white">{product.seller}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#0A0A0F] border border-[#39FF14]/20 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-[#39FF14] tracking-tight">
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
              className="flex items-center justify-center gap-2 bg-transparent hover:bg-[#39FF14]/10 text-[#39FF14] font-bold py-4 border border-[#39FF14]/50 transition-colors uppercase tracking-widest"
            >
              <ShoppingCart size={18} /> ADD TO CART
            </button>
            <button 
              onClick={() => onBuyNow(product)}
              className="flex items-center justify-center gap-2 bg-[#39FF14] hover:bg-white text-black font-black py-4 transition-colors uppercase tracking-widest"
            >
              <Zap size={18} fill="currentColor" /> BUY NOW
            </button>
          </div>

          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-full flex items-center justify-center gap-2 py-4 border transition-colors uppercase tracking-widest text-sm font-bold ${
              isWishlisted 
                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                : 'bg-transparent border-[#39FF14]/20 text-slate-400 hover:text-[#39FF14] hover:border-[#39FF14]/50'
            }`}
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} /> 
            {isWishlisted ? 'SAVED TO WATCHLIST' : 'ADD TO WATCHLIST'}
          </button>

          {/* Security Info */}
          <div className="pt-6 border-t border-[#39FF14]/20 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <ShieldCheck size={16} className="text-[#39FF14]" /> Multisig Escrow
              </div>
              <p className="text-xs text-slate-500 pl-6">2-of-3 signatures required</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <Zap size={16} className="text-[#39FF14]" /> Auto-Dispatch
              </div>
              <p className="text-xs text-slate-500 pl-6">PGP encrypted delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
