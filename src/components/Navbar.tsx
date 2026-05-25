import { ShoppingBag, Heart, ShieldCheck, Activity, Menu, X, PhoneCall } from 'lucide-react';
import { CartItem, Product } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  setIsCartOpen: (open: boolean) => void;
  openAdmin: boolean;
  setOpenAdmin: (open: boolean) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  wishlist,
  setIsCartOpen,
  openAdmin,
  setOpenAdmin,
}: NavbarProps) {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* BRAND BRANDING */}
        <div 
          onClick={() => { setActiveTab('home'); setOpenAdmin(false); }} 
          className="flex cursor-pointer items-center space-x-2"
          id="nav-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <span className="font-display text-xl font-bold tracking-tight">W</span>
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-gray-900">
            Wise<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* PUBLIC NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => { setActiveTab('home'); setOpenAdmin(false); }}
            className={`font-sans text-sm font-medium transition-colors hover:text-blue-600 ${
              activeTab === 'home' && !openAdmin ? 'text-blue-600' : 'text-gray-500'
            }`}
            id="nav-btn-home"
          >
            Home Overview
          </button>
          <button
            onClick={() => { setActiveTab('shop'); setOpenAdmin(false); }}
            className={`font-sans text-sm font-medium transition-colors hover:text-blue-600 ${
              activeTab === 'shop' && !openAdmin ? 'text-blue-600' : 'text-gray-500'
            }`}
            id="nav-btn-shop"
          >
            Search Catalog
          </button>
          <button
            onClick={() => { setActiveTab('tracker'); setOpenAdmin(false); }}
            className={`font-sans text-sm font-medium transition-colors hover:text-blue-600 ${
              activeTab === 'tracker' && !openAdmin ? 'text-blue-600' : 'text-gray-500'
            }`}
            id="nav-btn-track"
          >
            Track Order
          </button>
          <button
            onClick={() => { setActiveTab('about'); setOpenAdmin(false); }}
            className={`font-sans text-sm font-medium transition-colors hover:text-blue-600 ${
              activeTab === 'about' && !openAdmin ? 'text-blue-600' : 'text-gray-500'
            }`}
            id="nav-btn-about"
          >
            Specs & Support
          </button>
        </nav>

        {/* SHORTCUT METRICS */}
        <div className="flex items-center space-x-4">
          {/* ASSISTANT TRIGGER TAG */}
          <div className="hidden sm:flex items-center space-x-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 font-medium">
            <svg className="h-3.5 w-3.5 animate-pulse text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6M12 18V22M4.22 4.22L7.05 7.05M16.95 16.95L19.78 19.78M2 12H6M18 12H22M4.22 19.78L7.05 16.95M16.95 7.05L19.78 4.22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="tracking-tight">AI Active</span>
          </div>

          {/* WISHLIST BUTTON */}
          <button
            onClick={() => setActiveTab('shop')}
            className="relative p-2 text-gray-500 transition-colors hover:text-red-500"
            title="View Wishlist"
            id="nav-btn-wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* BASKET DRAWER TRIGGER */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-1 rounded-xl bg-gray-50 p-2 text-gray-700 transition-all hover:bg-gray-100 font-sans"
            id="nav-btn-cart"
          >
            <ShoppingBag className="h-5 w-5 text-gray-900" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {totalCartItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white px-1">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* ADMIN PORTAL GATEWAY */}
          <button
            onClick={() => {
              setOpenAdmin(!openAdmin);
            }}
            className={`flex items-center space-x-1 rounded-xl px-3 py-2 text-xs font-semibold tracking-tight transition-all ${
              openAdmin
                ? 'bg-blue-600 text-white ring-2 ring-blue-600/20'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
            id="nav-btn-admin"
          >
            <Activity className="h-4 w-4" />
            <span>{openAdmin ? 'Live Store Hub' : 'Admin Hub'}</span>
          </button>
        </div>
      </div>

      {/* MOBILE MINI BAR */}
      <div className="flex md:hidden items-center justify-around border-t border-gray-100 bg-white py-2.5">
        <button
          onClick={() => { setActiveTab('home'); setOpenAdmin(false); }}
          className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'home' && !openAdmin ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => { setActiveTab('shop'); setOpenAdmin(false); }}
          className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'shop' && !openAdmin ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <span className="text-base">📱</span>
          <span>Shop</span>
        </button>
        <button
          onClick={() => { setActiveTab('tracker'); setOpenAdmin(false); }}
          className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'tracker' && !openAdmin ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <span className="text-base">📦</span>
          <span>Track</span>
        </button>
        <button
          onClick={() => { setActiveTab('about'); setOpenAdmin(false); }}
          className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'about' && !openAdmin ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <span className="text-base">💡</span>
          <span>Support</span>
        </button>
      </div>
    </header>
  );
}
