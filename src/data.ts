import { Product, Order, StoreStatistics } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 18500, // in Ghanaian Cedis (GHS)
    originalPrice: 19500,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
    badge: 'Flagship',
    description: 'The ultimate iPhone featuring a strong and lightweight titanium design, ground-breaking Pro camera system, and the powerful A17 Pro chip for outstanding mobile performance.',
    specifications: {
      Display: '6.7-inch Super Retina XDR OLED, 120Hz',
      Chip: 'A17 Pro Ceramic Shield',
      Camera: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      Battery: 'Up to 29 hours video playback',
      OS: 'iOS 17 (Upgradable to iOS 18)',
      Weight: '221g'
    },
    stock: 12,
    sku: 'AP-IP15PM-256',
    rating: 4.9,
    reviewsCount: 148,
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Blue', 'Titanium White'],
    storages: ['256GB', '512GB', '1TB']
  },
  {
    id: 'p2',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 16800,
    originalPrice: 18000,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
    badge: 'Best Seller',
    description: 'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a titanium exterior and a flat 6.8-inch display. Discover unparalleled creativity, productivity, and possibilities driven by Galaxy AI.',
    specifications: {
      Display: '6.8-inch Dynamic AMOLED 2X, QHD+, 120Hz',
      Chip: 'Snapdragon 8 Gen 3 for Galaxy',
      Camera: '200MP Main + 50MP + 12MP + 10MP Quad Camera with 100x Zoom',
      S_Pen: 'Embedded S-Pen included',
      Battery: '5000mAh with 45W Fast Charging',
      OS: 'Android 14 with One UI 6.1'
    },
    stock: 15,
    sku: 'SM-S24U-256',
    rating: 4.8,
    reviewsCount: 112,
    colors: ['Titanium Yellow', 'Titanium Violet', 'Titanium Gray', 'Titanium Black'],
    storages: ['256GB', '512GB']
  },
  {
    id: 'p3',
    name: 'Wise Refurbished iPhone 13 Pro',
    brand: 'Apple',
    category: 'refurbished',
    price: 8900,
    originalPrice: 10500,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600',
    badge: 'Wise Certified',
    description: 'Fully tested, sanitized, and certified. Wise Refurbished Grade A (like-new) iPhone 13 Pro. Comes with a complimentary charger and a 6-month warranty.',
    specifications: {
      Condition: 'Grade A Refurbished (No visible scratches)',
      Battery_Health: '87% or higher guaranteed',
      Display: '6.1-inch Super Retina XDR with ProMotion',
      Chip: 'A15 Bionic chip',
      Camera: 'Pro 12MP triple camera system'
    },
    stock: 8,
    sku: 'AP-IP13PR-REF',
    rating: 4.6,
    reviewsCount: 45,
    colors: ['Sierra Blue', 'Graphite', 'Gold', 'Alpine Green'],
    storages: ['128GB', '256GB']
  },
  {
    id: 'p4',
    name: 'Tecno Camon 30 Pro 5G',
    brand: 'Tecno',
    category: 'smartphones',
    price: 4950,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    badge: 'New Arrival',
    description: 'Designed for professional mobile imaging. Features a Sony IMX890 50MP OIS primary camera and 144Hz high refresh rate screen for incredible mobile gaming.',
    specifications: {
      Display: '6.78-inch AMOLED, 144Hz AMOLED',
      Chip: 'MediaTek Dimensity 8200 Ultimate 5G',
      Camera: '50MP Sony IMX890 OIS + 50MP Ultra-wide + 2MP Depth',
      Battery: '5000mAh battery with 70W Ultra Charge',
      OS: 'Android 14'
    },
    stock: 24,
    sku: 'TC-C30P-5G',
    rating: 4.7,
    reviewsCount: 38,
    colors: ['Iceland Basalt', 'Clashing Silver', 'Emerald Green'],
    storages: ['256GB']
  },
  {
    id: 'p5',
    name: 'Infinix Note 40 Pro',
    brand: 'Infinix',
    category: 'smartphones',
    price: 4350,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
    badge: 'Budget Pick',
    description: 'Experience 45W Multi-Charge plus magnetic wireless safe charging. Built with 3D curved display for a spectacular flagship-style viewing at an affordable pricing.',
    specifications: {
      Display: '6.78-inch 3D Curved AMOLED, 120Hz',
      Chip: 'MediaTek Helio G99 Ultimate',
      Camera: '108MP OIS Super-Zoom Camera',
      Power: '45W All-Round FastCharge2.0 + 20W Wireless MagCharge',
      RAM_Storage: '8GB RAM + 256GB Storage'
    },
    stock: 32,
    sku: 'IX-N40P-256',
    rating: 4.5,
    reviewsCount: 29,
    colors: ['Vintage Green', 'Titan Gold'],
    storages: ['256GB']
  },
  {
    id: 'p6',
    name: 'Wise BassPodz ANC Pro',
    brand: 'Wise',
    category: 'accessories',
    price: 950,
    originalPrice: 1250,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
    badge: 'Flash Sale',
    description: 'Engineered by Wise. Featuring active noise cancelling (ANC) up to 45dB, customized ultra-bass sound drivers, and an outstanding battery life of up to 40 hours with the smart screen charging case.',
    specifications: {
      ANC: 'Yes (Hybrid up to 45dB)',
      Battery_Life: 'Up to 8 hours (Earbuds) / 40 hours total',
      Water_Resistance: 'IPX5 Sweat resistance',
      Connectivity: 'Bluetooth 5.3 Quick Pair',
      Smart_Touch: 'Full volume, call, and track gestures'
    },
    stock: 65,
    sku: 'WS-BPANC-BLK',
    rating: 4.8,
    reviewsCount: 84,
    colors: ['Onyx Black', 'Pearl White', 'Forest Green'],
  },
  {
    id: 'p7',
    name: 'Wise 20000mAh PowerArc Bank',
    brand: 'Wise',
    category: 'accessories',
    price: 650,
    image: 'https://images.unsplash.com/photo-1609592424109-dd776a3e1eb4?auto=format&fit=crop&q=80&w=600',
    description: 'High capacity, compact design. Offers 65W power delivery (PD) to charge your laptops, tablets, and smartphones simultaneously. Features an LED digital power status indicator screen.',
    specifications: {
      Capacity: '20,000mAh (74Wh)',
      Output_Ports: '2x USB-C PD, 1x USB-A QC 3.0',
      Max_Speed: '65W Power Delivery (Charges Macbook Air)',
      In_the_box: 'USB-C to USB-C 100W woven cable included'
    },
    stock: 45,
    sku: 'WS-P20K-PD65',
    rating: 4.9,
    reviewsCount: 97,
    colors: ['Space Gray', 'Chalk White'],
  },
  {
    id: 'p8',
    name: '65W GaN Triple USB Fast Charger',
    brand: 'Anker',
    category: 'accessories',
    price: 780,
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600',
    description: 'High-speed GaN technology. Ditch your heavy old chargers. Anker 65W lets you safely charge a laptop, phone, and tablet all from one small plug.',
    specifications: {
      Technology: 'GaNPrime II Technology',
      Input: '100-240V',
      Ports: '2x USB-C, 1x USB-A',
      Safety: 'ActiveShield 2.0 temperature protection'
    },
    stock: 3, // Low Stock trigger
    sku: 'AK-GAN65-W',
    rating: 4.7,
    reviewsCount: 52,
    colors: ['Midnight Black', 'Glossy White'],
  },
  {
    id: 'p9',
    name: 'Wise FitWatch Horizon Pro',
    brand: 'Wise',
    category: 'accessories',
    price: 1800,
    originalPrice: 2200,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600',
    badge: 'Premium Wearable',
    description: 'Wise premium health tracker and smartwatch. Beautiful Always-on AMOLED dial, tracks real-time heart rate, blood oxygen (SpO2), stress metrics, and provides advanced sports analysis.',
    specifications: {
      Display: '1.43-inch AMOLED, 466x466 resolution',
      Battery: 'Up to 14 days standard usage',
      GPS: 'Dual-band multi-system GPS',
      Calling: 'Bluetooth call answering & quick SMS text templates'
    },
    stock: 22,
    sku: 'WS-FWH-PRO',
    rating: 4.6,
    reviewsCount: 31,
    colors: ['Carbon Black', 'Active Green', 'Vintage Brown Leather'],
  },
  {
    id: 'p10',
    name: 'Wise MagSafe Premium Armor Case',
    brand: 'Wise',
    category: 'accessories',
    price: 320,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600',
    description: 'Ultra military drop protection case with sleek tactile metallic buttons. Strong circular N52 NdFeB magnets guarantee seamless MagSafe accessories snap-locking.',
    specifications: {
      Material: 'Shockproof TPU + Hard PC scratchproof shield',
      Magnets: 'N52 MagSafe grade alignment array built-in',
      Drop_Rating: '12ft professional test drop certified'
    },
    stock: 120,
    sku: 'WS-MAGAC-IP15',
    rating: 4.5,
    reviewsCount: 16,
    colors: ['Frosted Black', 'Matte Alpine Green', 'Clear Crystal'],
  }
];

export const GH_REGIONS = [
  { name: 'Greater Accra', capital: 'Accra', deliveryFee: 35, eta: '1 - 2 Days' },
  { name: 'Ashanti', capital: 'Kumasi', deliveryFee: 50, eta: '2 - 3 Days' },
  { name: 'Western', capital: 'Sekondi-Takoradi', deliveryFee: 65, eta: '2 - 3 Days' },
  { name: 'Central', capital: 'Cape Coast', deliveryFee: 55, eta: '2 - 3 Days' },
  { name: 'Eastern', capital: 'Koforidua', deliveryFee: 45, eta: '2 - 3 Days' },
  { name: 'Northern', capital: 'Tamale', deliveryFee: 85, eta: '3 - 4 Days' },
  { name: 'Savanah', capital: 'Damongo', deliveryFee: 90, eta: '3 - 5 Days' },
  { name: 'Upper East', capital: 'Bolgatanga', deliveryFee: 95, eta: '3 - 5 Days' },
  { name: 'Volta', capital: 'Ho', deliveryFee: 60, eta: '2 - 3 Days' }
];

export const VALID_COUPONS = [
  { code: 'WISELAUNCH', type: 'percentage', value: 10, minSpend: 500, description: '10% Launch promo for spending above GHS 500' },
  { code: 'MOBILENOW', type: 'flat', value: 200, minSpend: 3000, description: 'GHS 200 off purchases above GHS 3,000' },
  { code: 'AKWASIDAE', type: 'percentage', value: 15, minSpend: 1000, description: 'Special 15% festival discount' }
];

export const RECIPIENT_TEST_INFO = {
  mobileNo: '0244123456',
  email: 'danquahtwumasi214@gmail.com'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'W-ORD-9021',
    customerName: 'Kwame Mensah',
    customerEmail: 'kwame@example.com',
    customerPhone: '0244112233',
    shippingAddress: 'Ring Road Central, near Peak Clinic',
    city: 'Kokomlemle',
    region: 'Greater Accra',
    country: 'Ghana',
    items: [
      {
        productId: 'p5',
        productName: 'Infinix Note 40 Pro',
        price: 4350,
        quantity: 1,
        selectedColor: 'Vintage Green',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600'
      },
      {
        productId: 'p10',
        productName: 'Wise MagSafe Premium Armor Case',
        price: 320,
        quantity: 2,
        selectedColor: 'Frosted Black',
        image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 4990,
    discountApplied: 0,
    paymentMethod: 'MTN Mobile Money',
    paymentDetails: {
      mobileNumber: '0244112233',
      provider: 'MTN',
      transactionId: 'TXN-984411032'
    },
    paymentStatus: 'Paid',
    deliveryStatus: 'Processing',
    orderDate: '2026-05-24T14:22:00Z',
    trackingNumber: 'WS-TRK-784820'
  },
  {
    id: 'W-ORD-8941',
    customerName: 'Abena Agyemang',
    customerEmail: 'abena@example.com',
    customerPhone: '0553998877',
    shippingAddress: 'Patasi Block B, behind Shell station',
    city: 'Kumasi',
    region: 'Ashanti',
    country: 'Ghana',
    items: [
      {
        productId: 'p6',
        productName: 'Wise BassPodz ANC Pro',
        price: 950,
        quantity: 1,
        selectedColor: 'Pearl White',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 950,
    discountApplied: 0,
    paymentMethod: 'Telecel Cash',
    paymentDetails: {
      mobileNumber: '0553998877',
      provider: 'Telecel',
      transactionId: 'TXN-110488274'
    },
    paymentStatus: 'Paid',
    deliveryStatus: 'Shipped',
    orderDate: '2026-05-22T09:12:00Z',
    trackingNumber: 'WS-TRK-114402'
  },
  {
    id: 'W-ORD-7740',
    customerName: 'David Taylor',
    customerEmail: 'david_intl@example.com',
    customerPhone: '+13125556677',
    shippingAddress: '556 E 74th St, Apt 4C',
    city: 'Chicago',
    region: 'Outside Ghana',
    country: 'United States',
    items: [
      {
        productId: 'p1',
        productName: 'iPhone 15 Pro Max',
        price: 18500,
        quantity: 1,
        selectedColor: 'Titanium Blue',
        selectedStorage: '512GB',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 18500,
    discountApplied: 0,
    paymentMethod: 'Stripe',
    paymentStatus: 'Paid',
    deliveryStatus: 'Delivered',
    orderDate: '2026-05-18T18:40:00Z',
    trackingNumber: 'WS-TRK-894002'
  }
];

export const INITIAL_ANALYTICS: StoreStatistics = {
  salesTotal: 49340,
  ordersCount: 14,
  customersCount: 11,
  lowStockCount: 1, // Only Anker GaN Charger count is 3
  salesByCategory: {
    smartphones: 39800,
    accessories: 4450,
    refurbished: 5090,
  },
  monthlySales: [
    { month: 'Jan', sales: 9500, count: 3 },
    { month: 'Feb', sales: 12400, count: 4 },
    { month: 'Mar', sales: 8100, count: 2 },
    { month: 'Apr', sales: 14500, count: 4 },
    { month: 'May (MTD)', sales: 24340, count: 6 }
  ],
  recentActivity: [
    { id: 'act-1', type: 'order', text: 'New order Kwame Mensah GHS 4,990 paid via Mobile Money', date: '5 mins ago' },
    { id: 'act-2', type: 'customer', text: 'New account registered for danquahtwumasi214@gmail.com', date: '30 mins ago' },
    { id: 'act-3', type: 'product', text: 'S24 Ultra stock updated by Manager', date: '2 hours ago' },
    { id: 'act-4', type: 'order', text: 'Order WS-TRK-114402 marked as Shipped', date: 'Yesterday' }
  ]
};
