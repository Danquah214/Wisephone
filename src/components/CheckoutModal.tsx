import { useState, FormEvent } from 'react';
import { X, ShieldCheck, CheckCircle2, Ticket, CreditCard, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { GH_REGIONS } from '../data';

interface CheckoutModalProps {
  summary: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    regionName: string;
    couponApplied?: string;
  } | null;
  cart: any[];
  onClose: () => void;
  onOrderSuccess: (order: any) => void;
}

export default function CheckoutModal({
  summary,
  cart,
  onClose,
  onOrderSuccess,
}: CheckoutModalProps) {
  if (!summary) return null;

  // Form parameters
  const [name, setName] = useState('Daniel Twumasi');
  const [email, setEmail] = useState('danquahtwumasi214@gmail.com');
  const [phone, setPhone] = useState('0244123456');
  const [address, setAddress] = useState('Dzorwulu, off Fiesta Royale highway');
  const [city, setCity] = useState('Accra');
  const [paymentType, setPaymentType] = useState<'momo' | 'card'>('momo');
  
  // Momo details
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [momoProvider, setMomoProvider] = useState('MTN');

  // Checkout phases
  const [status, setStatus] = useState<'form' | 'momo_prompt' | 'processing' | 'success'>('form');
  const [errorText, setErrorText] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleNextSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name || !email || !phone || !address || !city) {
      setErrorText('Please fill in all standard shipping details.');
      return;
    }

    if (paymentType === 'momo') {
      if (!momoNumber || momoNumber.length < 9) {
        setErrorText('Please enter a valid Ghana Mobile Money number.');
        return;
      }
      setStatus('momo_prompt');
    } else {
      // Simulate standard card processing straight to spinner
      triggerProcessing();
    }
  };

  const triggerProcessing = async () => {
    setStatus('processing');
    
    // Package items correctly
    const items = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedStorage: item.selectedStorage,
      image: item.product.image
    }));

    const orderPayload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      city,
      region: summary.regionName,
      country: 'Ghana',
      items,
      totalAmount: summary.total,
      discountApplied: summary.discount,
      paymentMethod: paymentType === 'momo' ? `${momoProvider} Mobile Money` : 'Card',
      paymentDetails: paymentType === 'momo' ? {
        mobileNumber: momoNumber,
        provider: momoProvider,
        transactionId: `TXN-MO${Math.floor(1000000 + Math.random() * 9000000)}`
      } : {
        transactionId: `TXN-CR${Math.floor(1000000 + Math.random() * 9000000)}`
      }
    };

    try {
      // Post to our express server REST API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Server returned an error while saving order.');
      }

      const orderData = await response.json();
      
      // Artificial delay for high quality processing spinner
      setTimeout(() => {
        setCompletedOrder(orderData);
        setStatus('success');
      }, 2500);

    } catch (err: any) {
      console.error(err);
      setErrorText('An error occurred while placing order. Please try again.');
      setStatus('form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm font-sans">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-fade-in"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {status === 'success' ? 'Order Confirmed!' : 'Secure Wise Payment'}
          </h3>
          {status !== 'processing' && status !== 'success' && (
            <button
              onClick={onClose}
              className="rounded-full bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100"
              id="checkout-close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* CONTENT CHANNELS */}
        <div className="max-h-[85vh] overflow-y-auto p-5 space-y-5">
          
          {/* 1. SHIPPING FORM */}
          {status === 'form' && (
            <form onSubmit={handleNextSubmit} className="space-y-4 text-xs">
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-150 flex justify-between items-center">
                <div>
                  <p className="font-bold text-blue-700">GHANA GATEWAY ROUTER</p>
                  <p className="text-blue-500 text-[10px]">Recipient: {summary.regionName} Dispatch</p>
                </div>
                <span className="font-display font-extrabold text-blue-600">GHS {summary.total.toLocaleString()}</span>
              </div>

              {errorText && (
                <p className="p-2.5 rounded-xl bg-red-50 text-red-600 font-medium">
                  {errorText}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Customer Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-900 font-medium"
                    id="checkout-name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Email (Receipts Delivery)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-900 font-medium"
                    id="checkout-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0244123456"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-900 font-medium"
                    id="checkout-phone"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Town / City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-900 font-medium"
                    id="checkout-city"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Physical Street Address (MoMo Dispatch Point)</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, landmark details..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-900 font-medium"
                  id="checkout-address"
                />
              </div>

              {/* PAYMENT TYPES CHOSER */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Authorize Payment Using:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('momo')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      paymentType === 'momo'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs uppercase leading-none">Mobile Money</p>
                      <p className="text-[9px] text-gray-400 mt-1">MTN, Telecel, AirtelTigo</p>
                    </div>
                    <span className="text-base">📱</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      paymentType === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs uppercase leading-none">Credit / Debit Card</p>
                      <p className="text-[9px] text-gray-400 mt-1">Visa, Mastercard, Stripe</p>
                    </div>
                    <span className="text-base"><CreditCard className="h-4 w-4" /></span>
                  </button>
                </div>
              </div>

              {/* MOBILE MONEY EXTRA SPECS */}
              {paymentType === 'momo' && (
                <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1 text-orange-850">Select MoMo Network Carrier</label>
                    <select
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 focus:outline-none"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="Telecel">Telecel Cash</option>
                      <option value="AirtelTigo">AirtelTigo Money</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1 text-orange-850">Mobile Wallet Number</label>
                    <input
                      type="text"
                      required
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      placeholder="e.g. 0244123456"
                      className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 focus:outline-none font-mono font-semibold"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex h-11 items-center justify-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md mt-4 text-xs uppercase tracking-wider"
                id="form-checkout-submit"
              >
                <span>Proceed to Authorization</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* 2. MOMO AUTH PIN INSTRUCTION SCREEN */}
          {status === 'momo_prompt' && (
            <div className="space-y-5 text-center py-6 font-sans">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 animate-bounce">
                <span className="text-3xl">📳</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg font-black text-gray-900 leading-tight">Authorize MoMo Prompt</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  We have dispatched an automated **{momoProvider}** instant payment notification bill of <strong className="text-blue-600 font-mono text-sm block mt-1">GHS {summary.total.toLocaleString()}</strong> to your mobile wallet at <span className="font-mono font-bold text-gray-800">{momoNumber}</span>.
                </p>
              </div>

              <div className="rounded-xl border border-gray-150 p-4 max-w-sm mx-auto bg-gray-50 text-left text-[11px] leading-relaxed text-gray-600 space-y-2">
                <p className="font-extrabold text-gray-800 uppercase tracking-wide">Steps to Complete:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Check your phone screen for the automated USSD push request</li>
                  <li>Enter your high-security {momoProvider} wallet **secret PIN**</li>
                  <li>Click **Yes** or **Accept** to approve standard Wise checkout</li>
                </ol>
              </div>

              <div className="flex justify-center space-x-3 max-w-sm mx-auto pt-3">
                <button
                  type="button"
                  onClick={() => setStatus('form')}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Edit Number
                </button>
                <button
                  type="button"
                  onClick={triggerProcessing}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1"
                >
                  <span>Approve & Pay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. TRANSACTION PROCESSING STATUS INDICATOR */}
          {status === 'processing' && (
            <div className="space-y-4 text-center py-12">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-display text-base font-black text-gray-900">Validating Mobile Transaction...</h4>
                <p className="text-xs text-gray-400 mt-1">Querying cellular provider billing systems. Do not close this window.</p>
              </div>
              <div className="max-w-xs mx-auto text-[10px] text-gray-400 font-mono space-y-0.5 mt-4">
                <p>CONTACTING: GATEWAY_SEC_CHANNELS</p>
                <p>METHOD: {paymentType === 'momo' ? `MOMO_${momoProvider.toUpperCase()}` : 'CARD_VISA_STRIPE'}</p>
                <p>ENCRYPTION: AES-GCM-256 SECURED</p>
              </div>
            </div>
          )}

          {/* 4. ORDER FINISHED TRACKING BOARD */}
          {status === 'success' && completedOrder && (
            <div className="space-y-6 text-center py-4 font-sans">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              
              <div>
                <h4 className="font-display text-xl font-black text-gray-900 leading-tight">Medaase! Purchase Successful!</h4>
                <p className="text-xs text-gray-500 mt-1">Your order has been recorded successfully under No. <strong className="text-blue-600 font-mono">{completedOrder.id}</strong></p>
              </div>

              {/* COPYABLE SUMMARY BOX */}
              <div className="rounded-2xl border border-gray-150 p-4 bg-gray-50 text-left text-xs space-y-3">
                <div className="border-b pb-2 flex justify-between text-gray-500">
                  <span>Shipped to:</span>
                  <span className="font-bold text-gray-900">{completedOrder.customerName}</span>
                </div>
                <div className="border-b pb-2 flex justify-between text-gray-500">
                  <span>Destination:</span>
                  <span className="font-bold text-gray-900">{completedOrder.city}, {completedOrder.region}</span>
                </div>
                <div className="border-b pb-2 flex justify-between text-gray-500">
                  <span>Charge Deducted:</span>
                  <strong className="font-mono text-gray-900">GHS {completedOrder.totalAmount.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between items-center text-blue-700 bg-blue-100/50 p-2.5 rounded-xl font-mono">
                  <span>TRACKING CODE:</span>
                  <strong className="text-sm font-black select-all tracking-wide">{completedOrder.trackingNumber}</strong>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
                We have transmitted confirmation notifications to **{completedOrder.customerEmail}** and **{completedOrder.customerPhone}** with billing details. Place orders via the Wise mobile app any time.
              </div>

              <button
                type="button"
                onClick={() => onOrderSuccess(completedOrder)}
                className="w-full flex h-11 items-center justify-center space-x-1 rounded-xl bg-gray-950 hover:bg-black text-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all"
                id="checkout-complete-finish"
              >
                <span>Dismiss & Track Shipment</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
