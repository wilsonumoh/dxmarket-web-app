import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Users, Store, Truck, ShoppingBag, Percent, AlertCircle, 
  Settings, Server, ToggleLeft, ToggleRight, ListCollapse, Database, RefreshCw, KeyRound, Terminal,
  Edit, Trash, Plus, Check, X, Bell, DollarSign, Sparkles, Menu
} from 'lucide-react';
import { Product, MerchantStore, Supplier, Order, AuditLog, SystemConfig, User, UserRole } from '../types';
import CMSDashboard from './CMSDashboard';
import MenuManager from './admin/MenuManager';
import ContentManager from './admin/ContentManager';

interface AdminPortalsProps {
  role: 'admin' | 'superadmin';
  onNavigate: (view: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  merchants: MerchantStore[];
  setMerchants: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  formatPrice?: (usdAmount: number) => string;
}

export default function AdminPortals({
  role,
  onNavigate,
  products,
  setProducts,
  merchants,
  setMerchants,
  suppliers,
  setSuppliers,
  orders,
  setOrders,
  auditLogs,
  setAuditLogs,
  systemConfig,
  setSystemConfig,
  formatPrice,
}: AdminPortalsProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [siteContentTab, setSiteContentTab] = useState<'hero' | 'menu'>('hero');

  // Format helper
  const format = formatPrice || ((usd: number) => `$${usd.toFixed(2)}`);

  // Interactive configurations
  const [commissionRate, setCommissionRate] = useState(systemConfig.commissionRate);
  const [maintenanceMode, setMaintenanceMode] = useState(systemConfig.maintenanceMode);
  const [allowRegistration, setAllowRegistration] = useState(systemConfig.allowSelfRegistration);

  // Security Firewall
  const [blockedIPs, setBlockedIPs] = useState<string[]>(['198.51.100.12', '203.0.113.44']);
  const [newIPToBlock, setNewIPToBlock] = useState('');

  // FCM / Alerts manager state
  const [sentNotifications, setSentNotifications] = useState([
    { id: 'not-1', title: 'Weekend Mega Sale!', message: 'Get 10% off using coupon APEX10 across selected merchants.', target: 'All', time: '2026-06-26 15:30' },
    { id: 'not-2', title: 'System Maintenance Alert', message: 'The marketplace will undergo routine core server upgrades on Sunday at 2 AM UTC.', target: 'Merchants Only', time: '2026-06-25 09:12' }
  ]);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMessage, setNewNotifMessage] = useState('');
  const [newNotifTarget, setNewNotifTarget] = useState('All');

  // Transaction Ledger state
  const [transactions, setTransactions] = useState([
    { id: 'txn-101', type: 'Payout', amount: 840.50, merchant: 'ApexTech Solutions', status: 'Settled', date: '2026-06-26 14:00' },
    { id: 'txn-102', type: 'Escrow Lock', amount: 499.99, customer: 'Sarah Jenkins', status: 'Held', date: '2026-06-26 12:45' },
    { id: 'txn-103', type: 'Settlement Payout', amount: 3200.00, merchant: 'Vogue Essentials', status: 'Settled', date: '2026-06-25 10:30' },
    { id: 'txn-104', type: 'Escrow Lock', amount: 220.00, customer: 'Michael Chen', status: 'Refunded', date: '2026-06-24 16:15' }
  ]);
  const [newTxnAmount, setNewTxnAmount] = useState('');
  const [newTxnType, setNewTxnType] = useState('Payout');
  const [newTxnParty, setNewTxnParty] = useState('ApexTech Solutions');

  // Categories management
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // User list simulation
  const [users, setUsers] = useState<User[]>([
    { id: 'u-1', name: 'Wilson Umoh', email: 'wilson.umoh@gmail.com', role: 'superadmin', joinedDate: '2026-06-25' },
    { id: 'u-2', name: 'Alex Mercer', email: 'alex@apextech.com', role: 'merchant', joinedDate: '2026-05-12' },
    { id: 'u-3', name: 'Sophia Lin', email: 'sophia@vogueessentials.com', role: 'merchant', joinedDate: '2026-04-18' },
    { id: 'u-4', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'customer', joinedDate: '2026-06-15' },
    { id: 'u-5', name: 'Elena Rostova', email: 'elena@greenlogistics.org', role: 'supplier', joinedDate: '2026-06-22' },
    { id: 'u-6', name: 'Marcus Vance', email: 'marcus@salescorp.com', role: 'sales', joinedDate: '2026-06-20' },
    { id: 'u-7', name: 'Chinedu Okafor', email: 'chinedu.o@logistics.ng', role: 'delivery_agent', joinedDate: '2026-06-01' },
    { id: 'u-8', name: 'Amara Kone', email: 'amara.support@dxmarket.com', role: 'support_agent', joinedDate: '2026-06-10' }
  ]);
  const [suspendedUsers, setSuspendedUsers] = useState<string[]>([]);

  // Menu, banners and general configuration edits
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuView, setNewMenuView] = useState('products');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('');
  const [newBannerBtnText, setNewBannerBtnText] = useState('');
  const [newBannerBtnView, setNewBannerBtnView] = useState('products');

  // Product edits
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductForm, setEditProductForm] = useState({
    title: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    category: '',
    brand: '',
    description: ''
  });

  // Telemetry
  const [telemetry, setTelemetry] = useState({
    cpuLoad: '14.2%',
    memoryUsed: '2.4 GB / 8.0 GB',
    dbLatency: '1.2ms',
    activeSockets: 48,
    lastBackup: '2026-06-27 00:00:00 UTC'
  });

  const triggerHealthSync = () => {
    setTelemetry({
      cpuLoad: `${(Math.random() * 20 + 5).toFixed(1)}%`,
      memoryUsed: `${(Math.random() * 1.5 + 1.8).toFixed(1)} GB / 8.0 GB`,
      dbLatency: `${(Math.random() * 2 + 0.5).toFixed(1)}ms`,
      activeSockets: Math.floor(Math.random() * 20 + 35),
      lastBackup: 'Synced Just Now'
    });
    alert('System metrics successfully refreshed.');
  };

  const handleBlockIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIPToBlock) return;
    setBlockedIPs(prev => [...prev, newIPToBlock]);
    
    const newAudit: AuditLog = {
      id: `log-${Date.now()}`,
      userId: 'admin-1',
      userName: 'Wilson Umoh (Super Admin)',
      userRole: 'superadmin',
      action: `Blocked hostile IP address ${newIPToBlock} via firewall settings`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.55',
      status: 'Success'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    setNewIPToBlock('');
  };

  const handleApproveMerchant = (merchantId: string) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === merchantId) {
        return { ...m, isApproved: true };
      }
      return m;
    }));

    setProducts(prev => prev.map(p => {
      if (p.merchantId === merchantId) {
        return { ...p, isApproved: true };
      }
      return p;
    }));
    
    const newAudit: AuditLog = {
      id: `log-${Date.now()}`,
      userId: 'admin-2',
      userName: 'Marcus (Admin)',
      userRole: 'admin',
      action: `Approved Merchant Storefront registration: ${merchants.find(m => m.id === merchantId)?.name}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.58',
      status: 'Success'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    alert('Merchant store approved! All associated products activated in public storefront.');
  };

  const handleUpdateCommission = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemConfig(prev => ({ ...prev, commissionRate }));
    
    const newAudit: AuditLog = {
      id: `log-${Date.now()}`,
      userId: 'admin-1',
      userName: 'Wilson Umoh (Super Admin)',
      userRole: 'superadmin',
      action: `Updated platform commission rate to ${commissionRate}%`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.55',
      status: 'Success'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    alert('Platform global commission rate successfully modified.');
  };

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    setSystemConfig(prev => ({ ...prev, maintenanceMode: next }));
    
    const newAudit: AuditLog = {
      id: `log-${Date.now()}`,
      userId: 'admin-1',
      userName: 'Wilson Umoh (Super Admin)',
      userRole: 'superadmin',
      action: `Toggled maintenance mode status to ${next ? 'ACTIVE' : 'INACTIVE'}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.55',
      status: 'Success'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    alert(`Maintenance Mode toggled to: ${next ? 'ENABLED' : 'DISABLED'}`);
  };

  // CATEGORY OPERATIONS
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (systemConfig.categories.includes(newCategoryName)) {
      alert('Category already exists!');
      return;
    }
    setSystemConfig(prev => ({
      ...prev,
      categories: [...prev.categories, newCategoryName.trim()]
    }));
    setNewCategoryName('');
    alert('Category successfully added!');
  };

  const handleUpdateCategory = (oldName: string) => {
    if (!categoryInput.trim()) return;
    if (systemConfig.categories.includes(categoryInput) && categoryInput !== oldName) {
      alert('Category already exists!');
      return;
    }
    setSystemConfig(prev => ({
      ...prev,
      categories: prev.categories.map(c => c === oldName ? categoryInput.trim() : c)
    }));
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: categoryInput.trim() } : p));
    setEditingCategory(null);
    setCategoryInput('');
    alert('Category successfully renamed!');
  };

  const handleDeleteCategory = (catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"? Associated products will remain but lose their classification.`)) {
      setSystemConfig(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== catName)
      }));
      alert('Category removed.');
    }
  };

  // PRODUCT EDIT OPERATIONS
  const startEditingProduct = (p: Product) => {
    setEditingProduct(p);
    setEditProductForm({
      title: p.title,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      category: p.category,
      brand: p.brand,
      description: p.description
    });
  };

  const saveProductEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          title: editProductForm.title,
          price: Number(editProductForm.price),
          originalPrice: Number(editProductForm.originalPrice),
          stock: Number(editProductForm.stock),
          category: editProductForm.category,
          brand: editProductForm.brand,
          description: editProductForm.description
        };
      }
      return p;
    }));

    setEditingProduct(null);
    alert('Product details successfully updated.');
  };

  const deleteProduct = (pId: string) => {
    if (confirm('Are you sure you want to delete this product from catalog?')) {
      setProducts(prev => prev.filter(p => p.id !== pId));
      alert('Product permanently removed.');
    }
  };

  // USER MANAGEMENT OPERATIONS
  const handleUpdateUserRole = (uId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === uId ? { ...u, role: newRole } : u));
    alert('User role updated successfully.');
  };

  const toggleUserSuspension = (uId: string) => {
    if (suspendedUsers.includes(uId)) {
      setSuspendedUsers(prev => prev.filter(id => id !== uId));
      alert('User access fully restored.');
    } else {
      setSuspendedUsers(prev => [...prev, uId]);
      alert('User has been suspended. They will be locked out of terminal actions.');
    }
  };

  const deleteUser = (uId: string) => {
    if (confirm('Are you sure you want to permanently delete this user account?')) {
      setUsers(prev => prev.filter(u => u.id !== uId));
      alert('User deleted.');
    }
  };

  // FCM NOTIFICATION CHANNELS
  const handleDispatchNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle || !newNotifMessage) return;

    const newAlert = {
      id: `not-${Date.now()}`,
      title: newNotifTitle,
      message: newNotifMessage,
      target: newNotifTarget,
      time: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setSentNotifications(prev => [newAlert, ...prev]);
    setNewNotifTitle('');
    setNewNotifMessage('');
    alert(`Success! Broadcast dispatched via FCM to target group: ${newNotifTarget}`);
  };

  // TRANSACTION LOGS & ESCROW CONTROL
  const handleCreateTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxnAmount) return;

    const newTx = {
      id: `txn-${Date.now()}`,
      type: newTxnType,
      amount: Number(newTxnAmount),
      merchant: newTxnType === 'Payout' ? newTxnParty : undefined,
      customer: newTxnType === 'Escrow Lock' ? newTxnParty : undefined,
      status: 'Settled',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setTransactions(prev => [newTx, ...prev]);
    setNewTxnAmount('');
    alert(`Ledger transaction logged: ${newTxnType} of ${format(Number(newTxnAmount))}`);
  };

  const toggleEscrow = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Toggle simulated escrow locked state
        const current = o.trackingSteps?.some(s => s.status === 'Escrow Funds Disbursed');
        const updatedSteps = current 
          ? (o.trackingSteps || []).filter(s => s.status !== 'Escrow Funds Disbursed')
          : [...(o.trackingSteps || []), { status: 'Escrow Funds Disbursed', date: new Date().toISOString().split('T')[0], location: 'Central Clearing', description: 'Escrow funds officially cleared and disbursed to Merchant Wallet.' }];
        
        return {
          ...o,
          trackingSteps: updatedSteps
        };
      }
      return o;
    }));
    alert('Escrow disbursement status adjusted for this order.');
  };

  // APP MENU & BANNER CONTROLS
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel.trim()) return;
    setSystemConfig(prev => ({
      ...prev,
      appMenu: [...prev.appMenu, { label: newMenuLabel.trim(), view: newMenuView }]
    }));
    setNewMenuLabel('');
    alert('Custom menu item published.');
  };

  const handleRemoveMenuItem = (label: string) => {
    setSystemConfig(prev => ({
      ...prev,
      appMenu: prev.appMenu.filter(item => item.label !== label)
    }));
    alert('Menu item removed.');
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImageUrl) return;
    setSystemConfig(prev => ({
      ...prev,
      heroBanners: [...prev.heroBanners, {
        title: newBannerTitle,
        subtitle: newBannerSubtitle,
        imageUrl: newBannerImageUrl,
        buttonText: newBannerBtnText || 'Shop Now',
        buttonView: newBannerBtnView
      }]
    }));
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImageUrl('');
    setNewBannerBtnText('');
    alert('New hero promotional banner created.');
  };

  const handleRemoveBanner = (index: number) => {
    setSystemConfig(prev => ({
      ...prev,
      heroBanners: prev.heroBanners.filter((_, idx) => idx !== index)
    }));
    alert('Hero banner removed.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="admin-portals-layout">
      {/* Admin navigation sidebar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 h-fit space-y-1">
        <p className="px-3 py-1.5 text-[10px] uppercase font-black text-[#0F4C81] tracking-wider">
          {role === 'admin' ? 'Platform Administrator' : 'Platform Super Admin'}
        </p>

        {/* ADMIN COMMONS */}
        {[
          { id: 'dashboard', label: 'Admin Dashboard', icon: <Server className="w-4 h-4" /> },
          { id: 'merchant-approvals', label: 'Merchant Approvals', icon: <Store className="w-4 h-4" /> },
          { id: 'product-moderation', label: 'Catalog & Products', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'commission-manager', label: 'Commission Settings', icon: <Percent className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-slate-50 text-[#0F4C81] border border-slate-200/60' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}

        {/* PLATFORM OPERATIONS */}
        <p className="px-3 py-1.5 text-[10px] uppercase font-black text-slate-400 tracking-wider pt-4">Platform Operations</p>
        {[
          { id: 'app-content', label: 'App Content & Layout', icon: <Settings className="w-4 h-4" /> },
          { id: 'site-content', label: 'Site Content', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
          { id: 'catalog-categories', label: 'Manage Categories', icon: <ListCollapse className="w-4 h-4" /> },
          { id: 'user-directory', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
          { id: 'transactions', label: 'Ledger & Escrow', icon: <Database className="w-4 h-4" /> },
          { id: 'notifications', label: 'FCM Alerts Broadcast', icon: <Bell className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-slate-50 text-[#0F4C81] border border-slate-200/60' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}

        {/* SUPER ADMIN SPECIFIC CONTROLS */}
        {role === 'superadmin' && (
          <>
            <p className="px-3 py-1.5 text-[10px] uppercase font-black text-rose-500 tracking-wider pt-4">Core Systems</p>
            {[
              { id: 'platform-config', label: 'System Configurations', icon: <Settings className="w-4 h-4" /> },
              { id: 'security-center', label: 'Security Firewall', icon: <KeyRound className="w-4 h-4" /> },
              { id: 'audit-logs', label: 'System Audit Logs', icon: <Terminal className="w-4 h-4" /> },
              { id: 'health-monitoring', label: 'Server Telemetry', icon: <Database className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded cursor-pointer transition ${activeTab === tab.id ? 'bg-rose-50/50 text-rose-700 border border-rose-100/60' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Dynamic content rendering column */}
      <div className="lg:col-span-3 space-y-6">

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6" id="admin-dashboard">
            <div className="bg-[#0F4C81] text-white p-6 rounded-xl">
              <h2 className="text-base font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Central Management Terminal</span>
              </h2>
              <p className="text-xs text-blue-100 mt-1">Control active merchants, verify supplier integrations, set commission margins, configure custom animations, and secure endpoints.</p>
            </div>

            {/* Quick stats totals */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-500">
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <span className="font-bold uppercase text-[10px] block text-slate-400">Global Sales Gross</span>
                <p className="text-xl font-black text-[#0F4C81]">{format(14580.00)}</p>
              </div>
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <span className="font-bold uppercase text-[10px] block text-slate-400">Active Vendors</span>
                <p className="text-xl font-black text-slate-800">{merchants.length} Stores</p>
              </div>
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <span className="font-bold uppercase text-[10px] block text-slate-400">Global Orders Volume</span>
                <p className="text-xl font-black text-slate-800">{orders.length} Placed</p>
              </div>
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-1 shadow-sm">
                <span className="font-bold uppercase text-[10px] block text-slate-400">Commission Fee</span>
                <p className="text-xl font-black text-emerald-600">{systemConfig.commissionRate}% rate</p>
              </div>
            </div>

            {/* Approvals warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Pending Vendor Approval Requests</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {merchants.filter(m => !m.isApproved).length > 0 ? (
                    merchants.filter(m => !m.isApproved).map((m) => (
                      <div key={m.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{m.name}</p>
                          <p className="text-[10px] text-slate-400">Owner: {m.ownerName} | Joined: {m.joinedDate}</p>
                        </div>
                        <button
                          onClick={() => handleApproveMerchant(m.id)}
                          className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                        >
                          Approve Store
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">All vendor registrations have been certified.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Active Categories Overview</h3>
                <div className="flex flex-wrap gap-2">
                  {systemConfig.categories.map((c) => (
                    <span key={c} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MERCHANT APPROVALS */}
        {activeTab === 'merchant-approvals' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4" id="merchant-moderation">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Merchant Registration Compliance</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {merchants.map((m) => (
                <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800">{m.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${m.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {m.isApproved ? 'Approved & Live' : 'Pending Verification'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px]">Owner: {m.ownerName} ({m.ownerEmail}) | Products: {m.productsCount} | Escrow Balance: {format(m.balance)}</p>
                    <p className="text-gray-600 mt-1 italic">"{m.description}"</p>
                  </div>
                  {!m.isApproved && (
                    <button
                      onClick={() => handleApproveMerchant(m.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-xs self-start sm:self-auto cursor-pointer"
                    >
                      Authorize Store
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CATALOG & PRODUCT DETAILS MODERATION */}
        {activeTab === 'product-moderation' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6" id="product-moderation-suite">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900">Platform Product Catalog Moderation</h3>
              <p className="text-xs text-gray-400">{products.length} Products listed</p>
            </div>

            {editingProduct && (
              <form onSubmit={saveProductEdits} className="bg-slate-50 p-4 border rounded-xl space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Edit className="w-4 h-4 text-[#0F4C81]" />
                    Edit Product Details: {editingProduct.title}
                  </span>
                  <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Product Title</label>
                    <input
                      type="text"
                      required
                      value={editProductForm.title}
                      onChange={e => setEditProductForm({...editProductForm, title: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Category</label>
                    <select
                      value={editProductForm.category}
                      onChange={e => setEditProductForm({...editProductForm, category: e.target.value})}
                      className="w-full p-2 border bg-white rounded"
                    >
                      {systemConfig.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Price (USD Base Value)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editProductForm.price}
                      onChange={e => setEditProductForm({...editProductForm, price: Number(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Original MSRP Price (USD)</label>
                    <input
                      type="number"
                      step="any"
                      value={editProductForm.originalPrice}
                      onChange={e => setEditProductForm({...editProductForm, originalPrice: Number(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Physical Stock Inventory</label>
                    <input
                      type="number"
                      required
                      value={editProductForm.stock}
                      onChange={e => setEditProductForm({...editProductForm, stock: Number(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Brand Name</label>
                    <input
                      type="text"
                      required
                      value={editProductForm.brand}
                      onChange={e => setEditProductForm({...editProductForm, brand: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500">Description Overview</label>
                  <textarea
                    rows={3}
                    value={editProductForm.description}
                    onChange={e => setEditProductForm({...editProductForm, description: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0F4C81] text-white rounded font-bold hover:bg-[#1E88E5]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-slate-100 text-xs">
              {products.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded" />
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-gray-400">
                        Merchant: <span className="text-gray-600 font-medium">{p.merchantName}</span> | 
                        Category: <span className="text-gray-600 font-medium">{p.category}</span> | 
                        Price: <span className="text-[#0F4C81] font-bold">{format(p.price)}</span> | 
                        Stock: <span className="font-mono">{p.stock}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => startEditingProduct(p)}
                      className="p-1 text-gray-500 hover:text-blue-600 border border-transparent hover:border-gray-200 rounded"
                      title="Edit details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1 text-gray-500 hover:text-rose-600 border border-transparent hover:border-gray-200 rounded"
                      title="Delete Product"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: COMMISSION SETTINGS */}
        {activeTab === 'commission-manager' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4" id="commission-manager">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">Global Commission Engine</h3>
            <form onSubmit={handleUpdateCommission} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Standard Platform Margin Fee (%)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="px-2.5 py-1.5 border border-gray-300 rounded w-28"
                  />
                  <button type="submit" className="bg-[#0F4C81] text-white px-4 py-1.5 rounded font-bold hover:bg-[#1E88E5]">
                    Apply Changes
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">This commission percentage is automatically withheld from payments during escrow release and credited to the super admin treasury.</p>
              </div>
            </form>
          </div>
        )}

        {/* TAB: APP CONTENT & LAYOUT MANAGEMENT */}
        {activeTab === 'app-content' && (
          <CMSDashboard
            systemConfig={systemConfig}
            setSystemConfig={setSystemConfig}
            products={products}
            setProducts={setProducts}
            formatPrice={format}
          />
        )}

        {/* TAB: SITE CONTENT */}
        {activeTab === 'site-content' && (
          <div className="space-y-6">
            {/* Toggle tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-md">
              <button
                type="button"
                onClick={() => setSiteContentTab('hero')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  siteContentTab === 'hero'
                    ? 'bg-white text-[#0F4C81] shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Homepage Hero Config</span>
              </button>
              <button
                type="button"
                onClick={() => setSiteContentTab('menu')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  siteContentTab === 'menu'
                    ? 'bg-white text-[#0F4C81] shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Menu className="w-4 h-4 text-[#0F4C81]" />
                <span>Navigation Menu Manager</span>
              </button>
            </div>

            {siteContentTab === 'hero' ? (
              <ContentManager
                systemConfig={systemConfig}
                setSystemConfig={setSystemConfig}
              />
            ) : (
              <MenuManager
                systemConfig={systemConfig}
                setSystemConfig={setSystemConfig}
              />
            )}
          </div>
        )}

        {/* TAB: CATEGORIES MANAGEMENT */}
        {activeTab === 'catalog-categories' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6" id="catalog-categories-manager">
            <div className="border-b pb-2 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-[#0F4C81]">Manage Product Classification Categories</h3>
              <span className="text-xs text-gray-400 font-mono">{systemConfig.categories.length} Active Categories</span>
            </div>

            <form onSubmit={handleAddCategory} className="bg-slate-50 p-4 border rounded-xl space-y-3 text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Register New Marketplace Category
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries & Household"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  className="flex-1 p-2 border bg-white rounded"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-bold">
                  Add Category
                </button>
              </div>
            </form>

            <div className="divide-y divide-slate-100 text-xs">
              {systemConfig.categories.map((cat) => (
                <div key={cat} className="py-3 flex justify-between items-center gap-4">
                  {editingCategory === cat ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={e => setCategoryInput(e.target.value)}
                        className="flex-1 p-1 border rounded bg-white text-xs"
                      />
                      <button onClick={() => handleUpdateCategory(cat)} className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingCategory(null)} className="border border-gray-300 p-1 rounded text-gray-500 hover:bg-gray-100">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-bold text-slate-800">{cat}</p>
                        <p className="text-[10px] text-gray-400">{products.filter(p => p.category === cat).length} Products mapped to this</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingCategory(cat); setCategoryInput(cat); }}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:border-gray-200 border border-transparent rounded"
                          title="Rename Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1 text-gray-500 hover:text-rose-600 hover:border-gray-200 border border-transparent rounded"
                          title="Delete Category"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: USER DIRECTORY ROLE & ACCESS CONTROL */}
        {activeTab === 'user-directory' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4" id="user-directory-panel">
            <h3 className="font-extrabold text-sm text-[#0F4C81] border-b pb-2">Platform User Accounts Registry</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {users.map((u) => {
                const isSuspended = suspendedUsers.includes(u.id);
                return (
                  <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{u.name}</span>
                        {isSuspended && (
                          <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Suspended</span>
                        )}
                        {u.role === 'superadmin' && (
                          <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Super Admin Owner</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400">Email: {u.email} | Registered: {u.joinedDate}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400">Role:</span>
                        <select
                          value={u.role}
                          disabled={u.id === 'u-1'} // Block demoting the main owner simulator account
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="p-1 border bg-white rounded text-[11px]"
                        >
                          <option value="superadmin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="merchant">Merchant Owner</option>
                          <option value="supplier">Logistics Supplier</option>
                          <option value="sales">Sales Agent</option>
                          <option value="customer">Customer Buyer</option>
                          <option value="delivery_agent">Delivery Courier</option>
                          <option value="support_agent">Support Desk Rep</option>
                        </select>
                      </div>

                      <button
                        onClick={() => toggleUserSuspension(u.id)}
                        disabled={u.id === 'u-1'}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border ${isSuspended ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50' : 'border-rose-300 text-rose-500 hover:bg-rose-50'}`}
                      >
                        {isSuspended ? 'Restore Access' : 'Suspend Account'}
                      </button>

                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={u.id === 'u-1'}
                        className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                        title="Delete User permanently"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: LEDGER PAYOUTS & ESCROW TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6" id="transactions-log-terminal">
            {/* Escrow Locks list */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0F4C81] border-b pb-2">Active Order Escrow Locks & Settlements</h3>
              <div className="divide-y divide-slate-100 text-xs text-gray-600">
                {orders.map((o) => {
                  const hasDisbursed = o.trackingSteps?.some(s => s.status === 'Escrow Funds Disbursed');
                  return (
                    <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-bold text-slate-800">Order #{o.id}</p>
                        <p className="text-[10px] text-gray-400">Buyer: {o.customerName} | Total Price: <span className="text-emerald-600 font-bold">{format(o.total)}</span> | Shipping Stage: {o.status}</p>
                        <p className="text-[10px] text-[#0F4C81] font-semibold">
                          Escrow Status: <span className={hasDisbursed ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{hasDisbursed ? 'Disbursed to Merchant Store Wallet' : 'Locked (Escrow Protection Active)'}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleEscrow(o.id)}
                        className={`px-3 py-1 rounded text-xs font-bold cursor-pointer text-white transition ${hasDisbursed ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      >
                        {hasDisbursed ? 'Re-lock Funds' : 'Release Escrow Payout'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Ledger Logging form */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0F4C81] border-b pb-2">Manual Ledger Payout & Fund Settlements</h3>
              <form onSubmit={handleCreateTxn} className="bg-slate-50 p-4 border rounded-xl space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Transaction Category</label>
                    <select
                      value={newTxnType}
                      onChange={e => setNewTxnType(e.target.value)}
                      className="w-full p-2 border bg-white rounded"
                    >
                      <option value="Payout">Merchant Payout Settlement</option>
                      <option value="Escrow Lock">Simulate Escrow Deposit</option>
                      <option value="Refund">Inbound refund return</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Beneficiary / Destination Partner</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ApexTech Solutions"
                      value={newTxnParty}
                      onChange={e => setNewTxnParty(e.target.value)}
                      className="w-full p-2 border bg-white rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Amount (USD Base Price)</label>
                    <input
                      type="number"
                      required
                      placeholder="Amount"
                      value={newTxnAmount}
                      onChange={e => setNewTxnAmount(e.target.value)}
                      className="w-full p-2 border bg-white rounded"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white py-2 rounded font-bold">
                  Log Ledger Transaction Note
                </button>
              </form>

              {/* Transactions logs table */}
              <div className="divide-y divide-slate-100 text-xs">
                {transactions.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex justify-between items-center text-gray-600">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{tx.type}</span>
                        <span className="text-[9px] text-gray-400 font-mono">{tx.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Party: {tx.merchant || tx.customer || 'External Platform Partner'} | Date: {tx.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 block">{format(tx.amount)}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded text-[8px] font-bold">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: FCM ALERTS BROADCAST */}
        {activeTab === 'notifications' && (
          <div className="space-y-6" id="fcm-broadcast-center">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0F4C81] border-b pb-2 flex items-center gap-1.5">
                <Bell className="w-5 h-5 text-amber-500" />
                Dispatch FCM Global Push Broadcast
              </h3>
              <form onSubmit={handleDispatchNotification} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Alert Title / Heading</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flash Sale Live! ⚡"
                      value={newNotifTitle}
                      onChange={e => setNewNotifTitle(e.target.value)}
                      className="w-full p-2 border rounded bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Target Audience Channel</label>
                    <select
                      value={newNotifTarget}
                      onChange={e => setNewNotifTarget(e.target.value)}
                      className="w-full p-2 border bg-white rounded"
                    >
                      <option value="All">All Marketplace Users (B2B & B2C)</option>
                      <option value="Customers Only">Registered Customers Only</option>
                      <option value="Merchants Only">Store Merchants Only</option>
                      <option value="Suppliers Only">Suppliers Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500">Message Body Context</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter message details seen in notifications drop panel..."
                    value={newNotifMessage}
                    onChange={e => setNewNotifMessage(e.target.value)}
                    className="w-full p-2 border rounded bg-white"
                  />
                </div>

                <button type="submit" className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white py-2 rounded font-bold">
                  Broadcast Push Notification to Users
                </button>
              </form>
            </div>

            {/* Broadcast Logs */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs border-b pb-2">Broadcast Telemetry History Logs</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {sentNotifications.map((not) => (
                  <div key={not.id} className="py-3 space-y-1 text-gray-600">
                    <div className="flex justify-between items-center">
                      <p className="font-extrabold text-slate-800">{not.title}</p>
                      <span className="bg-blue-100 text-[#0F4C81] px-1.5 py-0.5 rounded text-[8px] font-bold">Channel: {not.target}</span>
                    </div>
                    <p className="leading-relaxed">{not.message}</p>
                    <p className="text-[10px] text-gray-400 font-mono">Dispatched: {not.time} | Telemetry State: SENT SUCCESSFUL</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SYSTEM CONFIGURATIONS */}
        {activeTab === 'platform-config' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6" id="superadmin-configurations">
            <h3 className="font-extrabold text-sm text-[#0F4C81] border-b border-gray-100 pb-2">Platform System Properties</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
              {/* Maintenance Toggle */}
              <div className="bg-slate-50 border rounded-xl p-4 space-y-4 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-slate-800">Platform Global Maintenance Lockout</p>
                  <p className="text-[10px] text-gray-400 mt-1">If enabled, locks public visitors out with a clean 'System Upgrading' cover.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                  <span className="font-bold text-slate-600">Active Status</span>
                  <button onClick={handleToggleMaintenance}>
                    {maintenanceMode ? (
                      <ToggleRight className="w-10 h-10 text-[#0F4C81]" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Registration toggler */}
              <div className="bg-slate-50 border rounded-xl p-4 space-y-4 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-slate-800">Dynamic User Registration Switch</p>
                  <p className="text-[10px] text-gray-400 mt-1">Enables self-signups for new customer accounts immediately.</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                  <span className="font-bold text-slate-600">Active Status</span>
                  <button onClick={() => {
                    const next = !allowRegistration;
                    setAllowRegistration(next);
                    setSystemConfig(prev => ({ ...prev, allowSelfRegistration: next }));
                  }}>
                    {allowRegistration ? (
                      <ToggleRight className="w-10 h-10 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 text-xs text-gray-500">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Core Virtual Container Context</h3>
              <p>Platform Host ID: <code className="bg-gray-100 px-1 rounded font-bold text-gray-800">DXMARKET_ENTERPRISE_PROD_1</code></p>
              <p>Node.js Runtime: <code className="bg-gray-100 px-1 rounded font-bold text-gray-800">v22.14.0</code></p>
              <p>Core Ingress Binding: <code className="bg-gray-100 px-1 rounded font-bold text-gray-800">Port 3000</code></p>
              <p>Database Status: <code className="bg-gray-100 px-1 rounded font-bold text-emerald-600">ACTIVE FIREBASE CLOUD</code></p>
            </div>
          </div>
        )}

        {/* TAB: SECURITY CENTER */}
        {activeTab === 'security-center' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="superadmin-security">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-rose-700 border-b border-gray-100 pb-2">IP Blocklist Firewall</h3>
              <form onSubmit={handleBlockIP} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Block IPv4 Address</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="198.51.100.12"
                      value={newIPToBlock}
                      onChange={(e) => setNewIPToBlock(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white"
                    />
                    <button type="submit" className="bg-rose-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-rose-700">
                      Block IP
                    </button>
                  </div>
                </div>
              </form>

              <div className="divide-y divide-gray-100 text-xs text-gray-700">
                {blockedIPs.map((ip) => (
                  <div key={ip} className="py-2 flex justify-between items-center">
                    <span className="font-mono">{ip}</span>
                    <button
                      onClick={() => setBlockedIPs(blockedIPs.filter(item => item !== ip))}
                      className="text-gray-400 hover:text-emerald-600 text-[10px] font-bold"
                    >
                      Authorize IP
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 text-xs text-gray-600">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Two-Factor Encryption Policies</h3>
              <p>Platform Multi-factor requirement: <span className="text-emerald-600 font-bold">MANDATORY FOR ALL VENDORS & ADMINS</span></p>
              <p>Hash Encryption Protocol: <span className="font-mono">SHA-256</span></p>
              <p>Session Expire Limit: <span className="font-mono">15 Minutes idle</span></p>
            </div>
          </div>
        )}

        {/* TAB: AUDIT LOGS */}
        {activeTab === 'audit-logs' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4" id="superadmin-audit-logs">
            <h3 className="font-extrabold text-sm text-rose-700 border-b border-gray-100 pb-2">Platform Master Audit Logs</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-extrabold text-gray-800">{log.action}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-gray-400">User: {log.userName} ({log.userRole}) | IP Address: {log.ipAddress} | Timestamp: {log.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SERVER HEALTH TELEMETRY */}
        {activeTab === 'health-monitoring' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 text-xs text-gray-600" id="superadmin-health">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-extrabold text-sm text-rose-700">Real-Time Infrastructure Telemetry</h3>
              <button
                onClick={triggerHealthSync}
                className="p-1 border border-gray-300 hover:bg-gray-50 rounded cursor-pointer animate-spin-hover"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Container CPU load</span>
                <p className="font-black text-gray-800 font-mono text-sm">{telemetry.cpuLoad}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Allocated RAM Buffer</span>
                <p className="font-black text-gray-800 font-mono text-sm">{telemetry.memoryUsed}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Drizzle DB response</span>
                <p className="font-black text-emerald-600 font-mono text-sm">{telemetry.dbLatency}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Active Websockets</span>
                <p className="font-black text-gray-800 font-mono text-sm">{telemetry.activeSockets} users</p>
              </div>
              <div className="bg-gray-50 p-3 rounded col-span-2 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Logistics Database Backup</span>
                <p className="font-black text-gray-800 font-mono text-sm">{telemetry.lastBackup}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
