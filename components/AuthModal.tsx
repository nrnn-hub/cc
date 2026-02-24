import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { AuthMode, User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onLogin: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  mode, 
  onClose, 
  onSwitchMode,
  onLogin 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !password) {
      setError('Credentials required for access.');
      setIsLoading(false);
      return;
    }

    const usersStr = localStorage.getItem('shadow_users');
    const users: UserType[] = usersStr ? JSON.parse(usersStr) : [];

    if (mode === 'signup') {
      if (!name) {
        setError('Identity alias required.');
        setIsLoading(false);
        return;
      }
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('Identity already exists in the database.');
        setIsLoading(false);
        return;
      }

      const newUser = { email, name, password };
      users.push(newUser);
      localStorage.setItem('shadow_users', JSON.stringify(users));
      
      onLogin({ email, name });
      onClose();
    } else {
      // Login
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        setError('Invalid credentials. Access denied.');
        setIsLoading(false);
        return;
      }

      onLogin({ email: user.email, name: user.name });
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#0D0D15] border border-[#39FF14]/30 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <Lock className="text-[#39FF14]" size={20} />
            <h2 className="text-xl font-bold font-mono text-white tracking-wider">
              {mode === 'login' ? 'ACCESS_TERMINAL' : 'INIT_IDENTITY'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs font-mono flex items-center gap-2">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-[#39FF14] uppercase">Alias</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-2.5 pl-10 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-all font-mono text-sm"
                  placeholder="Enter alias..."
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#39FF14] uppercase">Encrypted ID (Email)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded p-2.5 pl-10 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-all font-mono text-sm"
                placeholder="user@shadow.net"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#39FF14] uppercase">Passphrase</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded p-2.5 pl-10 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-all font-mono text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#39FF14] text-black font-bold py-3 rounded mt-6 hover:bg-[#32E611] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">DECRYPTING...</span>
            ) : (
              <>
                {mode === 'login' ? 'AUTHENTICATE' : 'ESTABLISH LINK'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/5 text-center">
          <p className="text-xs text-slate-400">
            {mode === 'login' ? "No identity established?" : "Already possess credentials?"}{' '}
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#39FF14] hover:underline font-bold ml-1"
            >
              {mode === 'login' ? 'Initialize New User' : 'Access Terminal'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
