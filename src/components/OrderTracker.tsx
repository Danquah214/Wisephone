import { useState, FormEvent } from 'react';
import { Search, Loader2, Package, ArrowRight, Truck, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  onSearchTracker: (trackingNum: string) => Promise<Order | null>;
  initialTrackingCode?: string;
}

export default function OrderTracker({ onSearchTracker, initialTrackingCode = '' }: OrderTrackerProps) {
  const [trackingCode, setTrackingCode] = useState(initialTrackingCode);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [errorText, setErrorText] = useState('');

  const handleTrackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorText('');
    setMatchedOrder(null);

    try {
      const order = await onSearchTracker(trackingCode.trim());
      if (order) {
        setMatchedOrder(order);
      } else {
        setErrorText('No delivery records found matching this tracking code. Check the format (e.g., WS-TRK-784820).');
      }
    } catch (err) {
      console.error(err);
      setErrorText('Unable to query tracking data right now.');
    } finally {
      setLoading(false);
    }
  };

  // Status mapping to gauge numbers
  const statusLevels: Record<string, number> = {
    'Pending': 1,
    'Processing': 2,
    'Shipped': 3,
    'Delivered': 4
  };

  const currentLevel = matchedOrder ? statusLevels[matchedOrder.deliveryStatus] || 1 : 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 font-sans">
      <div className="space-y-6">
        
        {/* HERO HEADER */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Wise Delivery Tracking Portal</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Enter your **WS-TRK-** code from your checkout receipt to query live courier dispatch logs.
          </p>
        </div>

        {/* INPUT FORM COMPONENTS */}
        <form onSubmit={handleTrackSubmit} className="relative max-w-xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-md focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all p-1">
            <div className="pl-3 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="e.g. WS-TRK-784820"
              className="w-full text-sm font-mono text-gray-900 placeholder-gray-400 px-3 py-3 focus:outline-none"
              id="tracker-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 transition-colors flex items-center space-x-1.5 shrink-0"
              id="tracker-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <span>Track Pack</span>
              )}
            </button>
          </div>
          
          <div className="flex justify-center space-x-2 mt-2 font-mono text-[10px] text-gray-400">
            <span>Try testing copy:</span>
            <button 
              type="button" 
              onClick={() => { setTrackingCode('WS-TRK-784820'); }} 
              className="text-blue-500 font-bold hover:underline"
            >
              WS-TRK-784820
            </button>
            <span>or</span>
            <button 
              type="button" 
              onClick={() => { setTrackingCode('WS-TRK-114402'); }} 
              className="text-blue-500 font-bold hover:underline"
            >
              WS-TRK-114402
            </button>
          </div>
        </form>

        {/* TRACK LOG RESPONSE CHANNELS */}
        {errorText && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-600 max-w-xl mx-auto animate-fade-in text-center">
            {errorText}
          </div>
        )}

        {/* DISPLAY SHIPMENT METRIC AND PROGRESS GAUGE */}
        {matchedOrder && !loading && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fade-in max-w-2xl mx-auto">
            
            {/* TOP BAR */}
            <div className="bg-gray-950 p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">SECURE PACKAGE TRACKER</p>
                <h3 className="text-base font-extrabold tracking-tight mt-0.5">{matchedOrder.id} ({matchedOrder.trackingNumber})</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase">Estimated Delivery Date:</p>
                <p className="text-sm font-bold tracking-tight text-blue-400 mt-0.5">
                  {matchedOrder.region === 'Greater Accra' ? 'Within 24 Hours' : '2 - 3 Working Days'}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-8">
              
              {/* STAGE TIMELINE STEPS GRAPHICS */}
              <div className="relative flex items-center justify-between font-sans">
                {/* HORIZONTAL LINE BACKDROP */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 -z-10 transition-all duration-700" 
                  style={{ width: `${((currentLevel - 1) / 3) * 100}%` }}
                />

                {/* TIMELINE STEPS */}
                {[
                  { label: 'Placed', info: 'Order Authenticated', icon: '📝' },
                  { label: 'Processing', info: 'Item Packaged', icon: '📦' },
                  { label: 'Shipped', info: 'In Transit', icon: '🚚' },
                  { label: 'Delivered', info: 'Handed Over', icon: '✅' }
                ].map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = stepNum <= currentLevel;
                  const isUpcoming = stepNum > currentLevel;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-2 text-center relative z-10">
                      <div 
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md ${
                          stepNum === currentLevel 
                            ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-50' 
                            : isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border-2 border-gray-150 text-gray-300'
                        }`}
                      >
                        {isActive && stepNum < currentLevel ? <CheckCircle className="h-4.5 w-4.5" /> : <span>{step.icon}</span>}
                      </div>
                      <div className="hidden sm:block">
                        <p className={`text-xs font-bold leading-none ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                        <p className="text-[9px] text-gray-400 mt-1">{step.info}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TIMELINE DETAILS DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-xs font-sans">
                
                {/* SHIPMENT SUMMARY */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Package Logistics Status:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Dispatch Location Point</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">{matchedOrder.shippingAddress}, {matchedOrder.city}, {matchedOrder.region}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Truck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Carrier Channel Provider</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">Wise Mobile Logistics (Accra Core Center)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Secured Signature Required</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">Yes, please verify using OTP on phone {matchedOrder.customerPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ITEMS IN THE PACKAGE */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Ordered Items Included:</h4>
                  <div className="rounded-2xl border border-gray-100 p-2 bg-gray-50/50 space-y-2">
                    {matchedOrder.items.map((it, i) => (
                      <div key={i} className="flex items-center space-x-2.5 border-b border-gray-100 last:border-0 pb-1.5 last:pb-0">
                        <img 
                          src={it.image} 
                          alt={it.productName} 
                          className="h-10 w-10 object-cover rounded-lg border bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 text-[11px] leading-tight text-gray-600">
                          <p className="font-bold text-gray-900 line-clamp-1">{it.productName}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Color: {it.selectedColor} | Qty: {it.quantity}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-[10px] text-gray-500 flex justify-between font-semibold border-t">
                      <span>Total Paid:</span>
                      <span className="font-mono text-gray-900">GHS {matchedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
