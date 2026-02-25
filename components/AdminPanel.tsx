import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ShieldAlert, Package, CheckCircle, XCircle, Clock, Box } from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderAction, setOrderAction] = useState<{orderId: string, status: OrderStatus} | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem('shadow_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const emptyProduct: Product = {
    id: `prod_${Math.random().toString(36).substr(2, 9)}`,
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 5,
    reviews: 0,
    expiryMinutes: 60,
    category: '',
    seller: 'Admin'
  };

  const [formData, setFormData] = useState<Product>(emptyProduct);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAdding(false);
    setError(null);
  };

  const handleAdd = () => {
    setFormData({ ...emptyProduct, id: `prod_${Math.random().toString(36).substr(2, 9)}` });
    setIsAdding(true);
    setEditingProduct(null);
    setError(null);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setError(null);
  };

  const handleSave = () => {
    if (formData.price < 0) {
      setError('Price must be a positive number.');
      return;
    }
    if (formData.originalPrice < 0) {
      setError('Original Price must be a positive number.');
      return;
    }

    let newProducts;
    if (isAdding) {
      newProducts = [formData, ...products];
    } else {
      newProducts = products.map(p => p.id === formData.id ? formData : p);
    }
    setProducts(newProducts);
    localStorage.setItem('shadow_products', JSON.stringify(newProducts));
    handleCancel();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const newProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(newProducts);
      localStorage.setItem('shadow_products', JSON.stringify(newProducts));
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderAction({ orderId, status: newStatus });
  };

  const confirmOrderAction = () => {
    if (orderAction) {
      const updatedOrders = orders.map(order => 
        order.id === orderAction.orderId ? { ...order, status: orderAction.status } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('shadow_orders', JSON.stringify(updatedOrders));
      setOrderAction(null);
    }
  };

  const cancelOrderAction = () => {
    setOrderAction(null);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'delivered': return 'text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500 font-mono">
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative w-full max-w-md bg-[#0D0D15] border border-red-500/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-red-500/10">
              <ShieldAlert className="text-red-500" size={24} />
              <h2 className="text-xl font-bold font-mono text-white tracking-wider uppercase">
                Confirm Deletion
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Are you sure you want to delete <span className="text-red-400 font-bold">[{productToDelete.title}]</span>?
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end mt-6">
                <button 
                  onClick={cancelDelete} 
                  className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 text-sm uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-6 py-2 text-sm font-black uppercase tracking-widest transition-colors rounded"
                >
                  <Trash2 size={16} /> Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Action Confirmation Modal */}
      {orderAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={cancelOrderAction}
          />
          <div className="relative w-full max-w-md bg-[#0D0D15] border border-[#39FF14]/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#39FF14]/10">
              <ShieldAlert className="text-[#39FF14]" size={24} />
              <h2 className="text-xl font-bold font-mono text-white tracking-wider uppercase">
                Confirm Action
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Are you sure you want to change the status of order <span className="text-[#39FF14] font-bold">[{orderAction.orderId}]</span> to <span className="text-[#39FF14] font-bold uppercase">{orderAction.status}</span>?
              </p>
              <div className="flex gap-4 justify-end mt-6">
                <button 
                  onClick={cancelOrderAction} 
                  className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 text-sm uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOrderAction} 
                  className="flex items-center gap-2 bg-[#39FF14] text-black hover:bg-white px-6 py-2 text-sm font-black uppercase tracking-widest transition-colors rounded"
                >
                  <CheckCircle size={16} /> Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500/10 rounded flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="text-red-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-red-500 tracking-wider glitch-text" data-text="ADMIN_TERMINAL">ADMIN_TERMINAL</h1>
            <p className="text-xs text-slate-500">Root access granted. Modify marketplace inventory.</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-black/50 p-1 border border-white/10 rounded">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded ${
              activeTab === 'products' 
                ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' 
                : 'text-slate-500 hover:text-white border border-transparent'
            }`}
          >
            <Box size={14} /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded ${
              activeTab === 'orders' 
                ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' 
                : 'text-slate-500 hover:text-white border border-transparent'
            }`}
          >
            <Package size={14} /> Orders
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="flex justify-end mb-6">
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          {(isAdding || editingProduct) && (
        <div className="bg-[#0A0A0F] border border-[#39FF14]/30 p-6 mb-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#39FF14]/50"></div>
          <h2 className="text-[#39FF14] font-bold mb-4 uppercase tracking-widest">
            {isAdding ? 'Initialize New Product' : 'Modify Existing Product'}
          </h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 mb-4 text-sm font-bold flex items-center gap-2 rounded">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Image</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover border border-white/10" />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData({...formData, image: url});
                    }
                  }} 
                  className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#39FF14]/10 file:text-[#39FF14] hover:file:bg-[#39FF14]/20" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Price ($)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Original Price ($)</label>
              <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: parseFloat(e.target.value)})} className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Seller Alias</label>
              <input type="text" value={formData.seller} onChange={e => setFormData({...formData, seller: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-white text-sm focus:border-[#39FF14] outline-none transition-colors h-24" />
            </div>
          </div>
          
          <div className="flex gap-4 justify-end">
            <button onClick={handleCancel} className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 text-sm uppercase tracking-widest transition-colors">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-[#39FF14] text-black hover:bg-white px-6 py-2 text-sm font-black uppercase tracking-widest transition-colors">
              <Save size={16} /> Save Product
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-[#0A0A0F] border border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-[#39FF14]/30 transition-colors">
            <img src={product.image} alt={product.title} referrerPolicy="no-referrer" className="w-16 h-16 object-cover border border-white/10 grayscale" />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold truncate text-sm">{product.title}</h3>
              <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                <span className="text-[#39FF14] font-bold">${product.price}</span>
                <span>{product.category}</span>
                <span>{product.seller}</span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <button onClick={() => handleEdit(product)} className="flex-1 sm:flex-none flex justify-center p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/30 transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDeleteClick(product)} className="flex-1 sm:flex-none flex justify-center p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm uppercase tracking-widest border border-white/5 bg-[#0A0A0F]">
            No products in database.
          </div>
        )}
      </div>
        </>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm uppercase tracking-widest border border-white/5 bg-[#0A0A0F]">
              No orders found.
            </div>
          ) : (
            orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
              <div key={order.id} className="bg-[#0A0A0F] border border-white/10 p-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#39FF14] font-bold text-sm">ORDER_ID: {order.id}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Clock size={12} /> {new Date(order.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">${order.total.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Total Amount</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-black border border-white/10 flex items-center justify-center text-xs text-slate-500">
                        {item.quantity}x
                      </div>
                      <span className="text-slate-300 flex-1 truncate">{item.title}</span>
                      <span className="text-[#39FF14]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-xs text-slate-400">
                    <span className="uppercase tracking-widest text-slate-500 block mb-1">Destination Address:</span>
                    <span className="font-mono text-[#39FF14] bg-[#39FF14]/10 px-2 py-1 rounded border border-[#39FF14]/20 break-all">
                      {order.cryptoAddress}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    <span className="uppercase tracking-widest text-slate-500 block mb-1">Transaction ID / Sender:</span>
                    <span className="font-mono text-orange-500 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 break-all">
                      {order.paymentId || 'N/A'}
                    </span>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 border border-[#39FF14]/30 text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <CheckCircle size={14} /> Confirm
                      </button>
                    </div>
                  )}
                  
                  {order.status === 'processing' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <Package size={14} /> Mark Shipped
                      </button>
                    </div>
                  )}

                  {order.status === 'shipped' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 border border-[#39FF14]/30 text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <CheckCircle size={14} /> Mark Delivered
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
