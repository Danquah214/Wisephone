import { useState, FormEvent } from 'react';
import { X, Trash2, Percent, Truck, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { CartItem } from '../types';
import { GH_REGIONS, VALID_COUPONS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedCheckout: (summary: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    regionName: string;
    couponApplied?: string;
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof VALID_COUPONS[0] | null>(null);
  const [couponError, setCouponError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(GH_REGIONS[0]); // default to Greater Accra

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Apply discounts
  let discountAmount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minSpend) {
      if (appliedCoupon.type === 'percentage') {
        discountAmount = (subtotal * appliedCoupon.value) / 100;
      } else if (appliedCoupon.type === 'flat') {
        discountAmount = appliedCoupon.value;
      }
    }
  }

  const deliveryFee = subtotal > 0 ? selectedRegion.deliveryFee : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError('');
    
    const matched = VALID_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!matched) {
      setCouponError('Invalid coupon code.');
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < matched.minSpend) {
      setCouponError(`Min spend of GHS ${matched.minSpend.toLocaleString()} required for this coupon.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(matched);
    setCouponCode('');
  };

  const handleCheckoutClick = () => {
    onProceedCheckout({
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total,
      regionName: selectedRegion.name,
      couponApplied: appliedCoupon?.code
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-fade-in">
          
          {/* DRAWER TOP BAR */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
              <ShoppingBagIcon />
              <span>Your Wise Basket</span>
            </h2>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100"
              id="cart-drawer-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {/* CART LIST ITEMS */}
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 space-y-4 text-center">
                <span className="text-4xl bg-gray-50 rounded-full p-4">🛒</span>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Your basket is empty</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">Scan our smartphones inventory or add earbuds/accessories to checkout!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex space-x-4 border-b border-gray-50 pb-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-xl object-cover bg-gray-50 border shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-gray-400 font-mono">{item.product.brand}</p>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs font-medium text-blue-600">
                        Color: {item.selectedColor} {item.selectedStorage ? `• ${item.selectedStorage}` : ''}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center rounded-lg bg-gray-55 border p-0.5 text-xs font-mono">
                          <button
                            onClick={() => onUpdateQty(index, Math.max(1, item.quantity - 1))}
                            className="h-6 w-6 rounded hover:bg-white flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(index, item.quantity + 1)}
                            className="h-6 w-6 rounded hover:bg-white flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-905">
                          GHS {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-300 hover:text-red-500 shrink-0 self-start p-1.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* DIRECT GHANA SHIPPING REGION MAPPER */}
            {cart.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Delivery Destination (Ghana):</span>
                </label>
                <select
                  value={selectedRegion.name}
                  onChange={(e) => {
                    const found = GH_REGIONS.find(r => r.name === e.target.value);
                    if (found) setSelectedRegion(found);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  id="cart-region-select"
                >
                  {GH_REGIONS.map(reg => (
                    <option key={reg.name} value={reg.name}>
                      {reg.name} (GHS {reg.deliveryFee} • {reg.eta})
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Standard Hub Delivery:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedRegion.eta}</span>
                </div>
              </div>
            )}

            {/* PROMO COUPON PROMO SYSTEMS */}
            {cart.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5 pl-1.5">
                  <Ticket className="h-4 w-4 text-blue-600" />
                  <span>Promo Code Settings:</span>
                </label>
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WISELAUNCH"
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-blue-600"
                    id="cart-coupon-input"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 text-white hover:bg-gray-850 px-4 py-2 text-xs font-bold transition-all"
                    id="apply-coupon-btn"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[11px] text-red-500 font-medium pl-1">{couponError}</p>}
                
                {/* PROMO HELP NOTIFIER */}
                <div className="text-[10px] text-gray-400 pl-1 leading-relaxed">
                  Try **WISELAUNCH** (10% off &gt; GHS 500) or **AKWASIDAE** (15% off &gt; GHS 1,000)!
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5 mt-2 text-xs text-blue-700 animate-fade-in">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <Percent className="h-3 w-3 text-blue-600" />
                      <span>Applied: <strong className="font-mono tracking-wider">{appliedCoupon.code}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-blue-500 hover:text-red-500 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DYNAMIC BILL IN BASKET FOOTER */}
          {cart.length > 0 && (
            <div className="border-t border-gray-150 p-5 bg-gray-50/50 space-y-4">
              <div className="text-xs space-y-2 font-sans text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal sum:</span>
                  <span className="font-mono font-bold text-gray-900">GHS {subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-blue-600 font-semibold">
                    <span>Discount Applied ({appliedCoupon.code}):</span>
                    <span className="font-mono">- GHS {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{selectedRegion.name} Shipping:</span>
                  <span className="font-mono font-bold text-gray-900">GHS {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200/50 pt-3 flex justify-between text-sm text-gray-900 font-bold">
                  <span className="text-base font-extrabold uppercase">Total:</span>
                  <span className="font-display text-lg font-black text-blue-600">
                    GHS {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CHECKOUT TRIGGERS */}
              <button
                onClick={handleCheckoutClick}
                className="w-full flex h-12 items-center justify-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 transition-all font-sans"
                id="checkout-btn"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center space-x-1 py-1.5 text-[10px] text-gray-400 font-sans">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Wise secure checkout protects all your transactions.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="h-4.5 w-4.5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
