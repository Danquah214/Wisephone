import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// IN-MEMORY DATABASE STATE FOR FULL INTERACTION
let products = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 18500,
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
    description: 'Fully tested, sanitized, and certified. Wise Refurbished Grade A (like-new) iPhone 13 Pro. Comes with a complimentary charger and a 12-month warranty.',
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
    originalPrice: 4950,
    discount: 0,
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
    originalPrice: 4350,
    discount: 0,
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
    storages: []
  },
  {
    id: 'p7',
    name: 'Wise 20000mAh PowerArc Bank',
    brand: 'Wise',
    category: 'accessories',
    price: 650,
    originalPrice: 650,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1609592424109-dd776a3e1eb4?auto=format&fit=crop&q=80&w=600',
    badge: 'Sleek power',
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
    storages: []
  },
  {
    id: 'p8',
    name: '65W GaN Triple USB Fast Charger',
    brand: 'Anker',
    category: 'accessories',
    price: 780,
    originalPrice: 780,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600',
    badge: 'Low Stock',
    description: 'High-speed GaN technology. Ditch your heavy old chargers. Anker 65W lets you safely charge a laptop, phone, and tablet all from one small plug.',
    specifications: {
      Technology: 'GaNPrime II Technology',
      Input: '100-240V',
      Ports: '2x USB-C, 1x USB-A',
      Safety: 'ActiveShield 2.0 temperature protection'
    },
    stock: 3,
    sku: 'AK-GAN65-W',
    rating: 4.7,
    reviewsCount: 52,
    colors: ['Midnight Black', 'Glossy White'],
    storages: []
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
    storages: []
  },
  {
    id: 'p10',
    name: 'Wise MagSafe Premium Armor Case',
    brand: 'Wise',
    category: 'accessories',
    price: 320,
    originalPrice: 320,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600',
    badge: 'Shield',
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
    storages: []
  }
];

let orders = [
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

let recentActivity = [
  { id: 'act-1', type: 'order', text: 'New order Kwame Mensah GHS 4,990 paid via MTN Mobile Money', date: '5 mins ago' },
  { id: 'act-2', type: 'customer', text: 'New account registered for danquahtwumasi214@gmail.com', date: '30 mins ago' },
  { id: 'act-3', type: 'product', text: 'S24 Ultra stock updated by Manager', date: '2 hours ago' },
  { id: 'act-4', type: 'order', text: 'Order WS-TRK-114402 marked as Shipped', date: 'Yesterday' }
];

// LAZY INITIALIZATION FOR GEMINI CLIENT
let geminiClient: any = null;
function getGeminiClient() {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY environment variable is not defined. AI Chatbot assistant will fall back to simulated guides.');
      return null;
    }
    try {
      geminiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return geminiClient;
}

// ---------------------- REST API ENDPOINTS ----------------------

// 1. PRODUCTS
app.get('/api/products', (req: Request, res: Response) => {
  res.json(products);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct = {
    ...req.body,
    id: 'p' + (products.length + 11),
    rating: 5.0,
    reviewsCount: 0
  };
  products.unshift(newProduct);
  recentActivity.unshift({
    id: 'act-' + Date.now(),
    type: 'product',
    text: `Admin added new product: ${newProduct.name}`,
    date: 'Just now'
  });
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    recentActivity.unshift({
      id: 'act-' + Date.now(),
      type: 'product',
      text: `Updated product specification: ${products[index].name}`,
      date: 'Just now'
    });
    return res.json(products[index]);
  }
  res.status(404).json({ error: 'Product not found' });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const deleted = products[index];
    products = products.filter(p => p.id !== id);
    recentActivity.unshift({
      id: 'act-' + Date.now(),
      type: 'product',
      text: `Removed product from catalogue: ${deleted.name}`,
      date: 'Just now'
    });
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Product not found' });
});

// 2. ORDERS
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    city,
    region,
    country,
    items,
    totalAmount,
    discountApplied,
    paymentMethod,
    paymentDetails
  } = req.body;

  if (!customerName || !customerEmail || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing core ordering information' });
  }

  // Decrement stock levels for ordered items
  items.forEach((item: any) => {
    const pIndex = products.findIndex(p => p.id === item.productId);
    if (pIndex !== -1) {
      products[pIndex].stock = Math.max(0, products[pIndex].stock - item.quantity);
    }
  });

  const newOrder = {
    id: `W-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    city,
    region,
    country,
    items,
    totalAmount,
    discountApplied: discountApplied || 0,
    paymentMethod,
    paymentDetails: paymentDetails || {},
    paymentStatus: (paymentMethod.toLowerCase().includes('money') || paymentMethod === 'Card' || paymentMethod === 'Stripe' || paymentMethod === 'PayPal') ? 'Paid' : 'Pending',
    deliveryStatus: 'Pending',
    orderDate: new Date().toISOString(),
    trackingNumber: `WS-TRK-${Math.floor(100000 + Math.random() * 900000)}`
  };

  orders.unshift(newOrder as any);

  // Add a nice recent activity note
  recentActivity.unshift({
    id: 'act-' + Date.now(),
    type: 'order',
    text: `Order ${newOrder.id} placed by ${customerName} (GHS ${totalAmount})`,
    date: 'Just now'
  });

  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { deliveryStatus, paymentStatus } = req.body;
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    if (deliveryStatus) orders[index].deliveryStatus = deliveryStatus;
    if (paymentStatus) orders[index].paymentStatus = paymentStatus;

    recentActivity.unshift({
      id: 'act-' + Date.now(),
      type: 'order',
      text: `Order ${id} is now updated to: ${deliveryStatus || paymentStatus}`,
      date: 'Just now'
    });

    return res.json(orders[index]);
  }
  res.status(404).json({ error: 'Order not found' });
});

// 3. ANALYTICS
app.get('/api/analytics', (req: Request, res: Response) => {
  // calculate totals dynamically to reflect changes
  const salesTotal = orders.reduce((sum, o) => o.paymentStatus === 'Paid' ? sum + o.totalAmount : sum, 0);
  const ordersCount = orders.length;
  const customersCount = new Set(orders.map(o => o.customerEmail)).size;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  // Breakdown of category sales based on current order history
  const salesByCategory = products.reduce((acc, p) => {
    acc[p.category] = 0;
    return acc;
  }, {} as Record<string, number>);

  orders.forEach(o => {
    if (o.paymentStatus === 'Paid') {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const cat = prod.category;
          salesByCategory[cat] = (salesByCategory[cat] || 0) + (item.price * item.quantity);
        }
      });
    }
  });

  res.json({
    salesTotal,
    ordersCount,
    customersCount,
    lowStockCount,
    salesByCategory,
    monthlySales: [
      { month: 'Jan', sales: 9500, count: 3 },
      { month: 'Feb', sales: 12400, count: 4 },
      { month: 'Mar', sales: 8100, count: 2 },
      { month: 'Apr', sales: 14500, count: 4 },
      { month: 'May (MTD)', sales: salesTotal, count: ordersCount }
    ],
    recentActivity: recentActivity.slice(0, 10)
  });
});

// 4. SMART GEMINI CHAT
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages history list is required' });
  }

  // Construct context regarding what we sell and where we deliver
  const businessKnowledgeBase = `
    You are "Wise Assistant", the helpful AI shopping ambassador for "Wise" (a modern premium mobile phones, accessories, and gadgets store based in Ghana and shipping globally).
    Here is our current live store inventory that you can search or recommend to users:
    ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, brand: p.brand, price: `GHS ${p.price}`, description: p.description, stock: p.stock, category: p.category })))}

    Our Business Information:
    - Currency: GHS (Ghanaian New Cedi). If people ask for foreign equivalents, you can loosely say we accept debit/credit cards, PayPal, and Stripe, which automatically converts.
    - Payments: We support MTN Mobile Money, Telecel Cash (formerly Vodafone), AirtelTigo Money, Visa/Mastercard, PayPal, and Stripe.
    - Delivery: Under Ghana, we ship directly to:
      * Greater Accra (ETA: 1-2 Days, Fee: GHS 35)
      * Ashanti (ETA: 2-3 Days, Fee: GHS 50)
      * Western (ETA: 2-3 Days, Fee: GHS 65)
      * Other regions (ETA: 2-5 Days, Fee: GHS 45 - GHS 95)
      * Global/International shipping is handled via DHL inside 5-7 working days.
    - Repairs & Services: Wise will launch professional screen replacements, water damage repairs, battery swaps, and gadget diagnostics in the next phase! You can advise customers to stay tuned.

    Guidelines:
    1. Be friendly, clean, and highly professional. Use formatting (bullet points, bold text) to make your replies clear.
    2. Guide users dynamically. If they need accessories for an iPhone, mention our Wise BassPodz ANC Pro (ANC earbuds, GHS 950) or our MagSafe Premium Armor Case (GHS 320).
    3. Do NOT make up products we don't carry. Always refer back to our official catalog of smartphones/accessories.
    4. Keep answers moderately concise.
  `;

  const client = getGeminiClient();

  if (!client) {
    // If API key is not defined, we fall back gracefully with a highly helpful simulated assistant matching search keywords
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    let mockResponse = `Hello there! I'm the **Wise Assistant**. Our Gemini API premium key is not configured in secrets yet, but I can still orient you! \n\nWe have amazing smartphones in stock right now, including the **iPhone 15 Pro Max** (GHS 18,500), **Samsung Galaxy S24 Ultra** (GHS 16,800), and budget options like the **Infinix Note 40 Pro** (GHS 4,350).\n\nWe accept **MTN Mobile Money**, **Telecel Cash**, and debit cards with delivery to Greater Accra in 1-2 days. How can I assist you further?`;

    const lower = lastUserMessage.toLowerCase();
    if (lower.includes('iphone') || lower.includes('apple')) {
      mockResponse = `Excellent choice! For Apple fans, we currently offer:\n- **iPhone 15 Pro Max** (GHS 18,500) - Brand New flagship.\n- **Wise Certified Refurbished iPhone 13 Pro** (GHS 8,900) - Grade A like-new condition with 12m warranty!\n\nWe also have corresponding **MagSafe Premium Armor Cases** (GHS 320) in stock. Would you like me to help you add any of these to your basket?`;
    } else if (lower.includes('samsung') || lower.includes('galaxy')) {
      mockResponse = `We have the high-end **Samsung Galaxy S24 Ultra** (GHS 16,800) featuring titanium armor and embedded S-Pen, currently a hot best seller! Let me know if you would like to proceed with purchase or check its dimensions.`;
    } else if (lower.includes('accessory') || lower.includes('charger') || lower.includes('earbud') || lower.includes('powerbank')) {
      mockResponse = `Our premium audio and power line-up includes:\n- **Wise BassPodz ANC Pro** (GHS 950, down from GHS 1,250 - Features ANC & 40h play)\n- **Wise PowerArc 20000mAh Power Bank** (GHS 650 - Supports 65W laptop & phone PD charging)\n- **Anker GaN 65W Triple Wall Charger** (GHS 780)\n- **Wise MagSafe Premium Armor Case** (GHS 320)\n\nThese accessories are fully compatible and are ready to ship!`;
    } else if (lower.includes('shipping') || lower.includes('deliver') || lower.includes('accra') || lower.includes('ghana')) {
      mockResponse = `We deliver across Ghana! Here is our standard delivery schedule:\n- **Greater Accra**: GHS 35 (1-2 days delivery ETA)\n- **Ashanti Region (Kumasi)**: GHS 50 (2-3 days ETA)\n- **Western Region (Takoradi)**: GHS 65 (2-3 days ETA)\n- **Northern (Tamale)**: GHS 85\n\nAll items are packaged securely and dispatched with live tracking codes.`;
    }

    return res.json({ text: mockResponse });
  }

  try {
    // Format messages safely for gemini model contents parameter
    const formattedContents = messages.map((m: any) => {
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      };
    });

    // Run using official @google/genai SDK
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: businessKnowledgeBase,
        temperature: 0.7,
      }
    });

    const resultText = response.text || 'Sorry, I couldn\'t process that inquiry.';
    return res.json({ text: resultText });
  } catch (error: any) {
    console.error('Gemini assistant generation failed:', error);
    res.status(500).json({ error: 'Gemini assistant was unable to process your query.', details: error.message });
  }
});


// ----------------- VITE AND PRODUCTION SERVING -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wise shop portal running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
