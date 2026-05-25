import React from 'react';
import { Star, Eye, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, color: string, storage?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductCardProps) {
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/40"
      id={`product-card-${product.id}`}
    >
      {/* BADGE LABELS */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="inline-flex items-center rounded-lg bg-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
            {product.badge}
          </span>
        )}
        {hasDiscount && (
          <span className="inline-flex items-center rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
            -{product.discount}% OFF
          </span>
        )}
      </div>

      {/* WISHLIST HEARTS */}
      <button
        onClick={() => onToggleWishlist(product)}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-200 border ${
          isWishlisted 
            ? 'bg-red-50 border-red-200 text-red-500' 
            : 'bg-white/90 border-gray-100 text-gray-400 hover:text-red-500 hover:scale-105'
        }`}
        title="Save to Wishlist"
      >
        <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* PRODUCT ENERGETIC IMAGE VIEW */}
      <div 
        onClick={() => onSelect(product)} 
        className="relative aspect-square w-full cursor-pointer bg-gray-50 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* HOVER OVERLAY BLURS */}
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Full Specs</span>
          </button>
        </div>
      </div>

      {/* PRODUCT SPECS & NAME BODY */}
      <div className="flex flex-1 flex-col p-4 font-sans">
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>{product.brand}</span>
          <span>{product.sku}</span>
        </div>

        <h3 
          onClick={() => onSelect(product)} 
          className="mt-1 flex-1 cursor-pointer text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
        >
          {product.name}
        </h3>

        {/* STAR RATING WRAP */}
        <div className="mt-2 flex items-center space-x-1">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviewsCount})</span>
        </div>

        {/* PRICING & STOCK SPECS */}
        <div className="mt-3 flex items-end justify-between border-t border-gray-50 pt-3">
          <div className="flex flex-col">
            {hasDiscount && product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                GHS {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-display text-base font-extrabold text-gray-900">
              GHS {product.price.toLocaleString()}
            </span>
          </div>

          {/* STOCK CHECKS */}
          {product.stock <= 0 ? (
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Out of Stock</span>
          ) : product.stock <= 5 ? (
            <button
              onClick={() => onAddToCart(product, product.colors[0], product.storages?.[0])}
              className="flex items-center space-x-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-2 text-xs font-bold text-white transition-all shadow-md shadow-amber-500/10"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Only {product.stock} left!</span>
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product, product.colors[0], product.storages?.[0])}
              className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 transition-all duration-200"
              title="Add to Basket"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
