import React, { useState, useMemo, useCallback } from 'react';
import { 
  ShoppingCart, Heart, Eye, Star, Zap, ShieldCheck, Loader2, Cpu, ArrowUpRight, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, showToast, toggleCompare, compareList } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  // --- useMemo: Mahsulot identifikatori va nomi (har renderda qayta hisoblanmasligi uchun) ---
  const currentId = useMemo(() => product?._id || product?.id, [product]);
  const productName = useMemo(() => product?.name || product?.title || '', [product]);

  // --- useMemo: Sevimlilar ro'yxatida borligini tekshirish ---
  const isWishlisted = useMemo(() => {
    if (!Array.isArray(wishlist) || !currentId) return false;
    return wishlist.some(item => (item._id || item.id) === currentId);
  }, [wishlist, currentId]);

  // --- useMemo: Solishtirish ro'yxatida borligini tekshirish ---
  const isCompared = useMemo(() => {
    if (!Array.isArray(compareList) || !currentId) return false;
    return compareList.some(item => (item._id || item.id) === currentId);
  }, [compareList, currentId]);

  // --- useMemo: Narx formatlash funksiyasi (har renderda qayta yaratilmasligi uchun) ---
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";
  }, []);

  // --- useMemo: Chegirma va narx hisob-kitoblari ---
  const { hasDiscount, originalPrice, currentPrice } = useMemo(() => {
    const discount = Number(product?.discount) || 0;
    const hasDisc = discount > 0;
    const origPrice = Number(product?.price) || 0;
    const currPrice = hasDisc ? origPrice * (1 - discount / 100) : origPrice;
    return { hasDiscount: hasDisc, originalPrice: origPrice, currentPrice: currPrice };
  }, [product]);

  // --- useMemo: Kategoriya nomini render qilish ---
  const renderCategory = useCallback(() => {
    if (!product?.category) return "KATEGORIYA";
    let name = "KATEGORIYA";
    if (typeof product.category === 'object') {
      name = product.category.name || product.category.title || "KATEGORIYA";
    } else {
      name = String(product.category);
    }
    return name.toUpperCase();
  }, [product]);

  // --- useCallback: Savatga qo'shish ---
  const handleAddToCart = useCallback((e) => {
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
  }, [isAdding, addToCart, product, productName, showToast]);

  // --- useCallback: Sevimlilarga qo'shish/olib tashlash ---
  const handleWishlistToggle = useCallback((e) => {
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
  }, [toggleWishlist, product, isWishlisted, showToast]);

  // --- useCallback: Solishtirishga qo'shish/olib tashlash ---
  const handleCompareToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toggleCompare?.(product);
    } catch (error) {
      console.error("Compare tizimida xatolik:", error);
    }
  }, [toggleCompare, product]);

  if (!product) return null;

  return (
    <div className="group relative rounded-2xl border border-slate-900 bg-slate-950/40 p-2.5 sm:p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_20px_40px_-15px_rgba(255,193,7,0.22)] overflow-hidden flex flex-col sm:h-[520px] font-sans select-none text-white min-w-0">
      {/* Kiber Plazma Foni */}
      <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10 pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-rose-500/5 blur-3xl transition-all duration-500 group-hover:bg-rose-500/10 pointer-events-none" />

      {/* Rasm Hududi */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950/80 border border-slate-900 p-2 sm:p-4 group-hover:border-slate-800 transition-colors duration-500 sm:min-h-[190px] sm:max-h-[210px]">
        <Link to={`/product/${currentId}`} className="block h-full w-full" aria-label={productName}>
          <img
            src={product.image}
            alt={productName}
            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

        {/* Indikatorlar */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[9px] font-black text-slate-950 uppercase tracking-widest shadow-[0_0_15px_rgba(255,193,7,0.4)] font-mono animate-pulse">
              <Zap className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-slate-950" />
              YANGI
            </span>
          )}
          <span className="rounded-md bg-slate-950/90 backdrop-blur-md border border-slate-800 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[9px] font-bold text-emerald-400 shadow-sm uppercase tracking-widest font-mono">
            {renderCategory()}
          </span>
        </div>

        {hasDiscount && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 rounded-md bg-rose-500 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.3)] font-mono">
            -{product.discount}% CHEGIRMA
          </div>
        )}

        {/* Hover Action Panel — mobil qurilmalarda (touch) doim ko'rinadi */}
        <div className="absolute inset-y-0 right-2 sm:right-3 flex flex-col justify-center gap-1.5 sm:gap-2 md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label="Sevimlilarga qo'shish"
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-200 shadow-xl ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20'
                : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleCompareToggle}
            aria-label="Solishtirish"
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-200 shadow-xl ${
              isCompared
                ? 'bg-blue-500 text-white border-blue-500 shadow-blue-500/20'
                : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30'
            }`}
            title={isCompared ? "Solishtirishdan olib tashlash" : "Solishtirishga qo'shish"}
          >
            <Scale className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isCompared ? 'fill-white' : ''}`} />
          </button>
          <Link
            to={`/product/${currentId}`}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 backdrop-blur-md transition-all duration-200 shadow-xl"
            aria-label="Batafsil ko'rish"
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>

      {/* Detallar */}
      <div className="flex flex-1 flex-col mt-2 sm:mt-4 relative z-10 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                  i < Math.floor(product.rating || 5) ? 'fill-amber-500 text-amber-500' : 'text-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 ml-0.5 sm:ml-1">
            {product.rating || "5.0"}
            <span className="hidden sm:inline"> ({product.reviewsCount || 12} ta sharh)</span>
            <span className="sm:hidden"> ({product.reviewsCount || 12})</span>
          </span>
        </div>

        <Link to={`/product/${currentId}`} className="block">
          <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 sm:line-clamp-1 mb-1 tracking-tight leading-snug sm:leading-tight">
            {productName}
          </h3>
        </Link>

        <p className="block text-[11px] sm:text-xs text-slate-400 line-clamp-1 sm:line-clamp-2 leading-relaxed mb-3 flex-1 font-light">
          {product.description}
        </p>

        {/* Texnik xarakteristikalar */}
        {product.specs && product.specs.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1 mb-3">
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
        <div className="hidden sm:flex items-center justify-between border-t border-slate-900 pt-3 mb-4 text-[11px]">
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
        <div className="space-y-1.5 sm:space-y-3 mt-auto pt-1 sm:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-1">
            <span className="font-mono font-black text-emerald-400 text-sm sm:text-lg tracking-tight truncate">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through font-mono">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <Link
              to={`/product/${currentId}`}
              className="hidden sm:flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 hover:border-slate-700 hover:text-white"
            >
              <span>BATAFSIL</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 sm:py-2.5 text-[11px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                isAdding
                  ? 'bg-slate-900 border-slate-800 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-500 border-emerald-500 text-slate-950 hover:bg-transparent hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(255,193,7,0.3)] active:scale-[0.97]'
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
