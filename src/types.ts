export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'smartphones' | 'accessories' | 'laptops' | 'tablets' | 'refurbished';
  price: number;
  originalPrice?: number;
  discount?: number; // percentage
  image: string;
  images?: string[]; // Multiple showcase images
  badge?: string; // e.g. "Best Seller", "New", "Flash Sale"
  description: string;
  specifications: Record<string, string>;
  stock: number;
  sku: string;
  rating: number;
  reviewsCount: number;
  colors: string[];
  storages?: string[]; // e.g. ["128GB", "256GB", "512GB"]
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedStorage?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  region: string; // e.g. Greater Accra, Ashanti, Western etc.
  country: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedColor: string;
    selectedStorage?: string;
    image: string;
  }[];
  totalAmount: number;
  discountApplied: number;
  paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'AirtelTigo Money' | 'Card' | 'Stripe' | 'PayPal';
  paymentDetails?: {
    mobileNumber?: string;
    provider?: string;
    transactionId?: string;
  };
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  orderDate: string;
  trackingNumber: string;
  couponCode?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface StoreStatistics {
  salesTotal: number;
  ordersCount: number;
  customersCount: number;
  lowStockCount: number;
  salesByCategory: Record<string, number>;
  monthlySales: { month: string; sales: number; count: number }[];
  recentActivity: { id: string; type: 'order' | 'product' | 'customer'; text: string; date: string }[];
}
