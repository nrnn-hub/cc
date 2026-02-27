
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { ProductDetailsPage } from './components/ProductDetailsPage.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { OrdersPage } from './components/OrdersPage.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { BackgroundAnimation } from './components/BackgroundAnimation.tsx';
import { PRODUCTS } from './constants.tsx';
import { Product, CartItem, AppView, User, AuthMode, Order } from './types.ts';
import { ShieldAlert, Github, Info } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<AppView>('grid');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Load products
  useEffect(() => {
    const stored = localStorage.getItem('shadow_products');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem('shadow_products', JSON.stringify(PRODUCTS));
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBuyNow = (product: Product) => {
    // Clear cart and add only this item, or just add it and go to checkout
    setCart([{ ...product, quantity: 1 }]);
    setView('checkout');
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
  };

  const resetSim = () => {
    setCart([]);
    setView('grid');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]); // Optional: clear cart on logout
    setView('grid');
  };

  const handleCheckoutConfirm = (address: string, paymentId: string) => {
    if (!user) {
      setAuthMode('login');
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.email,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      date: new Date().toISOString(),
      cryptoAddress: address,
      paymentId: paymentId,
    };

    const existingOrdersStr = localStorage.getItem('shadow_orders');
    const existingOrders: Order[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    localStorage.setItem('shadow_orders', JSON.stringify([newOrder, ...existingOrders]));

    setCart([]);
    setView('orders');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#39FF14] selection:text-black relative">
      <BackgroundAnimation />
      <Navbar 
        cart={cart} 
        user={user}
        onRemove={handleRemoveFromCart} 
        onViewChange={setView}
        onAuth={setAuthMode}
        onLogout={handleLogout}
        currentView={view}
      />

      <AuthModal 
        isOpen={!!authMode}
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={setAuthMode}
        onLogin={handleLogin}
      />

      <main className="flex-1">
        {view === 'grid' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest mb-4">
                <ShieldAlert size={14} className="animate-pulse" /> OPSEC WARNING: Use PGP for all comms
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white font-mono glitch-text" data-text="SHADOW MARKET">
                SHADOW <span className="text-[#39FF14] neon-glow">MARKET</span>
              </h1>
              <div className="flex justify-center items-center gap-4 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span> Network: Tor (Onion v3)</span>
                <span>|</span>
                <span>Uptime: 99.9%</span>
                <span>|</span>
                <span>Escrow: Active</span>
              </div>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm font-mono border border-white/5 bg-black/50 p-4 rounded">
                Welcome to the premier decentralized marketplace. All transactions are final. 
                <span className="text-[#39FF14]"> PGP key required for vendor contact.</span>
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && user?.email === '333@gmail.com' && (
          <AdminPanel products={products} setProducts={setProducts} />
        )}

        {view === 'product' && selectedProduct && (
          <ProductDetailsPage 
            product={selectedProduct}
            onBack={() => setView('grid')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {view === 'checkout' && (
          <CheckoutPage 
            cart={cart} 
            onBack={() => setView('grid')} 
            onConfirm={handleCheckoutConfirm}
          />
        )}

        {view === 'orders' && user && (
          <OrdersPage userEmail={user.email} />
        )}
      </main>

      <Chatbot />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0D0D15] py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-[#39FF14]" size={20} />
              <span className="text-lg font-bold font-mono">SHADOWMARKET</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Leading the decentralized commerce revolution since 2024. Privacy is our priority.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-[#39FF14] cursor-pointer">Marketplace</li>
              <li className="hover:text-[#39FF14] cursor-pointer">Seller Portal</li>
              <li className="hover:text-[#39FF14] cursor-pointer">Verification Protocol</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-[#39FF14] cursor-pointer">Anonymous Chat</li>
              <li className="hover:text-[#39FF14] cursor-pointer">Dispute Node</li>
              <li className="hover:text-[#39FF14] cursor-pointer">FAQ</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
          <p>© 2024 ShadowMarket</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
