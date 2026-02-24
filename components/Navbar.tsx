
import React, { useState } from 'react';
import { ShoppingCart, ShieldAlert, X, Trash2, ChevronRight, User, LogOut, LogIn } from 'lucide-react';
import { CartItem, AppView, User as UserType, AuthMode } from '../types.ts';
import { COLORS } from '../constants.tsx';

interface NavbarProps {
  cart: CartItem[];
  user: UserType | null;
  onRemove: (id: string) => void;
  onViewChange: (view: AppView) => void;
  onAuth: (mode: AuthMode) => void;
  onLogout: () => void;
  currentView: AppView;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cart, 
  user, 
  onRemove, 
  onViewChange, 
  onAuth, 
  onLogout, 
  currentView 
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-[#39FF14]/20 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onViewChange('grid')}
        >
          <div className="w-10 h-10 bg-[#39FF14]/10 rounded flex items-center justify-center border border-[#39FF14]/30 group-hover:border-[#39FF14] transition-all">
            <ShieldAlert className="text-[#39FF14]" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white font-mono hidden sm:block">
            SHADOW<span className="text-[#39FF14] neon-glow">MARKET</span>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#39FF14] bg-[#39FF14]/10 px-3 py-1.5 rounded border border-[#39FF14]/20">
                <User size={14} />
                <span className="truncate max-w-[100px]">{user.name || user.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Disconnect</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onAuth('login')}
                className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <LogIn size={16} /> <span className="hidden sm:inline">Login</span>
              </button>
              <button 
                onClick={() => onAuth('signup')}
                className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
              >
                Sign Up
              </button>
            </div>
          )}

          <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 hover:bg-[#39FF14]/10 rounded-full transition-colors group"
          >
            <ShoppingCart className="text-[#E2E8F0] group-hover:text-[#39FF14] transition-colors" size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#39FF14] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mini Cart Dropdown */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-6 top-20 w-80 bg-[#12121A] border border-[#39FF14]/30 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-lg">Your Terminal Cart</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-[#39FF14] text-xs font-mono">${item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 bg-white/5 border-t border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-xl font-bold font-mono text-[#39FF14]">${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => {
                    onViewChange('checkout');
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-[#39FF14] text-black font-bold py-3 rounded hover:bg-[#32E611] transition-colors flex items-center justify-center gap-2"
                >
                  PROCEED TO CHECKOUT <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};
