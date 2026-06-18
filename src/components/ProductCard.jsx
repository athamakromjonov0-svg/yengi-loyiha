import React, { useState } from 'react';
import { 
  ShoppingCart, Heart, Eye, Star, Zap, ShieldCheck, Loader2, Cpu, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const currentId = product._id || product.id;
  const productName = product.name || product.title || '';

  const isWishlisted = Array.isArray(wishlist)
    ? wishlist.some(item => (item._id || item.id) === currentId)
    : false;

  const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";

  const hasDiscount = product.discount && Number(product.discount) > 0;
  const originalPrice = Number(product.price) || 0;
  const currentPrice = hasDiscount
    ? originalPrice * (1 - Number(product.discount) / 100)
    : originalPrice;

  const renderCategory = () => {
    if (!product.category) return "KATEGORIYA";
    let name = "KATEGORIYA";
    if (typeof product.category === 'object') {
      name = product.category.name || product.category.title || "KATEGORIYA";
    } else {
      name = String(product.category);
    }
    return name.toUpperCase();
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    try {
      addToCart(product, 1);
      showToast?.(`${productName} muvaffaqiyatli savatga qo'shildi!`, "success");
    } catch (error) {
      console.error("Savat tizimida xatolik:", error);
    } finally {
      setTimeout(() => setIsAdding(false), 600);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toggleWishlist?.(product);
      showToast?.(
        isWishlisted ? "Mahsulot sevimlilardan olib tashlandi." : "Mahsulot sevimlilarga qo'shildi!",
        "info"
      );
    } catch (error) {
      console.error("Wishlist tizimida xatolik:", error);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-slate-900 bg-slate-950/40 p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col h-[520px] font-sans select-none text-white">
      {/* Kiber Plazma Foni */}
      <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10 pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-rose-500/5 blur-3xl transition-all duration-500 group-hover:bg-rose-500/10 pointer-events-none" />

      {/* Rasm Hududi */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950/80 border border-slate-900 p-4 group-hover:border-slate-800 transition-colors duration-500 min-h-[190px] max-h-[210px]">
        <img
          src={product.image}
          alt={productName}
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

        {/* Indikatorlar */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-1 text-[9px] font-black text-slate-950 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)] font-mono animate-pulse">
              <Zap className="h-2.5 w-2.5 fill-slate-950" />
              YANGI
            </span>
          )}
          <span className="rounded-md bg-slate-950/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 text-[9px] font-bold text-emerald-400 shadow-sm uppercase tracking-widest font-mono">
            {renderCategory()}
          </span>
        </div>

        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10 rounded-md bg-rose-500 px-2.5 py-1 text-[9px] font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.3)] font-mono">
            -{product.discount}% CHEGIRMA
          </div>
        )}

        {/* Hover Action Panel */}
        <div className="absolute inset-y-0 right-3 flex flex-col justify-center gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-200 shadow-xl ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20'
                : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
          <Link
            to={`/product/${currentId}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 backdrop-blur-md transition-all duration-200 shadow-xl"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Detallar */}
      <div className="flex flex-1 flex-col mt-4 relative z-10">
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating || 5) ? 'fill-amber-500 text-amber-500' : 'text-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 ml-1">
            {product.rating || "5.0"} ({product.reviewsCount || 12} ta sharh)
          </span>
        </div>

        <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1 mb-1 tracking-tight">
          {productName}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-1 font-light">
          {product.description}
        </p>

        {/* Texnik xarakteristikalar */}
        {product.specs && product.specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.specs.slice(0, 2).map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-[9px] font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono"
              >
                <Cpu className="h-2.5 w-2.5 text-emerald-400" />
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Kafolat va Ombor Holati */}
        <div className="flex items-center justify-between border-t border-slate-900 pt-3 mb-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400 font-light">1 yil rasmiy kafolat</span>
          </div>
          {product.stock && Number(product.stock) < 5 ? (
            <span className="text-rose-400 font-mono font-bold animate-pulse bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              Faqat {product.stock} dona!
            </span>
          ) : (
            <span className="text-emerald-500 font-medium font-mono text-[10px]">AVAILABLE</span>
          )}
        </div>

        {/* Narxlar va Tugmalar */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-mono font-black text-emerald-400 text-lg tracking-tight">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${currentId}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 hover:border-slate-700 hover:text-white"
            >
              <span>BATAFSIL</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                isAdding
                  ? 'bg-slate-900 border-slate-800 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-500 border-emerald-500 text-slate-950 hover:bg-transparent hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.97]'
              }`}
            >
              {isAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>SAVAT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}