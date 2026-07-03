import { Product, MerchantStore, Supplier, Order, Lead, BlogPost, AuditLog, SystemConfig, SampleUserCredential } from './types';

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  commissionRate: 8.5,
  platformName: 'DXMARKET',
  maintenanceMode: false,
  allowSelfRegistration: true,
  enable2FA: true,
  currencies: ['NGN', 'USD', 'EUR', 'GBP', 'KES'],
  languages: ['English', 'Español', 'Français', 'Deutsch', 'Yoruba'],
  heroTitle: 'Direct Cross-Border Multi-Vendor Trade Hub',
  heroDescription: 'DXMARKET connects premium suppliers, verified cross-border merchants, and smart automated cargo logistics to serve millions of global customers.',
  footerNote: '© 2026 DXMARKET Inc. All Rights Reserved. Manufactured and certified in modern cloud native containers.',
  appMenu: [
    { label: 'Flash Sales', view: 'flash-sales' },
    { label: 'Merchant Stores', view: 'merchant-stores' },
    { label: 'Market Blog', view: 'blog' },
    { label: 'FAQs', view: 'faq' },
    { label: 'Our Story', view: 'about' },
    { label: 'Contact Support', view: 'contact' },
    { label: '🚀 Sample Users & Login Hub', view: 'sample-users' }
  ],
  heroBanners: [
    {
      title: 'Enterprise Cross-Border Logistics',
      subtitle: 'Ship products globally with real-time transit telemetry tracking.',
      imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&h=400&q=80',
      buttonText: 'Explore Logistics',
      buttonView: 'products'
    }
  ],
  animationStyle: 'Smooth Float',
  animationDuration: 0.5,
  categories: ['Electronics', 'Fashion', 'Beauty & Skincare', 'Sports & Fitness'],
  heroConfig: {
    title: 'Enterprise Cross-Border Logistics',
    subtitle: 'Ship products globally with real-time transit telemetry tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=1200&h=400&q=80'
  }
};

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Top E-Commerce Trends Shaping Global Trade in 2026',
    summary: 'Discover how multi-vendor systems, AI recommendations, and local warehouses are revolutionizing delivery speeds.',
    content: `Global e-commerce is entering a new frontier of speed and intelligence. In 2026, customers no longer wait weeks for cross-border shipments. Multi-vendor marketplaces like DXMARKET are partnering with local suppliers to decentralize inventory. This means high-demand goods are pre-staged in domestic fulfillment nodes, bringing delivery times down from 7 days to under 48 hours. 

    Furthermore, personalized shopping feeds powered by client-side and server-side machine learning models have increased cart conversion rates by 35%. By analyzing browsing density, hover states, and wishlist frequency, platforms can curate hyper-relevant recommendations that anticipate consumer demands. In this deep dive, we explore how you can ready your merchant storefront for the fast-approaching holiday shopping rush.`,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    author: 'Sarah Jenkins',
    date: '2026-06-15',
    category: 'E-commerce Insights',
    readTime: '5 min read'
  },
  {
    id: 'blog-2',
    title: 'How to Build a Multi-Channel Brand on DXMARKET',
    summary: 'A step-by-step masterclass for new merchants wanting to scale from local retail to national supply chains.',
    content: `Transitioning from a boutique boutique storefront to an enterprise-grade digital merchant is a journey filled with logistical pivots. In this guide, we sit down with five of our highest-grossing sellers to unlock the exact playbooks they used to cross $100k in monthly sales. 
    
    The secret? A combined focus on high-fidelity visual product galleries, instant customer follow-ups via the Live Chat widget, and participating in platform-wide Flash Sales. The merchants who saw the steepest growth curves spent their first month refining their product variants and offering exclusive coupons to early reviewers. Learn how to optimize your supply streams, automate order processing, and unlock loyalty campaigns that turn first-time shoppers into brand evangelists.`,
    image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
    author: 'Marcus Vance',
    date: '2026-06-20',
    category: 'Seller Guides',
    readTime: '8 min read'
  },
  {
    id: 'blog-3',
    title: 'Sustainability in Modern Supply Logistics',
    summary: 'How eco-friendly packaging and green carrier networks reduce operational carbon footprints.',
    content: `Eco-conscious consumerism is no longer a niche preference; it is a vital metric for modern business viability. Multi-vendor frameworks are uniquely positioned to spearhead environmental sustainability. By sourcing products from regional merchants rather than distant single-node mega-warehouses, DXMARKET is slashing transport emissions by 40%. 
    
    This article highlights the best-practice green packaging guidelines that our certified supplier network uses. From biodegradable cornstarch packing peanuts to optimized delivery grouping routines, we demonstrate how choosing green logistics actually reduces return shipping costs and increases customer retention.`,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    author: 'Elena Rostova',
    date: '2026-06-22',
    category: 'Logistics',
    readTime: '6 min read'
  }
];

export const MOCK_MERCHANTS: MerchantStore[] = [
  {
    id: 'm-1',
    name: 'ApexTech Solutions',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&h=400&q=80',
    description: 'Premier distributor of smart consumer electronics and high-performance workstation accessories.',
    rating: 4.8,
    productsCount: 14,
    ordersCount: 520,
    joinedDate: '2025-01-10',
    isApproved: true,
    balance: 8450.00,
    coupons: [
      { id: 'c-1', code: 'APEX10', discount: 10, type: 'percentage', expiryDate: '2026-09-30', isActive: true },
      { id: 'c-2', code: 'APEXWORK', discount: 50, type: 'fixed', minSpend: 400, expiryDate: '2026-08-15', isActive: true }
    ],
    ownerName: 'Alex Mercer',
    ownerEmail: 'alex@apextech.com'
  },
  {
    id: 'm-2',
    name: 'Vogue Essentials',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&h=400&q=80',
    description: 'Curated apparel, organic streetwear, and essential dynamic everyday fashion wear.',
    rating: 4.6,
    productsCount: 32,
    ordersCount: 1150,
    joinedDate: '2025-02-14',
    isApproved: true,
    balance: 14200.50,
    coupons: [
      { id: 'c-3', code: 'VOGUE20', discount: 20, type: 'percentage', expiryDate: '2026-12-31', isActive: true }
    ],
    ownerName: 'Sophia Lin',
    ownerEmail: 'sophia@vogueessentials.com'
  },
  {
    id: 'm-3',
    name: 'GlowOrganic Beauty',
    logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&h=400&q=80',
    description: '100% cruelty-free, vegan skincare, premium wellness, and organic beauty supplements.',
    rating: 4.9,
    productsCount: 18,
    ordersCount: 430,
    joinedDate: '2025-03-01',
    isApproved: true,
    balance: 5120.20,
    coupons: [
      { id: 'c-4', code: 'GLOW5', discount: 5, type: 'fixed', expiryDate: '2026-10-10', isActive: true }
    ],
    ownerName: 'Elena Rostova',
    ownerEmail: 'elena@gloworganic.com'
  },
  {
    id: 'm-4',
    name: 'Titan Fitness Co',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&h=400&q=80',
    description: 'High-durability gym weights, resistance gear, and state-of-the-art cardio setups.',
    rating: 4.5,
    productsCount: 11,
    ordersCount: 290,
    joinedDate: '2025-05-18',
    isApproved: false, // For testing approvals
    balance: 0,
    coupons: [],
    ownerName: 'John Miller',
    ownerEmail: 'john@titanfit.com'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    title: 'AuraSound Active ANC Headphones',
    price: 189.99,
    originalPrice: 249.99,
    description: 'Immersive sound with industry-leading Active Noise Cancellation. Enjoy 40 hours of uninterrupted wireless playback, high-fidelity transducers, and ultra-plush protein leather earcups.',
    category: 'Electronics',
    brand: 'AuraSound',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.8,
    reviewsCount: 128,
    reviews: [
      { id: 'r-1', userName: 'David K.', rating: 5, comment: 'Phenomenal bass depth and the noise isolation is top-notch. Battery easily lasts all week.', date: '2026-06-01' },
      { id: 'r-2', userName: 'Sarah L.', rating: 4, comment: 'Very comfortable but the charging cable could have been a bit longer. Highly recommended overall.', date: '2026-06-12' }
    ],
    merchantId: 'm-1',
    merchantName: 'ApexTech Solutions',
    specifications: {
      'Driver Unit': '40mm Dynamic Speaker',
      'Battery Life': 'Up to 40 Hours with ANC',
      'Bluetooth Version': '5.2 aptX HD',
      'Charging Time': '1.5 Hours to Full',
      'Weight': '260g'
    },
    variants: [
      { name: 'Color', options: ['Cosmic Black', 'Snow White', 'Marine Blue'] },
      { name: 'Warranty', options: ['1-Year Standard', '2-Year Extended (+ $25)'] }
    ],
    selectedVariant: { Color: 'Cosmic Black', Warranty: '1-Year Standard' },
    stock: 45,
    salesCount: 380,
    isFeatured: true,
    isTrending: true,
    isFlashSale: true,
    flashSaleEnds: '2026-06-30T12:00:00Z',
    isApproved: true
  },
  {
    id: 'p-2',
    title: 'WorkStation Pro 34" Ultrawide Monitor',
    price: 499.99,
    originalPrice: 599.99,
    description: 'Command your workspace with 34 inches of immersive 1440p curved excellence. Equipped with 100Hz refresh rate, USB-C Power Delivery (90W), and 99% sRGB color gamut coverage for elite creators.',
    category: 'Electronics',
    brand: 'ApexTech',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.6,
    reviewsCount: 64,
    reviews: [
      { id: 'r-3', userName: 'Robert M.', rating: 5, comment: 'Massive upgrade for coding and heavy spreadsheet analysis. Stand is solid and adjusts beautifully.', date: '2026-05-20' }
    ],
    merchantId: 'm-1',
    merchantName: 'ApexTech Solutions',
    specifications: {
      'Screen Size': '34 Inches Curved 1500R',
      'Resolution': '3440 x 1440 WQHD',
      'Refresh Rate': '100Hz',
      'Ports': '1x DP, 2x HDMI, 1x USB-C (90W PD)',
      'Contrast Ratio': '3000:1'
    },
    variants: [
      { name: 'Stand Type', options: ['Standard Tilt/Swivel', 'Heavy Duty Arm Mount'] }
    ],
    selectedVariant: { 'Stand Type': 'Standard Tilt/Swivel' },
    stock: 12,
    salesCount: 140,
    isFeatured: true,
    isTrending: false,
    isFlashSale: false,
    isApproved: true
  },
  {
    id: 'p-3',
    title: 'Heritage Cashmere Overcoat',
    price: 220.00,
    originalPrice: 350.00,
    description: 'Double-breasted timeless silhouette crafted from a luxurious 70% virgin wool and 30% soft cashmere blend. Impeccable tailoring, internal secure passport pocket, and satin inner lining.',
    category: 'Fashion',
    brand: 'Vogue Essentials',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.9,
    reviewsCount: 88,
    reviews: [
      { id: 'r-4', userName: 'Clara G.', rating: 5, comment: 'Stunning fit and incredibly soft. Feels like a $1,000 designer piece. Absolutely perfect for winter.', date: '2026-06-18' }
    ],
    merchantId: 'm-2',
    merchantName: 'Vogue Essentials',
    specifications: {
      'Material': '70% Virgin Wool, 30% Premium Cashmere',
      'Lining': '100% Breathable Viscose Satin',
      'Care': 'Dry Clean Only',
      'Tailoring': 'Slim-fit Structured'
    },
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Classic Camel', 'Charcoal Gray', 'Midnight Navy'] }
    ],
    selectedVariant: { Size: 'M', Color: 'Classic Camel' },
    stock: 25,
    salesCount: 220,
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    isApproved: true
  },
  {
    id: 'p-4',
    title: 'Minimalist Leather Urban Backpack',
    price: 115.00,
    originalPrice: 145.00,
    description: 'Water-resistant full-grain leather backpack. Fits a 16" laptop with dedicated padding, features hidden magnetic pockets, luggage strap, and integrated USB pass-through port.',
    category: 'Fashion',
    brand: 'Vogue Essentials',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.5,
    reviewsCount: 42,
    reviews: [],
    merchantId: 'm-2',
    merchantName: 'Vogue Essentials',
    specifications: {
      'Capacity': '20 Liters',
      'Laptop Compartment': 'Fits up to 16-inch work devices',
      'Material': 'Full-grain Bovine Leather, YKK Zippers',
      'Dimensions': '42 x 30 x 15 cm'
    },
    variants: [
      { name: 'Color', options: ['Saddle Brown', 'Noir Black'] }
    ],
    selectedVariant: { Color: 'Saddle Brown' },
    stock: 55,
    salesCount: 195,
    isFeatured: false,
    isTrending: true,
    isFlashSale: true,
    flashSaleEnds: '2026-06-29T18:00:00Z',
    isApproved: true
  },
  {
    id: 'p-5',
    title: 'Hyaluronic Botanical Radiance Serum',
    price: 45.00,
    originalPrice: 65.00,
    description: 'Intense moisture lock with organic aloe vera, multi-molecular hyaluronic acid, and botanical extracts. Plumps skin texture, reduces fine dry lines, and yields an immediate glowing dewiness.',
    category: 'Beauty & Skincare',
    brand: 'GlowOrganic',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.7,
    reviewsCount: 190,
    reviews: [
      { id: 'r-5', userName: 'Michelle T.', rating: 5, comment: 'Unbelievably hydrating! My skin absorbs this immediately, and there is zero sticky residue left behind.', date: '2026-06-24' }
    ],
    merchantId: 'm-3',
    merchantName: 'GlowOrganic Beauty',
    specifications: {
      'Skin Type': 'All skin types, sensitive skin safe',
      'Key Ingredients': 'Hyaluronic Acid, Organic Aloe, Vitamin E',
      'Free From': 'Parabens, Sulfates, Synthetic Fragrances',
      'Volume': '50ml / 1.7 fl.oz'
    },
    variants: [
      { name: 'Bottle Size', options: ['50ml Standard', '100ml Refill (+ $30)'] }
    ],
    selectedVariant: { 'Bottle Size': '50ml Standard' },
    stock: 120,
    salesCount: 650,
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    isApproved: true
  },
  {
    id: 'p-6',
    title: 'ApexCore High-Speed NVMe Gen4 SSD 2TB',
    price: 159.00,
    originalPrice: 199.00,
    description: 'Unleash storage performance with speeds up to 7400MB/s read. Optimized with customized heat sink plates for seamless PlayStation 5 and high-end gaming PC configuration integrations.',
    category: 'Electronics',
    brand: 'ApexTech',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.7,
    reviewsCount: 38,
    reviews: [],
    merchantId: 'm-1',
    merchantName: 'ApexTech Solutions',
    specifications: {
      'Capacity': '2TB NVMe SSD',
      'Interface': 'PCIe Gen 4.0 x4, NVMe 1.4',
      'Sequential Read': 'Up to 7400 MB/s',
      'Sequential Write': 'Up to 6500 MB/s',
      'Form Factor': 'M.2 2280'
    },
    variants: [
      { name: 'Capacity', options: ['1TB', '2TB (+ $60)', '4TB (+ $220)'] }
    ],
    selectedVariant: { Capacity: '2TB (+ $60)' },
    stock: 30,
    salesCount: 150,
    isFeatured: false,
    isTrending: true,
    isFlashSale: false,
    isApproved: true
  },
  {
    id: 'p-7',
    title: 'Titan Hex Cast Iron Kettlebells',
    price: 85.00,
    originalPrice: 110.00,
    description: 'Professional grade cast iron kettlebell. Single-cast core for seamless durability and texture coated handle that fits broad grip requirements for swings, curls, and clean squats.',
    category: 'Sports & Fitness',
    brand: 'Titan Fitness',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'],
    rating: 4.5,
    reviewsCount: 22,
    reviews: [],
    merchantId: 'm-4',
    merchantName: 'Titan Fitness Co',
    specifications: {
      'Material': '100% Solid Cast Iron Core',
      'Finishing': 'Powder Matte Black',
      'Grip Diameter': '33mm standard'
    },
    variants: [
      { name: 'Weight', options: ['12kg', '16kg (+ $20)', '24kg (+ $55)'] }
    ],
    selectedVariant: { Weight: '16kg (+ $20)' },
    stock: 15,
    salesCount: 75,
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    isApproved: false // Awaiting moderation
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 's-1',
    name: 'TransPacific Electronics Corp',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80',
    supplyCategory: 'Electrical Parts & Display Assemblies',
    rating: 4.7,
    pendingRequests: 3,
    status: 'Approved',
    inventoriesSupplied: 15200,
    shipments: [
      { id: 'ship-1', productName: 'AuraSound Headphone Chassis', quantity: 500, status: 'In Transit', shipmentDate: '2026-06-25', trackingNumber: 'TRK-98721A' },
      { id: 'ship-2', productName: 'WorkStation Monitor Display Panels', quantity: 200, status: 'Delivered', shipmentDate: '2026-06-12', trackingNumber: 'TRK-45122B' }
    ]
  },
  {
    id: 's-2',
    name: 'EuroTex Organic Mills',
    logo: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=150&h=150&q=80',
    supplyCategory: 'Premium Wool & Organic Cotton Fibers',
    rating: 4.9,
    pendingRequests: 0,
    status: 'Approved',
    inventoriesSupplied: 34000,
    shipments: [
      { id: 'ship-3', productName: 'Superfine Merino Blend Rolls', quantity: 80, status: 'In Transit', shipmentDate: '2026-06-26', trackingNumber: 'TRK-10902C' }
    ]
  },
  {
    id: 's-3',
    name: 'BioRadiant Labs Germany',
    logo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=150&h=150&q=80',
    supplyCategory: 'Clean Formulations & Serum Components',
    rating: 4.2,
    pendingRequests: 1,
    status: 'Pending',
    inventoriesSupplied: 500,
    shipments: []
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l-1',
    name: 'Fiona Gallagher',
    email: 'fiona@chicagostore.com',
    phone: '+1 (312) 555-8910',
    interestLevel: 'High',
    source: 'Merchant Self-Inquiry',
    status: 'Contacted',
    lastFollowUp: '2026-06-24',
    notes: 'Inquired about subscription levels. Has a high volume of active home inventory and is eager to switch from Shopify.'
  },
  {
    id: 'l-2',
    name: 'Samuel Adebayo',
    email: 'sam@lagoswholesale.net',
    phone: '+234 803 123 4567',
    interestLevel: 'Medium',
    source: 'LinkedIn Outbound',
    status: 'Proposal Sent',
    lastFollowUp: '2026-06-21',
    notes: 'Wholesale supplier looking to connect directly with secondary electronics retailers.'
  },
  {
    id: 'l-3',
    name: 'Yuki Takahashi',
    email: 'yuki@kyotoartisan.jp',
    phone: '+81 90 9876 5432',
    interestLevel: 'High',
    source: 'Organic Search',
    status: 'New',
    lastFollowUp: '2026-06-27',
    notes: 'Handmade organic leather brand. Sent automated welcome pack. Needs manual onboarding assistance.'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    customerId: 'cust-1',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@gmail.com',
    items: [
      { productId: 'p-1', productTitle: 'AuraSound Active ANC Headphones', price: 189.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80', merchantId: 'm-1' }
    ],
    total: 189.99,
    status: 'Shipped',
    shippingStatus: 'In Transit',
    date: '2026-06-25',
    shippingAddress: '42 Wall Street, Apt 12B, New York, NY 10005',
    paymentMethod: 'Wallet Balance',
    trackingNumber: 'DX-718293-USA',
    trackingLogs: [
      { id: 1, status: 'Order Authorized', timestamp: '2026-06-25 10:00 AM', location: 'Payment Gateway Clearing', description: 'Order successfully created and escrow secured.', completed: true },
      { id: 2, status: 'Warehouse Packaging', timestamp: '2026-06-25 02:30 PM', location: 'ApexTech Warehouse #3, CA', description: 'Automated sorting, custom gift boxing, and shipping label attached.', completed: true },
      { id: 3, status: 'Departed Facility', timestamp: '2026-06-26 08:00 AM', location: 'San Francisco Hub, CA', description: 'Loaded onto air freight Line DX-802.', completed: true },
      { id: 4, status: 'In Transit', timestamp: '2026-06-26 06:15 PM', location: 'New York Regional Sort Facility, NY', description: 'Package arrived at regional sorting center. Awaiting courier dispatch.', completed: true, isCurrent: true },
      { id: 5, status: 'Out for Delivery', timestamp: 'Expected 08:30 AM', location: 'Manhattan Courier Fleet, NY', description: 'Driver allocated for last-mile residential drop-off.', completed: false },
      { id: 6, status: 'Delivered', timestamp: 'Pending', location: '42 Wall Street, Apt 12B, New York, NY', description: 'Recipient signature required upon arrival.', completed: false }
    ],
    trackingSteps: [
      { status: 'Order Placed', date: '2026-06-25 10:00', location: 'System', description: 'Order successfully created and payment verified.' },
      { status: 'Fulfillment Processing', date: '2026-06-25 14:30', location: 'ApexTech Warehouse 3', description: 'Merchant sorted, custom packed, and applied logistics label.' },
      { status: 'In Transit', date: '2026-06-26 08:00', location: 'NYC Distribution Hub', description: 'Handed over to DXMARKET priority courier network.' }
    ]
  },
  {
    id: 'ord-1004',
    customerId: 'cust-1',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@gmail.com',
    items: [
      { productId: 'p-2', productTitle: 'ChronoMaster Valjoux Automatic Watch', price: 1250.00, quantity: 1, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=100&q=80', merchantId: 'm-2' }
    ],
    total: 1250.00,
    status: 'Shipped',
    shippingStatus: 'Out for Delivery',
    date: '2026-06-27',
    shippingAddress: '42 Wall Street, Apt 12B, New York, NY 10005',
    paymentMethod: 'Direct Bank Escrow',
    trackingNumber: 'DX-990412-USA',
    trackingLogs: [
      { id: 1, status: 'Order Authorized', timestamp: '2026-06-26 08:00 AM', location: 'Escrow Vault Clearing', description: 'High-value timepiece transaction verified & insured.', completed: true },
      { id: 2, status: 'Warehouse Packaging', timestamp: '2026-06-26 11:30 AM', location: 'Geneva-NYC Secure Depot', description: 'Tamper-evident serial tagging and luxury presentation case sealed.', completed: true },
      { id: 3, status: 'Departed Facility', timestamp: '2026-06-26 06:00 PM', location: 'JFK Armored Air Cargo Hub, NY', description: 'Received at high-value security transit terminal.', completed: true },
      { id: 4, status: 'In Transit', timestamp: '2026-06-27 04:15 AM', location: 'Lower Manhattan Security Depot, NY', description: 'Transferred to armored urban courier vehicle.', completed: true },
      { id: 5, status: 'Out for Delivery', timestamp: '2026-06-27 08:15 AM', location: 'Manhattan Financial District Fleet #09', description: 'Armored courier vehicle is 3 stops away from destination.', completed: true, isCurrent: true },
      { id: 6, status: 'Delivered', timestamp: 'Expected 11:30 AM', location: '42 Wall Street, Apt 12B, New York, NY', description: 'Photo ID & biometric signature required upon receipt.', completed: false }
    ],
    trackingSteps: [
      { status: 'Order Authorized', date: '2026-06-26 08:00', location: 'Escrow Vault', description: 'Verified.' },
      { status: 'Out for Delivery', date: '2026-06-27 08:15', location: 'Manhattan Fleet #09', description: 'Armored courier vehicle 3 stops away.' }
    ]
  },
  {
    id: 'ord-1002',
    customerId: 'cust-1',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@gmail.com',
    items: [
      { productId: 'p-5', productTitle: 'Hyaluronic Botanical Radiance Serum', price: 45.00, quantity: 2, image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=100&q=80', merchantId: 'm-3' }
    ],
    total: 90.00,
    status: 'Delivered',
    shippingStatus: 'Delivered',
    date: '2026-06-18',
    shippingAddress: '42 Wall Street, Apt 12B, New York, NY 10005',
    paymentMethod: 'Credit Card (Visa ending in 4242)',
    trackingNumber: 'DX-112023-USA',
    trackingLogs: [
      { id: 1, status: 'Order Authorized', timestamp: '2026-06-18 09:15 AM', location: 'Payment Gateway Clearing', description: 'Order successfully authorized and payment verified.', completed: true },
      { id: 2, status: 'Warehouse Packaging', timestamp: '2026-06-18 01:20 PM', location: 'Lumière Bio-Labs Storage, WA', description: 'Temperature-controlled botanical packaging completed.', completed: true },
      { id: 3, status: 'Departed Facility', timestamp: '2026-06-19 06:00 AM', location: 'Seattle Air Hub, WA', description: 'In transit via express cargo network.', completed: true },
      { id: 4, status: 'In Transit', timestamp: '2026-06-19 09:30 PM', location: 'JFK International Hub, NY', description: 'Customs cleared and transferred to local metropolitan carrier.', completed: true },
      { id: 5, status: 'Out for Delivery', timestamp: '2026-06-20 07:45 AM', location: 'Manhattan Courier Van #44', description: 'Courier driver en route to destination address.', completed: true },
      { id: 6, status: 'Delivered', timestamp: '2026-06-20 03:40 PM', location: '42 Wall Street, Apt 12B, NY', description: 'Left with resident at front door. Signed by M. Vance.', completed: true, isCurrent: true }
    ],
    trackingSteps: [
      { status: 'Order Placed', date: '2026-06-18 09:15', location: 'System', description: 'Order successfully authorized.' },
      { status: 'Delivered', date: '2026-06-20 15:40', location: 'Front Door', description: 'Left with resident. Signed by M. Vance.' }
    ]
  },
  {
    id: 'ord-1003',
    customerId: 'cust-2',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@techmedia.co',
    items: [
      { productId: 'p-3', productTitle: 'Heritage Cashmere Overcoat', price: 220.00, quantity: 1, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80', merchantId: 'm-2' },
      { productId: 'p-5', productTitle: 'Hyaluronic Botanical Radiance Serum', price: 45.00, quantity: 1, image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=100&q=80', merchantId: 'm-3' }
    ],
    total: 265.00,
    status: 'Processing',
    shippingStatus: 'Processing',
    date: '2026-06-26',
    shippingAddress: '15 Lombard Street, London EC3V 9AM, United Kingdom',
    paymentMethod: 'Saved Mastercard ending in 9988',
    trackingNumber: 'DX-889012-UK',
    trackingLogs: [
      { id: 1, status: 'Order Authorized', timestamp: '2026-06-26 11:30 AM', location: 'Global Escrow Clearing', description: 'Payment verified via saved Mastercard ending in 9988.', completed: true },
      { id: 2, status: 'Warehouse Packaging', timestamp: '2026-06-26 03:15 PM', location: 'Vogue London Atelier, UK', description: 'Garment steaming, luxury garment bagging, and quality check in progress.', completed: true, isCurrent: true },
      { id: 3, status: 'Departed Facility', timestamp: 'Scheduled', location: 'London Heathrow Logistics Terminal', description: 'Awaiting scheduled courier pickup.', completed: false },
      { id: 4, status: 'In Transit', timestamp: 'Pending', location: 'UK National Distribution Grid', description: 'Inter-city linehaul transfer.', completed: false },
      { id: 5, status: 'Out for Delivery', timestamp: 'Pending', location: 'Central London Courier Depot', description: 'Final mile dispatch.', completed: false },
      { id: 6, status: 'Delivered', timestamp: 'Pending', location: '15 Lombard Street, London, UK', description: 'Handed over to concierge.', completed: false }
    ],
    trackingSteps: [
      { status: 'Order Authorized', date: '2026-06-26 11:30', location: 'Escrow Clearing', description: 'Payment verified.' },
      { status: 'Processing', date: '2026-06-26 15:15', location: 'Vogue Atelier UK', description: 'Garment preparation in progress.' }
    ]
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', userId: 'admin-1', userName: 'Super Admin Eleanor', userRole: 'superadmin', action: 'Modified Platform Commission rate from 9.0% to 8.5%', timestamp: '2026-06-27 00:15:32', ipAddress: '192.168.1.55', status: 'Success' },
  { id: 'log-2', userId: 'admin-1', userName: 'Super Admin Eleanor', userRole: 'superadmin', action: 'Approved Supplier: EuroTex Organic Mills', timestamp: '2026-06-26 18:22:10', ipAddress: '192.168.1.55', status: 'Success' },
  { id: 'log-3', userId: 'm-1', userName: 'Alex Mercer (ApexTech)', userRole: 'merchant', action: 'Attempted to upload blacklisted product wordings', timestamp: '2026-06-26 14:02:11', ipAddress: '172.56.21.90', status: 'Failed' },
  { id: 'log-4', userId: 'admin-2', userName: 'Admin Marcus', userRole: 'admin', action: 'Suspended user account account spammer@trashmail.com', timestamp: '2026-06-26 11:30:00', ipAddress: '192.168.1.58', status: 'Success' }
];

export const MOCK_SAMPLE_USERS: SampleUserCredential[] = [
  {
    role: 'customer',
    roleTitle: 'Customer Account',
    name: 'Marcus Vance',
    email: 'marcus.vance@gmail.com',
    password: 'dxcustomer2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    highlights: ['Wallet Balance: $350.00', '1,200 Loyalty Points', 'Live Order Tracking (#ord-1001)', 'Saved Addresses & Wishlist'],
    testScenario: 'Test purchasing items, applying coupons, live timeline order tracking, and checking wallet balances.',
    targetView: 'customer-dashboard'
  },
  {
    role: 'merchant',
    roleTitle: 'Vendor Store (ApexTech)',
    name: 'Alex Mercer',
    email: 'alex@apextech.com',
    password: 'dxmerchant2026',
    avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    highlights: ['Store Balance: $8,450.00', '14 Active Tech Products', '520 Completed Orders', 'Active Coupon: APEX10'],
    testScenario: 'Test uploading new product listings, publishing promotional coupon codes, and reviewing sales analytics.',
    targetView: 'merchant-dashboard'
  },
  {
    role: 'merchant',
    roleTitle: 'Vendor Store (Vogue Essentials)',
    name: 'Sophia Lin',
    email: 'sophia@vogueessentials.com',
    password: 'dxmerchant2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    highlights: ['Store Balance: $14,200.50', '32 Fashion Products', '1,150 Completed Orders', 'Active Coupon: VOGUE20'],
    testScenario: 'Test fashion catalog management, inventory levels, and order fulfillment processing.',
    targetView: 'merchant-dashboard'
  },
  {
    role: 'supplier',
    roleTitle: 'Logistics Supplier',
    name: 'TransPacific Electronics',
    email: 'logistics@transpacific.com',
    password: 'dxsupplier2026',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    highlights: ['15,200 Inventories Supplied', '2 Active Cargo Shipments', '4.7 Logistics Rating', 'Direct B2B Supply Stream'],
    testScenario: 'Test staging raw materials, authorizing cargo transport manifests, and tracking shipment delivery status.',
    targetView: 'supplier-dashboard'
  },
  {
    role: 'sales',
    roleTitle: 'Sales CRM Specialist',
    name: 'Fiona Gallagher',
    email: 'fiona.sales@dxmarket.com',
    password: 'dxsales2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    highlights: ['3 Active Merchant Leads', 'Outbound B2B Pipeline', 'Lead Qualification Tools', 'Commission Tracking'],
    testScenario: 'Test adding new prospective merchant leads, updating follow-up dates, and managing CRM deals.',
    targetView: 'sales-dashboard'
  },
  {
    role: 'admin',
    roleTitle: 'Platform Moderator',
    name: 'Marcus Admin',
    email: 'marcus.admin@dxmarket.com',
    password: 'dxadmin2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    highlights: ['Content Moderation', 'Product & Store Approvals', 'Menu & Banner CMS', 'User Governance'],
    testScenario: 'Test approving pending product listings (e.g. Titan Kettlebells), editing site banners, and managing catalogs.',
    targetView: 'admin-dashboard'
  },
  {
    role: 'superadmin',
    roleTitle: 'Super Admin Executive',
    name: 'Eleanor Vance',
    email: 'eleanor.super@dxmarket.com',
    password: 'dxsuper2026',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    highlights: ['8.5% Commission Rate Control', 'Financial Ledger Audits', 'Full System Settings', 'Security Audit Logs'],
    testScenario: 'Test modifying global marketplace commission rates, inspecting security audit trails, and platform settings.',
    targetView: 'superadmin-dashboard'
  }
];
