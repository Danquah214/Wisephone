import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ArrowRight, ShieldCheck, Heart, Sparkles, Check, RefreshCw, Cpu, Phone } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import WiseAssistant from './components/WiseAssistant';
import { Product, CartItem, Order, StoreStatistics } from './types';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminOpened, setAdminOpened] = useState<boolean>(false);

  // Database core state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<StoreStatistics | null>(null);

  // Cart and favorites (Wishlist) synced with LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wise_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wise_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutSummary, setCheckoutSummary] = useState<any | null>(null);
  
  // Filtering & search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState<number>(20000);

  // Trigger tracking code from checkout success
  const [trackedCode, setTrackedCode] = useState('');

  // Local sync saving
  useEffect(() => {
    localStorage.setItem('wise_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wise_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // DB Sync loading
  const fetchStoreData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      const ordRes = await fetch('/api/orders');
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }

      const statsRes = await fetch('/api/analytics');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setAnalytics(statsData);
      }
    } catch (err) {
      console.error('Error fetching data from API endpoints:', err);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // API Call Handlers
  const handleAddProduct = async (payload: any): Promise<Product | null> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const added = await res.json();
        await fetchStoreData();
        return added;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleUpdateProduct = async (id: string, payload: any): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchStoreData();
        return updated;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchStoreData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleUpdateOrder = async (id: string, payload: any): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        await fetchStoreData();
        return updated;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleTrackSearch = async (trackingNum: string): Promise<Order | null> => {
    try {
      // Find within local / API loaded orders instantly
      const matched = orders.find(o => o.trackingNumber.toUpperCase() === trackingNum.trim().toUpperCase() || o.id.toUpperCase() === trackingNum.trim().toUpperCase());
      return matched || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Chat message fetch
  const handleSendMessage = async (history: { role: string; content: string }[]): Promise<string> => {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await response.json();
      return data.text || 'I unable to retrieve a response right now.';
    } catch (err) {
      console.error(err);
      return 'AI Shopping Assistant communications are currently congested. Our technicians are repairing links!';
    }
  };

  // Cart operations operations
  const handleAddToCart = (product: Product, color: string, storage?: string, quantity = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedColor === color && 
                item.selectedStorage === storage
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedColor: color, selectedStorage: storage }];
    });
    
    // Open drawer to trigger instant satisfaction
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (idx: number, qty: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[idx].quantity = qty;
      return updated;
    });
  };

  const handleRemoveFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Placing Order clears cart
  const handleOrderSuccess = (newOrder: Order) => {
    setCart([]);
    setCheckoutSummary(null);
    setTrackedCode(newOrder.trackingNumber);
    setActiveTab('tracker');
    setAdminOpened(false);
    fetchStoreData();
  };

  // Searching helper
  const handleSearchTrigger = (query: string) => {
    setSearchQuery(query);
    setActiveTab('shop');
    setAdminOpened(false);
  };

  // Filtering products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesPrice = p.price <= priceFilter;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Featured Flagship
  const featured = products.find(p => p.badge === 'Flagship') || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-950 antialiased">
      
      {/* HEADER COMPONENT */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        wishlist={wishlist}
        setIsCartOpen={setIsCartOpen}
        openAdmin={adminOpened}
        setOpenAdmin={setAdminOpened}
      />

      {/* CORE VIEW TARGET ROUTING */}
      <main className="flex-1 pb-16">
        
        {/* ADMIN OVERLAY DESK */}
        {adminOpened ? (
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrder={handleUpdateOrder}
            stats={analytics || {
              salesTotal: 49340,
              ordersCount: orders.length,
              customersCount: 11,
              lowStockCount: products.filter(p => p.stock <= 5).length,
              salesByCategory: { smartphones: 39800, accessories: 4450, refurbished: 5090 },
              monthlySales: [],
              recentActivity: []
            }}
            onRefresh={fetchStoreData}
          />
        ) : activeTab === 'home' ? (
          /* PUBLIC HOME OVERVIEW */
          <div className="space-y-12">
            
            {/* HERO HERO MODULE */}
            <Hero
              onSearch={handleSearchTrigger}
              onFilterCategory={(cat) => { setCategoryFilter(cat); setActiveTab('shop'); }}
              featuredProduct={featured}
              onSelectProduct={setSelectedProduct}
            />

            {/* QUICK CATEGORIES BOX */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center md:text-left space-y-1 mb-6">
                <h3 className="font-display text-sm font-bold text-gray-500 uppercase tracking-widest block font-bold">Catalog Channels</h3>
                <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight">Select by core categories</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Smartphones', icon: '📱', desc: 'Sleek flagship and budget ones', key: 'smartphones' },
                  { title: 'Wise Refurbished', icon: '✨', desc: 'Tested Grade-A with 12m warranty', key: 'refurbished' },
                  { title: 'BassPodz Audio', icon: '🎧', desc: 'Active ANC Pro earbuds & speakers', key: 'accessories' },
                  { title: 'Power and Protection', icon: '🔌', desc: 'Triple GaN chargers and banks', key: 'accessories' }
                ].map((item, id) => (
                  <div
                    key={id}
                    onClick={() => {
                      setCategoryFilter(item.key);
                      setActiveTab('shop');
                    }}
                    className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5"
                  >
                    <span className="text-3xl bg-gray-50 rounded-xl p-2.5 inline-block group-hover:bg-blue-50 transition-colors">{item.icon}</span>
                    <h4 className="font-display text-sm font-extrabold text-gray-900 mt-4 tracking-tight group-hover:text-blue-600 transition-colors uppercase leading-tight">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED BEST SELLERS ROW */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-gray-100 pb-4 mb-8 font-sans">
                <div>
                  <h3 className="font-display text-sm font-bold text-gray-500 uppercase tracking-widest block font-bold">TOP PICKS</h3>
                  <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight">Best sellers in store right now</h2>
                </div>
                <button
                  onClick={() => { setCategoryFilter('all'); setActiveTab('shop'); }}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>Search Full Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={setSelectedProduct}
                    onAddToCart={(prod, col, stor) => handleAddToCart(prod, col, stor, 1)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some(w => w.id === p.id)}
                  />
                ))}
              </div>
            </div>

            {/* INTERACTIVE WISE SERVICES BUMB */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950">
                <div className="space-y-4 max-w-xl text-center md:text-left font-sans">
                  <span className="inline-flex items-center space-x-1 rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Coming Phase 2</span>
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight leading-none text-white">Wise Fix Diagnostics & Repairs</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Cracked display screen? Battery draining too fast? Our upcoming certified Wise technicians will use original OEM diagnostics and replacements with express 2-hour completion in Accra.
                  </p>
                </div>
                <button
                  onClick={() => handleSearchTrigger('Refurbished')}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-sans text-xs font-black uppercase tracking-wider px-6 py-4.5 rounded-2xl shrink-0 shadow-lg"
                >
                  Browse Repaired Grade-A Devices
                </button>
              </div>
            </div>

            {/* BRAND VALUE INJECTS */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              <div className="flex bg-white rounded-2xl p-6 border space-x-4 items-start">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 font-extrabold text-xl font-display shrink-0">🛠️</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Tested & Sealed</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Every refurbished device undergoes our certified 45-point hardware inspection process.</p>
                </div>
              </div>
              <div className="flex bg-white rounded-2xl p-6 border space-x-4 items-start">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 font-extrabold text-xl font-display shrink-0">🔒</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Ghanaian Gateways</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Approved secure processing for MTN Mobile Money, Telecel Cash, and secure card transactions.</p>
                </div>
              </div>
              <div className="flex bg-white rounded-2xl p-6 border space-x-4 items-start">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 font-extrabold text-xl font-display shrink-0">🤝</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Dedicated Advisors</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Our smart Wise help system uses actual real-time specifications mapping to identify solutions.</p>
                </div>
              </div>
            </div>

          </div>
        ) : activeTab === 'shop' ? (
          /* CORE SEARCHABLE SHOP CHANNEL */
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b pb-4 mb-8 gap-4 font-sans">
              <div>
                <h2 className="font-display text-2xl font-black text-gray-900 tracking-tight">Wise Hardware Catalog</h2>
                <p className="text-xs text-gray-400 mt-1">Found {filteredProducts.length} premium tech items matching options.</p>
              </div>

              {/* SEARCH & FILTERS CONTROLS */}
              <div className="flex flex-wrap items-end gap-3 md:gap-4">
                {/* GHS PRICE SLIDER CONTAINER */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-gray-550 uppercase tracking-wider">Price Range (GHS):</span>
                  <div className="flex items-center space-x-2 bg-white border border-gray-150 shadow-xs rounded-xl px-3 py-1.5 text-xs font-semibold">
                    <input
                      type="range"
                      min="100"
                      max="20000"
                      step="100"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-blue-600 h-1 bg-gray-250 cursor-pointer rounded-lg appearance-none"
                    />
                    <span className="text-blue-600 font-mono font-bold whitespace-nowrap min-w-[75px] text-right">≤ GHS {priceFilter.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-gray-550 uppercase tracking-wider">Category Filter:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 h-[34px] cursor-pointer"
                  >
                    <option value="all">All Category Items</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                    <option value="refurbished">Refurbished Phones</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-gray-550 uppercase tracking-wider">Keyword Search:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search model name..."
                      className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 w-48 h-[34px]"
                    />
                    <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                
                {(searchQuery || categoryFilter !== 'all' || priceFilter < 20000) && (
                  <button
                    onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setPriceFilter(20000); }}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer py-2 px-1 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed space-y-4">
                <span className="text-4xl bg-gray-50 p-4 rounded-full inline-block">🔍</span>
                <div>
                  <h3 className="text-base font-bold text-gray-800">No items match your filters</h3>
                  <p className="text-xs text-gray-400 mt-1">Try expanding your GHS budget limit or search key queries.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setPriceFilter(20000); }}
                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {filteredProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={setSelectedProduct}
                    onAddToCart={(prod, col, stor) => handleAddToCart(prod, col, stor, 1)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some(w => w.id === p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'tracker' ? (
          /* LIVE TRACKER */
          <OrderTracker 
            onSearchTracker={handleTrackSearch} 
            initialTrackingCode={trackedCode}
          />
        ) : (
          /* DETAILS SPECIFICATIONS & SUPPORT POLICY */
          <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 font-sans space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Wise Specifications & Warranty Policy</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                Read are commitment to device durability, product packaging steps, and delivery timelines inside Ghana.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 md:p-8 space-y-6 text-xs text-gray-650 leading-relaxed font-medium">
              <div className="space-y-2">
                <h4 className="font-display text-sm font-bold text-gray-900 uppercase tracking-widest block font-extrabold flex items-center space-x-1.5">
                  <span>📱</span>
                  <span>1. Wise Certified Grade-A Standard</span>
                </h4>
                <p>
                  Every pre-loved or refurbished smartphone offered inside our digital catalog conforms with Wise Certified standards. Our hardware supervisors undergo rigorous 45-step diagnostics checking battery thresholds, display digitizer levels, cellular network frequencies, speaker decibels, and flash memory sectors. We promise Grade-A premium performance.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-sm font-bold text-gray-900 uppercase tracking-widest block font-extrabold flex items-center space-x-1.5">
                  <span>🔒</span>
                  <span>2. Payment Clearance Guarantee</span>
                </h4>
                <p>
                  We leverage highly secure APIs for MTN Mobile Money, Telecel Cash, and universal debit/credit cards. Funds are validated instantly under our security verification models to prevent any billing compromises. Receipts are generated dynamically and delivered directly to your mailbox.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-sm font-bold text-gray-900 uppercase tracking-widest block font-extrabold flex items-center space-x-1.5">
                  <span>🚚</span>
                  <span>3. Local Shipping & ETA Timelines</span>
                </h4>
                <p>
                  In Greater Accra we dispatch within 24 hours. Under Kumasi (Ashanti), Takoradi (Western), and Volta Regions package transits take 2 to 3 Working Days. Our packages are secured under military-strength shockproof casing tags to secure your smartphone displays against transport impacts.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-12 text-center text-xs text-gray-400 font-sans">
        <div className="mx-auto max-w-7xl px-4 space-y-4">
          <p className="font-display text-base font-bold text-gray-950">Wise<span className="text-blue-600">.</span> Tech Hub</p>
          <p className="max-w-md mx-auto leading-relaxed">
            The authentic mobile phones and high-speed protection gadgets marketplace. Delivered next-day with real-time Mobile Money authorization routers.
          </p>
          <div className="flex justify-center space-x-4 text-[10px] font-mono select-none pt-4">
            <span>&copy; {new Date().getFullYear()} Wise Inc. Ghana</span>
            <span>•</span>
            <span>Accra Central office</span>
            <span>•</span>
            <span>Support: +233 24 412 3456</span>
          </div>
        </div>
      </footer>

      {/* DETAILED SPECS MODAL MODAL */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* SHOPPING CART OVERVIEW DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={(summ) => {
          setCheckoutSummary(summ);
          setIsCartOpen(false);
        }}
      />

      {/* SECURE MOMO BILL PAYMENT GATEWAY */}
      <CheckoutModal
        summary={checkoutSummary}
        cart={cart}
        onClose={() => setCheckoutSummary(null)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* FLOATING WIRELESS AI Tech Assistant */}
      <WiseAssistant
        onSendMessage={handleSendMessage}
        onQuickSelectProduct={(pName) => {
          const matched = products.find(p => p.name.toLowerCase().includes(pName.toLowerCase()));
          if (matched) setSelectedProduct(matched);
        }}
      />

    </div>
  );
}
