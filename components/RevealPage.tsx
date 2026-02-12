
import React from 'react';
/* Added Bitcoin to the list of imports from lucide-react */
import { AlertCircle, ShieldOff, CheckCircle2, ChevronRight, Globe, UserX, Clock, Wallet, Bitcoin } from 'lucide-react';

interface RevealPageProps {
  onRestart: () => void;
}

export const RevealPage: React.FC<RevealPageProps> = ({ onRestart }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-red-500/10 border border-red-500 rounded-3xl p-8 md:p-12 mb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 text-red-500 mb-6 border border-red-500/30">
          <AlertCircle size={48} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">
          🚨 SCAM <span className="text-red-500">DETECTED</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
          If this were a real site, your money and personal information would likely be gone forever.
        </p>

        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div className="bg-black/40 border border-red-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-3 text-red-400 font-bold uppercase text-xs tracking-widest">
              <ShieldOff size={18} /> Financial Loss
            </div>
            <p className="text-slate-400 text-sm">Crypto payments are non-refundable. Once you send it, you can't get it back through any bank or authority.</p>
          </div>
          <div className="bg-black/40 border border-red-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-3 text-red-400 font-bold uppercase text-xs tracking-widest">
              <UserX size={18} /> Identity Theft
            </div>
            <p className="text-slate-400 text-sm">Scammers use your email, name, and address for phishing attacks or to sell your data on the dark web.</p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <span className="text-[#39FF14]">#</span> Educational Deconstruction
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14]">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Artificial Urgency</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">The "Ending Soon" timers are designed to make you panic and skip the research phase. Real marketplaces rarely have 5-minute sales for high-value items.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14]">
                  <Wallet size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Unrealistic Pricing</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">An iPhone for $199 or a Rolex for $899? If a deal seems too good to be true, it always is. Scammers use bait pricing to lure victims.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14]">
                  <Bitcoin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Crypto-Only Payment</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Major retailers always offer credit cards or PayPal because they provide buyer protection. Scammers prefer Crypto because it's anonymous and irreversible.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-[#12121A] border border-white/5 rounded-2xl group hover:border-[#39FF14]/30 transition-all">
                <div className="shrink-0 w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center text-[#39FF14]">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Shadow Sellers</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Notice the lack of a "Contact Us" page, Physical Address, or Terms of Service? Legitimate businesses must provide legal transparency.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-white">How to Stay Safe Online</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <CheckCircle2 className="text-[#39FF14]" size={32} />
              <h4 className="font-bold">Verify the URL</h4>
              <p className="text-sm text-slate-400">Always check for typos (e.g., amozon.com) and ensure the site has HTTPS security.</p>
            </div>
            <div className="space-y-3">
              <CheckCircle2 className="text-[#39FF14]" size={32} />
              <h4 className="font-bold">Use Protected Payments</h4>
              <p className="text-sm text-slate-400">Pay via credit card or established processors like PayPal for dispute options.</p>
            </div>
            <div className="space-y-3">
              <CheckCircle2 className="text-[#39FF14]" size={32} />
              <h4 className="font-bold">Search for Reviews</h4>
              <p className="text-sm text-slate-400">Search "Site Name + Scam" on independent forums before purchasing anything.</p>
            </div>
          </div>
          
          <button 
            onClick={onRestart}
            className="mt-12 group flex items-center gap-2 text-[#39FF14] font-bold text-lg hover:underline"
          >
            I understand, take me back to safety <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </section>
      </div>
    </div>
  );
};
