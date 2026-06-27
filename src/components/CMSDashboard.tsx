import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Save, RefreshCw, Layout, Image, Menu, Star, Plus, Trash, Edit, 
  Check, X, Eye, Laptop, ShieldCheck, AlertCircle, ShoppingBag, Globe, FileText
} from 'lucide-react';
import { Product, SystemConfig } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebaseClient';

interface CMSDashboardProps {
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  formatPrice: (usdAmount: number) => string;
}

export default function CMSDashboard({
  systemConfig,
  setSystemConfig,
  products,
  setProducts,
  formatPrice,
}: CMSDashboardProps) {
  // Navigation tabs for CMS
  const [cmsTab, setCmsTab] = useState<'hero' | 'menu' | 'featured' | 'brand'>('hero');
  
  // Local state for editing to prevent immediate unsaved database writes
  const [localConfig, setLocalConfig] = useState<SystemConfig>({ ...systemConfig });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local config with systemConfig from parent if systemConfig changes remotely
  useEffect(() => {
    setLocalConfig({ ...systemConfig });
  }, [systemConfig]);

  // Track if there are unsaved local edits
  useEffect(() => {
    const isDifferent = JSON.stringify(localConfig) !== JSON.stringify(systemConfig);
    setHasChanges(isDifferent);
  }, [localConfig, systemConfig]);

  // Form states for adding items
  // Banner Add Form
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerBtnText, setBannerBtnText] = useState('Shop Now');
  const [bannerBtnView, setBannerBtnView] = useState('products');
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);

  // Menu Add Form
  const [menuLabel, setMenuLabel] = useState('');
  const [menuView, setMenuView] = useState('products');
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);

  // Brand Info Edit Forms
  const [platformName, setPlatformName] = useState(localConfig.platformName);
  const [heroTitle, setHeroTitle] = useState(localConfig.heroTitle);
  const [heroDescription, setHeroDescription] = useState(localConfig.heroDescription);
  const [footerNote, setFooterNote] = useState(localConfig.footerNote);

  // Product Search / Filter
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState('All');

  // Load brand states from localConfig
  useEffect(() => {
    setPlatformName(localConfig.platformName);
    setHeroTitle(localConfig.heroTitle);
    setHeroDescription(localConfig.heroDescription);
    setFooterNote(localConfig.footerNote);
  }, [localConfig.platformName, localConfig.heroTitle, localConfig.heroDescription, localConfig.footerNote]);

  // Write changes to Firestore
  const handlePublishChanges = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const docRef = doc(db, 'settings', 'systemConfig');
      
      // Keep featuredProductIds in sync
      const finalConfig = {
        ...localConfig,
        platformName,
        heroTitle,
        heroDescription,
        footerNote,
      };

      await setDoc(docRef, finalConfig);
      
      // Update global parent states
      setSystemConfig(finalConfig);

      // If featuredProductIds changed, update the local products state isFeatured flags
      if (finalConfig.featuredProductIds) {
        setProducts(prevProducts => 
          prevProducts.map(p => ({
            ...p,
            isFeatured: finalConfig.featuredProductIds?.includes(p.id) || false
          }))
        );
      }

      setSaveStatus('success');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (error) {
      console.error('Error publishing configuration: ', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
      
      // Fire formal skill error logger
      try {
        handleFirestoreError(error, OperationType.WRITE, 'settings/systemConfig');
      } catch (innerError) {
        // Log caught
      }
    } finally {
      setIsSaving(false);
    }
  };

  // BANNER OPERATIONS
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImageUrl.trim()) {
      alert('Please provide at least a Title and valid Image URL.');
      return;
    }

    const newBanner = {
      title: bannerTitle,
      subtitle: bannerSubtitle,
      imageUrl: bannerImageUrl,
      buttonText: bannerBtnText || 'Shop Now',
      buttonView: bannerBtnView
    };

    if (editingBannerIndex !== null) {
      // Edit existing
      const updatedBanners = [...localConfig.heroBanners];
      updatedBanners[editingBannerIndex] = newBanner;
      setLocalConfig(prev => ({ ...prev, heroBanners: updatedBanners }));
      setEditingBannerIndex(null);
    } else {
      // Add new
      setLocalConfig(prev => ({
        ...prev,
        heroBanners: [...prev.heroBanners, newBanner]
      }));
    }

    // Reset Form
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImageUrl('');
    setBannerBtnText('Shop Now');
    setBannerBtnView('products');
  };

  const handleStartEditBanner = (index: number) => {
    const b = localConfig.heroBanners[index];
    setBannerTitle(b.title);
    setBannerSubtitle(b.subtitle || '');
    setBannerImageUrl(b.imageUrl);
    setBannerBtnText(b.buttonText);
    setBannerBtnView(b.buttonView);
    setEditingBannerIndex(index);
  };

  const handleRemoveBanner = (index: number) => {
    if (confirm('Are you sure you want to remove this promo banner?')) {
      setLocalConfig(prev => ({
        ...prev,
        heroBanners: prev.heroBanners.filter((_, idx) => idx !== index)
      }));
      if (editingBannerIndex === index) {
        setEditingBannerIndex(null);
        setBannerTitle('');
        setBannerSubtitle('');
        setBannerImageUrl('');
      }
    }
  };

  // MENU OPERATIONS
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuLabel.trim()) return;

    const newItem = { label: menuLabel.trim(), view: menuView };

    if (editingMenuIndex !== null) {
      const updatedMenu = [...localConfig.appMenu];
      updatedMenu[editingMenuIndex] = newItem;
      setLocalConfig(prev => ({ ...prev, appMenu: updatedMenu }));
      setEditingMenuIndex(null);
    } else {
      // Check for duplicate labels
      if (localConfig.appMenu.some(item => item.label.toLowerCase() === menuLabel.trim().toLowerCase())) {
        alert('A menu item with this label already exists.');
        return;
      }
      setLocalConfig(prev => ({
        ...prev,
        appMenu: [...prev.appMenu, newItem]
      }));
    }

    setMenuLabel('');
    setMenuView('products');
  };

  const handleStartEditMenuItem = (index: number) => {
    const item = localConfig.appMenu[index];
    setMenuLabel(item.label);
    setMenuView(item.view);
    setEditingMenuIndex(index);
  };

  const handleRemoveMenuItem = (index: number) => {
    setLocalConfig(prev => ({
      ...prev,
      appMenu: prev.appMenu.filter((_, idx) => idx !== index)
    }));
    if (editingMenuIndex === index) {
      setEditingMenuIndex(null);
      setMenuLabel('');
    }
  };

  // FEATURED PRODUCT OPERATIONS
  const handleToggleFeaturedProduct = (productId: string) => {
    const currentFeatured = localConfig.featuredProductIds || [];
    let updatedFeatured: string[];

    if (currentFeatured.includes(productId)) {
      updatedFeatured = currentFeatured.filter(id => id !== productId);
    } else {
      updatedFeatured = [...currentFeatured, productId];
    }

    setLocalConfig(prev => ({
      ...prev,
      featuredProductIds: updatedFeatured
    }));
  };

  // Re-seed with local MOCK_PRODUCTS isFeatured values if featuredProductIds is empty
  useEffect(() => {
    if (!localConfig.featuredProductIds) {
      const initialFeaturedIds = products.filter(p => p.isFeatured).map(p => p.id);
      setLocalConfig(prev => ({
        ...prev,
        featuredProductIds: initialFeaturedIds
      }));
    }
  }, [products, localConfig.featuredProductIds]);

  // Filter approved products for grid display
  const approvedProducts = products.filter(p => p.isApproved);
  const filteredProducts = approvedProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(prodSearch.toLowerCase()) || 
                          p.brand.toLowerCase().includes(prodSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(prodSearch.toLowerCase());
    const matchesCat = prodCategory === 'All' || p.category === prodCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6" id="dxmarket-cms-layout">
      {/* Top Controls Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-[#0F4C81] rounded-lg">
              <Layout className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Storefront Content Management (CMS)</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Publish brand layouts, custom banners, featured storefront items, and navigation rules globally to Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Change Indicator */}
          {hasChanges ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Local Edits
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Synced with Live Firestore
            </span>
          )}

          <button
            onClick={handlePublishChanges}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition duration-150 cursor-pointer ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      {/* Save Success/Error Toasts */}
      {saveStatus === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300" id="cms-save-success">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-emerald-900">Changes Successfully Published!</p>
            <p className="mt-0.5">The global homepage banners, navigation menu routes, and product lists have been updated in Firestore.</p>
          </div>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300" id="cms-save-error">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-rose-900">Database Publish Failed</p>
            <p className="mt-0.5 font-mono text-[10px] bg-white/60 p-1.5 rounded border border-rose-100 overflow-x-auto">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main CMS Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: CMS Form controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Segment Tabs Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm flex gap-1">
            {[
              { id: 'hero', label: 'Banners & Hero', icon: <Image className="w-4 h-4" /> },
              { id: 'menu', label: 'Menus & Routing', icon: <Menu className="w-4 h-4" /> },
              { id: 'featured', label: 'Featured Grids', icon: <Star className="w-4 h-4" /> },
              { id: 'brand', label: 'Platform & Brand', icon: <Globe className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCmsTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  cmsTab === tab.id 
                    ? 'bg-[#0F4C81] text-white' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[450px]">
            {/* TAB 1: HERO & BANNERS */}
            {cmsTab === 'hero' && (
              <div className="space-y-6" id="cms-hero-tab">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F4C81]">Homepage Hero Promo Banners</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure active image slide carousels for primary cross-border merchant campaign drives.</p>
                </div>

                {/* Banner list cards */}
                <div className="space-y-3">
                  {localConfig.heroBanners.length === 0 ? (
                    <div className="border border-dashed p-6 text-center text-xs text-gray-400 rounded-xl bg-slate-50/50">
                      No promo banners configured. Add one below.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {localConfig.heroBanners.map((banner, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex gap-3 items-center text-xs">
                          <img src={banner.imageUrl} alt={banner.title} className="w-16 h-12 rounded object-cover flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <p className="font-extrabold text-slate-800 truncate">{banner.title}</p>
                            <p className="text-gray-500 truncate text-[11px]">{banner.subtitle}</p>
                            <span className="inline-block mt-1 bg-blue-100 text-[#0F4C81] px-1.5 py-0.5 rounded text-[9px] font-black">
                              Action: {banner.buttonText} → View: {banner.buttonView}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleStartEditBanner(idx)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Banner"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveBanner(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Banner"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add / Edit Form */}
                <form onSubmit={handleAddBanner} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <p className="font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {editingBannerIndex !== null ? `Edit Banner #${editingBannerIndex + 1}` : 'Create New Banner'}
                    </p>
                    {editingBannerIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBannerIndex(null);
                          setBannerTitle('');
                          setBannerSubtitle('');
                          setBannerImageUrl('');
                        }}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Banner Header Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Premium Tech Supplies"
                        value={bannerTitle}
                        onChange={e => setBannerTitle(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Banner Subtitle / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Free shipping on selected freight routers"
                        value={bannerSubtitle}
                        onChange={e => setBannerSubtitle(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-gray-500">Banner Image URL</label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={bannerImageUrl}
                        onChange={e => setBannerImageUrl(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Call-To-Action Button Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Shop Now"
                        value={bannerBtnText}
                        onChange={e => setBannerBtnText(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Button View Link Target</label>
                      <select
                        value={bannerBtnView}
                        onChange={e => setBannerBtnView(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg"
                      >
                        <option value="products">Catalog Products</option>
                        <option value="merchant-stores">Store Directory</option>
                        <option value="blog">Market Blogs</option>
                        <option value="faq">FAQs Helpdesk</option>
                        <option value="about">Our Story</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F4C81] text-white p-2 rounded-lg font-bold hover:bg-[#1C5D94] transition-colors cursor-pointer mt-2"
                  >
                    {editingBannerIndex !== null ? 'Save Banner Edits' : 'Add Promo Banner to List'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: MENU CONFIGURATION */}
            {cmsTab === 'menu' && (
              <div className="space-y-6" id="cms-menu-tab">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F4C81]">Global Navigation Header Menu</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure customized navigation link cards displayed in the global marketplace header.</p>
                </div>

                {/* Current menu lists */}
                <div className="flex flex-wrap gap-2">
                  {localConfig.appMenu.map((item, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-slate-800">{item.label}</span>
                      <span className="text-[10px] text-gray-400">({item.view})</span>
                      <div className="flex items-center gap-1 border-l pl-2 ml-1">
                        <button
                          onClick={() => handleStartEditMenuItem(idx)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveMenuItem(idx)}
                          className="text-rose-500 hover:text-rose-700 ml-1 font-bold"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Menu editor form */}
                <form onSubmit={handleAddMenuItem} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
                  <p className="font-extrabold text-slate-700">
                    {editingMenuIndex !== null ? `Edit Navigation Link #${editingMenuIndex + 1}` : 'Create New Menu Navigation Link'}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Navigation Label</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Naira Promos"
                        value={menuLabel}
                        onChange={e => setMenuLabel(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Destination View Routing</label>
                      <select
                        value={menuView}
                        onChange={e => setMenuView(e.target.value)}
                        className="w-full p-2 border bg-white rounded-lg"
                      >
                        <option value="products">Catalog Products</option>
                        <option value="categories">All Categories Page</option>
                        <option value="merchant-stores">Store Directory</option>
                        <option value="blog">Market Blogs</option>
                        <option value="faq">FAQs Helpdesk</option>
                        <option value="contact">Contact Support</option>
                        <option value="about">About Us / Story</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    {editingMenuIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMenuIndex(null);
                          setMenuLabel('');
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-[#0F4C81] hover:bg-[#1C5D94] text-white px-4 py-2 rounded-lg font-bold transition cursor-pointer"
                    >
                      {editingMenuIndex !== null ? 'Save Navigation Link' : 'Add Navigation Link'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: FEATURED PRODUCTS SELECTION GRID */}
            {cmsTab === 'featured' && (
              <div className="space-y-6" id="cms-featured-tab">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F4C81]">Featured Products Showcase Grid</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Directly select, toggle and curate which verified merchant products are actively highlighted in the "Featured Products" grid on the homepage.
                  </p>
                </div>

                {/* Filter and search controllers */}
                <div className="flex flex-col sm:flex-row gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Search approved products..."
                    value={prodSearch}
                    onChange={e => setProdSearch(e.target.value)}
                    className="flex-grow p-2 border rounded-lg bg-white"
                  />
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value)}
                    className="p-2 border rounded-lg bg-white min-w-[150px]"
                  >
                    <option value="All">All Categories</option>
                    {localConfig.categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Product Select Grid list */}
                <div className="border rounded-xl divide-y overflow-hidden max-h-[350px] overflow-y-auto bg-slate-50/20 text-xs">
                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      No approved products match the selection criteria.
                    </div>
                  ) : (
                    filteredProducts.map(product => {
                      const isFeatured = (localConfig.featuredProductIds || []).includes(product.id);
                      return (
                        <div key={product.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={product.image} alt={product.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-800 truncate">{product.title}</p>
                              <p className="text-gray-400 text-[10px] truncate">{product.brand} • {product.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-[#0F4C81]">{formatPrice(product.price)}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleFeaturedProduct(product.id)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition cursor-pointer ${
                                isFeatured 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                  : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                              <span>{isFeatured ? 'Featured' : 'Feature'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="text-[11px] text-gray-400 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>
                    Currently, <strong>{(localConfig.featuredProductIds || []).length}</strong> product(s) are designated as "Featured" on the homepage grid.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 4: GENERAL BRANDING */}
            {cmsTab === 'brand' && (
              <div className="space-y-6" id="cms-brand-tab">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F4C81]">Global Brand, Identity & Typography</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure global public metadata, text placements and platform names stored centrally.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Platform Public Name</label>
                      <input
                        type="text"
                        value={platformName}
                        onChange={e => setPlatformName(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Homepage Hero Title</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={e => setHeroTitle(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Hero Subtitle / Description Text</label>
                    <textarea
                      rows={3}
                      value={heroDescription}
                      onChange={e => setHeroDescription(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Global Footer Copyright Note</label>
                    <input
                      type="text"
                      value={footerNote}
                      onChange={e => setFooterNote(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>

                  {/* Transition styles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Platform Animation Presets</label>
                      <select
                        value={localConfig.animationStyle}
                        onChange={e => setLocalConfig(prev => ({ ...prev, animationStyle: e.target.value as any }))}
                        className="w-full p-2 border bg-white rounded-lg"
                      >
                        <option value="Smooth Float">Smooth Float (Elastic translation)</option>
                        <option value="Snappy Bounce">Snappy Bounce (Spring scale-ups)</option>
                        <option value="Classic Fade">Classic Fade (High focus transparency)</option>
                        <option value="None">None (Max performance flat mode)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Transition Duration ({localConfig.animationDuration}s)</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={localConfig.animationDuration}
                        onChange={e => setLocalConfig(prev => ({ ...prev, animationDuration: Number(e.target.value) }))}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Live Mockup Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-white sticky top-24">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">Live Wireframe Mockup</span>
              </div>
              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono">
                Updates Instantly
              </span>
            </div>

            {/* Preview Stage Container */}
            <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 flex flex-col text-slate-300 text-[10px]">
              
              {/* Mock App Header */}
              <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex justify-between items-center">
                <span className="font-black text-[12px] text-blue-400 tracking-tight flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                  {platformName || 'DXMARKET'}
                </span>
                
                {/* Mock Menu Links */}
                <div className="hidden sm:flex gap-2">
                  {localConfig.appMenu.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="text-slate-400 font-bold hover:text-white cursor-pointer px-1">
                      {item.label}
                    </span>
                  ))}
                  {localConfig.appMenu.length > 4 && (
                    <span className="text-slate-500 font-black">+{localConfig.appMenu.length - 4} more</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[8px] font-mono">
                    ₦ NGN
                  </span>
                </div>
              </div>

              {/* Mock Banner Carousel Slide */}
              {localConfig.heroBanners.length > 0 ? (
                <div className="relative h-28 bg-slate-900">
                  <img 
                    src={localConfig.heroBanners[0].imageUrl} 
                    alt="Active Banner preview" 
                    className="w-full h-full object-cover opacity-40" 
                  />
                  <div className="absolute inset-0 p-3 flex flex-col justify-center space-y-1">
                    <p className="font-black text-white text-[11px] leading-tight drop-shadow">
                      {localConfig.heroBanners[0].title}
                    </p>
                    <p className="text-slate-300 drop-shadow text-[9px] line-clamp-1 max-w-[85%]">
                      {localConfig.heroBanners[0].subtitle}
                    </p>
                    <button className="bg-blue-500 text-white font-black px-2 py-0.5 rounded text-[8px] mt-1 w-fit">
                      {localConfig.heroBanners[0].buttonText}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-slate-500">
                  <Image className="w-6 h-6 text-slate-700 mb-1" />
                  <span>No promotional banners active</span>
                </div>
              )}

              {/* Mock Hero Header Intro */}
              <div className="p-4 text-center border-b border-slate-800 space-y-1 bg-slate-950">
                <h4 className="font-extrabold text-[12px] text-white tracking-tight leading-snug">
                  {heroTitle || 'Direct Multi-Vendor Trade Hub'}
                </h4>
                <p className="text-slate-400 text-[9px] leading-relaxed max-w-sm mx-auto line-clamp-2">
                  {heroDescription || 'DXMARKET connects premium suppliers and cross-border trade.'}
                </p>
              </div>

              {/* Mock Featured Showcase Grid */}
              <div className="p-3 bg-slate-950 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-200">Featured Showcase Grid</span>
                  <span className="text-[8px] text-slate-500">Curated by Admin</span>
                </div>

                {/* Grid items */}
                <div className="grid grid-cols-2 gap-2">
                  {products
                    .filter(p => (localConfig.featuredProductIds || []).includes(p.id))
                    .slice(0, 2)
                    .map((p, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded p-1.5 flex flex-col justify-between">
                        <img src={p.image} alt="" className="w-full h-12 object-cover rounded mb-1" />
                        <div>
                          <p className="font-extrabold text-white truncate">{p.title}</p>
                          <p className="text-[#0F4C81] font-black">{formatPrice(p.price)}</p>
                        </div>
                      </div>
                    ))}
                  {(localConfig.featuredProductIds || []).length === 0 && (
                    <div className="col-span-2 py-4 text-center text-slate-500">
                      No featured products selected
                    </div>
                  )}
                </div>
                {(localConfig.featuredProductIds || []).length > 2 && (
                  <p className="text-center text-[8px] text-slate-500 pt-1">
                    + {(localConfig.featuredProductIds || []).length - 2} more featured products in catalog
                  </p>
                )}
              </div>

              {/* Mock Footer */}
              <div className="bg-slate-900 border-t border-slate-800 p-2 text-center text-[8px] text-slate-500 truncate">
                {footerNote || '© 2026 DXMARKET Inc. All Rights Reserved.'}
              </div>
            </div>

            <div className="mt-4 flex gap-1.5 p-3 rounded-lg border border-slate-800 bg-slate-950 text-[10px] text-slate-400 items-start">
              <Eye className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>
                Changes made in this mockup are staging configurations only. Click <strong>"Publish Changes"</strong> at the top right to write updates permanently to the live Firestore.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
