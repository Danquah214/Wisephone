import { useState, useEffect, FormEvent } from 'react';
import { Activity, Plus, Trash2, Edit, Save, Truck, Package, ShoppingCart, Users, DollarSign, Archive, X, Info } from 'lucide-react';
import { Product, Order, StoreStatistics } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (prodData: any) => Promise<Product | null>;
  onUpdateProduct: (id: string, updatedData: any) => Promise<Product | null>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onUpdateOrder: (id: string, updatedData: any) => Promise<Order | null>;
  stats: StoreStatistics;
  onRefresh: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  stats,
  onRefresh
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  
  // Product Creation Forms state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPName, setNewPName] = useState('');
  const [newPBrand, setNewPBrand] = useState('Apple');
  const [newPCategory, setNewPCategory] = useState<'smartphones' | 'accessories' | 'refurbished'>('smartphones');
  const [newPPrice, setNewPPrice] = useState(1000);
  const [newPStock, setNewPStock] = useState(10);
  const [newPSku, setNewPSku] = useState('');
  const [newPImage, setNewPImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600');
  const [newPImagesList, setNewPImagesList] = useState<string[]>([]);
  const [newExtraImageUrlAdd, setNewExtraImageUrlAdd] = useState('');
  const [newPDesc, setNewPDesc] = useState('Premium Wise electronics product offering outstanding life longevity.');

  // Inline Stock Edit State
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState(0);

  // Inline Price Edit State
  const [editingPId, setEditingPId] = useState<string | null>(null);
  const [editingPriceVal, setEditingPriceVal] = useState(0);

  // Comprehensive Product Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPName, setEditPName] = useState('');
  const [editPBrand, setEditPBrand] = useState('Apple');
  const [editPCategory, setEditPCategory] = useState<'smartphones' | 'accessories' | 'refurbished' | 'laptops' | 'tablets'>('smartphones');
  const [editPPrice, setEditPPrice] = useState(0);
  const [editPOriginalPrice, setEditPOriginalPrice] = useState(0);
  const [editPStock, setEditPStock] = useState(0);
  const [editPSku, setEditPSku] = useState('');
  const [editPImage, setEditPImage] = useState('');
  const [editPImagesList, setEditPImagesList] = useState<string[]>([]);
  const [editPDesc, setEditPDesc] = useState('');
  const [newExtraImageUrl, setNewExtraImageUrl] = useState('');

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditPName(product.name);
    setEditPBrand(product.brand);
    setEditPCategory(product.category as any);
    setEditPPrice(product.price);
    setEditPOriginalPrice(product.originalPrice || product.price);
    setEditPStock(product.stock);
    setEditPSku(product.sku);
    setEditPImage(product.image);
    setEditPImagesList(product.images || []);
    setEditPDesc(product.description);
    setNewExtraImageUrl('');
  };

  const handleSaveProductEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Calculate percent discount automatically from difference
    const origPrice = Number(editPOriginalPrice) || Number(editPPrice);
    const salePrice = Number(editPPrice);
    let discountPercent = 0;
    if (origPrice > salePrice) {
      discountPercent = Math.round(((origPrice - salePrice) / origPrice) * 100);
    }

    const payload = {
      name: editPName,
      brand: editPBrand,
      category: editPCategory,
      price: salePrice,
      originalPrice: origPrice,
      discount: discountPercent,
      image: editPImage,
      images: editPImagesList,
      stock: Number(editPStock),
      sku: editPSku,
      description: editPDesc
    };

    const updated = await onUpdateProduct(editingProduct.id, payload);
    if (updated) {
      setEditingProduct(null);
      onRefresh();
    }
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPName || !newPSku) return;

    const payload = {
      name: newPName,
      brand: newPBrand,
      category: newPCategory,
      price: Number(newPPrice),
      originalPrice: Number(newPPrice),
      discount: 0,
      image: newPImage,
      images: newPImagesList,
      badge: 'New',
      description: newPDesc,
      specifications: {
        Display: '6.7-inch Super AMOLED',
        Chip: 'Octa-Core Processor',
        Camera: '50MP Triple System Camera',
        Warranty: '12 Months Official Wise Warranty'
      },
      stock: Number(newPStock),
      sku: newPSku,
      colors: ['Charcoal Black', 'Arctic Silver']
    };

    const added = await onAddProduct(payload);
    if (added) {
      setShowAddForm(false);
      setNewPName('');
      setNewPSku('');
      setNewPImagesList([]);
      setNewExtraImageUrlAdd('');
      onRefresh();
    }
  };

  const handleUpdateStock = async (id: string) => {
    const updated = await onUpdateProduct(id, { stock: editingStockVal });
    if (updated) {
      setEditingStockId(null);
      onRefresh();
    }
  };

  const handleUpdatePrice = async (id: string) => {
    const updated = await onUpdateProduct(id, { price: editingPriceVal, originalPrice: editingPriceVal });
    if (updated) {
      setEditingPId(null);
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    const success = await onDeleteProduct(id);
    if (success) {
      onRefresh();
    }
  };

  const handleOrderStatusChange = async (orderId: string, statusVal: string) => {
    await onUpdateOrder(orderId, { deliveryStatus: statusVal });
    onRefresh();
  };

  const handleOrderPaymentChange = async (orderId: string, statusVal: string) => {
    await onUpdateOrder(orderId, { paymentStatus: statusVal });
    onRefresh();
  };

  // Find max monthly value to scale graphic bars
  const maxMonthlySales = Math.max(...stats.monthlySales.map(m => m.sales), 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100/60 px-2.5 py-0.5 text-xs text-blue-800 font-bold uppercase tracking-wider">
            <Activity className="h-3 w-3 animate-pulse text-blue-600" />
            <span>WISE SHOPPING CHANNELS CORE NETWORK API</span>
          </span>
          <h2 className="font-display text-3xl font-black text-gray-900 mt-1">Wise Real-Time Analytics Desk</h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">CONNECTED NODE OUTLETS: GH_ACC_01 (GHS ACCRA CENTRAL HUB)</p>
        </div>

        {/* SUB NAV TARGET BUTTONS */}
        <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-bold leading-none select-none">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`rounded-lg px-4 py-2 transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Store Reports
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`rounded-lg px-4 py-2 transition-all ${
              activeSubTab === 'products'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`rounded-lg px-4 py-2 transition-all ${
              activeSubTab === 'orders'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Fulfill Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* METRIC BOXES GRIDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 font-sans">
        
        {/* REVENUE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Total Revenue</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><DollarSign className="h-4 w-4" /></span>
          </div>
          <p className="text-2xl font-black font-display text-gray-900">GHS {stats.salesTotal?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-450 font-mono">100% paid transactions</p>
        </div>

        {/* ORDER VOLUME */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Fulfillments</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><ShoppingCart className="h-4 w-4" /></span>
          </div>
          <p className="text-2xl font-black font-display text-gray-900">{stats.ordersCount}</p>
          <p className="text-[10px] text-gray-450 font-mono">Orders dispatch queues</p>
        </div>

        {/* CUSTOMERS COUNT */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Store Shoppers</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Users className="h-4 w-4" /></span>
          </div>
          <p className="text-2xl font-black font-display text-gray-900">{stats.customersCount}</p>
          <p className="text-[10px] text-gray-450 font-mono">Active account registers</p>
        </div>

        {/* CRITICAL STOCK OUTS COUNT */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Inventory Alerts</span>
            <span className="p-2 rounded-xl bg-red-50 text-red-650"><Archive className="h-4 w-4" /></span>
          </div>
          <p className="text-2xl font-black font-display text-red-600">{stats.lowStockCount}</p>
          <p className="text-[10px] text-gray-450 font-mono">Stock items &le; 5 units</p>
        </div>

      </div>

      {/* SUB-SECTION CHANNELS */}

      {/* 1. STORE REPORTS / CHARTS REPORT */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 font-sans">
          
          {/* MONTLY SALES HISTOGRAM CHART */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider block">Monthly Net Turnover History (GHS)</h3>
            <div className="space-y-3.5 pt-2">
              {stats.monthlySales.map((m, idx) => {
                const percentage = (m.sales / maxMonthlySales) * 100;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="font-semibold text-gray-750">{m.month} ({m.count} purchases)</span>
                      <span className="font-bold text-gray-900">GHS {m.sales.toLocaleString()}</span>
                    </div>
                    <div className="h-4 w-full bg-gray-50 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-gray-400 bg-gray-50 p-3 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
              <span>Turnover charts auto-compile dynamically as new Mobile Money checkout invoices receive clearance.</span>
            </div>
          </div>

          {/* SHARE SPECS BY CATEGORY AND RECENT ACTIVITY LOGS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CATEGORIES PIE REPAIR */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Turnover Share by category</h3>
              <div className="space-y-3 font-sans text-xs">
                {Object.entries(stats.salesByCategory).map(([cat, val]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between uppercase">
                      <span className="font-medium text-gray-500">{cat}</span>
                      <span className="font-bold font-mono text-gray-900">GHS {val.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${stats.salesTotal > 0 ? (val / stats.salesTotal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL-TIME LOGGING */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider block">Live Store Network Events</h3>
              <div className="space-y-3 max-h-[185px] overflow-y-auto pr-1">
                {stats.recentActivity.map(act => (
                  <div key={act.id} className="text-[11px] leading-tight pb-2 border-b last:border-0 hover:bg-gray-50 px-1 py-0.5 rounded transition-colors flex items-start gap-2 font-sans">
                    <span className="mt-0.5">
                      {act.type === 'order' ? '📥' : act.type === 'customer' ? '👤' : '📦'}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium leading-tight">{act.text}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-mono">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. PRODUCTS INVENTORY CONTROL */}
      {activeSubTab === 'products' && (
        <div className="space-y-6 mt-8 font-sans">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Inventory Hub</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-md shadow-blue-500/10"
              id="admin-add-product-btn"
            >
              <Plus className="h-4 w-4" />
              <span>Add Smartphone / Acc</span>
            </button>
          </div>

          {/* ADD PRODUCT OVERLAY FORM */}
          {showAddForm && (
            <form onSubmit={handleCreateProduct} className="p-5 bg-gray-55 border border-gray-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fade-in">
              <div className="md:col-span-3 pb-2 border-b flex justify-between items-center">
                <span className="font-bold text-gray-850 uppercase">New Store Item Particulars:</span>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-red-500"><X className="h-4.5 w-4.5" /></button>
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Product Display Name</label>
                <input
                  type="text"
                  required
                  value={newPName}
                  onChange={(e) => setNewPName(e.target.value)}
                  placeholder="e.g. iPhone 15 Plus"
                  className="w-full rounded-xl border bg-white px-3 py-2"
                />
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Brand Manufacturer</label>
                <select
                  value={newPBrand}
                  onChange={(e) => setNewPBrand(e.target.value)}
                  className="w-full rounded-xl border bg-white px-3 py-2"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Tecno">Tecno</option>
                  <option value="Infinix">Infinix</option>
                  <option value="Wise">Wise</option>
                  <option value="Anker">Anker</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Product SKU (Unqiue)</label>
                <input
                  type="text"
                  required
                  value={newPSku}
                  onChange={(e) => setNewPSku(e.target.value)}
                  placeholder="AP-IP15P-128"
                  className="w-full rounded-xl border bg-white px-3 py-2 uppercase font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Catalog Category</label>
                <select
                  value={newPCategory}
                  onChange={(e) => setNewPCategory(e.target.value as any)}
                  className="w-full rounded-xl border bg-white px-3 py-2"
                >
                  <option value="smartphones">Smartphones</option>
                  <option value="accessories">Accessories</option>
                  <option value="refurbished">Wise Refurbished</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Launch Price (GHS)</label>
                <input
                  type="number"
                  required
                  value={newPPrice}
                  onChange={(e) => setNewPPrice(Number(e.target.value))}
                  className="w-full rounded-xl border bg-white px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Initial Stock Capacity</label>
                <input
                  type="number"
                  required
                  value={newPStock}
                  onChange={(e) => setNewPStock(Number(e.target.value))}
                  className="w-full rounded-xl border bg-white px-3 py-2 font-mono"
                />
              </div>
              <div className="md:col-span-3">
                <label className="font-bold text-gray-500 uppercase block mb-1">Main Cover High-Res Image URL</label>
                <input
                  type="text"
                  required
                  value={newPImage}
                  onChange={(e) => setNewPImage(e.target.value)}
                  className="w-full rounded-xl border bg-white px-3 py-2 font-mono text-[11px]"
                />
              </div>
              <div className="md:col-span-3 bg-gray-50/50 p-4 border border-dashed border-gray-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <span className="font-bold text-gray-750 uppercase tracking-wide">Additional Showcase Gallery Pictures ({newPImagesList.length})</span>
                  <p className="text-[10px] text-gray-400">Add side or variant high-res snapshot links</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExtraImageUrlAdd}
                    onChange={(e) => setNewExtraImageUrlAdd(e.target.value)}
                    placeholder="Paste link to additional picture URL..."
                    className="flex-1 rounded-xl border bg-white px-3 py-2 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newExtraImageUrlAdd.trim()) {
                        setNewPImagesList(prev => [...prev, newExtraImageUrlAdd.trim()]);
                        setNewExtraImageUrlAdd('');
                      }
                    }}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs shrink-0 transition-colors cursor-pointer"
                  >
                    Add Image
                  </button>
                </div>
                {newPImagesList.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {newPImagesList.map((url, idx) => (
                      <div key={idx} className="relative h-14 w-14 group rounded-lg overflow-hidden border bg-white shadow-xs shrink-0">
                        <img src={url} alt={`Showcase ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setNewPImagesList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-red-650/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-3">
                <label className="font-bold text-gray-500 uppercase block mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  required
                  value={newPDesc}
                  onChange={(e) => setNewPDesc(e.target.value)}
                  className="w-full rounded-xl border bg-white px-3 py-2"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Commit Product into Core Catalog Database
                </button>
              </div>
            </form>
          )}

          {/* CATALOG TABLES */}
          <div className="overflow-hidden rounded-2xl border border-gray-150">
            <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5">Display Item</th>
                  <th className="px-5 py-3.5">SKU / Brand</th>
                  <th className="px-5 py-3.5">Pricing</th>
                  <th className="px-5 py-3.5">Inventory Units</th>
                  <th className="px-5 py-3.5 text-center">Operation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-sans">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-55 transition-colors">
                    <td className="px-5 py-3 flex items-center space-x-3.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 object-cover rounded-lg border bg-gray-50 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="leading-tight">
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize mt-0.5">{p.category}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono">
                      <p className="font-semibold text-gray-750">{p.sku}</p>
                      <p className="text-[10px] text-gray-400">{p.brand}</p>
                    </td>
                    <td className="px-5 py-3">
                      {editingPId === p.id ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={editingPriceVal}
                            onChange={(e) => setEditingPriceVal(Number(e.target.value))}
                            className="w-20 rounded border px-2 py-1 font-mono text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdatePrice(p.id)}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <Save className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-gray-950">GHS {p.price.toLocaleString()}</span>
                          <button
                            onClick={() => {
                              setEditingPId(p.id);
                              setEditingPriceVal(p.price);
                            }}
                            className="text-gray-300 hover:text-blue-600"
                            title="Edit Price"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {editingStockId === p.id ? (
                        <div className="flex items-center space-x-1 leading-none">
                          <input
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(Number(e.target.value))}
                            className="w-16 rounded border px-2 py-1 font-mono text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateStock(p.id)}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <Save className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span 
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${
                              p.stock <= 0 
                                ? 'bg-red-100 text-red-750' 
                                : p.stock <= 5 
                                ? 'bg-amber-100 text-amber-700 font-extrabold animate-pulse' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.stock} In Stock
                          </span>
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setEditingStockVal(p.stock);
                            }}
                            className="text-gray-300 hover:text-blue-600"
                            title="Edit Stock"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all cursor-pointer"
                          title="Comprehensive Product Editor"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                          title="Delete Product"
                          id={`del-btn-${p.id}`}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. ORDERS FULFILLMENTS DISPATCH AND TRACKING MANAGEMENT */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6 mt-8 font-sans text-xs">
          
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider block mb-4">Customer Orders Queue List</h3>

          <div className="overflow-hidden rounded-2xl border border-gray-150">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer Shipping Details</th>
                  <th className="px-5 py-3.5">Package Contents</th>
                  <th className="px-5 py-3.5 text-center">Fulfillment Status</th>
                  <th className="px-5 py-3.5 text-center">Order Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-sans text-xs">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-55 transition-colors">
                    
                    {/* ORDER ID */}
                    <td className="px-5 py-4 font-mono">
                      <p className="font-extrabold text-blue-600 text-sm">{o.id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(o.orderDate).toLocaleDateString()}</p>
                      <p className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold mt-2 inline-block select-all">{o.trackingNumber}</p>
                    </td>

                    {/* CUSTOMER INFO */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{o.customerName}</p>
                      <p className="text-gray-500 font-mono text-[11px] mt-0.5">{o.customerEmail}</p>
                      <p className="text-gray-450 text-[10px] mt-0.5 font-mono">{o.customerPhone}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">{o.shippingAddress}, {o.city}</p>
                    </td>

                    {/* PACKAGE CONTENTS */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5 max-w-xs">
                        {o.items.map((item, id) => (
                          <div key={id} className="flex items-center space-x-1.5 leading-tight text-[11px]">
                            <span className="font-medium text-gray-800 line-clamp-1">{item.productName}</span>
                            <span className="font-mono text-gray-400 shrink-0">({item.selectedColor} x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* ACTIONS MODIFIERS */}
                    <td className="px-5 py-4 text-center space-y-2 shrink-0">
                      
                      {/* DELIVERY MODIFIER */}
                      <div className="space-y-1 font-sans">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">DELIVERY STATUS</label>
                        <select
                          value={o.deliveryStatus}
                          onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                          className={`rounded-lg py-1 px-2 text-xs font-bold leading-none border focus:outline-none ${
                            o.deliveryStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : o.deliveryStatus === 'Shipped'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          <option value="Pending">Pending Pack</option>
                          <option value="Processing">Processing Stage</option>
                          <option value="Shipped">Shipped Dispatch</option>
                          <option value="Delivered">Delivered Handover</option>
                        </select>
                      </div>

                      {/* PAYMENT MODIFIER */}
                      <div className="space-y-1 font-sans">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">PAYMENT SETTINGS</label>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => handleOrderPaymentChange(o.id, e.target.value)}
                          className={`rounded-lg py-1 px-2 text-xs font-bold leading-none border focus:outline-none ${
                            o.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="Paid">Cleared (Paid)</option>
                          <option value="Pending">Verifying (Pending)</option>
                          <option value="Failed">Declined (Failed)</option>
                        </select>
                      </div>

                    </td>

                    {/* AMOUNT */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-gray-950 text-sm shrink-0">
                      GHS {o.totalAmount.toLocaleString()}
                      <p className="text-[9px] text-gray-400 font-sans font-medium mt-1">{o.paymentMethod.replace('Mobile Money', 'MoMo')}</p>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* COMPREHENSIVE EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-fade-in my-8">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 rounded-full bg-gray-50 p-1.5 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b pb-3 mb-5">
              <span className="text-[10px] bg-blue-150 text-blue-850 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider">Product Master Editor</span>
              <h3 className="font-display text-xl font-black text-gray-900 mt-1">Edit: {editingProduct.name}</h3>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">DB_ID: {editingProduct.id} • SKU: {editingProduct.sku}</p>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-550 uppercase block mb-1">Product Display Name</label>
                  <input
                    type="text"
                    required
                    value={editPName}
                    onChange={(e) => setEditPName(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-550 uppercase block mb-1">Brand Manufacturer</label>
                  <select
                    value={editPBrand}
                    onChange={(e) => setEditPBrand(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 h-[34px] cursor-pointer"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Wise">Wise</option>
                    <option value="Anker">Anker</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-550 uppercase block mb-1">Product SKU (Unique)</label>
                  <input
                    type="text"
                    required
                    value={editPSku}
                    onChange={(e) => setEditPSku(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-550 uppercase block mb-1">Catalog Category</label>
                  <select
                    value={editPCategory}
                    onChange={(e) => setEditPCategory(e.target.value as any)}
                    className="w-full rounded-xl border bg-white px-3 py-2 h-[34px] capitalize cursor-pointer"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                    <option value="refurbished">Wise Refurbished</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-550 uppercase block mb-1">Our Store Price (GHS)</label>
                  <input
                    type="number"
                    required
                    value={editPPrice}
                    onChange={(e) => setEditPPrice(Number(e.target.value))}
                    className="w-full rounded-xl border bg-white px-3 py-2 font-mono text-xs font-bold text-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-550 uppercase block mb-1">Original Price / Was Price (GHS)</label>
                  <input
                    type="number"
                    required
                    value={editPOriginalPrice}
                    onChange={(e) => setEditPOriginalPrice(Number(e.target.value))}
                    className="w-full rounded-xl border bg-white px-3 py-2 font-mono text-xs text-gray-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-550 uppercase block mb-1">Available Inventory Units</label>
                  <input
                    type="number"
                    required
                    value={editPStock}
                    onChange={(e) => setEditPStock(Number(e.target.value))}
                    className="w-full rounded-xl border bg-white px-3 py-2 font-mono text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-550 uppercase block mb-1">Main Cover High-Res Image URL</label>
                  <input
                    type="text"
                    required
                    value={editPImage}
                    onChange={(e) => setEditPImage(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 font-mono text-[11px]"
                  />
                </div>

                {/* Multiple Images Sub-Form */}
                <div className="sm:col-span-2 bg-gray-50/50 p-3.5 border border-dashed border-gray-200 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center bg-transparent">
                    <span className="font-bold text-gray-650 uppercase tracking-wide">Showcase Gallery Pictures ({editPImagesList.length})</span>
                    <p className="text-[10px] text-gray-405">Manage interactive slideshow frames</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newExtraImageUrl}
                      onChange={(e) => setNewExtraImageUrl(e.target.value)}
                      placeholder="Paste secondary high-res image link..."
                      className="flex-1 rounded-xl border bg-white px-3 py-2 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newExtraImageUrl.trim()) {
                          setEditPImagesList(prev => [...prev, newExtraImageUrl.trim()]);
                          setNewExtraImageUrl('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shrink-0 transition-colors cursor-pointer"
                    >
                      Add Picture
                    </button>
                  </div>

                  {editPImagesList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {editPImagesList.map((url, idx) => (
                        <div key={idx} className="relative h-14 w-14 group rounded-lg overflow-hidden border bg-white shadow-xs shrink-0">
                          <img src={url} alt={`Showcase ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => setEditPImagesList(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-650/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-550 uppercase block mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    required
                    value={editPDesc}
                    onChange={(e) => setEditPDesc(e.target.value)}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-xs text-gray-700"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all uppercase tracking-wider shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Commit Modifications to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
