import { useState } from 'react';
import { X, Star, Check, Sparkles, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, storage?: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.storages ? product.storages[0] : undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Dynamic image gallery selection state
  const [activeImage, setActiveImage] = useState(product.image);

  // Sync active image when product changes
  useState(() => {
    setActiveImage(product.image);
  });
  
  // Handle product swapping safely with primitive values
  const prodId = product.id;
  const prodImg = product.image;
  const [prevId, setPrevId] = useState(prodId);
  if (prodId !== prevId) {
    setPrevId(prodId);
    setActiveImage(prodImg);
  }

  const handleAddSubmit = () => {
    onAddToCart(product, selectedColor, selectedStorage, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Deduped image list
  const galleryImages = Array.from(
    new Set([
      product.image,
      ...(product.images || [])
    ])
  ).filter(Boolean);

  // Generate some simulated client reviews for additional realism
  const simulatedReviews = [
    {
      id: 'rev-1',
      author: 'Ebenezer Osei',
      rating: 5,
      date: 'May 18, 2026',
      text: `Superb authentic product. Verified delivery here in East Legon inside 5 hours! Wise customer care is extremely polite. Highly recommended if you want genuine accessories.`,
      verified: true
    },
    {
      id: 'rev-2',
      author: 'Patricia Mensah',
      rating: 4,
      date: 'May 10, 2026',
      text: `The item is premium quality. Very sturdy. Placed order using MTN MoMo on Monday and arrived in Kumasi by Wednesday afternoon. Battery life is extraordinary.`,
      verified: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6 lg:p-10">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors"
          id="modal-close-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {/* INNER MODAL SCROLL BOX */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* GALLERY PANEL */}
            <div className="space-y-4">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {galleryImages.map((imgUrl, thumbIdx) => {
                    const isActive = activeImage === imgUrl;
                    return (
                      <button
                        key={thumbIdx}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`h-20 w-20 overflow-hidden rounded-xl bg-gray-50 cursor-pointer border-2 transition-all ${
                          isActive 
                            ? 'border-blue-600 opacity-100 scale-102 ring-2 ring-blue-100' 
                            : 'border-gray-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${product.name} view ${thumbIdx + 1}`} 
                          className="h-full w-full object-cover pointer-events-none" 
                          referrerPolicy="no-referrer" 
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SPECS AND OPTIONS PANEL */}
            <div className="space-y-6">
              <div className="font-sans">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
                <h2 className="mt-1 font-display text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h2>
                <div className="mt-2.5 flex items-center space-x-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* PRICING */}
              <div className="rounded-2xl bg-gray-50 p-4 font-sans border border-gray-100">
                <div className="flex items-baseline space-x-3">
                  <span className="font-display text-2xl font-black text-gray-900">
                    GHS {product.price.toLocaleString()}
                  </span>
                  {product.discount !== undefined && product.discount > 0 && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        GHS {product.originalPrice?.toLocaleString()}
                      </span>
                      <span className="rounded-lg bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 uppercase">
                        {product.discount}% Discount
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Price includes standard Wise 6-month product health protection.
                </p>
              </div>

              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* COLORS PICKER */}
              <div className="font-sans">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
                  Select Color: <span className="text-blue-600 font-medium">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`inline-flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full border border-gray-300" style={{
                          backgroundColor: color.includes('Gray') ? '#9ca3af' : color.includes('Black') ? '#111827' : color.includes('Blue') ? '#2563eb' : color.includes('Gold') ? '#fbbf24' : color.includes('Green') ? '#15803d' : '#e5e7eb'
                        }} />
                        <span>{color}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STORAGES CARDS PICKER */}
              {product.storages && product.storages.length > 0 && (
                <div className="font-sans">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
                    Storage Capacity:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {product.storages.map((storage) => {
                      const isSelected = selectedStorage === storage;
                      return (
                        <button
                          key={storage}
                          onClick={() => setSelectedStorage(storage)}
                          className={`rounded-xl border py-2.5 text-xs font-mono font-bold transition-all text-center ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-650 hover:border-gray-300'
                          }`}
                        >
                          {storage}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTION ADD BUTTON BAR */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 font-sans">
                {/* QUANTITY PICKER */}
                <div className="flex h-11 items-center rounded-xl bg-gray-50 border border-gray-100 p-1 font-mono text-sm">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white text-gray-600 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white text-gray-600 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddSubmit}
                  disabled={product.stock <= 0}
                  className={`flex-1 flex h-11 items-center justify-center space-x-2 rounded-xl text-sm font-bold shadow-md transition-all ${
                    product.stock <= 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'
                  }`}
                  id="modal-add-cart-btn"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{added ? 'Added to Cart!' : `Add to Basket (GHS ${(product.price * qty).toLocaleString()})`}</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-red-500' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                  title="Save to Favorite"
                >
                  <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* DISPATCH ETA NOTIFIER */}
              <div className="flex items-center space-x-2 rounded-xl bg-blue-50/40 border border-blue-100 px-3.5 py-3 text-xs text-blue-700 font-sans">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Wise delivery tracks this item. Standard dispatch within 24 hours.</span>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS TABLE TABLE */}
          <div className="mt-12 border-t border-gray-100 pt-8 font-sans">
            <h3 className="font-display text-lg font-bold text-gray-900 uppercase tracking-tight mb-4">
              Full System Specifications
            </h3>
            <div className="overflow-hidden rounded-2xl border border-gray-150">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <tbody className="divide-y divide-gray-100 bg-white">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                      <td className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-500 border-r border-gray-100">{key.replace('_', ' ')}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-900">{val}</td>
                    </tr>
                  ))}
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-500 border-r border-gray-100">Official SKU</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-900">{product.sku}</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-500 border-r border-gray-100">Live Stock Status</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">{product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CUSTOMER REVIEWS LIST */}
          <div className="mt-12 border-t border-gray-100 pt-8 font-sans">
            <h3 className="font-display text-lg font-bold text-gray-900 uppercase tracking-tight mb-4">
              Verified Shopper Reviews
            </h3>
            <div className="space-y-4">
              {simulatedReviews.map(rev => (
                <div key={rev.id} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{rev.author}</p>
                      <div className="flex text-amber-400 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{rev.date}</span>
                  </div>
                  <p className="text-sm text-gray-655 leading-relaxed">{rev.text}</p>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
