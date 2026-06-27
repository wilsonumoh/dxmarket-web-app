export type UserRole = 'guest' | 'customer' | 'merchant' | 'supplier' | 'sales' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
  phone?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  brand: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  merchantId: string;
  merchantName: string;
  specifications: Record<string, string>;
  variants: {
    name: string;
    options: string[];
  }[];
  selectedVariant?: Record<string, string>;
  stock: number;
  salesCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isFlashSale: boolean;
  flashSaleEnds?: string;
  isApproved: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: Record<string, string>;
}

export interface MerchantStore {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  productsCount: number;
  ordersCount: number;
  joinedDate: string;
  isApproved: boolean;
  balance: number;
  coupons: Coupon[];
  ownerName: string;
  ownerEmail: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expiryDate: string;
  minSpend?: number;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  supplyCategory: string;
  rating: number;
  pendingRequests: number;
  status: 'Pending' | 'Approved' | 'Suspended';
  inventoriesSupplied: number;
  shipments: SupplierShipment[];
}

export interface SupplierShipment {
  id: string;
  productName: string;
  quantity: number;
  status: 'In Transit' | 'Delivered' | 'Pending';
  shipmentDate: string;
  trackingNumber: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
  image: string;
  merchantId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  trackingSteps?: {
    status: string;
    date: string;
    location: string;
    description: string;
  }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestLevel: 'High' | 'Medium' | 'Low';
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Lost';
  lastFollowUp: string;
  notes: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  timestamp: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}

export interface SystemConfig {
  commissionRate: number;
  platformName: string;
  maintenanceMode: boolean;
  allowSelfRegistration: boolean;
  enable2FA: boolean;
  currencies: string[];
  languages: string[];
  // Dynamic admin configurations
  heroTitle: string;
  heroDescription: string;
  footerNote: string;
  appMenu: { label: string; view: string }[];
  heroBanners: { title: string; subtitle: string; imageUrl: string; buttonText: string; buttonView: string }[];
  animationStyle: 'Smooth Float' | 'Snappy Bounce' | 'Classic Fade' | 'None';
  animationDuration: number;
  categories: string[];
  featuredProductIds?: string[];
}
