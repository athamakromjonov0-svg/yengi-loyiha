import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Cpu, 
  Layers, 
  ArrowLeft,
  Share2,
  Sparkles,
  Zap,
  Minus,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, showToast, loading } = useApp();

  // Lokal holatlar (States)
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' yoki 'reviews'
  const [selectedImage, setSelectedImage] = useState('');

  // MAHSUlOTNI KIBER-BAZADAN QIDIRIB TOPISH (id va _id formatlari uchun universal himoya)
  const product = products 
    ? products.find(item => String(item._id || item.id) === String(id)) 
    : null;

  // Mahsulot yuklanganda asosiy rasm holatini o'rnatish
  useEffect(() => {
    if (product) {
      const pImage = product.image || product.img;
      if (pImage) setSelectedImage(pImage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <h1 className="text-3xl font-black text-rose-500 mb-4 tracking-wider uppercase font-mono">
          KIBER-RESURS TOPILMADI
        </h1>
        <p className="text-sm text-slate-400 mb-6">So'ralgan mahsulot klaster ma'lumotlar bazasida mavjud emas.</p>
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:text-white transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  // Sevimlilar ro'yxatida borligini tekshirish (Universal ID solishtiruvi)
  const isWishlisted = wishlist 
    ? wishlist.some(item => String(item._id || item.id) === String(product._id || product.id)) 
    : false;

  // Narxni formatlash matrixi
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";
  };

  const hasDiscount = product.discount && Number(product.discount) > 0;
  const currentPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  // Savat mexanikasi
  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      if (showToast) {
        showToast(`${product.name || product.title} (${quantity} dona) savatga qo'shildi!`, "success");
      }
    }
  };

  // Ulashish tizimi
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    if (showToast) showToast("Havola buferga nusxalandi!", "info");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
      {/* Orqa fon effektlari */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* Yuqori boshqaruv paneli */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/50 border border-slate-900 px-4 py-2 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-900 text-slate-400 hover:text-white transition-colors"
              title="Ulashish"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => toggleWishlist && toggleWishlist(product)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isWishlisted 
                  ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
                  : 'bg-slate-900/50 border-slate-900 text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Asosiy Arena Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* CHAP TARAFI: Multimedia Moduli (Rasm galereyasi) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl border border-slate-900 bg-slate-900/30 overflow-hidden group flex items-center justify-center">
              <img
                src={selectedImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"}
                alt={product.name || product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 rounded-md bg-rose-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                  -{product.discount}%
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 rounded-md bg-emerald-400 px-3 py-1 text-[10px] font-black text-slate-950 uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                  <Zap className="h-3 w-3 fill-slate-950" /> YANGI
                </div>
              )}
            </div>

            {/* Qo'shimcha prevyu rasmlar */}
            <div className="grid grid-cols-4 gap-4">
              {[(product.image || product.img), "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=300", "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300", "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=300"].map((imgSrc, i) => (
                imgSrc && (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imgSrc)}
                    className={`aspect-square rounded-xl overflow-hidden border bg-slate-900/50 p-1 transition-all ${
                      selectedImage === imgSrc ? 'border-emerald-400 shadow-md shadow-emerald-500/10' : 'border-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <img src={imgSrc} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                )
              ))}
            </div>
          </div>

          {/* O'NG TARAFI: Kiber-Metrikalar va Sotib olish Moduli */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Sparkles className="h-3 w-3" /> {typeof product.category === 'object' ? product.category.name : (product.category || "Kiber Gadjet")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {product.name || product.title}
              </h1>
              
              {/* Reyting matritsasi */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {product.rating || "5.0"} ({product.reviewsCount || 12} kiber-sharh)
                </span>
              </div>
            </div>

            {/* Narxlar arxitekturasi */}
            <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900 backdrop-blur-md space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-mono font-black text-white tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-light">Soliqlar hisobga olingan. To'liq zavod kafolati ostida.</p>
            </div>

            {/* Tavsif */}
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              {product.description || "Ushbu yuqori muhandislik darajasidagi premium mahsulot foydalanuvchiga eng yuqori quvvat va innovatsion kiber-muhitni taqdim etadi."}
            </p>

            {/* Miqdorni boshqarish va Savatga tashlash */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Counter Moduli */}
                <div className="flex items-center justify-between border border-slate-800 bg-slate-900/50 rounded-xl p-1.5 sm:w-32">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono font-bold text-sm px-2 text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Sotib olish tugmasi */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all"
                >
                  <ShoppingCart className="h-4 w-4" /> Savatga qo'shish
                </button>
              </div>
            </div>

            {/* Info kartalari */}
            <div className="grid sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3 rounded-xl border border-slate-900/60 bg-slate-900/20 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="text-[11px]">
                  <p className="font-bold text-white">1 Yil Kafolat</p>
                  <p className="text-slate-500">Rasmiy kiber-himoya</p>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-slate-900/60 bg-slate-900/20 flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-400 shrink-0" />
                <div className="text-[11px]">
                  <p className="font-bold text-white">Tezkor Kuryer</p>
                  <p className="text-slate-500">24 soat ichida yetkazish</p>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-slate-900/60 bg-slate-900/20 flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-purple-400 shrink-0" />
                <div className="text-[11px]">
                  <p className="font-bold text-white">Xavfsiz Qaytarish</p>
                  <p className="text-slate-500">14 kunlik qaytarish sharti</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Informatsion Tizim (Tablar) */}
        <div className="mt-16 border-t border-slate-900 pt-10">
          <div className="flex border-b border-slate-900 gap-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'specs' ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Texnik Xususiyatlari
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'reviews' ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Sharhlar ({product.reviewsCount || 12})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'specs' ? (
              <div className="max-w-3xl space-y-4">
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Ushbu tizim komponentining to'liq me'moriy spetsifikatsiyasi pastdagi matritsada ko'rsatilgan.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {(product.specs && product.specs.length > 0 ? product.specs : ["Kiber-arxitektura v2", "Neon yoritgich komplekt", "Ultra-past kechikish darajasi", "Oliy toifali korpus materiallari"]).map((spec, index) => (
                    <div key={index} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/30 border border-slate-900 text-xs text-slate-300">
                      <Cpu className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl space-y-6">
                {[
                  { name: "Kiber Root", date: "12.05.2026", text: "Haqiqatdan ham juda sifatli ishlangan, narxiga mutloq arziydi. Tavsiya qilaman!" },
                  { name: "Alex Matrix", date: "08.05.2026", text: "Yetkazib berish kuryerlik xizmati juda tez ishladi. Mahsulot qadog'i buzilmagan, ideal holatda keldi." }
                ].map((review, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">{review.name}</span>
                      <span className="text-slate-600 font-mono">{review.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, starIdx) => <Star key={starIdx} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}