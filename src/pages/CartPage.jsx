import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  Zap,
  Ticket,
  Wallet,
  BadgePercent,
  CheckCircle2,
  Clock,
  Package,
  ChevronRight,
  Loader2,
  Sparkles,
  X,
  Percent,
  Gift,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    addToCart, 
    decreaseCartQuantity, 
    removeFromCart, 
    clearCart, 
    showToast,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    bonusPoints,
    useBonusPoints,
    deliveryZones,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    calculateCartSubtotal,
    calculateDeliveryFee,
    calculateCouponDiscount,
    calculateCartTotal,
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [useBonus, setUseBonus] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [freeShipProgress, setFreeShipProgress] = useState(0);

  const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";

  const getItemId = (item) => item._id || item.id;

  const getItemPrice = (item) => {
    const originalPrice = Number(item.price) || 0;
    const hasDiscount = item.discount && Number(item.discount) > 0;
    return hasDiscount
      ? originalPrice * (1 - Number(item.discount) / 100)
      : originalPrice;
  };

  const subtotal = calculateCartSubtotal();
  const deliveryFee = calculateDeliveryFee();
  const couponDiscount = calculateCouponDiscount();
  const bonusDiscount = useBonus ? Math.min(bonusPoints * 1000, subtotal - couponDiscount) : 0;
  const total = calculateCartTotal() - bonusDiscount;

  // Bepul yetkazib berish progress
  const targetForFree = 1000000;
  const remainingForFree = Math.max(0, targetForFree - subtotal);
  const freeProgress = Math.min(100, (subtotal / targetForFree) * 100);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate('/buyurtma');
      setIsCheckingOut(false);
    }, 500);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast?.("Kupon kodini kiriting!", "error");
      return;
    }
    const success = applyCoupon?.(couponCode);
    if (success) {
      setCouponCode('');
    }
  };

  const handleToggleBonus = () => {
    if (bonusPoints <= 0) {
      showToast?.("Sizda bonus ballar yetarli emas!", "warning");
      return;
    }
    setUseBonus(!useBonus);
    if (!useBonus) {
      showToast?.(`${Math.min(bonusPoints * 1000, subtotal).toLocaleString('uz-UZ')} so'm bonus ishlatiladi`, "success");
    }
  };

  const itemCount = cart.reduce((t, i) => t + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex items-center justify-center">
        {/* Orqa fon effektlari */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-lg">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-xl">
            <ShoppingCart className="h-10 w-10 text-slate-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-3">
            Savat <span className="text-emerald-400">Bo'sh</span>
          </h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
            Kiber-savat modulingiz hozircha bo'sh. Katalogdan mahsulot tanlab, savatga qo'shing.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Katalogga qaytish
          </Link>

          {/* Aksiya banner */}
          <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Maxsus aksiya!</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Savatga mahsulot qo'shing va <span className="text-emerald-400 font-bold">WELCOME10</span> kuponi bilan 10% chegirma oling!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
      {/* Orqa fon effektlari */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* Yuqori panel */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/50 border border-slate-900 px-4 py-2 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
              {itemCount} ta mahsulot
            </span>
            <button
              onClick={() => {
                clearCart();
                showToast?.("Savat moduli tozalandi", "info");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Tozalash
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-emerald-400" />
          Savat <span className="text-emerald-400">Moduli</span>
        </h1>

        {/* Bepul yetkazib berish progress */}
        <div className="mb-8 p-4 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-white">Bepul yetkazib berish</span>
            </div>
            {remainingForFree > 0 ? (
              <span className="text-[10px] font-mono text-slate-500">
                Yana <span className="text-emerald-400 font-bold">{formatPrice(remainingForFree)}</span> qo'shing
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> BEPUL YETKAZIB BERISH
              </span>
            )}
          </div>
          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${freeProgress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Mahsulotlar ro'yxati */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const itemId = getItemId(item);
              const itemName = item.name || item.title || "Mahsulot";
              const itemPrice = getItemPrice(item);
              const hasDiscount = item.discount && Number(item.discount) > 0;

              return (
                <div
                  key={itemId}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md transition-all hover:border-slate-800 group"
                >
                  {/* Rasm */}
                  <Link
                    to={`/product/${itemId}`}
                    className="shrink-0 w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden border border-slate-900 bg-slate-950/60 flex items-center justify-center p-2"
                  >
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Ma'lumot */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${itemId}`}
                      className="font-bold text-white text-sm hover:text-emerald-400 transition-colors line-clamp-1"
                    >
                      {itemName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono font-black text-emerald-400 text-sm">
                        {formatPrice(itemPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          {formatPrice(Number(item.price) || 0)}
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                    {item.specs && item.specs.length > 0 && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                        {item.specs.slice(0, 2).join(" • ")}
                      </p>
                    )}
                    {item.stock && Number(item.stock) < 5 && (
                      <p className="text-[10px] text-rose-400 font-mono mt-1 animate-pulse">
                        Faqat {item.stock} dona qolgan!
                      </p>
                    )}
                  </div>

                  {/* Miqdor boshqaruvi */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-800 bg-slate-950/60 rounded-xl p-1">
                      <button
                        onClick={() => decreaseCartQuantity(itemId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono font-bold text-sm px-3 text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-black text-white text-sm">
                        {formatPrice(itemPrice * item.quantity)}
                      </p>
                      <p className="text-[9px] text-slate-600 font-mono">
                        {formatPrice(itemPrice)} × {item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 mt-1 inline-flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buyurtma xulosasi */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" /> Buyurtma Xulosasi
              </h2>

              {/* Kupon qo'llash */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <BadgePercent className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-400 font-mono">{appliedCoupon.code}</p>
                        <p className="text-[9px] text-slate-500">-{appliedCoupon.discount}% chegirma</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kupon kodi"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none uppercase font-mono"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all"
                    >
                      <BadgePercent className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {['WELCOME10', 'SUMMER20', 'NEWYEAR30'].map(code => (
                    <button
                      key={code}
                      onClick={() => {
                        setCouponCode(code);
                        applyCoupon?.(code);
                      }}
                      className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded hover:text-emerald-400 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bonus ballar */}
              {bonusPoints > 0 && (
                <button
                  onClick={handleToggleBonus}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    useBonus ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Bonus ballar</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${useBonus ? 'text-amber-400' : 'text-slate-400'}`}>
                      {useBonus ? 'Ishlatilmoqda ✓' : `${bonusPoints} ball`}
                    </span>
                  </div>
                  {useBonus && bonusDiscount > 0 && (
                    <p className="mt-1 text-[10px] text-emerald-400 font-mono">
                      Chegirma: -{formatPrice(bonusDiscount)}
                    </p>
                  )}
                </button>
              )}

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Ostiy summa</span>
                  <span className="font-mono font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Ticket className="h-3.5 w-3.5" /> Kupon chegirmasi
                    </span>
                    <span className="font-mono font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {useBonus && bonusDiscount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span className="flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5" /> Bonus chegirma
                    </span>
                    <span className="font-mono font-bold">-{formatPrice(bonusDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Yetkazib berish
                  </span>
                  <span className="font-mono font-bold text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400">BEPUL</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-900 pt-3 flex justify-between items-center">
                  <span className="font-bold text-white uppercase tracking-wider text-xs">Jami</span>
                  <span className="font-mono font-black text-emerald-400 text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Yo'naltirilmoqda...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Buyurtmani Rasmiylashtirish
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 font-light text-center leading-relaxed">
                1 000 000 so'mdan yuqori buyurtmalarda yetkazib berish bepul!
              </p>
            </div>

            {/* Kafolat kartalari */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-900/60 bg-slate-900/20 flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">1 yil kafolat</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-900/60 bg-slate-900/20 flex flex-col items-center gap-2 text-center">
                <Truck className="h-5 w-5 text-blue-400" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tezkor yetkazish</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-900/60 bg-slate-900/20 flex flex-col items-center gap-2 text-center">
                <RotateCcw className="h-5 w-5 text-purple-400" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">14 kun qaytarish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}