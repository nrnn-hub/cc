
import React, { useState } from 'react';
import { Bitcoin, ChevronLeft, ShieldCheck, CreditCard as CardIcon, AlertTriangle, Copy, Check, Loader2, QrCode } from 'lucide-react';
import { CartItem } from '../types.ts';

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onConfirm: (address: string) => void;
}

type CheckoutStep = 'details' | 'payment-pending' | 'success';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onBack, onConfirm }) => {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const btcAmount = (total / 65000).toFixed(6); // Fictional BTC rate
  const btcAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  const handleFinalize = (e: React.MouseEvent) => {
    e.preventDefault();
    if (paymentMethod === 'crypto') {
      setStep('payment-pending');
    } else {
      alert("Credit Card systems are currently undergoing high-security maintenance. Please use Bitcoin for immediate processing.");
      setPaymentMethod('crypto');
    }
  };

  const handleConfirmBtcPayment = () => {
    setIsVerifying(true);
    // Simulate a fake "blockchain verification" delay
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      setTimeout(() => {
        onConfirm(btcAddress);
      }, 2000);
    }, 2500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-24 h-24 rounded-full bg-[#39FF14]/20 flex items-center justify-center text-[#39FF14] border border-[#39FF14]/50 mb-6">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight font-mono mb-2">TRANSACTION COMPLETE</h2>
        <p className="text-[#39FF14] font-mono text-sm mb-8">Escrow secured. Awaiting admin confirmation.</p>
        <Loader2 className="animate-spin text-slate-500" size={24} />
      </div>
    );
  }

  if (step === 'payment-pending') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#12121A] border border-orange-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(247,147,26,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
          
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 animate-pulse">
              <Bitcoin size={48} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">CRYPTO ESCROW <span className="text-orange-500">ACTIVE</span></h2>
              <p className="text-slate-400 text-sm max-w-sm">
                Order status: <strong>Pending Transfer</strong>. Send the exact amount to the verified address below.
              </p>
            </div>

            {/* Fake QR Section */}
            <div className="relative p-2 bg-white rounded-xl">
               <div className="w-32 h-32 bg-white flex items-center justify-center relative overflow-hidden">
                  <QrCode size={100} className="text-black opacity-20" />
                  <div className="absolute inset-0 scan-line" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bitcoin size={40} className="text-orange-500" />
                  </div>
               </div>
            </div>

            <div className="w-full space-y-4">
              <div className="bg-black/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-black text-slate-500">
                  <span>Exact Amount (BTC)</span>
                  <span className="text-orange-500">Fixed Rate</span>
                </div>
                <div className="text-4xl font-mono font-bold text-white flex items-center justify-center gap-3">
                  {btcAmount} <span className="text-lg text-slate-600">BTC</span>
                </div>
                <div className="text-[10px] text-slate-500 text-center uppercase tracking-widest">≈ ${total.toFixed(2)} USD</div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Secure BTC Wallet Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-[#39FF14] break-all flex items-center justify-between shadow-inner">
                    {btcAddress}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="shrink-0 w-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 hover:bg-orange-500/20 transition-all"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex gap-3 text-left">
              <AlertTriangle className="text-red-500 shrink-0" size={18} />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <span className="text-red-500 font-bold uppercase">Attention:</span> Your funds will be released only after 1 network confirmation. DO NOT close this terminal during the transfer.
              </p>
            </div>

            <button 
              disabled={isVerifying}
              onClick={handleConfirmBtcPayment}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                isVerifying 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-orange-500 text-black hover:bg-orange-400 shadow-[0_10px_30px_rgba(247,147,26,0.3)] active:scale-95'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> SCANNING BLOCKCHAIN...
                </>
              ) : (
                <>
                  <Check size={20} /> I HAVE COMPLETED PAYMENT
                </>
              )}
            </button>
            
            <button 
              onClick={() => setStep('details')}
              className="text-xs text-slate-600 hover:text-white transition-colors uppercase font-bold tracking-widest"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-[#39FF14] mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-8">
          <section className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <span className="w-8 h-8 rounded-full bg-[#39FF14]/10 text-[#39FF14] flex items-center justify-center text-sm font-mono">01</span>
              Protocol Delivery Details
            </h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#39FF14] outline-none transition-colors text-white"
                  placeholder="Anonymous User"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Email (Encrypted)</label>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#39FF14] outline-none transition-colors text-white"
                  placeholder="user@securenodes.io"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <span className="w-8 h-8 rounded-full bg-[#39FF14]/10 text-[#39FF14] flex items-center justify-center text-sm font-mono">02</span>
              Payment Architecture
            </h2>
            
            <div className="space-y-4">
              <div 
                onClick={() => setPaymentMethod('crypto')}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'crypto' ? 'bg-[#39FF14]/5 border-[#39FF14]' : 'bg-black/50 border-white/10 hover:border-white/20'}`}
              >
                <div className="w-10 h-10 rounded bg-[#39FF14]/10 flex items-center justify-center">
                  <Bitcoin className="text-[#39FF14]" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-white">Bitcoin (BTC) <span className="text-[10px] bg-[#39FF14]/10 text-[#39FF14] px-1.5 py-0.5 rounded ml-2 uppercase">Preferred</span></p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Fast Escrow Release + Secure Node Routing</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'crypto' ? 'border-[#39FF14]' : 'border-slate-600'}`}>
                  {paymentMethod === 'crypto' && <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14]" />}
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('card')}
                className="p-4 border border-white/5 bg-black/50 rounded-xl cursor-not-allowed opacity-40 group relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center">
                    <CardIcon className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">Credit Card / Debit</p>
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-tighter">Gateway Offline - Use BTC</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="md:col-span-2 space-y-6">
          <section className="bg-[#12121A] border border-[#39FF14]/30 rounded-2xl p-6 sticky top-28">
            <h3 className="font-bold mb-6 text-lg text-white underline decoration-[#39FF14]/30 underline-offset-8">Order Configuration</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-mono text-[#39FF14] font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#39FF14] text-xs font-bold uppercase tracking-widest">
                <span>Shadow Discount (Applied)</span>
                <span>-15%</span>
              </div>
              <div className="flex justify-between pt-3 text-2xl font-black">
                <span className="text-white">TOTAL</span>
                <span className="text-[#39FF14] font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleFinalize}
              className="w-full mt-8 bg-[#39FF14] text-black font-black py-4 rounded-xl hover:bg-[#32E611] transition-all transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(57,255,20,0.3)] flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <ShieldCheck size={20} /> INITIATE ESCROW
            </button>
            
            <div className="flex justify-center gap-4 mt-6 opacity-30 grayscale scale-75">
              <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded text-white font-mono">TLS_V3_AES</span>
              <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded text-white font-mono">P2P_TUNNEL</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
