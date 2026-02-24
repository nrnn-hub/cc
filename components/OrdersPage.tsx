import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, AlertTriangle, Loader2 } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersPageProps {
  userEmail: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ userEmail }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const ordersStr = localStorage.getItem('shadow_orders');
    if (ordersStr) {
      const allOrders: Order[] = JSON.parse(ordersStr);
      const userOrders = allOrders.filter(o => o.userId === userEmail);
      setOrders(userOrders);
    }
  }, [userEmail]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'processing': return <Loader2 className="text-blue-500 animate-spin" size={16} />;
      case 'shipped': return <Truck className="text-purple-500" size={16} />;
      case 'delivered': return <CheckCircle className="text-[#39FF14]" size={16} />;
      default: return <AlertTriangle className="text-red-500" size={16} />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'delivered': return 'text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500 font-mono">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#39FF14]/10 rounded flex items-center justify-center border border-[#39FF14]/30">
          <Package className="text-[#39FF14]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">TRANSACTION_HISTORY</h1>
          <p className="text-xs text-slate-500">Encrypted ledger for {userEmail}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#0A0A0F] border border-white/5 p-12 text-center rounded-lg">
          <Package size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 font-bold">NO TRANSACTIONS FOUND</p>
          <p className="text-xs text-slate-500 mt-2">Your ledger is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0A0A0F] border border-white/10 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Order ID</p>
                  <p className="text-sm text-white font-bold">{order.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Date</p>
                  <p className="text-sm text-white">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Total</p>
                  <p className="text-sm text-[#39FF14] font-bold">${order.total.toFixed(2)}</p>
                </div>
                <div className={`px-3 py-1.5 rounded border flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded border border-white/10 grayscale" />
                    <div className="flex-1">
                      <p className="text-sm text-white font-bold">{item.title}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-[#39FF14] font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-white/5 bg-black/50 flex justify-between items-center">
                <p className="text-[10px] text-slate-500">Escrow Address: <span className="text-slate-400">{order.cryptoAddress}</span></p>
                {order.status === 'pending' && (
                  <p className="text-[10px] text-yellow-500 animate-pulse">Awaiting Admin Confirmation</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
