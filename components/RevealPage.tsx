
import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, ChevronRight, Globe, Lock, Clock, Bitcoin, Package, ArrowRight, AlertTriangle } from 'lucide-react';

interface RevealPageProps {
  onRestart: () => void;
}

export const RevealPage: React.FC<RevealPageProps> = ({ onRestart }) => {
  const [showAudit, setShowAudit] = useState(false);
  const orderId = `BTC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  if (!showAudit) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-[#39FF14]/5 border border-[#39FF14]/30 rounded-3xl p-8 md:p-12 mb-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(57,255,20,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#39FF14]" />
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#39FF14]/20 text-[#39FF14] mb-6 border border-[#39FF14]/30 animate-pulse">
            <CheckCircle2 size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">
            BITCOIN <span className="text-[#39FF14] neon-glow">RECEIVED</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
            Your transaction has been verified on the blockchain. Your order is now in the fulfillment queue.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-left border-t border-white/5 pt-8">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TX Hash ID</p>
              <p className="text-white font-mono font-bold truncate">#{orderId}</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Confirms</p>
              <p className="text-[#39FF14] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
                6/6 Confirmed
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Shipment Node</p>
              <p className="text-white font-bold">Express Relay</p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <button className="w-full max-w-sm bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10 group">
              <Package size={18} /> GENERATE TRACKING LABEL <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-500 italic">
              * Note: Digital delivery for keys and credentials is instantaneous once tracking generates.
            </p>
          </div>
        </div>

        {/* Subtle Educational Entry Point */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="shrink-0 w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 border border-orange-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Final Security Report</h4>
              <p className="text-xs text-slate-400">Transaction complete. View the deconstruction of this simulated marketplace.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAudit(true)}
            className="whitespace-nowrap bg-orange-500 text-black font-black px-6 py-3 rounded-lg hover:bg-orange-400 transition-all text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20"
          >
            Open Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
          <AlertTriangle className="text-orange-500" /> Fraud Deconstruction
        </h2>
        <button 
          onClick={() => setShowAudit(false)}
          className="text-slate-400 hover:text-white text-sm"
        >
          Back to Receipt
        </button>
      </div>

      <div className="space-y-16">
        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The Bitcoin Trap</h3>
                <p className="text-sm text-slate-400 font-medium">In a real scenario, your funds would now be unrecoverable.</p>
              </div>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
               <h4 className="font-bold text-orange-400 text-sm mb-2 flex items-center gap-2">
                 <Bitcoin size={16} /> Immutable Ledger
               </h4>
               <p className="text-xs text-slate-400 leading-relaxed">
                 Once Bitcoin is sent, there is no "Undo" or "Chargeback". Scammers prefer BTC because they can move the funds through "mixers" to hide their identity within minutes.
               </p>
             </div>
             <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
               <h4 className="font-bold text-orange-400 text-sm mb-2 flex items-center gap-2">
                 <Lock size={16} /> Fake Escrow
               </h4>
               <p className="text-xs text-slate-400 leading-relaxed">
                 Scam sites often claim to use "Secure Escrow Nodes". In reality, the address belongs directly to the scammer. The "Payment Confirmed" screen is just a UI trick to stop you from panicking immediately.
               </p>
             </div>
           </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4 text-white">
            <span className="text-[#39FF14]">#</span> Red Flags Identified
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                  <Bitcoin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Exclusive Crypto Requirement</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Legitimate businesses almost always offer standard payment methods (Visa/Mastercard). Forcing users into crypto is a major indicator of a scam.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14]">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Urgency & False Scarcity</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">The "Ending Soon" timers and "Limited Inventory" warnings are designed to bypass your logical thinking and force a quick, emotional decision.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Unrealistic Pricing</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Premium electronics at 80-90% discount are economically impossible for a real business. If it's too good to be true, it is a fraud.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Phishing Foundation</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">By providing your Name and Email during checkout, you've handed the scammer the tools to target you with more believable phishing emails in the future.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-white">How to Stay Safe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <CheckCircle2 className="text-[#39FF14]" size={32} />
              <h4 className="font-bold text-white">Use Official Sites</h4>
              <p className="text-sm text-slate-400">Always navigate to a store via your browser bookmark or a verified link. Never trust "Shadow" marketplaces.</p>
            </div>
            <div className="space-y-3">
              <CheckCircle2 className="text-[#39FF14]" size={32} />
              <h4 className="font-bold text-white">Protected Payments</h4>
              <p className="text-sm text-slate-400">Credit cards and PayPal (Goods & Services) offer protection. Never pay with Friends & Family, Crypto, or Gift Cards.</p>
            </div>
            <div className="space-y-3">
              <CheckCircle2 className="text-[#39FF14]" size={32} />
              <h4 className="font-bold text-white">Verify Domain Names</h4>
              <p className="text-sm text-slate-400">Scammers use "typosquatting" (e.g., amozon.com instead of amazon.com). Check the URL bar carefully.</p>
            </div>
          </div>
          
          <button 
            onClick={onRestart}
            className="mt-12 group flex items-center gap-2 text-[#39FF14] font-bold text-lg hover:underline transition-all"
          >
            Reset Simulation & Return to Safety <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </section>
      </div>
    </div>
  );
};
