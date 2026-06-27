import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PublicPages from './components/PublicPages';
import AuthPages from './components/AuthPages';
import PortalPages from './components/PortalPages';
import AdminPortals from './components/AdminPortals';
import { doc, onSnapshot, setDoc, getDocFromServer } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './lib/firebaseClient';

import { 
  MOCK_PRODUCTS, MOCK_MERCHANTS, MOCK_SUPPLIERS, MOCK_LEADS, 
  MOCK_ORDERS, MOCK_BLOGS, MOCK_AUDIT_LOGS, INITIAL_SYSTEM_CONFIG 
} from './dummyData';
import { Product, CartItem, Order, MerchantStore, Supplier, Lead, AuditLog, UserRole } from './types';
import { MessageSquare, X, Send, ShieldCheck, Mail, ShieldAlert, Sparkles, HelpCircle, Store } from 'lucide-react';

export default function App() {
  // Simulator states
  const [currentRole, setRole] = useState<UserRole>('guest');
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  // Core global databases
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [merchants, setMerchants] = useState<MerchantStore[]>(MOCK_MERCHANTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [systemConfig, setSystemConfig] = useState(INITIAL_SYSTEM_CONFIG);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Localization
  const [currency, setCurrency] = useState('NGN');
  const [language, setLanguage] = useState('English');

  // Currency converter (1 USD = 1,600 NGN, 1 USD = 0.92 EUR, 1 USD = 0.78 GBP)
  const formatPrice = (usdAmount: number) => {
    switch (currency) {
      case 'NGN':
        return `₦${(usdAmount * 1600).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'EUR':
        return `€${(usdAmount * 0.92).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'GBP':
        return `£${(usdAmount * 0.78).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'USD':
      default:
        return `$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  // Live Chat Widget State
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { sender: 'agent', text: 'Welcome to DXMARKET support desk! How can I assist you with merchant registries or tracking cargo shipping today?', time: 'Just Now' }
  ]);

  // Synchronize system config from Firestore in real-time
  useEffect(() => {
    const verifyConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'settings', 'systemConfig'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firebase is currently offline. Please check your network and configuration.");
        }
      }
    };
    verifyConnection();

    const docRef = doc(db, 'settings', 'systemConfig');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSystemConfig(prev => ({
          ...prev,
          ...data
        }));
        
        if (data.featuredProductIds) {
          setProducts(prevProducts =>
            prevProducts.map(p => ({
              ...p,
              isFeatured: data.featuredProductIds.includes(p.id)
            }))
          );
        }
      } else {
        setDoc(docRef, INITIAL_SYSTEM_CONFIG).catch((err) => {
          console.log('System configuration not yet initialized in Firestore or user lacks permission to write it. Using local defaults.');
        });
      }
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'settings/systemConfig');
      } catch (e) {}
    });

    return () => unsubscribe();
  }, []);

  // Handle route navigation
  const handleNavigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item to cart
  const handleAddToCart = (product: Product, quantity: number, variant: Record<string, string>) => {
    setCart(prev => {
      const existsIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      );

      if (existsIdx > -1) {
        return prev.map((item, idx) => {
          if (idx === existsIdx) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      }

      return [...prev, { product, quantity, selectedVariant: variant }];
    });
  };

  // Toggle Item in Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Simulated Chat Bot Responses
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatLogs(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just Now' }]);
    setChatMessage('');

    // Generate response based on keyword matching
    setTimeout(() => {
      let response = "I'm checking that transaction with our logistics compliance desk. Can you please specify your store ID or tracking code?";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('merchant') || lower.includes('register') || lower.includes('sell')) {
        response = "To register as a merchant on DXMARKET, navigate to the Auth Suite, sign up, then switch your role simulator to 'Merchant' to manage your store profile.";
      } else if (lower.includes('shipping') || lower.includes('track') || lower.includes('order')) {
        response = "DXMARKET prioritizes automated cargo logistics. You can view real-time tracking points inside the 'Customer Portal' under 'My Orders'.";
      } else if (lower.includes('commission') || lower.includes('payout')) {
        response = "By default, the platform retains an 8.5% commission fee which sponsors cross-border cargo transport. Super admins can adjust this fee within settings.";
      }

      setChatLogs(prev => [...prev, { sender: 'agent', text: response, time: 'Just now' }]);
    }, 1000);
  };

  // Dynamic Content Router
  const renderViewContent = () => {
    // 1. Check if Auth views
    if (['login', 'register', 'forgot', 'verify', '2fa'].includes(currentView)) {
      return (
        <AuthPages
          initialView={currentView}
          onNavigate={handleNavigate}
          onSuccess={(name, email) => {
            setRole('customer');
            handleNavigate('home');
          }}
        />
      );
    }

    // 2. Check if portal views
    if (currentView.endsWith('-dashboard')) {
      const extractedRole = currentView.split('-')[0] as 'customer' | 'merchant' | 'supplier' | 'sales' | 'admin' | 'superadmin';
      
      if (extractedRole === 'admin' || extractedRole === 'superadmin') {
        return (
          <AdminPortals
            role={extractedRole}
            onNavigate={handleNavigate}
            products={products}
            setProducts={setProducts}
            merchants={merchants}
            setMerchants={setMerchants}
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            orders={orders}
            setOrders={setOrders}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            systemConfig={systemConfig}
            setSystemConfig={setSystemConfig}
            formatPrice={formatPrice}
          />
        );
      }

      return (
        <PortalPages
          role={extractedRole}
          view={currentView}
          onNavigate={handleNavigate}
          products={products}
          setProducts={setProducts}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          merchants={merchants}
          setMerchants={setMerchants}
          orders={orders}
          setOrders={setOrders}
          suppliers={suppliers}
          setSuppliers={setSuppliers}
          leads={leads}
          setLeads={setLeads}
          systemConfig={systemConfig}
          formatPrice={formatPrice}
        />
      );
    }

    // 3. Fallback: Customer sub-navigation portals mapping
    if (currentView.startsWith('customer-')) {
      const subTab = currentView.replace('customer-', '');
      return (
        <PortalPages
          role="customer"
          view={currentView}
          onNavigate={handleNavigate}
          products={products}
          setProducts={setProducts}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          merchants={merchants}
          setMerchants={setMerchants}
          orders={orders}
          setOrders={setOrders}
          suppliers={suppliers}
          setSuppliers={setSuppliers}
          leads={leads}
          setLeads={setLeads}
          systemConfig={systemConfig}
          formatPrice={formatPrice}
        />
      );
    }

    // 4. Default: Public Views
    return (
      <PublicPages
        view={currentView}
        viewParams={viewParams}
        products={products}
        merchants={merchants}
        blogs={MOCK_BLOGS}
        cart={cart}
        wishlist={wishlist}
        onNavigate={handleNavigate}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        systemConfig={systemConfig}
        formatPrice={formatPrice}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans" id="dxmarket-application">
      {/* Interactive Sticky Header */}
      <Header
        currentRole={currentRole}
        setRole={setRole}
        cart={cart}
        wishlist={wishlist}
        onNavigate={handleNavigate}
        products={products}
        currentCurrency={currency}
        setCurrency={setCurrency}
        currentLanguage={language}
        setLanguage={setLanguage}
        currencies={systemConfig.currencies}
        languages={systemConfig.languages}
        systemConfig={systemConfig}
        formatPrice={formatPrice}
      />

      {/* Main Container Stage */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6">
        {renderViewContent()}
      </main>

      {/* Interactive Live Chat Widget Component */}
      <div className="fixed bottom-6 right-6 z-50" id="live-chat-widget">
        {showChat ? (
          <div className="w-80 h-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-[#0F4C81] text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <div>
                  <p className="font-bold text-xs">DXMARKET Compliance Desk</p>
                  <p className="text-[9px] text-gray-200">System Agent • Active Now</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-gray-300 hover:text-white cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat Body Logs */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
              {chatLogs.map((log, idx) => (
                <div key={idx} className={`flex flex-col ${log.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className={`px-3 py-2 rounded-lg leading-relaxed max-w-[85%] ${log.sender === 'user' ? 'bg-[#1E88E5] text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-100'}`}>
                    {log.text}
                  </span>
                  <span className="text-[8px] text-gray-400 mt-0.5">{log.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-2 bg-white border-t border-gray-100 flex gap-1.5">
              <input
                type="text"
                placeholder="Ask about merchant register, shipping, coupons..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
              <button type="submit" className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white p-2 rounded-lg cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition transform hover:scale-110"
            title="Open Live Chat Widget"
          >
            <MessageSquare className="w-5.5 h-5.5" />
          </button>
        )}
      </div>

      {/* World Class Multi-Column Footer */}
      <footer className="bg-white border-t border-gray-200" id="dx-main-footer">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 sm:px-6 text-xs text-gray-500">
          
          {/* Brand Presentation Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-lg bg-[#0F4C81] flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-base tracking-tight">DX</span>
              </div>
              <span className="text-base font-extrabold text-[#0F4C81] tracking-tight">DXMARKET</span>
            </div>
            <p className="leading-relaxed text-gray-400 font-medium">
              World-class, secure enterprise multi-vendor digital e-commerce marketplace matching premium sellers and global logistics chains.
            </p>
            <div className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded border border-blue-100 text-[10px] text-gray-600">
              <ShieldCheck className="w-5 h-5 text-[#0F4C81] flex-shrink-0" />
              <span>GDPR Vetted • PCI-DSS Compliant • WCAG Triple-A Accessible</span>
            </div>
          </div>

          {/* Department links column */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-gray-800 text-[10px] tracking-wider">Top Departments</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => { setProducts(MOCK_PRODUCTS); handleNavigate('products', { category: 'Electronics' }); }} className="hover:text-[#1E88E5] cursor-pointer">Electronics & Gadgets</button></li>
              <li><button onClick={() => { setProducts(MOCK_PRODUCTS); handleNavigate('products', { category: 'Fashion' }); }} className="hover:text-[#1E88E5] cursor-pointer">Tailored Boutique Apparel</button></li>
              <li><button onClick={() => { setProducts(MOCK_PRODUCTS); handleNavigate('products', { category: 'Beauty & Skincare' }); }} className="hover:text-[#1E88E5] cursor-pointer">Organic Wellness Products</button></li>
              <li><button onClick={() => { setProducts(MOCK_PRODUCTS); handleNavigate('products', { category: 'Sports & Fitness' }); }} className="hover:text-[#1E88E5] cursor-pointer">Sports & Gym Gear</button></li>
            </ul>
          </div>

          {/* Policy & Support Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-gray-800 text-[10px] tracking-wider">Resources & Legal</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => handleNavigate('faq')} className="hover:text-[#1E88E5] cursor-pointer">FAQ Helpdesk</button></li>
              <li><button onClick={() => handleNavigate('terms')} className="hover:text-[#1E88E5] cursor-pointer">Terms & Conditions</button></li>
              <li><button onClick={() => handleNavigate('privacy')} className="hover:text-[#1E88E5] cursor-pointer">Privacy Security Policy</button></li>
              <li><button onClick={() => handleNavigate('returns')} className="hover:text-[#1E88E5] cursor-pointer">Return & Exchange policy</button></li>
              <li><button onClick={() => handleNavigate('shipping')} className="hover:text-[#1E88E5] cursor-pointer">Shipping Information</button></li>
            </ul>
          </div>

          {/* Support Information Column */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-gray-800 text-[10px] tracking-wider">Enterprise Inbound Support</h4>
            <p className="leading-relaxed">
              Have questions regarding vendor payouts, bulk supply logistics or catalog moderation? Submit an inquiry ticket to our help desk.
            </p>
            <button
              onClick={() => handleNavigate('contact')}
              className="bg-gray-100 hover:bg-[#0F4C81] hover:text-white text-gray-700 font-bold px-4 py-2 rounded text-center block w-full transition cursor-pointer"
            >
              Open Support Help Desk
            </button>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="bg-gray-50 py-4 border-t border-gray-100 text-center text-[10px] text-gray-400 font-medium">
          <p>© 2026 DXMARKET Inc. All Rights Reserved. Manufactured and certified in modern cloud native containers.</p>
        </div>
      </footer>
    </div>
  );
}
