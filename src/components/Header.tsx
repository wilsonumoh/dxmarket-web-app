import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Heart, Bell, Globe, DollarSign, Menu, X, ShieldAlert, ShieldCheck, Sparkles, User, ChevronDown, Check, Store, Truck, BadgeDollarSign, Settings } from 'lucide-react';
import { UserRole, Product, CartItem, SystemConfig } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  cart: CartItem[];
  wishlist: Product[];
  onNavigate: (view: string, params?: Record<string, any>) => void;
  products: Product[];
  currentCurrency: string;
  setCurrency: (currency: string) => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  currencies: string[];
  languages: string[];
  systemConfig: SystemConfig;
  formatPrice: (usdAmount: number) => string;
}

export default function Header({
  currentRole,
  setRole,
  cart,
  wishlist,
  onNavigate,
  products,
  currentCurrency,
  setCurrency,
  currentLanguage,
  setLanguage,
  currencies,
  languages,
  systemConfig,
  formatPrice,
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Shipped!', desc: 'Your headphones are on their way.', time: '2 mins ago', read: false },
    { id: 2, title: 'New Supplier Approved', desc: 'EuroTex Organic Mills joined.', time: '1 hr ago', read: false },
    { id: 3, title: 'Flash Sale Ending', desc: 'AuraSound 20% off ends in 3 hrs.', time: '3 hrs ago', read: true },
  ]);

  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Click outside suggestions close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Search filtered suggestions
  const filteredSuggestions = searchTerm.trim() === '' ? [] : products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'merchant': return 'Merchant';
      case 'supplier': return 'Supplier';
      case 'sales': return 'Sales Agent';
      case 'customer': return 'Customer';
      case 'guest': default: return 'Guest / Public';
    }
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'superadmin': return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
      case 'admin': return <Settings className="w-3.5 h-3.5 text-blue-400" />;
      case 'merchant': return <Store className="w-3.5 h-3.5 text-emerald-400" />;
      case 'supplier': return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      case 'sales': return <BadgeDollarSign className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <User className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50" id="dx-header-bar">
      {/* Top Bar for Simulator Control & Info */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs flex justify-between items-center border-b border-slate-800 sm:px-6">
        <p className="hidden md:block text-slate-400">
          🇳🇬 Default: <span className="text-white font-bold">Nigerian Naira (₦ NGN)</span> | Cross-Border Automated Trade Core
        </p>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {/* Quick Simulation role selector */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Switch role view in current session"
            >
              {getRoleIcon(currentRole)}
              <span className="font-semibold">{getRoleLabel(currentRole)} View</span>
              <ChevronDown className="w-3 h-3 text-white" />
            </button>
            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 border border-gray-100 z-50 text-sm">
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-100">Select Simulator View</p>
                {(['guest', 'customer', 'merchant', 'supplier', 'sales', 'admin', 'superadmin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setRole(role);
                      setShowRoleSelector(false);
                      if (role === 'guest' || role === 'customer') {
                        onNavigate('home');
                      } else {
                        onNavigate(`${role}-dashboard`);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition cursor-pointer ${currentRole === role ? 'bg-blue-50 font-medium text-[#0F4C81]' : ''}`}
                  >
                    <span className="flex items-center gap-2 text-xs">
                      {getRoleIcon(role)}
                      {getRoleLabel(role)}
                    </span>
                    {currentRole === role && <Check className="w-4 h-4 text-[#0F4C81]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency dropdown */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
            <select 
              value={currentCurrency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none text-white text-xs cursor-pointer focus:outline-none font-bold"
            >
              {currencies.map(c => <option key={c} value={c} className="text-black font-semibold">{c}</option>)}
            </select>
          </div>

          {/* Language dropdown */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
            <Globe className="w-3 h-3 text-blue-400" />
            <select 
              value={currentLanguage} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-white text-xs cursor-pointer focus:outline-none font-bold"
            >
              {languages.map(l => <option key={l} value={l} className="text-black font-semibold">{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 sm:px-6">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer select-none"
          id="dx-logo"
        >
          <div className="w-10 h-10 rounded bg-[#0F4C81] flex items-center justify-center font-bold text-white text-xl shadow-inner">
            {systemConfig.platformName.slice(0, 2).toUpperCase()}
          </div>
          <div className="leading-none">
            <span className="text-xl font-extrabold text-white tracking-tight uppercase">
              {systemConfig.platformName}
            </span>
            <div className="text-[9px] text-[#1E88E5] font-semibold tracking-widest">ENTERPRISE HUB</div>
          </div>
        </div>

        {/* Search Bar with Suggestions */}
        <div ref={suggestionsRef} className="hidden md:flex relative flex-1 max-w-lg items-center gap-2" id="search-container">
          <div className="flex-1 flex items-center border border-slate-700 rounded-lg bg-slate-800 px-3 py-1.5 focus-within:border-[#1E88E5] focus-within:bg-slate-850 transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products, brands, merchants, suppliers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="bg-transparent border-none focus:ring-0 text-xs w-full px-2 outline-none text-slate-100 placeholder-slate-400"
            />
          </div>
          <button 
            onClick={() => {
              onNavigate('products', { search: searchTerm });
              setShowSuggestions(false);
            }}
            className="bg-[#1E88E5] hover:bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>

          {/* Real-time suggestions panel */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-100 z-50 overflow-hidden text-xs">
              {filteredSuggestions.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    onNavigate('product-details', { product: p });
                    setSearchTerm('');
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition"
                >
                  <img src={p.image} alt={p.title} className="w-8 h-8 object-cover rounded" />
                  <div>
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="text-[10px] text-gray-400">Category: {p.category} | Price: {formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Wishlist Shortcut */}
          <button 
            onClick={() => onNavigate('customer-wishlist')}
            className="relative p-2 text-slate-300 hover:text-white transition cursor-pointer rounded-full hover:bg-slate-800"
            title="My Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Notifications Icon with dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="relative p-2 text-slate-300 hover:text-white transition cursor-pointer rounded-full hover:bg-slate-800"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 bg-amber-500 rounded-full w-2 h-2"></span>
              )}
            </button>
            {showNotificationCenter && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-sm">
                <div className="flex justify-between items-center px-4 py-1.5 border-b border-gray-100">
                  <p className="font-bold text-gray-800">Notifications</p>
                  <button 
                    onClick={() => {
                      setNotifications(notifications.map(n => ({...n, read: true})));
                    }}
                    className="text-xs text-[#1E88E5] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 hover:bg-gray-50 transition ${!n.read ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex justify-between items-start gap-1">
                        <p className="font-semibold text-gray-800 text-xs">{n.title}</p>
                        <span className="text-[9px] text-gray-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon with sliding preview toggler */}
          <div className="relative">
            <button 
              onClick={() => setShowMiniCart(!showMiniCart)}
              className="relative p-2 text-slate-300 hover:text-white transition cursor-pointer rounded-full hover:bg-slate-800"
              title="Cart"
              id="mini-cart-trigger"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF9800] text-black rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Minicart Dropdown overlay */}
            {showMiniCart && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-850 rounded-xl shadow-xl border border-gray-100 py-3 z-50 text-sm">
                <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center text-gray-800">
                  <p className="font-bold">Your Cart ({totalCartItems})</p>
                  <button onClick={() => setShowMiniCart(false)} className="text-gray-400 hover:text-gray-650 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {cart.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto text-gray-800">
                      {cart.map((item, index) => (
                        <div key={index} className="p-3 flex gap-3 hover:bg-gray-50">
                          <img src={item.product.image} alt={item.product.title} className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold line-clamp-1 text-xs">{item.product.title}</p>
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity} | {Object.entries(item.selectedVariant).map(([k,v]) => `${k}:${v}`).join(', ')}</p>
                            <p className="text-xs font-semibold text-[#0F4C81] mt-0.5">{formatPrice(item.product.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-gray-800">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">Subtotal:</span>
                        <span className="font-bold text-[#0F4C81]">{formatPrice(totalCartPrice)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {
                            onNavigate('customer-cart');
                            setShowMiniCart(false);
                          }}
                          className="w-full py-1.5 border border-gray-300 text-gray-750 text-xs font-semibold rounded hover:bg-gray-100 cursor-pointer text-center"
                        >
                          View Cart
                        </button>
                        <button 
                          onClick={() => {
                            onNavigate('customer-checkout');
                            setShowMiniCart(false);
                          }}
                          className="w-full py-1.5 bg-[#1E88E5] hover:bg-[#0F4C81] text-white text-xs font-semibold rounded cursor-pointer text-center transition"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Your cart is empty</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Account Shortcut */}
          <button 
            onClick={() => {
              if (currentRole === 'guest') {
                onNavigate('login');
              } else {
                onNavigate(`${currentRole}-dashboard`);
              }
            }}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full cursor-pointer transition text-xs font-medium text-slate-200"
            id="profile-trigger"
          >
            <User className="w-4 h-4 text-slate-300" />
            <span className="hidden lg:inline">Account</span>
          </button>
        </div>
      </div>

      {/* Categories Bar & Mega Menu Toggle (Dynamic based on Admin Configs!) */}
      <div className="bg-gray-50 border-t border-gray-200 hidden md:block" id="sub-navigation-bar">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between sm:px-6">
          <div className="flex items-center gap-6 text-xs text-gray-600 font-semibold py-2">
            {/* Mega Menu Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowMegaMenu(!showMegaMenu)}
                className="flex items-center gap-1.5 text-gray-800 hover:text-[#0F4C81] cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Menu Dropdown */}
              {showMegaMenu && (
                <div className="absolute top-full left-0 mt-2 w-[540px] bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 grid grid-cols-3 gap-6">
                  {systemConfig.categories.slice(0, 3).map((cat) => (
                    <div key={cat}>
                      <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1.5 mb-2 flex items-center gap-1 text-xs">
                        <span>{cat}</span>
                      </h4>
                      <ul className="space-y-1.5 font-normal text-gray-600">
                        {products.filter(p => p.category === cat).slice(0, 4).map((p) => (
                          <li key={p.id}>
                            <button 
                              onClick={() => { onNavigate('products', { category: cat }); setShowMegaMenu(false); }} 
                              className="hover:text-[#1E88E5] cursor-pointer text-left line-clamp-1"
                            >
                              {p.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Menu items managed by Admin */}
            {systemConfig.appMenu.map((item, index) => {
              const isExternal = item.view.startsWith('http://') || item.view.startsWith('https://') || item.view.startsWith('/');
              return (
                <button 
                  key={index} 
                  onClick={() => {
                    if (isExternal) {
                      window.open(item.view, '_blank', 'noopener,noreferrer');
                    } else {
                      onNavigate(item.view);
                    }
                  }} 
                  className="hover:text-[#0F4C81] cursor-pointer text-xs font-semibold"
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="py-2 text-[11px] text-gray-500 font-medium">
            🔥 Super Deal: Apply coupon <code className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold">APEX10</code> for 10% off items!
          </div>
        </div>
      </div>
    </header>
  );
}
