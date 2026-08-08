import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Home,
  Building2,
  Ticket,
  Zap,
  Wallet,
  Star,
  ScanLine,
  BadgePercent,
  Clock,
  Timer,
  Package,
  Smartphone,
  ChevronDown,
  CreditCard as CardIcon,
  Landmark,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    addresses, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress, 
    paymentMethod, 
    setPaymentMethod, 
    createOrder, 
    clearCart, 
    showToast,
    isSiteAuthenticated,
    coupons,
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
    savedCards,
    addCard,
    deleteCard,
    setDefaultCard,
  } = useApp();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    region: '',
    city: '',
    street: '',
    house: '',
    comment: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [useBonus, setUseBonus] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";

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

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const selectedZone = deliveryZones.find(z => z.id === selectedDeliveryZone);
  const defaultCard = savedCards.find(c => c.isDefault) || savedCards[0];

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.region || !newAddress.city || !newAddress.street) {
      showToast?.("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }
    addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({ name: '', phone: '', region: '', city: '', street: '', house: '', comment: '' });
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast?.("Kupon kodini kiriting!", "error");
      return;
    }
    const success = applyCoupon?.(couponCode);
    if (success) {
      setCouponCode('');
      setShowCouponModal(false);
    }
  };

  const handleToggleBonus = () => {
    if (bonusPoints <= 0) {
      showToast?.("Sizda bonus ballar yetarli emas!", "warning");
      return;
    }
    setUseBonus(!useBonus);
    if (!useBonus) {
      showToast?.(`${Math.min(bonusPoints * 1000, subtotal)} so'm bonus ishlatiladi`, "success");
    }
  };

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiry || !newCard.cvv) {
      showToast?.("Karta ma'lumotlarini to'liq kiriting!", "error");
      return;
    }
    // Karta raqamini maskalash
    const last4 = newCard.cardNumber.replace(/\s/g, '').slice(-4);
    const card = {
      ...newCard,
      last4,
      brand: newCard.cardNumber.startsWith('4') ? 'VISA' : (newCard.cardNumber.startsWith('5') ? 'Mastercard' : 'UzCard'),
    };
    addCard(card);
    setShowCardForm(false);
    setNewCard({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (!defaultAddress) {
      showToast?.("Iltimos, yetkazib berish manzilini qo'shing!", "error");
      return;
    }
    
    if (paymentMethod === 'card' && !defaultCard && savedCards.length === 0) {
      showToast?.("Iltimos, karta qo'shing yoki naqd pul to'lovini tanlang!", "error");
      return;
    }

    const order = createOrder(cart, {
      paymentMethod,
      address: defaultAddress,
      deliveryZone: selectedZone,
      notes: orderNotes,
      deliveryFee,
      couponDiscount: couponDiscount + bonusDiscount,
    });

    if (!order) return;

    if (useBonus) {
      useBonusPoints?.(Math.round(bonusDiscount / 1000));
    }

    clearCart();
    setUseBonus(false);
    showToast?.("Buyurtma muvaffaqiyatli rasmiylashtirildi! Operator tez orada siz bilan bog'lanadi.", "success");
    navigate('/sayt/profil?tab=orders');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-lg">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-xl">
            <CreditCard className="h-10 w-10 text-slate-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-3">
            Savat <span className="text-emerald-400">Bo'sh</span>
          </h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
            Buyurtma rasmiylashtirish uchun avval savatga mahsulot qo'shing.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Katalogga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Manzil', icon: MapPin },
    { num: 2, label: 'To\'lov', icon: CreditCard },
    { num: 3, label: 'Tasdiqlash', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
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
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-emerald-400" />
            Buyurtma <span className="text-emerald-400">Rasmiylashtirish</span>
          </h1>
        </div>

        {/* Step indikator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${
                  activeStep === step.num
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : activeStep > step.num
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 opacity-60'
                    : 'bg-slate-900/40 border-slate-900 text-slate-500'
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:block">{step.label}</span>
                <span className="text-[9px] font-mono">{step.num}/3</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`h-px w-8 ${activeStep > step.num ? 'bg-emerald-500/40' : 'bg-slate-900'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Chap qism: Manzil va To'lov */}
          <div className="lg:col-span-8 space-y-6">
            {/* Manzil bo'limi */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" /> Yetkazib berish manzili
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Yangi manzil
                </button>
              </div>

              {/* Manzillar ro'yxati */}
              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border transition-all ${
                        addr.isDefault
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {addr.type === 'office' ? (
                            <Building2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                          ) : (
                            <Home className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-bold text-white">
                              {addr.name} {addr.isDefault && (
                                <span className="ml-2 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">ASOSIY</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {addr.region}, {addr.city}, {addr.street} {addr.house}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 font-mono">{addr.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                              Asosiy qilish
                            </button>
                          )}
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Yangi manzil formasi */}
              {showAddressForm && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Qabul qiluvchi ismi *"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Telefon raqami *"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Viloyat *"
                      value={newAddress.region}
                      onChange={(e) => setNewAddress({ ...newAddress, region: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Shahar *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Ko'cha *"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Uy / Xonadon"
                      value={newAddress.house}
                      onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewAddress({ ...newAddress, type: 'home' })}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                          newAddress.type === 'home' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-500'
                        }`}
                      >
                        <Home className="h-3.5 w-3.5" /> Uy
                      </button>
                      <button
                        onClick={() => setNewAddress({ ...newAddress, type: 'office' })}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                          newAddress.type === 'office' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-500'
                        }`}
                      >
                        <Building2 className="h-3.5 w-3.5" /> Ish
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Mo'ljal (ixtiyoriy)"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Qo'shimcha izoh (ixtiyoriy)"
                    value={newAddress.comment}
                    onChange={(e) => setNewAddress({ ...newAddress, comment: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 rounded-xl bg-emerald-400 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 transition-all"
                    >
                      Manzilni saqlash
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              {addresses.length === 0 && !showAddressForm && (
                <p className="text-xs text-slate-500 font-light">
                  Hozircha manzil qo'shilmagan. Buyurtma berish uchun yangi manzil qo'shing.
                </p>
              )}

              {/* Yetkazib berish zonasi */}
              <div className="mt-4 pt-4 border-t border-slate-900">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-400" /> Yetkazib berish hududi
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {deliveryZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedDeliveryZone(zone.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedDeliveryZone === zone.id
                          ? 'border-blue-500/40 bg-blue-500/5'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`h-4 w-4 ${selectedDeliveryZone === zone.id ? 'text-blue-400' : 'text-slate-600'}`} />
                        <span className="text-xs font-bold text-white">{zone.name}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {zone.days}
                        </span>
                        <span className={`font-mono font-bold ${subtotal >= zone.freeFrom ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {subtotal >= zone.freeFrom ? 'BEPUL' : formatPrice(zone.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* To'lov usuli */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-emerald-400" /> To'lov usuli
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Naqd pul</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Yetkazib berishda</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Karta orqali</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Onlayn to'lov</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('click')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'click'
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Click</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Mobil ilova</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Saqlangan kartalar */}
              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Saqlangan kartalar</h3>
                    <button
                      onClick={() => setShowCardForm(!showCardForm)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Karta qo'shish
                    </button>
                  </div>

                  {savedCards.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-2">
                      {savedCards.map((card) => (
                        <div
                          key={card.id}
                          className={`p-3 rounded-xl border transition-all ${
                            card.isDefault ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-800 bg-slate-950/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              <CardIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-white">{card.brand}</p>
                              <p className="text-[10px] text-slate-500 font-mono">•••• •••• •••• {card.last4}</p>
                            </div>
                            <button
                              onClick={() => deleteCard(card.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          {!card.isDefault && (
                            <button
                              onClick={() => setDefaultCard(card.id)}
                              className="mt-2 text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-colors"
                            >
                              Asosiy qilish
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {showCardForm && (
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2 relative">
                          <CardIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
                          <input
                            type="text"
                            placeholder="Karta raqami"
                            value={newCard.cardNumber}
                            onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/[^\d\s]/g, '').slice(0, 19) })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500/30 focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Karta egasi ismi"
                          value={newCard.cardHolder}
                          onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value.toUpperCase() })}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500/30 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={newCard.expiry}
                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500/30 focus:outline-none"
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            value={newCard.cvv}
                            onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500/30 focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleAddCard}
                        className="w-full rounded-xl bg-blue-500 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-400 transition-all"
                      >
                        Kartani saqlash
                      </button>
                    </div>
                  )}

                  {savedCards.length === 0 && !showCardForm && (
                    <p className="text-[10px] text-slate-500 font-light">
                      Karta qo'shilmagan. Onlayn to'lov uchun karta qo'shing.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Kupon va bonus */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4">
                <Ticket className="h-4 w-4 text-emerald-400" /> Kupon va Bonuslar
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {/* Kupon */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgePercent className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Chegirma kuponi</span>
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-emerald-400 font-mono">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-slate-500 font-mono">-{appliedCoupon.discount}%</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        O'chirish
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Kupon kodini kiriting"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none uppercase font-mono"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all"
                      >
                        Qo'llash
                      </button>
                    </div>
                  )}
                  <p className="mt-2 text-[9px] text-slate-600 font-mono">
                    Mavjud: WELCOME10, SUMMER20, NEWYEAR30
                  </p>
                </div>

                {/* Bonus ballar */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Bonus ballar</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-amber-400">{bonusPoints}</span>
                      <span className="text-[10px] text-slate-500 ml-1 font-mono">ball</span>
                    </div>
                    <button
                      onClick={handleToggleBonus}
                      disabled={bonusPoints <= 0}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        useBonus
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                      } ${bonusPoints <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {useBonus ? 'Ishlatilmoqda ✓' : 'Ishlatish'}
                    </button>
                  </div>
                  {useBonus && bonusDiscount > 0 && (
                    <p className="mt-2 text-[10px] text-emerald-400 font-mono">
                      -{formatPrice(bonusDiscount)} chegirma qo'llandi
                    </p>
                  )}
                  <p className="mt-1 text-[9px] text-slate-600">
                    1 ball = 1,000 so'm. 10,000 so'm xarid = 1 ball
                  </p>
                </div>
              </div>
            </div>

            {/* Mahsulotlar ro'yxati */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4">
                <Truck className="h-4 w-4 text-emerald-400" /> Buyurtma tarkibi ({cart.length} ta)
              </h2>
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemId = item._id || item.id;
                  const itemName = item.name || item.title || "Mahsulot";
                  const itemPrice = getItemPrice(item);
                  const hasDiscount = item.discount && Number(item.discount) > 0;
                  return (
                    <div key={itemId} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                      <img
                        src={item.image}
                        alt={itemName}
                        className="w-14 h-14 rounded-lg object-contain bg-slate-900 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{itemName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-500 font-mono">Miqdor: {item.quantity}</p>
                          {hasDiscount && (
                            <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">-{item.discount}%</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                        {hasDiscount && (
                          <p className="text-[9px] text-slate-600 line-through font-mono">
                            {formatPrice(Number(item.price) * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Buyurtma izohi */}
              <div className="mt-4 pt-4 border-t border-slate-900">
                <textarea
                  placeholder="Buyurtma izohi (ixtiyoriy) — masalan, qo'ng'iroq qilish vaqti, eslatmalar..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* O'ng qism: Xulosa */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Buyurtma Xulosasi
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Ostiy summa</span>
                  <span className="font-mono font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <BadgePercent className="h-3.5 w-3.5" /> Kupon ({appliedCoupon.code})
                    </span>
                    <span className="font-mono font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {useBonus && bonusDiscount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span className="flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5" /> Bonus ballar
                    </span>
                    <span className="font-mono font-bold">-{formatPrice(bonusDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Yetkazib berish {selectedZone && `(${selectedZone.days})`}
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
                onClick={handlePlaceOrder}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all"
              >
                <CreditCard className="h-4 w-4" /> Buyurtmani Tasdiqlash
              </button>

              <p className="text-[10px] text-slate-500 font-light text-center leading-relaxed">
                {selectedZone ? 
                  `${selectedZone.name} uchun ${formatPrice(selectedZone.freeFrom)} so'mdan yuqori buyurtmalarda yetkazib berish bepul!` 
                  : "1 000 000 so'mdan yuqori buyurtmalarda yetkazib berish bepul!"
                }
              </p>

              {!isSiteAuthenticated && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                  <p className="text-[10px] text-amber-400 font-light">
                    Buyurtma tarixini saqlash uchun ro'yxatdan o'ting
                  </p>
                  <Link
                    to="/sayt/kirish"
                    className="inline-block mt-1.5 text-[10px] font-bold text-amber-400 underline hover:text-amber-300 transition-colors"
                  >
                    Tizimga kirish →
                  </Link>
                </div>
              )}
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
                <ShieldCheck className="h-5 w-5 text-purple-400" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Xavfsiz to'lov</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}