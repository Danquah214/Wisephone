import { useState, FormEvent } from 'react';
import { Search, Percent, ShieldCheck, Truck, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string) => void;
  featuredProduct: Product | undefined;
  onSelectProduct: (product: Product) => void;
}

const HERO_SLIDES = [
  {
    title: "Wise Premium Tech Collection",
    subtitle: "AUTHENTICITY meets AFORDABILITY",
    description: "Upgrade safely. Buy certified new and refurbished smartphones and high-speed delivery accessories. Fully covered with official Wise protection warranty.",
    tagline: "Free Accra Shipping on orders above GHS 1,000",
    buttonText: "Explore Smartphones",
    promoBadge: "10% Launch Promo",
    bgClass: "from-slate-900 via-blue-950 to-indigo-950",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Premium Sound & High-Speed Power",
    subtitle: "ENGINEERED BY WISE LABS",
    description: "Experience the next-level BassPodz ANC Pro (GHS 950) with 45dB Active Noise Cancellation and our ultra high-speed dual port 20k mAh GaN Power Banks.",
    tagline: "Unmatched performance. Tested rigorously.",
    buttonText: "Browse Accessories",
    promoBadge: "Save up to 24%",
    bgClass: "from-slate-955 via-blue-900 to-slate-900",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600"
  }
];

export default function Hero({ onSearch, onFilterCategory, featuredProduct, onSelectProduct }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gray-900 text-white">
      {/* BACKGROUND GRAPHIC ORBITS */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      {/* SLIDER WRAPPER */}
      <div className={`transition-all duration-700 bg-gradient-to-r ${slide.bgClass} py-12 md:py-20 px-4 sm:px-6 lg:px-8`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* TEXT SPECIFICS */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center space-x-1 rounded-full bg-blue-500/15 border border-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-400">
                <Percent className="h-3.5 w-3.5" />
                <span>{slide.promoBadge}</span>
              </span>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                {slide.title}
              </h1>

              <p className="font-sans text-xs uppercase tracking-widest font-bold text-blue-400">
                {slide.subtitle}
              </p>

              <p className="font-sans text-gray-300 text-base max-w-2xl leading-relaxed">
                {slide.description}
              </p>

              {/* SEARCH COMBINED COMPONENT */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl group">
                <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-xl ring-4 ring-blue-500/10 focus-within:ring-blue-500/20 transition-all">
                  <div className="pl-4 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search iPhone, Samsung, chargers, earbuds..."
                    className="w-full font-sans text-gray-900 placeholder-gray-500 px-3 py-4 text-sm focus:outline-none"
                    id="hero-search-input"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-4 transition-all"
                    id="hero-search-submit"
                  >
                    Search
                  </button>
                </div>
                
                {/* SUGGESTION BUBBLES */}
                <div className="flex flex-wrap gap-2 mt-3 pl-1">
                  <span className="text-xs text-gray-400 self-center">Hot tags:</span>
                  {['iPhone 15', 'Refurbished', 'BassPodz', 'Anker GaN', 'PowerBank'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchVal(tag);
                        onSearch(tag);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 text-white/85 text-xs font-medium hover:bg-white/20 hover:text-white transition-all font-mono"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>

              {/* USP BADGES */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl border-t border-white/10 font-sans">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="text-[11px] leading-tight text-gray-300">
                    <p className="font-bold">Next-Day Delivery</p>
                    <p className="text-gray-400">Across Ghana</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="text-[11px] leading-tight text-gray-300">
                    <p className="font-bold">Wise Certified</p>
                    <p className="text-gray-400">6-12m Warranty</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="text-[11px] leading-tight text-gray-300">
                    <p className="font-bold">Pay via MoMo</p>
                    <p className="text-gray-400">Highly Secured</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE GRAPHIC / SLIDESHOW CONTROLLER */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative group cursor-pointer w-full max-w-sm rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-4 transition-all hover:border-white/20">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-4 mx-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/5 flex items-center justify-between">
                  <div className="font-sans">
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">WISE EXCLUSIVE</p>
                    <p className="text-sm font-bold text-white tracking-tight">{slide.title.split(' ')[0]} Premium</p>
                  </div>
                  {featuredProduct && (
                    <button
                      onClick={() => onSelectProduct(featuredProduct)}
                      className="text-xs font-bold text-blue-400 hover:text-white transition-colors"
                    >
                      Quick Specs →
                    </button>
                  )}
                </div>
              </div>

              {/* CAROUSEL SWIPERS */}
              <div className="flex items-center space-x-2.5 mt-6">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
