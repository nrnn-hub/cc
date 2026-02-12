
import React, { useState } from 'react';
import { CreditCard, Wallet, Bitcoin, ChevronLeft, ShieldCheck, Lock } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onConfirm: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onBack, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-[#39FF14] mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Market
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-8">
          <section className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#39FF14]/10 text-[#39FF14] flex items-center justify-center text-sm font-mono">01</span>
              Shipping Information
            </h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#39FF14] outline-none transition-colors"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Protocol</label>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#39FF14] outline-none transition-colors"
                  placeholder="john@protonmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#39FF14]/10 text-[#39FF14] flex items-center justify-center text-sm font-mono">02</span>
                Secure Payment
              </h2>
              <div className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                Encrypted Session
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-black/50 border border-[#39FF14] rounded-xl cursor-not-allowed opacity-100">
                <div className="w-10 h-10 rounded bg-[#39FF14]/10 flex items-center justify-center">
                  <Bitcoin className="text-[#39FF14]" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Cryptocurrency (BTC / ETH / SOL)</p>
                  <p className="text-xs text-[#39FF14]">Instant processing + 5% discount applied</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#39FF14] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14]" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl opacity-40 cursor-not-allowed group">
                <div className="w-10 h-10 rounded bg-slate-500/10 flex items-center justify-center">
                  <CreditCard className="text-slate-500" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Credit Card</p>
                  <p className="text-xs text-red-500">Service currently unavailable due to maintenance</p>
                </div>
                <Lock size={16} className="text-slate-500" />
              </div>
            </div>
          </section>
        </div>

        <div className="md:col-span-2 space-y-6">
          <section className="bg-[#12121A] border border-[#39FF14]/30 rounded-2xl p-6 sticky top-28">
            <h3 className="font-bold mb-6 text-lg">Order Terminal</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-mono text-[#39FF14]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Network Fee</span>
                <span className="text-[#39FF14]">FREE</span>
              </div>
              <div className="flex justify-between pt-3 text-lg font-bold">
                <span>TOTAL</span>
                <span className="text-[#39FF14] font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onConfirm}
              className="w-full mt-8 bg-[#39FF14] text-black font-black py-4 rounded-xl hover:bg-[#32E611] transition-all transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(57,255,20,0.3)] flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <ShieldCheck size={20} /> Confirm Secure Order
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-tighter">
              By confirming, you agree to the anonymous commerce protocol.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
