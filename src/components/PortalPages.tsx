import React, { useState } from 'react';
import { 
  CreditCard, MapPin, Trash2, Heart, ShoppingBag, Truck, Bell, Award, Wallet, 
  MessageSquare, Star, Plus, Edit, Send, Sparkles, Check, TrendingUp, AlertTriangle, 
  User, CheckCircle, Clock, Package, DollarSign, Store, Users, FileText, ChevronRight, BadgePercent, Settings,
  Activity, ShieldCheck, Box, Globe, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, CartItem, Order, MerchantStore, Supplier, Lead, Coupon, SystemConfig } from '../types';

interface PortalPagesProps {
  role: 'customer' | 'merchant' | 'supplier' | 'sales';
  view: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  merchants: MerchantStore[];
  setMerchants: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  systemConfig: SystemConfig;
  formatPrice: (usdAmount: number) => string;
}

export default function PortalPages({
  role,
  view,
  onNavigate,
  products,
  setProducts,
  cart,
  setCart,
  wishlist,
  onToggleWishlist,
  merchants,
  setMerchants,
  orders,
  setOrders,
  suppliers,
  setSuppliers,
  leads,
  setLeads,
  systemConfig,
  formatPrice,
}: PortalPagesProps) {
  const format = formatPrice || ((usd: number) => `$${usd.toFixed(2)}`);

  // Navigation tabs helper
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderToTrack, setSelectedOrderToTrack] = useState<string>(orders[0]?.id || 'ord-1001');

  React.useEffect(() => {
    if (view) {
      if (view.startsWith('customer-')) {
        const tab = view.replace('customer-', '');
        if (tab === 'checkout') setActiveTab('cart');
        else setActiveTab(tab);
      } else if (view.startsWith('merchant-')) {
        const tab = view.replace('merchant-', '');
        setActiveTab(tab);
      } else if (view.startsWith('supplier-')) {
        const tab = view.replace('supplier-', '');
        setActiveTab(tab);
      } else if (view.startsWith('sales-')) {
        const tab = view.replace('sales-', '');
        setActiveTab(tab);
      } else if (view.endsWith('-dashboard')) {
        setActiveTab('dashboard');
      } else if (view === 'track-order' || view === 'customer-track-order') {
        setActiveTab('track-order');
      }
    }
  }, [view]);

  // Customer states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [walletFunds, setWalletFunds] = useState(350.00);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1200);
  const [profileName, setProfileName] = useState('Marcus Vance');
  const [profileEmail, setProfileEmail] = useState('marcus.vance@gmail.com');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 321-0987');
  const [addresses, setAddresses] = useState([
    { id: 'addr-1', name: 'Primary Residence', address: '42 Wall Street, Apt 12B, New York, NY 10005' },
    { id: 'addr-2', name: 'West Coast Office', address: '101 California St, Suite 400, San Francisco, CA 94111' }
  ]);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrVal, setNewAddrVal] = useState('');
  const [cards, setCards] = useState([
    { id: 'card-1', type: 'Visa', last4: '4242', exp: '12/28' },
    { id: 'card-2', type: 'Mastercard', last4: '9988', exp: '06/29' }
  ]);
  const [topupAmount, setTopupAmount] = useState('');

  // Checkout states
  const [selectedAddr, setSelectedAddr] = useState('addr-1');
  const [selectedPay, setSelectedPay] = useState('wallet');
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Merchant states
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdBrand, setNewProdBrand] = useState('ApexTech');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSuccess, setNewProdSuccess] = useState(false);
  
  // Merchant Coupon Code
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Sales lead addition
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadInterest, setNewLeadInterest] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newLeadSuccess, setNewLeadSuccess] = useState(false);

  // --- ACTIONS ---

  // Quantity updates in Cart
  const updateCartQty = (idx: number, delta: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i === idx) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeCartItem = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  // Checkout submission
  const handlePlaceOrder = () => {
    const totalCartPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const finalTotal = appliedCoupon
      ? (appliedCoupon.type === 'percentage' ? totalCartPrice * (1 - appliedCoupon.discount / 100) : totalCartPrice - appliedCoupon.discount)
      : totalCartPrice;

    if (selectedPay === 'wallet' && walletFunds < finalTotal) {
      alert('Insufficient wallet funds. Please top up or choose a credit card.');
      return;
    }

    if (selectedPay === 'wallet') {
      setWalletFunds(prev => prev - finalTotal);
    }

    // Append new order
    const newOrder: Order = {
      id: `ord-${Math.floor(Math.random() * 9000) + 1000}`,
      customerId: 'cust-1',
      customerName: profileName,
      customerEmail: profileEmail,
      items: cart.map(item => ({
        productId: item.product.id,
        productTitle: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        merchantId: item.product.merchantId
      })),
      total: finalTotal,
      status: 'Processing',
      shippingStatus: 'Processing',
      date: new Date().toISOString().split('T')[0],
      shippingAddress: addresses.find(a => a.id === selectedAddr)?.address || 'Address Not Provided',
      paymentMethod: selectedPay === 'wallet' ? 'Wallet Balance' : 'Saved Credit Card',
      trackingNumber: `DX-${Math.floor(100000 + Math.random() * 900000)}-USA`,
      trackingLogs: [
        { id: 1, status: 'Order Authorized', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: 'Payment Gateway Clearing', description: 'Order successfully created and escrow secured.', completed: true },
        { id: 2, status: 'Warehouse Packaging', timestamp: 'In Progress', location: 'ApexTech Warehouse #3, CA', description: 'Automated sorting and merchant packaging initiated.', completed: true, isCurrent: true },
        { id: 3, status: 'Departed Facility', timestamp: 'Pending', location: 'Logistics Sort Hub', description: 'Awaiting export dispatch.', completed: false },
        { id: 4, status: 'In Transit', timestamp: 'Pending', location: 'Regional Sort Center', description: 'Inter-facility transfer.', completed: false },
        { id: 5, status: 'Out for Delivery', timestamp: 'Pending', location: 'Local Delivery Fleet', description: 'Assigned to courier van.', completed: false },
        { id: 6, status: 'Delivered', timestamp: 'Pending', location: addresses.find(a => a.id === selectedAddr)?.address || 'Destination', description: 'Recipient signature required.', completed: false }
      ],
      trackingSteps: [
        { status: 'Order Placed', date: new Date().toISOString().slice(0, 16).replace('T', ' '), location: 'System', description: 'Order created and payment verified.' },
        { status: 'Processing', date: new Date().toISOString().slice(0, 16).replace('T', ' '), location: 'Warehouse 3', description: 'Fulfillment packaging initiated.' }
      ]
    };

    // Decrement stock levels
    setProducts(prev => prev.map(p => {
      const purchased = cart.find(item => item.product.id === p.id);
      if (purchased) {
        return { ...p, stock: Math.max(0, p.stock - purchased.quantity), salesCount: p.salesCount + purchased.quantity };
      }
      return p;
    }));

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Clear cart and reward loyalty points (1 point per dollar spent)
    setCart([]);
    setLoyaltyPoints(prev => prev + Math.floor(finalTotal));
    setAppliedCoupon(null);
    setCheckoutComplete(true);
  };

  // Add customized Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrVal) return;
    setAddresses(prev => [...prev, { id: `addr-${Date.now()}`, name: newAddrName, address: newAddrVal }]);
    setNewAddrName('');
    setNewAddrVal('');
  };

  // Top up simulated balance
  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) return;
    setWalletFunds(prev => prev + amt);
    setTopupAmount('');
    alert(`Successfully deposited $${amt.toFixed(2)} into your secure DXMARKET wallet.`);
  };

  // Merchant uploads new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProdPrice);
    const stock = parseInt(newProdStock);
    if (!newProdTitle || isNaN(price) || isNaN(stock)) return;

    const newProduct: Product = {
      id: `p-${products.length + 1}`,
      title: newProdTitle,
      price,
      description: newProdDesc || 'An enterprise level product vetted for platform compliance.',
      category: newProdCategory,
      brand: newProdBrand,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
      gallery: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'],
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      merchantId: 'm-1', // ApexTech Sol
      merchantName: 'ApexTech Solutions',
      specifications: { Origin: 'Imported', Quality: 'A-Grade' },
      variants: [{ name: 'Packaging', options: ['Eco Box', 'Bubble Wrap'] }],
      stock,
      salesCount: 0,
      isFeatured: false,
      isTrending: false,
      isFlashSale: false,
      isApproved: true
    };

    setProducts(prev => [newProduct, ...prev]);
    setNewProdTitle('');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdDesc('');
    setNewProdSuccess(true);
    setTimeout(() => setNewProdSuccess(false), 3000);
  };

  // Merchant creates coupon code
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const disc = parseFloat(newCouponDiscount);
    if (!newCouponCode || isNaN(disc)) return;
    const newC: Coupon = {
      id: `c-${Date.now()}`,
      code: newCouponCode.toUpperCase(),
      discount: disc,
      type: newCouponType,
      expiryDate: '2026-12-31',
      isActive: true
    };
    setMerchants(prev => prev.map(m => {
      if (m.id === 'm-1') {
        return { ...m, coupons: [...m.coupons, newC] };
      }
      return m;
    }));
    setNewCouponCode('');
    setNewCouponDiscount('');
    alert(`Coupon ${newC.code} published! Customers can now apply this code during checkout.`);
  };

  // Supplier dispatches cargo
  const handleSupplierDispatch = (shipmentId: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === 's-1') {
        return {
          ...s,
          shipments: s.shipments.map(sh => {
            if (sh.id === shipmentId) {
              return { ...sh, status: 'In Transit' };
            }
            return sh;
          })
        };
      }
      return s;
    }));
    alert('Logistics manifest authorized. Shipment cargo loaded for transport.');
  };

  // Sales CRM Lead updates
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadEmail) return;
    const nl: Lead = {
      id: `l-${leads.length + 1}`,
      name: newLeadName,
      email: newLeadEmail,
      phone: '+1 (555) 012-3456',
      interestLevel: newLeadInterest,
      source: 'Internal CRM Entry',
      status: 'New',
      lastFollowUp: new Date().toISOString().split('T')[0],
      notes: 'New prospective merchant interested in bulk supply catalog imports.'
    };
    setLeads(prev => [nl, ...prev]);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadSuccess(true);
    setTimeout(() => setNewLeadSuccess(false), 3000);
  };

  // --- RENDERING PORTALS ---

  // 1. CUSTOMER PORTAL
  if (role === 'customer') {
    const totalCartPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const finalTotal = appliedCoupon
      ? (appliedCoupon.type === 'percentage' ? totalCartPrice * (1 - appliedCoupon.discount / 100) : totalCartPrice - appliedCoupon.discount)
      : totalCartPrice;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="customer-portal-layout">
        {/* Portal navigation sidebar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit space-y-1">
          <p className="px-3 py-1.5 text-[10px] uppercase font-black text-gray-400 tracking-wider">Customer Portal</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'cart', label: 'Cart Checkout', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'orders', label: 'My Orders', icon: <Truck className="w-4 h-4" /> },
            { id: 'track-order', label: 'Track My Order', icon: <MapPin className="w-4 h-4 text-blue-500 animate-bounce" /> },
            { id: 'wishlist', label: 'Saved Wishlist', icon: <Heart className="w-4 h-4" /> },
            { id: 'wallet', label: 'Wallet Ledger', icon: <Wallet className="w-4 h-4" /> },
            { id: 'addresses', label: 'Address Book', icon: <MapPin className="w-4 h-4" /> },
            { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCheckoutComplete(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-blue-50 text-[#0F4C81]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic portal views */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6" id="customer-dashboard">
              <div className="bg-gradient-to-r from-[#0F4C81] to-[#1E88E5] text-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Welcome back, {profileName}!</h2>
                  <p className="text-xs text-gray-200 mt-1">Review your digital wallet, loyalty rewards tier, and track active deliveries.</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded text-center">
                    <span className="block text-[10px] text-gray-200 font-semibold">Wallet Funds</span>
                    <span className="font-extrabold text-base">${walletFunds.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded text-center">
                    <span className="block text-[10px] text-gray-200 font-semibold">Loyalty Reward Points</span>
                    <span className="font-extrabold text-base">{loyaltyPoints}</span>
                  </div>
                </div>
              </div>

              {/* Core metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] uppercase font-bold">Active Deliveries</span>
                    <Truck className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xl font-black text-gray-800">
                    {orders.filter(o => o.status === 'Shipped' || o.status === 'Processing').length} Packages
                  </p>
                  <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-[#1E88E5] hover:underline block pt-1">
                    Track Orders →
                  </button>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] uppercase font-bold">Saved Wishlist</span>
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="text-xl font-black text-gray-800">{wishlist.length} Products</p>
                  <button onClick={() => setActiveTab('wishlist')} className="text-[10px] font-bold text-[#1E88E5] hover:underline block pt-1">
                    View Wishlist →
                  </button>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] uppercase font-bold">Loyalty Tier</span>
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-xl font-black text-gray-800">
                    {loyaltyPoints >= 1000 ? '🥇 Gold Affiliate' : '🥈 Silver Tier'}
                  </p>
                  <p className="text-[10px] text-gray-400">Earn 1 point per $1 check out value.</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Recent Order History</h3>
                <div className="divide-y divide-gray-100">
                  {orders.length > 0 ? (
                    orders.slice(0, 2).map((order) => (
                      <div key={order.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-800">ID: {order.id}</p>
                          <p className="text-gray-400 font-medium">Placed: {order.date} | Total: ${order.total.toFixed(2)}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic py-2">No transaction history found.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CART & CHECKOUT */}
          {activeTab === 'cart' && (
            <div className="space-y-6" id="customer-cart-checkout">
              {checkoutComplete ? (
                <div className="bg-white border border-gray-200 p-8 rounded-xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-black text-gray-900">Your Order Has Been Placed!</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    The transaction was successfully processed. Wallet funds decremented, and inventory reorder metrics updated.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button onClick={() => { setActiveTab('orders'); setCheckoutComplete(false); }} className="px-4 py-2 bg-[#0F4C81] hover:bg-[#1E88E5] text-white text-xs font-bold rounded">
                      Track Shipments
                    </button>
                    <button onClick={() => onNavigate('products')} className="px-4 py-2 border border-gray-300 rounded text-xs text-gray-700 font-semibold">
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Cart items list */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                      <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Shopping Cart ({cart.length})</h3>
                      {cart.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {cart.map((item, idx) => (
                            <div key={idx} className="py-3.5 flex gap-4">
                              <img src={item.product.image} alt={item.product.title} className="w-14 h-14 object-cover rounded-md flex-shrink-0 bg-gray-50" />
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div className="flex justify-between gap-1 items-start">
                                  <div>
                                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{item.product.title}</h4>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                      {Object.entries(item.selectedVariant).map(([k,v]) => `${k}: ${v}`).join(', ')}
                                    </p>
                                  </div>
                                  <button onClick={() => removeCartItem(idx)} className="text-gray-400 hover:text-rose-500">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <div className="flex items-center border border-gray-300 rounded">
                                    <button onClick={() => updateCartQty(idx, -1)} className="px-2 py-0.5 hover:bg-gray-100 text-xs font-bold">-</button>
                                    <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                                    <button onClick={() => updateCartQty(idx, 1)} className="px-2 py-0.5 hover:bg-gray-100 text-xs font-bold">+</button>
                                  </div>
                                  <span className="font-extrabold text-[#0F4C81] text-xs">${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-xs">Your shopping cart is currently empty.</p>
                          <button onClick={() => onNavigate('products')} className="mt-3 text-xs font-bold text-[#1E88E5] hover:underline">Browse Products</button>
                        </div>
                      )}
                    </div>

                    {/* Shipping Address Picker */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                      <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Fulfillment Destination</h3>
                      <div className="space-y-2">
                        {addresses.map((a) => (
                          <label key={a.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${selectedAddr === a.id ? 'border-[#0F4C81] bg-blue-50/40' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input
                              type="radio"
                              name="checkout-addr"
                              checked={selectedAddr === a.id}
                              onChange={() => setSelectedAddr(a.id)}
                              className="mt-0.5 accent-[#0F4C81]"
                            />
                            <div className="text-xs">
                              <p className="font-bold text-gray-800">{a.name}</p>
                              <p className="text-gray-500 font-medium mt-0.5">{a.address}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary & Apply Coupon (Right Column) */}
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                      <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Order Bill Summary</h3>
                      
                      {/* Coupon validation block */}
                      <div className="space-y-1.5 pb-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Apply Promo Code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="APEX10, VOGUE20..."
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
                          />
                          <button
                            onClick={() => {
                              const found = merchants.flatMap(m => m.coupons).find(c => c.code === couponCode.toUpperCase());
                              if (found && found.isActive) {
                                setAppliedCoupon(found);
                                alert(`Success! Applied promo code ${found.code}.`);
                              } else {
                                alert('Invalid or inactive promotional coupon code.');
                              }
                            }}
                            className="bg-[#0F4C81] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#1E88E5]"
                          >
                            Apply
                          </button>
                        </div>
                        {appliedCoupon && (
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5">
                            Active Coupon: {appliedCoupon.code} (-{appliedCoupon.discount}{appliedCoupon.type === 'percentage' ? '%' : '$'})
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                        <div className="flex justify-between text-gray-500">
                          <span>Items Subtotal</span>
                          <span>${totalCartPrice.toFixed(2)}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Coupon Discount</span>
                            <span>
                              -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-500">
                          <span>Priority Shipping</span>
                          <span className="text-emerald-600 font-extrabold">FREE PROMO</span>
                        </div>
                        <div className="flex justify-between font-black text-[#0F4C81] text-sm pt-2 border-t border-gray-100">
                          <span>Grand Total</span>
                          <span>${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Payment method */}
                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Payment Authorization</label>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <button
                            onClick={() => setSelectedPay('wallet')}
                            className={`p-2 rounded border text-xs cursor-pointer font-bold ${selectedPay === 'wallet' ? 'border-[#0F4C81] bg-blue-50 text-[#0F4C81]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                          >
                            Wallet (${walletFunds.toFixed(2)})
                          </button>
                          <button
                            onClick={() => setSelectedPay('card')}
                            className={`p-2 rounded border text-xs cursor-pointer font-bold ${selectedPay === 'card' ? 'border-[#0F4C81] bg-blue-50 text-[#0F4C81]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                          >
                            Card ending in 4242
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className={`w-full py-3 text-white rounded text-xs font-bold cursor-pointer transition text-center ${cart.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}
                      >
                        Authorize & Place Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MY ORDERS / TRACKING */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6" id="customer-orders">
              <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Logistics & Order Tracking</h3>
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="py-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-extrabold text-xs text-gray-800">Order Token: #{order.id}</p>
                        <p className="text-[10px] text-gray-400">Dispatched: {order.date} | Total Invoice: ${order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] self-start sm:self-auto border ${
                          (order.shippingStatus === 'Delivered' || order.status === 'Delivered') 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : order.shippingStatus === 'Out for Delivery' 
                              ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          LOGISTICS: {order.shippingStatus?.toUpperCase() || order.status.toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedOrderToTrack(order.id);
                            setActiveTab('track-order');
                          }}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1 rounded text-[10px] font-extrabold shadow transition flex items-center gap-1 cursor-pointer animate-pulse"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Live Map Track 📍</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Tracking Steps Summary */}
                    {(order.trackingLogs && order.trackingLogs.length > 0) ? (
                      <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Live Logistics Progression & GPS Checkpoints:</span>
                          </p>
                          <span className="text-[10px] font-bold text-gray-500">
                            {order.trackingLogs.filter(l => l.completed).length} of {order.trackingLogs.length} Checkpoints Cleared
                          </span>
                        </div>
                        <div className="relative pl-5 border-l-2 border-blue-500 space-y-4 text-xs">
                          {order.trackingLogs.map((log, idx) => (
                            <div key={idx} className="relative">
                              <span className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                                log.isCurrent ? 'bg-blue-600 ring-4 ring-blue-500/30 animate-pulse' : log.completed ? 'bg-emerald-500' : 'bg-gray-300'
                              }`} />
                              <div className="flex flex-wrap justify-between items-center text-gray-800 gap-2">
                                <span className={`font-extrabold flex items-center gap-1.5 ${log.isCurrent ? 'text-blue-600 font-black' : log.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                  <span>{log.status}</span>
                                  {log.isCurrent && <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Active Stage</span>}
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{log.timestamp}</span>
                                </span>
                              </div>
                              <p className={`text-[11px] font-medium mt-0.5 ${log.isCurrent ? 'text-gray-800' : 'text-gray-500'}`}>
                                {log.description}
                              </p>
                              {log.location && (
                                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1 bg-emerald-50/80 inline-flex px-2 py-0.5 rounded border border-emerald-200/60">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>{log.location}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : order.trackingSteps ? (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3.5">
                        <p className="text-[10px] font-bold text-[#0F4C81] uppercase tracking-wider">Tracking Route:</p>
                        <div className="relative pl-4 border-l-2 border-blue-500 space-y-4 text-xs">
                          {order.trackingSteps.map((step, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -left-5 top-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                              <div className="flex justify-between items-center text-gray-800">
                                <span className="font-bold">{step.status}</span>
                                <span className="text-[10px] text-gray-400">{step.date}</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-medium">{step.description} ({step.location})</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded text-center text-xs text-gray-400">
                        📦 Package is awaiting merchant routing configuration.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TRACK MY ORDER (ANIMATED VISUAL TIMELINE) */}
          {activeTab === 'track-order' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8 shadow-sm" id="customer-track-order">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-black text-lg text-[#0F4C81] flex items-center gap-2">
                    <Truck className="w-6 h-6 text-blue-600 animate-bounce" />
                    <span>Interactive Order Logistics & Live Tracking</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Real-time GPS courier telemetry and timeline milestone animation.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Select Order:</span>
                  <select
                    value={selectedOrderToTrack}
                    onChange={(e) => setSelectedOrderToTrack(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg px-3 py-1.5 font-bold focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
                  >
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>Order #{o.id} — ${o.total.toFixed(2)} ({o.status})</option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const currentOrder = orders.find(o => o.id === selectedOrderToTrack) || orders[0];
                if (!currentOrder) {
                  return (
                    <div className="text-center py-12 text-gray-400 font-semibold text-sm">
                      📦 No orders found to track. Place an order in the Cart Checkout tab first!
                    </div>
                  );
                }

                const defaultMilestones = [
                  { id: 1, label: 'Order Authorized', desc: 'Payment verified & escrow secured.', time: '09:15 AM', location: 'Payment Clearing Hub', icon: <ShieldCheck className="w-5 h-5" />, completed: true, isCurrent: false },
                  { id: 2, label: 'Warehouse Packaging', desc: 'ApexTech automated sorting & gift boxing.', time: '11:40 AM', location: 'Warehouse 3', icon: <Box className="w-5 h-5" />, completed: true, isCurrent: false },
                  { id: 3, label: 'Customs & Air Freight', desc: 'Departed export cargo hub (Flight DX-802).', time: '02:30 PM', location: 'Export Terminal', icon: <Globe className="w-5 h-5" />, completed: true, isCurrent: false },
                  { id: 4, label: 'Regional Distribution Hub', desc: 'Sorted at regional facility for dispatch.', time: '06:15 PM', location: 'Regional Hub', icon: <Activity className="w-5 h-5" />, completed: true, isCurrent: true },
                  { id: 5, label: 'Out for Delivery', desc: 'Courier driver in transit to your address.', time: 'Expected 04:00 PM', location: 'Local Depot', icon: <Truck className="w-5 h-5" />, completed: false, isCurrent: false },
                  { id: 6, label: 'Delivered & Signed', desc: 'Handed over at front door.', time: 'Pending', location: 'Destination', icon: <CheckCircle2 className="w-5 h-5" />, completed: false, isCurrent: false }
                ];

                const iconMap: Record<number, React.ReactNode> = {
                  1: <ShieldCheck className="w-5 h-5" />,
                  2: <Box className="w-5 h-5" />,
                  3: <Globe className="w-5 h-5" />,
                  4: <Activity className="w-5 h-5" />,
                  5: <Truck className="w-5 h-5" />,
                  6: <CheckCircle2 className="w-5 h-5" />
                };

                const timelineMilestones = (currentOrder.trackingLogs && currentOrder.trackingLogs.length > 0)
                  ? currentOrder.trackingLogs.map((log, idx) => ({
                      id: Number(log.id) || (idx + 1),
                      label: log.status,
                      desc: log.description,
                      time: log.timestamp,
                      location: log.location,
                      icon: iconMap[idx + 1] || <Activity className="w-5 h-5" />,
                      completed: log.completed ?? false,
                      isCurrent: log.isCurrent ?? false
                    }))
                  : defaultMilestones;

                const currentStepIdx = timelineMilestones.findIndex(m => m.isCurrent) !== -1
                  ? timelineMilestones.findIndex(m => m.isCurrent) + 1
                  : (currentOrder.status === 'Delivered' || currentOrder.shippingStatus === 'Delivered') ? 6 : 3;

                const activeShippingStatus = currentOrder.shippingStatus || currentOrder.status || 'In Transit';

                return (
                  <div className="space-y-8">
                    {/* Live Courier Telemetry Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-[#0F4C81] to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Live Telemetry Broadcast Active</span>
                          </div>
                          <h4 className="text-2xl font-black tracking-tight">Tracking #{currentOrder.trackingNumber || `DX-${currentOrder.id}-GLB`}</h4>
                          <p className="text-xs text-blue-100/80 max-w-lg">
                            Destination: <span className="font-semibold text-white">{currentOrder.shippingAddress}</span>
                          </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex items-center gap-4 self-start md:self-auto min-w-[220px]">
                          <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center text-xl shadow-inner">
                            🚚
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-blue-200">Carrier Courier</p>
                            <p className="font-extrabold text-sm text-white">DX-Priority Express</p>
                            <p className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Driver GPS Connected</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Animated Progress Route Bar */}
                      <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-blue-200">
                          <span>Origin: Warehouse #3</span>
                          <span className="text-amber-300 font-extrabold animate-pulse">
                            {(activeShippingStatus === 'Delivered') ? '✅ Package Delivered Successfully' : `⏳ Current Status: ${activeShippingStatus}`}
                          </span>
                          <span>Destination: Recipient</span>
                        </div>
                        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(Math.min(currentStepIdx, timelineMilestones.length || 6) / (timelineMilestones.length || 6)) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 rounded-full shadow-lg relative"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline Milestones Animation Grid */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#1E88E5]" />
                        <span>Logistics Progress Timeline</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {timelineMilestones.map((milestone, idx) => {
                          const isCompleted = milestone.completed || milestone.id < currentStepIdx || (activeShippingStatus === 'Delivered');
                          const isCurrent = milestone.isCurrent || (milestone.id === currentStepIdx && activeShippingStatus !== 'Delivered');

                          return (
                            <motion.div
                              key={milestone.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              className={`p-5 rounded-xl border transition-all relative overflow-hidden ${
                                isCurrent 
                                  ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-500/20 scale-[1.02]' 
                                  : isCompleted 
                                    ? 'bg-white border-emerald-200 hover:border-emerald-300 shadow-sm' 
                                    : 'bg-gray-50/60 border-gray-200 opacity-60'
                              }`}
                            >
                              {isCurrent && (
                                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-wider animate-pulse">
                                  Current Stage
                                </span>
                              )}
                              {isCompleted && !isCurrent && (
                                <span className="absolute top-2 right-2 text-emerald-600 text-[10px] font-extrabold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Done</span>
                                </span>
                              )}

                              <div className="flex items-start gap-3.5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition ${
                                  isCurrent 
                                    ? 'bg-blue-600 text-white animate-bounce' 
                                    : isCompleted 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {milestone.icon}
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <span className="text-[10px] font-extrabold text-gray-400 uppercase">Step {idx + 1} of {timelineMilestones.length}</span>
                                  <h5 className={`font-black text-sm leading-tight ${isCurrent ? 'text-blue-950' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {milestone.label}
                                  </h5>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    {milestone.desc}
                                  </p>
                                  <div className="pt-2 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-semibold text-gray-400 border-t border-gray-100/80">
                                    <span className="flex items-center gap-1 text-gray-500">
                                      <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                      <span>{milestone.time}</span>
                                    </span>
                                    {milestone.location && (
                                      <span className="flex items-center gap-1 bg-gray-100/90 px-1.5 py-0.5 rounded text-gray-700 font-extrabold border border-gray-200/50">
                                        <MapPin className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                                        <span className="truncate max-w-[140px]">{milestone.location}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Package Item Summary within tracked order */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                      <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Items in this Cargo Shipment ({currentOrder.items.length})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentOrder.items.map((item, i) => (
                          <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3">
                            <img src={item.image} alt={item.productTitle} className="w-12 h-12 object-cover rounded bg-gray-100" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-gray-900 line-clamp-1">{item.productTitle}</p>
                              <p className="text-[10px] text-gray-500">Qty: {item.quantity} | Price: ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4" id="customer-wishlist">
              <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Saved Wishlist ({wishlist.length})</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="border border-gray-100 rounded-lg p-3 flex gap-3 shadow-sm hover:shadow transition">
                      <img src={prod.image} alt={prod.title} className="w-16 h-16 object-cover rounded bg-gray-50" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{prod.title}</h4>
                          <span className="font-bold text-[#0F4C81] text-xs">${prod.price.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              onNavigate('product-details', { product: prod });
                            }}
                            className="text-[10px] bg-gray-100 hover:bg-[#0F4C81] hover:text-white text-[#0F4C81] px-2 py-1 rounded font-bold transition"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onToggleWishlist(prod)}
                            className="text-[10px] text-rose-500 hover:underline font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-6">Your saved items list is empty.</p>
              )}
            </div>
          )}

          {/* TAB: WALLET LEDGER */}
          {activeTab === 'wallet' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start" id="customer-wallet">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-[#0F4C81]">My Digital Ledger</h3>
                <div className="p-4 bg-blue-50/50 rounded-lg text-center border border-blue-100">
                  <span className="text-[11px] text-gray-400 uppercase font-bold block">Available Balance</span>
                  <span className="text-2xl font-black text-[#0F4C81]">${walletFunds.toFixed(2)}</span>
                </div>

                <form onSubmit={handleTopup} className="space-y-3.5 border-t border-gray-100 pt-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Simulate Fund Deposit</label>
                    <input
                      type="number"
                      required
                      placeholder="Amount ($ e.g. 50)"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#0F4C81] text-white py-1.5 rounded text-xs font-bold hover:bg-[#1E88E5]">
                    Deposit Funds
                  </button>
                </form>
              </div>

              <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Recent Transactions History</h3>
                <div className="divide-y divide-gray-100 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <div>
                      <p className="font-bold text-emerald-600">Simulated Deposit Authorized</p>
                      <p className="text-[10px] text-gray-400">Credit card auth #DX-99121</p>
                    </div>
                    <span className="font-black text-emerald-600 font-mono">+$250.00</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <div>
                      <p className="font-bold text-gray-800">Direct Store Checkout #ord-1001</p>
                      <p className="text-[10px] text-gray-400">Order invoice debited</p>
                    </div>
                    <span className="font-black text-rose-600 font-mono">-$189.99</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="customer-addresses">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Addresses List</h3>
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="p-3 border border-gray-100 rounded bg-gray-50 text-xs relative">
                      <p className="font-bold text-gray-800">{a.name}</p>
                      <p className="text-gray-500 mt-1">{a.address}</p>
                      <button 
                        onClick={() => setAddresses(addresses.filter(addr => addr.id !== a.id))}
                        className="absolute right-2 top-2 text-gray-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Add New Location</h3>
                <form onSubmit={handleAddAddress} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Label (e.g. Office, Vacation Home)</label>
                    <input
                      type="text"
                      required
                      placeholder="My Store Cabin"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Full Shipping Address</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="100 Enterprise Way, Floor 4, Suite 9B..."
                      value={newAddrVal}
                      onChange={(e) => setNewAddrVal(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                  <button type="submit" className="bg-[#0F4C81] text-white py-1.5 rounded text-xs font-bold hover:bg-[#1E88E5] px-4 cursor-pointer">
                    Save Address
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-md space-y-4" id="customer-profile">
              <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Modify Personal Profile</h3>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Full Legal Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Primary Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Phone Contact</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                  />
                </div>
                <button 
                  onClick={() => alert('Profile successfully updated.')}
                  className="bg-[#0F4C81] text-white py-1.5 px-4 rounded text-xs font-bold hover:bg-[#1E88E5]"
                >
                  Save Profile Configuration
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 2. MERCHANT PORTAL
  if (role === 'merchant') {
    const merchantStore = merchants.find(m => m.id === 'm-1') || merchants[0];
    const merchantProducts = products.filter(p => p.merchantId === merchantStore.id);
    const storeOrders = orders.filter(o => o.items.some(i => i.merchantId === merchantStore.id));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="merchant-portal-layout">
        {/* Merchant Navigation Sidebar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit space-y-1">
          <p className="px-3 py-1.5 text-[10px] uppercase font-black text-gray-400 tracking-wider">Merchant Admin</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Store className="w-4 h-4" /> },
            { id: 'products', label: 'My Listings', icon: <Package className="w-4 h-4" /> },
            { id: 'orders', label: 'Fulfillment Orders', icon: <Truck className="w-4 h-4" /> },
            { id: 'coupons', label: 'Discounts / Coupons', icon: <BadgePercent className="w-4 h-4" /> },
            { id: 'settings', label: 'Storefront Settings', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-blue-50 text-[#0F4C81]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Merchant views */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6" id="merchant-dashboard">
              <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-amber-400">ApexTech Merchant Workspace</h2>
                  <p className="text-xs text-gray-300 mt-1">Manage inventories, approve custom shipping paths, and authorize payouts.</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded text-center">
                  <span className="block text-[10px] text-gray-300">Withdrawable Balance</span>
                  <span className="font-extrabold text-base">${merchantStore.balance.toFixed(2)}</span>
                </div>
              </div>

              {/* Stats blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Active Listings</span>
                  <p className="text-2xl font-black text-gray-800">{merchantProducts.length} Products</p>
                  <p className="text-[10px] text-emerald-600 font-medium">✓ All verified on platform</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">My Stores Revenue</span>
                  <p className="text-2xl font-black text-gray-800">$10,450.00</p>
                  <p className="text-[10px] text-emerald-600 font-medium">▲ +12% from previous month</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Total Fulfilled Orders</span>
                  <p className="text-2xl font-black text-gray-800">{merchantStore.ordersCount} completed</p>
                  <p className="text-[10px] text-amber-500 font-medium">⚠️ {storeOrders.filter(o => o.status === 'Pending').length} awaiting fulfillment</p>
                </div>
              </div>

              {/* Low stock indicators */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Reorder Warning / Low Stock levels</span>
                </h3>
                <div className="divide-y divide-gray-100">
                  {merchantProducts.filter(p => p.stock < 15).map((p) => (
                    <div key={p.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800">{p.title}</p>
                        <p className="text-[10px] text-gray-400">Reorder threshold: 15 units</p>
                      </div>
                      <span className="text-rose-600 font-extrabold font-mono">{p.stock} units left!</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="merchant-products">
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Active Product Directory</h3>
                
                <div className="divide-y divide-gray-100 text-xs">
                  {merchantProducts.map((p) => (
                    <div key={p.id} className="py-3 flex gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 object-cover rounded bg-gray-50 flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between gap-1">
                          <h4 className="font-bold text-gray-800 line-clamp-1">{p.title}</h4>
                          <span className="font-extrabold text-[#0F4C81]">${p.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Category: {p.category} | Units in stock: {p.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload new product */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Add New Product</h3>
                
                {newProdSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded text-xs">
                    ✓ Product uploaded! Vetted for catalog presentation instantly.
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="WorkStation Slim Bracket"
                      value={newProdTitle}
                      onChange={(e) => setNewProdTitle(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Price ($)</label>
                      <input
                        type="number"
                        required
                        placeholder="35.00"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Initial Stock</label>
                      <input
                        type="number"
                        required
                        placeholder="100"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded p-1.5 text-gray-700 bg-white"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty & Skincare">Beauty & Skincare</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Product Description</label>
                    <textarea
                      rows={2}
                      placeholder="Specify material composition..."
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>

                  <button type="submit" className="w-full bg-[#0F4C81] text-white py-1.5 rounded text-xs font-bold hover:bg-[#1E88E5]">
                    Publish Product Listing
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: ORDERS FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4" id="merchant-orders">
              <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Orders Awaiting Dispatch</h3>
              <div className="divide-y divide-gray-100 text-xs">
                {storeOrders.length > 0 ? (
                  storeOrders.map((o) => (
                    <div key={o.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">Order Token: #{o.id}</p>
                        <p className="text-gray-400">Buyer: {o.customerName} | Placed: {o.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px] uppercase">
                          {o.status}
                        </span>
                        {(o.status === 'Pending' || o.status === 'Processing') && (
                          <button
                            onClick={() => {
                              setOrders(prev => prev.map(order => {
                                if (order.id === o.id) {
                                  return { 
                                    ...order, 
                                    status: 'Shipped',
                                    shippingStatus: 'In Transit',
                                    trackingLogs: [
                                      { id: 1, status: 'Order Authorized', timestamp: order.date, location: 'Escrow Clearing', description: 'Order verified.', completed: true },
                                      { id: 2, status: 'Warehouse Packaging', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: 'Supplier Facility', description: 'Packed and labeled.', completed: true },
                                      { id: 3, status: 'Departed Facility', timestamp: 'Just Now', location: 'Dispatch Terminal', description: 'Handed over to priority cargo carrier.', completed: true },
                                      { id: 4, status: 'In Transit', timestamp: 'Just Now', location: 'National Logistics Hub', description: 'Dispatched by priority cargo carrier.', completed: true, isCurrent: true },
                                      { id: 5, status: 'Out for Delivery', timestamp: 'Expected Tomorrow', location: 'Local Delivery Depot', description: 'Scheduled for local delivery.', completed: false },
                                      { id: 6, status: 'Delivered', timestamp: 'Pending', location: order.shippingAddress, description: 'Signature required.', completed: false }
                                    ],
                                    trackingSteps: [
                                      { status: 'Order Placed', date: new Date().toISOString().split('T')[0], location: 'System', description: 'Order verified.' },
                                      { status: 'In Transit', date: new Date().toISOString().split('T')[0], location: 'NYC Distribution Hub', description: 'Dispatched by priority cargo carrier.' }
                                    ]
                                  };
                                }
                                return order;
                              }));
                              alert(`Order #${o.id} labeled for priority transit.`);
                            }}
                            className="bg-[#0F4C81] text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-[#1E88E5]"
                          >
                            Dispatch Cargo
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic py-3">No active orders found for this merchant.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: DISCOUNTS / COUPONS */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="merchant-coupons">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Active Discount Coupons</h3>
                <div className="space-y-3 text-xs">
                  {merchantStore.coupons.map((c) => (
                    <div key={c.id} className="p-3 bg-gray-50 border border-gray-100 rounded flex justify-between items-center">
                      <div>
                        <code className="text-amber-800 font-extrabold">{c.code}</code>
                        <p className="text-[10px] text-gray-400 mt-0.5">Discount: {c.discount}{c.type === 'percentage' ? '%' : '$'}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Create Coupon Code</h3>
                <form onSubmit={handleCreateCoupon} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Coupon Token (all caps)</label>
                    <input
                      type="text"
                      required
                      placeholder="APEXSAVE"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Discount Amount</label>
                      <input
                        type="number"
                        required
                        placeholder="15"
                        value={newCouponDiscount}
                        onChange={(e) => setNewCouponDiscount(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Type</label>
                      <select
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
                        className="w-full text-xs border border-gray-300 rounded p-1.5 text-gray-700 bg-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed ($)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#0F4C81] text-white py-1.5 rounded text-xs font-bold hover:bg-[#1E88E5]">
                    Publish Promotional Coupon
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-md space-y-4" id="merchant-settings">
              <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Modify Store Profile</h3>
              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Merchant Store Title</label>
                  <input
                    type="text"
                    defaultValue={merchantStore.name}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Storefront Bio Description</label>
                  <textarea
                    rows={2}
                    defaultValue={merchantStore.description}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Owner Contact</label>
                    <input type="text" defaultValue={merchantStore.ownerName} className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Primary Business Email</label>
                    <input type="email" defaultValue={merchantStore.ownerEmail} className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded" />
                  </div>
                </div>
                <button
                  onClick={() => alert('Store profile successfully updated on DXMARKET directory.')}
                  className="bg-[#0F4C81] text-white py-1.5 px-4 rounded text-xs font-bold hover:bg-[#1E88E5]"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 3. SUPPLIER PORTAL
  if (role === 'supplier') {
    const sObj = suppliers.find(s => s.id === 's-1') || suppliers[0];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="supplier-portal-layout">
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit space-y-1">
          <p className="px-3 py-1.5 text-[10px] uppercase font-black text-gray-400 tracking-wider">Supplier Actions</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Package className="w-4 h-4" /> },
            { id: 'shipments', label: 'Transit Manifests', icon: <Truck className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-blue-50 text-[#0F4C81]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6" id="supplier-dashboard">
              <div className="bg-amber-600 text-white p-6 rounded-xl">
                <h2 className="text-base font-extrabold uppercase tracking-widest">{sObj.name} Dashboard</h2>
                <p className="text-xs text-amber-100 mt-1">Staging raw items, cargo packing and supply tracking systems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500">
                <div className="bg-white p-4 border border-gray-100 rounded-xl space-y-1">
                  <span className="uppercase font-bold block text-[10px]">Supply Category</span>
                  <p className="text-sm font-extrabold text-[#0F4C81]">{sObj.supplyCategory}</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-xl space-y-1">
                  <span className="uppercase font-bold block text-[10px]">Total Supplied items</span>
                  <p className="text-base font-black text-gray-800">{sObj.inventoriesSupplied} units</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-xl space-y-1">
                  <span className="uppercase font-bold block text-[10px]">Approval Status</span>
                  <p className="text-sm font-extrabold text-emerald-600">✓ Vetted Active Supplier</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4" id="supplier-shipments">
              <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Logistics Transit Manifests</h3>
              <div className="divide-y divide-gray-100 text-xs">
                {sObj.shipments.map((ship) => (
                  <div key={ship.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-gray-800">{ship.productName}</p>
                      <p className="text-[10px] text-gray-400">Qty: {ship.quantity} | Tracking Code: {ship.trackingNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                        ship.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ship.status}
                      </span>
                      {ship.status === 'Pending' && (
                        <button
                          onClick={() => handleSupplierDispatch(ship.id)}
                          className="bg-[#0F4C81] text-white px-2 py-1 rounded text-[10px] font-bold"
                        >
                          Dispatch Cargo
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. SALES PORTAL
  if (role === 'sales') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="sales-portal-layout">
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit space-y-1">
          <p className="px-3 py-1.5 text-[10px] uppercase font-black text-gray-400 tracking-wider">CRM Directory</p>
          {[
            { id: 'dashboard', label: 'Sales Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'leads', label: 'Lead Management', icon: <Users className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-blue-50 text-[#0F4C81]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6" id="sales-dashboard">
              <div className="bg-purple-900 text-white p-6 rounded-xl">
                <h2 className="text-base font-extrabold uppercase tracking-wider">Inbound Lead Pipeline</h2>
                <p className="text-xs text-purple-100 mt-1">Qualifying outbound inquiries and converting boutique sellers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500">
                <div className="bg-white p-4 border border-gray-100 rounded-xl space-y-1">
                  <span className="uppercase font-bold text-[10px]">Active Leads</span>
                  <p className="text-base font-black text-gray-800">{leads.length} Records</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-xl space-y-1">
                  <span className="uppercase font-bold text-[10px]">Sales Followups</span>
                  <p className="text-base font-black text-[#0F4C81]">3 Scheduled</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 rounded-xl space-y-1">
                  <span className="uppercase font-bold text-[10px]">Pipeline Conversion</span>
                  <p className="text-base font-black text-emerald-600">64.5% conversion</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="sales-leads">
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Active Prospective Contacts</h3>
                <div className="divide-y divide-gray-100 text-xs">
                  {leads.map((l) => (
                    <div key={l.id} className="py-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="font-extrabold text-gray-800">{l.name} ({l.email})</p>
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                          l.interestLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {l.interestLevel} Priority
                        </span>
                      </div>
                      <p className="text-gray-400 font-medium">Phone: {l.phone} | Source: {l.source}</p>
                      <p className="text-gray-500 bg-gray-50 p-2 rounded mt-1">{l.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Lead */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Add New Lead</h3>
                
                {newLeadSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded text-[10px]">
                    ✓ Lead record successfully integrated into central pipeline CRM.
                  </div>
                )}

                <form onSubmit={handleAddLead} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Prospect Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Gavin"
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Prospect Email</label>
                    <input
                      type="email"
                      required
                      placeholder="gavin@store.com"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Interest Rating</label>
                    <select
                      value={newLeadInterest}
                      onChange={(e) => setNewLeadInterest(e.target.value as 'High' | 'Medium' | 'Low')}
                      className="w-full text-xs border border-gray-300 rounded p-1.5 text-gray-700 bg-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#0F4C81] text-white py-1.5 rounded text-xs font-bold hover:bg-[#1E88E5]">
                    Log CRM Contact
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
