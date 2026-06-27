import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Heart, ShoppingCart, ArrowRight, Grid, List, Filter, SlidersHorizontal, ChevronRight, MessageSquare, ArrowLeft, Send, CheckCircle, FileText, HelpCircle, PhoneCall, Mail, MapPin, X } from 'lucide-react';
import { Product, MerchantStore, BlogPost, CartItem, SystemConfig } from '../types';

interface PublicPagesProps {
  view: string;
  viewParams: Record<string, any>;
  products: Product[];
  merchants: MerchantStore[];
  blogs: BlogPost[];
  cart: CartItem[];
  wishlist: Product[];
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onAddToCart: (product: Product, quantity: number, variant: Record<string, string>) => void;
  onToggleWishlist: (product: Product) => void;
  systemConfig: SystemConfig;
  formatPrice: (usdAmount: number) => string;
}

export default function PublicPages({
  view,
  viewParams,
  products,
  merchants,
  blogs,
  cart,
  wishlist,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  systemConfig,
  formatPrice,
}: PublicPagesProps) {
  // Local state for Product Listing filters
  const [selectedCategory, setSelectedCategory] = useState<string>(viewParams?.category || 'All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(550);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(viewParams?.search || '');

  const format = formatPrice || ((usd: number) => `$${usd.toFixed(2)}`);

  // Local state for Product Details zoom / variants selection
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [detailQty, setDetailQty] = useState<number>(1);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync details variant selection
  const activeProduct: Product | undefined = viewParams?.product;
  useEffect(() => {
    if (activeProduct) {
      const initial: Record<string, string> = {};
      activeProduct.variants.forEach(v => {
        initial[v.name] = v.options[0];
      });
      setSelectedVariant(initial);
      setActiveImgIndex(0);
      setDetailQty(1);
      setReviewSubmitted(false);
    }
  }, [activeProduct]);

  // Sync search parameter from viewParams if any
  useEffect(() => {
    if (viewParams?.search !== undefined) {
      setSearchQuery(viewParams.search);
    }
    if (viewParams?.category !== undefined) {
      setSelectedCategory(viewParams.category);
    }
  }, [viewParams]);

  // Contact Page Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Newsletter email
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  // Carousel slider state for homepage (Dynamic from Admin Configs!)
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = systemConfig.heroBanners && systemConfig.heroBanners.length > 0
    ? systemConfig.heroBanners.map(b => ({
        title: b.title,
        desc: b.subtitle,
        image: b.imageUrl,
        action: b.buttonText || 'Explore',
        category: 'All',
        view: b.buttonView || 'products'
      }))
    : [
        {
          title: 'Upgrade Your Digital Space',
          desc: 'Get exclusive deals on 34" curved monitors and Active ANC workspace audio gear.',
          image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1400&q=80',
          action: 'Shop Electronics',
          category: 'Electronics',
          view: 'products'
        },
        {
          title: 'Timeless Cashmere & Tailored Styles',
          desc: 'Explore organic cotton blends and double-breasted cashmere overcoats from elite boutiques.',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
          action: 'Browse Fashion',
          category: 'Fashion',
          view: 'products'
        }
      ];

  useEffect(() => {
    if (view === 'home' && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [view, slides.length]);

  // List of all unique categories and brands (Dynamic based on Admin Configuration)
  const categoriesList = ['All', ...systemConfig.categories];
  const brandsList = ['All', 'AuraSound', 'ApexTech', 'Vogue Essentials', 'GlowOrganic', 'Titan Fitness'];

  const getAnimationClass = () => {
    const style = systemConfig.animationStyle || 'Smooth Float';
    switch (style) {
      case 'Smooth Float':
        return 'transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl';
      case 'Snappy Bounce':
        return 'transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95';
      case 'Classic Fade':
        return 'transition-opacity duration-300 hover:opacity-85 hover:shadow-md';
      case 'None':
      default:
        return 'transition-none';
    }
  };

  // Filter products
  const getFilteredProducts = () => {
    let list = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by brand
    if (selectedBrand !== 'All') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    // Filter by price range
    list = list.filter(p => p.price <= priceRange);

    // Sorting
    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'sales') {
      list.sort((a, b) => b.salesCount - a.salesCount);
    }

    return list;
  };

  const filteredProducts = getFilteredProducts();

  // Handle rating submit
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    if (activeProduct) {
      activeProduct.reviews.unshift({
        id: `rev-${Date.now()}`,
        userName: reviewAuthor,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0]
      });
      activeProduct.reviewsCount += 1;
      // Recalculate average rating
      const sum = activeProduct.reviews.reduce((acc, r) => acc + r.rating, 0);
      activeProduct.rating = Number((sum / activeProduct.reviews.length).toFixed(1));
      
      setReviewAuthor('');
      setReviewComment('');
      setReviewSubmitted(true);
    }
  };

  // --- RENDERING VIEWS ---

  // 1. HOMEPAGE
  if (view === 'home') {
    const featuredList = products.filter(p => p.isFeatured && p.isApproved);
    const trendingList = products.filter(p => p.isTrending && p.isApproved);
    const flashList = products.filter(p => p.isFlashSale && p.isApproved);

    return (
      <div className="space-y-12" id="homepage-view">
        {/* Hero Slider */}
        <div className="relative h-[320px] md:h-[480px] w-full overflow-hidden rounded-2xl bg-gray-950 shadow-lg" id="hero-slider">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="relative z-20 max-w-xl pl-6 pr-6 md:pl-12 text-white">
                <span className="inline-block bg-[#1E88E5] text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-3">EXECUTIVE SELECTION</span>
                <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight leading-tight">{slide.title}</h1>
                <p className="text-gray-200 mt-2 text-xs md:text-sm leading-relaxed">{slide.desc}</p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if ('view' in slide && slide.view) {
                        onNavigate(slide.view);
                      } else {
                        setSelectedCategory(slide.category);
                        onNavigate('products', { category: slide.category });
                      }
                    }}
                    className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-5 py-2.5 rounded-lg text-xs md:text-sm flex items-center gap-1.5 cursor-pointer shadow transition"
                  >
                    <span>{slide.action}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('products')}
                    className="border border-white/40 hover:border-white text-white font-semibold px-4 py-2.5 rounded-lg text-xs md:text-sm cursor-pointer transition"
                  >
                    View All Deals
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-25">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/40'} transition-all`}
              />
            ))}
          </div>
        </div>

        {/* Top categories grid */}
        <section id="homepage-categories">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0F4C81] tracking-tight">Browse Popular Departments</h2>
              <p className="text-xs text-gray-500">Explore premium goods vetted for structural quality and authenticity.</p>
            </div>
            <button onClick={() => onNavigate('categories')} className="text-xs font-bold text-[#1E88E5] hover:underline flex items-center gap-1">
              <span>All Categories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Electronics', count: '14 Products', icon: '💻', img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=300&q=80' },
              { name: 'Fashion', count: '32 Products', icon: '🧥', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
              { name: 'Beauty & Skincare', count: '18 Products', icon: '🧴', img: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=300&q=80' },
              { name: 'Sports & Fitness', count: '11 Products', icon: '🏋️', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80' }
            ].map((cat, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  onNavigate('products', { category: cat.name });
                }}
                className="group relative h-40 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition border border-gray-100"
              >
                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white" />
                <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                  <span className="text-xl mb-1 block">{cat.icon}</span>
                  <h3 className="font-bold text-sm tracking-tight">{cat.name}</h3>
                  <p className="text-[10px] text-gray-300">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sales with Live Timer */}
        <section className="bg-amber-50/70 border border-amber-100 p-6 rounded-2xl" id="homepage-flash-sale">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏳</span>
              <div>
                <h2 className="text-lg md:text-xl font-extrabold text-[#0F4C81]">Limited-Time Flash Deals</h2>
                <p className="text-xs text-amber-800">Unbeatable discounts directly sponsored by ApexTech & Vogue.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2 py-1 rounded">ENDS SOON</span>
              <button onClick={() => onNavigate('flash-sales')} className="text-xs font-bold text-amber-800 hover:underline">
                View All Deals →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {flashList.map((product) => {
              const discountPercent = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
              return (
                <div key={product.id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col ${getAnimationClass()}`}>
                  <div className="relative pt-[60%] overflow-hidden bg-gray-50">
                    <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full z-10">
                      -{discountPercent}% OFF
                    </span>
                    <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.brand}</span>
                      <h3 onClick={() => onNavigate('product-details', { product })} className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#1E88E5] cursor-pointer mt-0.5">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-rose-600">{format(product.price)}</span>
                        <span className="text-xs text-gray-400 line-through block font-medium">{product.originalPrice ? format(product.originalPrice) : ''}</span>
                      </div>
                      <button
                        onClick={() => onAddToCart(product, 1, product.selectedVariant || {})}
                        className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white p-2 rounded-lg cursor-pointer transition"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section id="homepage-featured">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0F4C81] tracking-tight">Vetted Featured Products</h2>
              <p className="text-xs text-gray-500">Premium choices recommended by DXMARKET curators based on user ratings.</p>
            </div>
            <button onClick={() => onNavigate('products')} className="text-xs font-bold text-[#1E88E5] hover:underline">
              Explore All Products
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredList.map((product) => (
              <div key={product.id} className={`bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col group ${getAnimationClass()}`}>
                <div className="relative pt-[70%] overflow-hidden bg-gray-50">
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="absolute top-2.5 right-2.5 z-10 bg-white/85 hover:bg-white p-1.5 rounded-full shadow hover:text-rose-500 transition cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.some(w => w.id === product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                  </button>
                  <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>{product.brand}</span>
                      <span className="text-emerald-600 flex items-center gap-0.5"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
                    </div>
                    <h3 onClick={() => onNavigate('product-details', { product })} className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#1E88E5] cursor-pointer mt-0.5">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-[#0F4C81]">{format(product.price)}</span>
                    </div>
                    <button
                      onClick={() => onAddToCart(product, 1, product.selectedVariant || {})}
                      className="bg-gray-100 hover:bg-[#0F4C81] hover:text-white text-[#0F4C81] p-2 rounded-lg cursor-pointer transition"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending & New Arrivals */}
        <section id="homepage-trending" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-[#0F4C81] mb-4 border-b border-gray-200 pb-2">🔥 Trending Right Now</h2>
            <div className="space-y-4">
              {trendingList.slice(0, 3).map((product) => (
                <div key={product.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition">
                  <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 onClick={() => onNavigate('product-details', { product })} className="font-bold text-xs text-gray-800 hover:text-[#1E88E5] cursor-pointer line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{product.brand} | {product.category}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-extrabold text-[#0F4C81] text-xs">{format(product.price)}</span>
                      <button 
                        onClick={() => onNavigate('product-details', { product })}
                        className="text-[10px] text-[#1E88E5] font-bold hover:underline"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0F4C81] mb-4 border-b border-gray-200 pb-2">🆕 Vetted New Arrivals</h2>
            <div className="space-y-4">
              {products.filter(p => p.isApproved).slice(2, 5).map((product) => (
                <div key={product.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition">
                  <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 onClick={() => onNavigate('product-details', { product })} className="font-bold text-xs text-gray-800 hover:text-[#1E88E5] cursor-pointer line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{product.brand} | {product.category}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-extrabold text-[#0F4C81] text-xs">{format(product.price)}</span>
                      <button 
                        onClick={() => onNavigate('product-details', { product })}
                        className="text-[10px] text-[#1E88E5] font-bold hover:underline"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Merchants Section */}
        <section id="homepage-merchants" className="bg-gray-50 p-6 rounded-2xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#0F4C81]">Elite Verified Merchants</h2>
              <p className="text-xs text-gray-500">Shop with confidence from certified direct enterprise distributors.</p>
            </div>
            <button onClick={() => onNavigate('merchant-stores')} className="text-xs font-bold text-[#1E88E5] hover:underline">
              See All Stores
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {merchants.filter(m => m.isApproved).slice(0, 3).map((merchant) => (
              <div key={merchant.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition flex flex-col items-center text-center">
                <img src={merchant.logo} alt={merchant.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow" />
                <h3 className="font-bold text-sm text-gray-800 mt-3">{merchant.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-700">{merchant.rating}</span>
                  <span className="text-xs text-gray-400">({merchant.ordersCount} orders)</span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-2">{merchant.description}</p>
                <button
                  onClick={() => onNavigate('merchant-storefront', { merchant })}
                  className="mt-4 px-4 py-1.5 bg-gray-100 hover:bg-[#0F4C81] hover:text-white text-[#0F4C81] text-xs font-bold rounded-lg cursor-pointer transition w-full"
                >
                  Visit Storefront
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Testimonials */}
        <section id="homepage-testimonials">
          <h2 className="text-lg font-bold text-[#0F4C81] text-center mb-6">What Global Shoppers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Gavin Sterling', role: 'verified buyer', text: 'ApexTech has incredible support. Handled my 34 inch screen packaging flawlessly and custom-vetted it before shipment.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Katarina Lopez', role: 'beauty influencer', text: 'The Botanical Hyaluronic serum is highly concentrated. Genuine glow. Unbelievable that multi-vendor can deliver so quickly.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Afolabi Balogun', role: 'wholesale importer', text: 'Outstanding compliance! The supplier EuroTex provides certified tracking numbers. Safe billing and smooth merchant portal integration.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80' }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative">
                <p className="text-xs text-gray-600 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-4">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{t.name}</h4>
                    <span className="text-[10px] uppercase text-[#1E88E5] font-extrabold tracking-wider">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Preview & Newsletter Signup */}
        <section id="homepage-blog-newsletter" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Blog preview */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider">📰 Market Insights</h2>
                <button onClick={() => onNavigate('blog')} className="text-xs font-semibold text-[#1E88E5] hover:underline">
                  View All
                </button>
              </div>
              {blogs.slice(0, 1).map((b) => (
                <div key={b.id} className="space-y-3">
                  <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded-lg" />
                  <span className="text-[10px] bg-blue-100 text-[#0F4C81] font-bold px-2 py-0.5 rounded uppercase">{b.category}</span>
                  <h3 className="font-extrabold text-sm text-gray-900">{b.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{b.summary}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onNavigate('blog-details', { blog: blogs[0] })}
              className="mt-4 text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1.5"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gradient-to-br from-[#0F4C81] to-[#1E88E5] text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-2xl mb-2 block">🔔</span>
              <h2 className="font-extrabold text-lg md:text-xl leading-tight">Stay ahead with price drops & supply updates</h2>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed">
                Subscribe to receive customized catalog alerts, platform coupon codes, and vetted merchant recommendations directly in your inbox.
              </p>
            </div>

            {newsletterSubbed ? (
              <div className="bg-white/10 p-3 rounded-lg mt-6 flex items-center gap-2 text-xs">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Success! You have subscribed to the DXMARKET global newsletter.</span>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubbed(true);
                    setNewsletterEmail('');
                  }
                }}
                className="mt-6 flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your enterprise email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/15 focus:bg-white text-gray-800 placeholder-white/70 focus:placeholder-gray-400 text-xs rounded-lg focus:outline-none transition border border-white/20"
                />
                <button
                  type="submit"
                  className="bg-[#FF9800] hover:bg-[#e68a00] text-black font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Mobile App Download Section */}
        <section id="homepage-app-download" className="bg-white border border-gray-100 rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <span className="text-3xl block mb-2">📱</span>
          <h2 className="text-lg font-extrabold text-[#0F4C81]">Download the DXMARKET App</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Stay logged in with biometric login, real-time push-notifications for cargo shipping tracking, and 1-click supplier updates.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition flex items-center gap-2">
              <span className="text-lg">🤖</span> Play Store (Android)
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition flex items-center gap-2">
              <span className="text-lg">🍏</span> App Store (iOS)
            </button>
          </div>
        </section>
      </div>
    );
  }

  // 2. PRODUCT LISTING PAGE
  if (view === 'products') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="product-listing-view">
        {/* Filter Panel (Left Column) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 h-fit space-y-6" id="filter-panel">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-[#0F4C81]" />
              <span>Filter Catalogue</span>
            </h3>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setPriceRange(550);
                setSearchQuery('');
              }}
              className="text-[10px] text-gray-400 hover:text-[#1E88E5] font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-bold text-gray-400">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#1E88E5]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories select */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-bold text-gray-400">Department</label>
            <div className="flex flex-col gap-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-2 py-1.5 rounded text-xs cursor-pointer transition ${selectedCategory === cat ? 'bg-blue-50 text-[#0F4C81] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brands select */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-bold text-gray-400">Brand</label>
            <div className="flex flex-col gap-1">
              {brandsList.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`text-left px-2 py-1.5 rounded text-xs cursor-pointer transition ${selectedBrand === b ? 'bg-blue-50 text-[#0F4C81] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="uppercase font-bold text-gray-400 text-[11px]">Max Price</span>
              <span className="font-extrabold text-[#0F4C81]">${priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="600"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81]"
            />
          </div>
        </div>

        {/* Product Grid / List Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sort Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> results matching criteria
            </p>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1 border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-1.5 cursor-pointer ${isGridView ? 'bg-gray-100 text-[#0F4C81]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-1.5 cursor-pointer ${!isGridView ? 'bg-gray-100 text-[#0F4C81]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs border border-gray-300 rounded p-1.5 text-gray-700 bg-white focus:outline-none"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="sales">Best Selling</option>
              </select>
            </div>
          </div>

          {/* Main Products Rendering */}
          {filteredProducts.length > 0 ? (
            isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className={`bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col group ${getAnimationClass()}`}>
                    <div className="relative pt-[70%] overflow-hidden bg-gray-50">
                      <button
                        onClick={() => onToggleWishlist(product)}
                        className="absolute top-2.5 right-2.5 z-10 bg-white/85 p-1.5 rounded-full shadow hover:text-rose-500 transition cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.some(w => w.id === product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                      </button>
                      <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.brand}</span>
                        <h3 onClick={() => onNavigate('product-details', { product })} className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-[#1E88E5] cursor-pointer mt-0.5">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-base font-extrabold text-[#0F4C81]">{format(product.price)}</span>
                        <button
                          onClick={() => onAddToCart(product, 1, product.selectedVariant || {})}
                          className="bg-gray-100 hover:bg-[#0F4C81] hover:text-white text-[#0F4C81] p-2 rounded-lg cursor-pointer transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className={`bg-white border border-gray-100 rounded-xl p-4 flex gap-4 transition ${getAnimationClass()}`}>
                    <img src={product.image} alt={product.title} className="w-32 h-32 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.brand}</span>
                        <h3 onClick={() => onNavigate('product-details', { product })} className="font-bold text-sm text-gray-900 hover:text-[#1E88E5] cursor-pointer mt-0.5">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500">({product.reviewsCount} verified reviews)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-lg font-extrabold text-[#0F4C81]">{format(product.price)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onToggleWishlist(product)}
                            className="p-2 border border-gray-300 rounded-lg hover:text-rose-500 hover:bg-gray-50 transition cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${wishlist.some(w => w.id === product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                          </button>
                          <button
                            onClick={() => onAddToCart(product, 1, product.selectedVariant || {})}
                            className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white px-4 py-2 rounded-lg cursor-pointer transition text-xs font-bold"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-gray-800 text-sm">No products found</p>
              <p className="text-xs text-gray-500 mt-1">Try relaxing filters, lowering category density constraints or widening search criteria.</p>
            </div>
          )}

          {/* Simple Pagination */}
          <div className="flex justify-center items-center gap-2 pt-6">
            <button className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-500 bg-gray-50 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-[#0F4C81] text-white rounded text-xs font-bold">1</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    );
  }

  // 3. PRODUCT DETAILS PAGE
  if (view === 'product-details') {
    const product: Product | undefined = viewParams?.product;
    if (!product) {
      return <p className="text-center text-gray-500">Error: Product details parameter missing.</p>;
    }

    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

    return (
      <div className="space-y-12" id="product-details-view">
        {/* Back Link */}
        <button onClick={() => onNavigate('products')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0F4C81] font-semibold cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalogue</span>
        </button>

        {/* Gallery & Cart Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Gallery with Image Zoom simulation */}
          <div className="space-y-4">
            <div className="relative pt-[75%] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
              <img
                src={product.gallery[activeImgIndex] || product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-300 origin-center hover:scale-125"
                title="Hover to zoom"
              />
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[9px] px-2 py-1 rounded">🔍 Hover to zoom image</span>
            </div>

            {/* Thumbnail carousel */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 cursor-pointer ${activeImgIndex === idx ? 'border-[#0F4C81]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Actions & Details */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] text-gray-400 font-extrabold uppercase tracking-widest">{product.brand}</span>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">{product.title}</h1>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} verified customer reviews)</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-[#0F4C81]">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2 font-medium">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${product.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {product.stock > 10 ? `${product.stock} units in stock` : `Only ${product.stock} items left!`}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>

            {/* Product Variants selection */}
            {product.variants.map((v) => (
              <div key={v.name} className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">{v.name}</label>
                <div className="flex gap-2">
                  {v.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariant({ ...selectedVariant, [v.name]: option })}
                      className={`px-3 py-1.5 rounded text-xs cursor-pointer border font-semibold transition ${selectedVariant[v.name] === option ? 'border-[#0F4C81] bg-blue-50 text-[#0F4C81] font-bold' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Merchant info preview */}
            <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center bg-white">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Shipped & Sold By</span>
                <span className="font-bold text-[#0F4C81] text-xs">{product.merchantName}</span>
              </div>
              <button
                onClick={() => {
                  const mObj = merchants.find(m => m.id === product.merchantId);
                  if (mObj) onNavigate('merchant-storefront', { merchant: mObj });
                }}
                className="text-xs text-[#1E88E5] font-bold hover:underline"
              >
                Visit Store
              </button>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-600 font-bold text-xs"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-extrabold text-gray-800">{detailQty}</span>
                <button
                  onClick={() => setDetailQty(detailQty + 1)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-600 font-bold text-xs"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, detailQty, selectedVariant);
                  alert(`Added ${detailQty} item(s) to cart with selected variants.`);
                }}
                className="flex-1 bg-[#0F4C81] hover:bg-[#1E88E5] text-white py-3 rounded-lg text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                onClick={() => {
                  onToggleWishlist(product);
                }}
                className="p-3 border border-gray-300 rounded-lg hover:text-rose-500 hover:bg-gray-50 transition cursor-pointer"
                title="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.some(w => w.id === product.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100 text-xs">
                <span className="text-gray-500 font-medium">{key}</span>
                <span className="font-bold text-gray-800">{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews and submit review */}
        <section className="space-y-6">
          <h2 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Customer Reviews ({product.reviewsCount})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Reviews display list */}
            <div className="md:col-span-2 space-y-4">
              {product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs text-gray-800">{rev.userName}</p>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'opacity-30'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-lg">No customer reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>

            {/* Write a review form */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Leave a Review</h3>
              
              {reviewSubmitted ? (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1">✓ Review Posted</p>
                  <p>Your rating has been recorded and will recalculate average product scores.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-gray-400">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#1E88E5]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-gray-400">Overall Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full text-xs border border-gray-300 rounded p-1.5 text-gray-700 bg-white"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="1">⭐ 1 Star</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-gray-400">Comments</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#1E88E5]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F4C81] hover:bg-[#1E88E5] text-white py-1.5 rounded text-xs font-bold transition cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Related Products list */}
        {related.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Related Items You May Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((prod) => (
                <div key={prod.id} className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 shadow-sm hover:shadow transition">
                  <img src={prod.image} alt={prod.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="min-w-0 flex flex-col justify-between flex-1">
                    <div>
                      <h4 onClick={() => onNavigate('product-details', { product: prod })} className="font-bold text-xs text-gray-800 line-clamp-1 hover:text-[#1E88E5] cursor-pointer">
                        {prod.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">{prod.brand}</p>
                    </div>
                    <span className="font-extrabold text-[#0F4C81] text-xs mt-1 block">${prod.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // 4. CATEGORIES LIST PAGE
  if (view === 'categories') {
    return (
      <div className="space-y-6" id="categories-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81]">Marketplace Departments</h2>
        <p className="text-xs text-gray-500">Explore structured catalogs curated across certified high-density industries.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categoriesList.filter(c => c !== 'All').map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  onNavigate('products', { category: cat });
                }}
                className="bg-white border border-gray-100 rounded-xl p-6 text-center cursor-pointer shadow-sm hover:shadow transition"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#0F4C81] text-2xl flex items-center justify-center rounded-full mx-auto mb-4">
                  {cat.startsWith('El') ? '💻' : cat.startsWith('Fa') ? '🧥' : cat.startsWith('Be') ? '🧴' : '🏋️'}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{cat}</h3>
                <p className="text-xs text-gray-400 mt-1">{count} items available</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. BRANDS LIST PAGE
  if (view === 'brands') {
    return (
      <div className="space-y-6" id="brands-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81]">Vetted Global Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brandsList.filter(b => b !== 'All').map((b) => {
            const count = products.filter(p => p.brand === b).length;
            return (
              <div
                key={b}
                onClick={() => {
                  setSelectedBrand(b);
                  onNavigate('products');
                }}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#1E88E5] transition"
              >
                <h3 className="font-extrabold text-sm text-[#0F4C81]">{b}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{count} active listings</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. FLASH SALES LIST PAGE
  if (view === 'flash-sales') {
    const flashList = products.filter(p => p.isFlashSale && p.isApproved);
    return (
      <div className="space-y-6" id="flash-sales-page">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
              <span>⏳</span> Platform Flash Blitz
            </h2>
            <p className="text-xs text-amber-800 mt-1">Exclusive lightning price cuts sponsored directly by vendor hubs. Ends in 2 hrs.</p>
          </div>
          <div className="text-xs bg-amber-200 text-amber-950 font-extrabold px-3 py-2 rounded-lg self-start md:self-auto">
            LIVE TIMER: 02h : 14m : 55s
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {flashList.map((product) => {
            const discountPercent = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
            return (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow">
                <div className="relative pt-[60%] overflow-hidden bg-gray-50">
                  <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full z-10">
                    -{discountPercent}% LIMIT
                  </span>
                  <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 onClick={() => onNavigate('product-details', { product })} className="font-bold text-xs text-gray-900 hover:text-[#1E88E5] cursor-pointer line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-base font-extrabold text-rose-600">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through block">${product.originalPrice?.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => onAddToCart(product, 1, product.selectedVariant || {})}
                      className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white p-2 rounded-lg cursor-pointer transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 7. DEALS AND PROMOTIONS PAGE
  if (view === 'deals') {
    return (
      <div className="space-y-6" id="deals-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81]">Active Coupons & Platform Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { code: 'APEX10', merchant: 'ApexTech Solutions', desc: '10% off consumer smart headphones and multi-drive NVMe storage assemblies.', exp: '2026-09-30' },
            { code: 'VOGUE20', merchant: 'Vogue Essentials', desc: '20% off classical tailoring wool cashmeres and canvas urban packs.', exp: '2026-12-31' },
            { code: 'GLOW5', merchant: 'GlowOrganic Beauty', desc: 'Flat $5.00 discount on botanical aloe vera glow serums.', exp: '2026-10-10' }
          ].map((promo) => (
            <div key={promo.code} className="bg-white border-2 border-dashed border-gray-200 p-5 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] bg-blue-100 text-[#0F4C81] px-2 py-0.5 rounded font-bold uppercase block w-fit">{promo.merchant}</span>
                <h3 className="font-bold text-gray-800 text-sm mt-1">{promo.desc}</h3>
                <p className="text-[10px] text-gray-400 mt-2">Expires on {promo.exp}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center min-w-[100px]">
                <code className="text-amber-800 font-extrabold text-sm block select-all">{promo.code}</code>
                <span className="text-[9px] text-amber-600 uppercase block font-bold mt-1">Copy Code</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. MERCHANT STORES LIST PAGE
  if (view === 'merchant-stores') {
    return (
      <div className="space-y-6" id="merchant-stores-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81]">Registered Store Hubs</h2>
        <p className="text-xs text-gray-500">Connecting buyers directly with high-capacity manufacturers and verified resellers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {merchants.map((merchant) => (
            <div key={merchant.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition flex gap-4">
              <img src={merchant.logo} alt={merchant.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow flex-shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">{merchant.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-gray-700">{merchant.rating}</span>
                    <span className="text-xs text-gray-400">({merchant.productsCount} products)</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">{merchant.description}</p>
                </div>
                <button
                  onClick={() => onNavigate('merchant-storefront', { merchant })}
                  className="mt-4 text-xs font-bold text-[#1E88E5] hover:underline text-left"
                >
                  Visit Storefront →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. INDIVIDUAL MERCHANT STOREFRONT VIEW
  if (view === 'merchant-storefront') {
    const merchant: MerchantStore | undefined = viewParams?.merchant;
    if (!merchant) return <p className="text-center">Merchant storefront parameter missing.</p>;
    const mProducts = products.filter(p => p.merchantId === merchant.id && p.isApproved);

    return (
      <div className="space-y-8" id="merchant-storefront-view">
        {/* Banner with profile */}
        <div className="relative h-44 rounded-xl overflow-hidden bg-gray-950">
          <img src={merchant.banner} alt="" className="w-full h-full object-cover opacity-65" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <img src={merchant.logo} alt={merchant.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow flex-shrink-0" />
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight">{merchant.name}</h1>
              <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">{merchant.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Vetted Vendor</span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {merchant.rating}</span>
                <span className="text-gray-300">| Joined {merchant.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Active listings */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Active Products from {merchant.name}</h2>
          
          {mProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {mProducts.map((p) => (
                <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition flex flex-col justify-between">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                  <div>
                    <h3 onClick={() => onNavigate('product-details', { product: p })} className="font-bold text-xs text-gray-800 hover:text-[#1E88E5] cursor-pointer line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">Stock remaining: {p.stock}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="font-extrabold text-[#0F4C81]">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => onAddToCart(p, 1, p.selectedVariant || {})}
                      className="bg-gray-100 hover:bg-[#0F4C81] hover:text-white text-[#0F4C81] p-1.5 rounded cursor-pointer transition text-xs font-bold"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic bg-gray-50 p-6 rounded-lg">No active products loaded for this merchant storefront.</p>
          )}
        </div>
      </div>
    );
  }

  // 10. BLOG LIST PAGE
  if (view === 'blog') {
    return (
      <div className="space-y-6" id="blog-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81]">Marketplace Trade Blog</h2>
        <p className="text-xs text-gray-500">Expert analysis, merchant strategies, and tech updates shaping global transactions.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div key={b.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow flex flex-col justify-between">
              <img src={b.image} alt="" className="w-full h-44 object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] bg-blue-100 text-[#0F4C81] px-2 py-0.5 rounded font-bold uppercase">{b.category}</span>
                  <h3 className="font-extrabold text-sm text-gray-900 line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{b.summary}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                  <span>{b.author} | {b.date}</span>
                  <button onClick={() => onNavigate('blog-details', { blog: b })} className="text-[#1E88E5] font-bold hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 11. BLOG DETAILS PAGE
  if (view === 'blog-details') {
    const blog: BlogPost | undefined = viewParams?.blog;
    if (!blog) return <p className="text-center">Blog post parameter missing.</p>;
    return (
      <div className="max-w-2xl mx-auto space-y-6" id="blog-details-view">
        <button onClick={() => onNavigate('blog')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0F4C81] font-semibold cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Articles</span>
        </button>
        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-xl shadow-sm" />
        <div className="space-y-2">
          <span className="text-[10px] bg-blue-100 text-[#0F4C81] font-bold px-2.5 py-1 rounded uppercase tracking-wider">{blog.category}</span>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">{blog.title}</h1>
          <p className="text-xs text-gray-400">{blog.author} | Published {blog.date} | {blog.readTime}</p>
        </div>
        <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-4">
          {blog.content}
        </div>
      </div>
    );
  }

  // 12. CONTACT US PAGE
  if (view === 'contact') {
    return (
      <div className="max-w-3xl mx-auto space-y-8" id="contact-page">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0F4C81]">Contact Client Support</h2>
          <p className="text-xs text-gray-500 mt-1">Our system integration agents respond within 2 hours of inquiry submission.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="space-y-4 bg-gray-50 p-5 rounded-xl text-xs text-gray-600">
            <div className="flex gap-2 items-start">
              <MapPin className="w-5 h-5 text-[#0F4C81] flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-800">Global Head Office</p>
                <p>Suite 800, Tech Towers, Canary Wharf, London</p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <Mail className="w-5 h-5 text-[#0F4C81] flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-800">Support Email</p>
                <p>support@dxmarket.com</p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <PhoneCall className="w-5 h-5 text-[#0F4C81] flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-800">Hotline</p>
                <p>+44 207 555 0199</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            {contactSent ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-xs space-y-1 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-extrabold text-sm">Message Successfully Logged</p>
                <p>Support ticket number #DX-{Math.floor(Math.random() * 90000) + 10000} has been registered to your email.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (contactName && contactEmail && contactMsg) {
                    setContactSent(true);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-gray-400">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-gray-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@work.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-gray-400">Inquiry Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Specify details about listing restrictions, shipping, bulk supplier request or custom orders..."
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0F4C81] hover:bg-[#1E88E5] text-white font-bold text-xs px-4 py-2 rounded transition cursor-pointer"
                >
                  Send Inquiry Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 13. ABOUT US PAGE
  if (view === 'about') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-xs text-gray-600 leading-relaxed" id="about-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81] tracking-tight">The DXMARKET Blueprint</h2>
        <p>
          Founded in 2025, **DXMARKET** is a certified B2B and B2C enterprise multi-vendor platform constructed to empower regional manufacturers, high-capacity retail merchants, and local carrier networks. Our architecture eliminates unnecessary brokerage, aligning real-time catalog listings directly with localized distribution warehouses.
        </p>
        <p>
          We prioritize programmatic transaction safety, high-fidelity metadata transparency, and automated supplier workflows. By integrating digital wallets, multi-currency ledgers, and priority tracking networks into a cohesive, SEO-friendly framework, DXMARKET is revolutionizing shipping efficiency and global trade infrastructure.
        </p>
        <img src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-48 object-cover rounded-xl mt-4" />
      </div>
    );
  }

  // 14. FAQ PAGE
  if (view === 'faq') {
    const faqList = [
      { q: 'How does vendor vetting work?', a: 'Every merchant store must upload valid corporate registrations. Our super admin audit team reviews approvals within 24 hours to secure absolute platform anti-fraud compliance.' },
      { q: 'What is the platform commission rate?', a: 'By default, the platform takes an 8.5% commission on completed sales, which is recycled into our global priority carrier network to subsidize cross-border cargo fees.' },
      { q: 'Can I connect third-party suppliers?', a: 'Yes. DXMARKET features a dedicated Supplier Portal where raw manufacturers can stage, sync, and dispatch structural inventories directly to primary merchant warehouses.' },
      { q: 'How are refunds administered?', a: 'Refund requests undergo structural verification by merchant staff. Once verified, funds are credited back to the customer’s wallet balance or source payment card within 3 business days.' }
    ];
    return (
      <div className="max-w-2xl mx-auto space-y-6" id="faq-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81]">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqList.map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#1E88E5]" />
                <span>{f.q}</span>
              </h3>
              <p className="text-xs text-gray-600 mt-2 pl-5 border-l border-blue-100">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 15 - 18. POLICY PAGES (Combined for brevity and elite clean layout)
  if (['terms', 'privacy', 'returns', 'shipping'].includes(view)) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-8 rounded-xl space-y-4 text-xs text-gray-600 leading-relaxed" id="policy-page">
        <h2 className="text-xl font-extrabold text-[#0F4C81] capitalize tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#1E88E5]" />
          <span>{view} Policy and Guidelines</span>
        </h2>
        <p className="font-semibold text-gray-700">Last updated: June 2026. Version 4.2.0-compliance</p>
        <p>
          This document describes the regulatory framework governing transactions, privacy schemas, logistics timelines, and structural return protocols on the DXMARKET multi-vendor e-commerce platform.
        </p>
        <p>
          We utilize secure cookies, encrypted token databases, and strict merchant approval processes to verify compliance with GDPR, HIPAA, and WCAG accessibility mandates. Users are advised to review billing agreements, refund parameters, and cargo handling procedures prior to issuing order dispatch calls to regional fulfillment centers.
        </p>
      </div>
    );
  }

  return null;
}
