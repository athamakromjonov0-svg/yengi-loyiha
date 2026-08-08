import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Plus,
  Scale,
  Check,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  Package,
  RefreshCw,
  CreditCard,
  Banknote,
  Wallet,
  Box,
  Timer,
  Shield,
  Gift,
  ChevronRight,
  ChevronLeft,
  Info,
  BadgePercent,
  Award,
  TrendingUp,
  Users,
  Globe,
  Lock,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  Send,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  X,
  Truck as TruckIcon,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    showToast, 
    loading, 
    addToRecentlyViewed,
    compareList,
    toggleCompare,
    reviews,
    addReview,
    bonusPoints,
    currency,
  } = useApp();

  // Lokal holatlar (States)
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImage, setSelectedImage] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState('1-2 kun');

  // MAHSULOTNI KIBER-BAZADAN QIDIRIB TOPISH
  const product = products 
    ? products.find(item => String(item._id || item.id) === String(id)) 
    : null;

  // Mahsulot yuklanganda asosiy rasm holatini o'rnatish
  const productId = product ? String(product._id || product.id) : null;
  useEffect(() => {
    if (product) {
      const pImage = product.image || product.img;
      if (pImage) setSelectedImage(pImage);
      addToRecentlyViewed?.(product);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // O'xshash mahsulotlar
  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products)) return [];
    let pCat = product.category;
    if (typeof pCat === 'object') pCat = pCat.name || '';
    return products
      .filter(p => {
        let cat = p.category;
        if (typeof cat === 'object') cat = cat.name || '';
        return String(cat) === String(pCat) && String(p._id || p.id) !== String(product._id || product.id);
      })
      .slice(0, 4);
  }, [product, products]);

  // Shu kategoriyadagi reyting
  const categoryAvgRating = useMemo(() => {
    if (!product || !Array.isArray(products)) return 0;
    let pCat = product.category;
    if (typeof pCat === 'object') pCat = pCat.name || '';
    const catProducts = products.filter(p => {
      let cat = p.category;
      if (typeof cat === 'object') cat = cat.name || '';
      return String(cat) === String(pCat);
    });
    if (catProducts.length === 0) return 0;
    return (catProducts.reduce((s, p) => s + (Number(p.rating) || 0), 0) / catProducts.length).toFixed(1);
  }, [product, products]);

  // Mahsulot sharhlari (lokal + context)
  const productReviews = useMemo(() => {
    if (!product) return [];
    const productId = String(product._id || product.id);
    const contextReviews = reviews?.[productId] || [];
    const defaultReviews = product.reviewsCount ? [
      { id: 'r1', userName: 'Kiber Root', rating: 5, text: 'Haqiqatdan ham juda sifatli ishlangan, narxiga mutloq arziydi. Tavsiya qilaman!', time: '2026-05-12' },
      { id: 'r2', userName: 'Alex Matrix', rating: 4, text: 'Yetkazib berish kuryerlik xizmati juda tez ishladi. Mahsulot qadog\'i buzilmagan, ideal holatda keldi.', time: '2026-05-08' },
      { id: 'r3', userName: 'TechPro User', rating: 5, text: 'Sifat va ishonchlilik nuqtai nazaridan eng yaxshisi! Kamchiliklari yo\'q.', time: '2026-05-01' },
    ].slice(0, 10) : [];
    return [...contextReviews, ...defaultReviews];
  }, [product, reviews]);

  // Ulashish tizimi
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || product?.title || 'Mahsulot',
          text: product?.description || '',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast?.("Havola buferga nusxalandi!", "info");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast?.("Ulashishda xatolik yuz berdi", "error");
      }
    }
  };

  // Savat mexanikasi
  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
      showToast?.(`${product.name || product.title} (${quantity} dona) savatga qo'shildi!`, "success");
    }
  };

  // Sotib olish
  const handleBuyNow = () => {
    if (addToCart) {
      addToCart(product, quantity);
      // Savat state'i yangilanishini kutib, keyin buyurtma sahifasiga o'tamiz
      setTimeout(() => navigate('/buyurtma'), 150);
    }
  };

  // Sharh qo'shish
  const handleAddReview = () => {
    if (!reviewText.trim()) {
      showToast?.("Sharh matnini kiriting!", "error");
      return;
    }
    addReview?.(String(product._id || product.id), {
      rating: reviewRating,
      text: reviewText,
      userName: reviewName || 'Anonim Foydalanuvchi',
      time: new Date().toISOString(),
    });
    setReviewText('');
    setReviewName('');
    setReviewRating(5);
    showToast?.("Sharhingiz qo'shildi, rahmat!", "success");
  };

  // Savol berish
  const handleAskQuestion = () => {
    if (!askQuestion.trim()) {
      showToast?.("Savol matnini kiriting!", "error");
      return;
    }
    setQuestions(prev => [
      { id: `Q-${Date.now()}`, text: askQuestion, userName: 'Siz', time: new Date().toISOString(), answered: false },
      ...prev,
    ]);
    setAskQuestion('');
    showToast?.("Savolingiz yuborildi! Admin tez orada javob beradi.", "success");
  };

  // In stock tekshirish
  const isInStock = product ? Number(product.stock) > 0 : false;
  const isWishlisted = wishlist 
    ? wishlist.some(item => String(item._id || item.id) === String(product?._id || product?.id)) 
    : false;
  const isCompared = compareList 
    ? compareList.some(item => String(item._id || item.id) === String(product?._id || product?.id)) 
    : false;

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

  // Narxni formatlash matrixi
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";
  };

  const hasDiscount = product.discount && Number(product.discount) > 0;
  const currentPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const savings = hasDiscount ? product.price - currentPrice : 0;
  const stockLevel = Number(product.stock) || 0;
  const stockText = stockLevel === 0 ? 'Mavjud emas' : stockLevel < 5 ? `Faqat ${stockLevel} dona qoldi!` : 'Mavjud';
  const stockColor = stockLevel === 0 ? 'text-rose-400' : stockLevel < 5 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
      {/* Orqa fon effektlari */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-6">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Bosh sahifa</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/" className="hover:text-emerald-400 transition-colors">Katalog</Link>
          <ChevronRight className="h-3 w-3" />
          <Link 
            to={`/kategoriya/${encodeURIComponent(String(typeof product.category === 'object' ? product.category.name : (product.category || 'GENERAL')).toLowerCase())}`}
            className="hover:text-emerald-400 transition-colors"
          >
            {typeof product.category === 'object' ? product.category.name : (product.category || 'GENERAL')}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300 truncate max-w-[150px]">{product.name || product.title}</span>
        </nav>

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
              onClick={() => toggleCompare?.(product)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isCompared 
                  ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
                  : 'bg-slate-900/50 border-slate-900 text-slate-400 hover:text-blue-500'
              }`}
              title="Solishtirish"
            >
              <Scale className={`h-4 w-4 ${isCompared ? 'fill-blue-500' : ''}`} />
            </button>
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
              title="Sevimlilar"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Asosiy Arena Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* CHAP TARAFI: Multimedia Moduli */}
          <div className="lg:col-span-6 space-y-4">
            <div 
              className={`relative aspect-square w-full rounded-2xl border border-slate-900 bg-slate-900/30 overflow-hidden group flex items-center justify-center transition-all ${
                zoomImage ? 'cursor-zoom-out scale-[1.02]' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoomImage(!zoomImage)}
            >
              <img
                src={selectedImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"}
                alt={product.name || product.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Sparkles className="h-3 w-3" /> {typeof product.category === 'object' ? product.category.name : (product.category || "Kiber Gadjet")}
                </span>
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                    <BadgePercent className="h-3 w-3" /> -{product.discount}% CHEGIRMA
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">
                    <Zap className="h-3 w-3" /> YANGI
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {product.name || product.title}
              </h1>
              
              {/* Reyting matritsasi */}
              <div className="flex items-center gap-4 pt-1 flex-wrap">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {product.rating || "5.0"} ({product.reviewsCount || 12} sharh)
                </span>
                <span className="text-xs text-slate-600 font-mono">|</span>
                <span className="text-xs font-mono text-slate-400">
                  Kategoriya reytingi: <span className="text-emerald-400 font-bold">{categoryAvgRating}</span>
                </span>
              </div>

              {/* Status panel */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${stockColor} ${
                  stockLevel === 0 ? 'border-rose-500/20 bg-rose-500/5' : stockLevel < 5 ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'
                }`}>
                  <Package className="h-3 w-3" /> {stockText}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400">
                  <Shield className="h-3 w-3" /> Kafolatli
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-400">
                  <Award className="h-3 w-3" /> Premium
                </span>
              </div>
            </div>

            {/* Narxlar arxitekturasi */}
            <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900 backdrop-blur-md space-y-3">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-mono font-black text-white tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-slate-500 line-through font-mono">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      Tejash: {formatPrice(savings)}
                    </span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900/60">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Kafolat</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">1 yil</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Yetkazish</div>
                  <div className="text-xs font-bold text-blue-400 mt-0.5">{deliveryEstimate}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Qaytarish</div>
                  <div className="text-xs font-bold text-purple-400 mt-0.5">14 kun</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-light">Soliqlar hisobga olingan. To'liq zavod kafolati ostida.</p>
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
                    onClick={() => setQuantity(q => Math.min(stockLevel || 99, q + 1))}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Sotib olish tugmalari */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-wider transition-all ${
                      isAddedToCart
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20'
                    } ${!isInStock ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'}`}
                  >
                    {isAddedToCart ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Qo'shildi!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" /> Savatga
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!isInStock}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:from-orange-400 hover:to-rose-400 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="h-4 w-4" /> Hoziroq sotib olish
                  </button>
                </div>
              </div>
            </div>

            {/* To'lov usullari */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1"><Banknote className="h-3 w-3 text-emerald-400" /> Naqd</span>
              <span className="text-slate-800">|</span>
              <span className="flex items-center gap-1"><CreditCard className="h-3 w-3 text-blue-400" /> Karta</span>
              <span className="text-slate-800">|</span>
              <span className="flex items-center gap-1"><Smartphone className="h-3 w-3 text-purple-400" /> Click</span>
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
          <div className="flex border-b border-slate-900 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs' ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 inline mr-1" /> Texnik Xususiyatlari
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 inline mr-1" /> Sharhlar ({product.reviewsCount || 12})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'questions' ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Users className="h-3.5 w-3.5 inline mr-1" /> Savol-javob
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shipping' ? 'border-emerald-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <TruckIcon className="h-3.5 w-3.5 inline mr-1" /> Yetkazib berish
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'specs' && (
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
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-6">
                {/* Sharh qo'shish formasi */}
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/30 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Sharh qoldiring</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Baho:</span>
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewRating(i + 1)}
                        className="transition-colors"
                      >
                        <Star className={`h-5 w-5 ${i < reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700 hover:text-amber-400/50'}`} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Ismingiz"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
                  />
                  <textarea
                    placeholder="Sharhingizni yozing..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddReview}
                    className="w-full rounded-xl bg-emerald-400 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 transition-all"
                  >
                    Sharhni yuborish
                  </button>
                </div>

                {/* Sharhlar ro'yxati */}
                {productReviews.slice(0, showAllReviews ? productReviews.length : 3).map((review, i) => (
                  <div key={review.id || i} className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-bold text-emerald-400 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-800">
                          <Users className="h-3 w-3" />
                        </div>
                        {review.userName}
                      </span>
                      <span className="text-slate-600 font-mono text-[10px]">
                        {new Date(review.time).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, starIdx) => <Star key={starIdx} className={`h-3 w-3 ${starIdx < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`} />)}
                    </div>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{review.text}</p>
                  </div>
                ))}

                {productReviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    {showAllReviews ? 'Kamroq ko\'rsatish' : `Barcha sharhlarni ko'rsatish (${productReviews.length})`}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="max-w-2xl space-y-4">
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/30 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Savol berish</h4>
                  <textarea
                    placeholder="Mahsulot haqida savolingiz..."
                    value={askQuestion}
                    onChange={(e) => setAskQuestion(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleAskQuestion}
                    className="w-full rounded-xl bg-emerald-400 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-300 transition-all"
                  >
                    <Send className="h-3.5 w-3.5 inline mr-1" /> Savolni yuborish
                  </button>
                </div>

                {questions.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-slate-900 bg-slate-950/40">
                    <p className="text-xs text-slate-500 font-light">Hozircha savollar yo'q. Birinchi bo'ling!</p>
                  </div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-emerald-400" /> {q.userName}
                        </span>
                        <span className="text-slate-600 font-mono text-[10px]">{new Date(q.time).toLocaleDateString('uz-UZ')}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-light">{q.text}</p>
                      {q.answered ? (
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                          <p className="text-[10px] text-emerald-400 font-bold">Admin javobi:</p>
                          <p className="text-xs text-slate-300 mt-1">{q.answer}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-600 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Javob kutmoqda...
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20">
                    <Truck className="h-6 w-6 text-blue-400 mb-2" />
                    <p className="text-xs font-bold text-white">Standart yetkazish</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">1-2 kun · 20,000 so'm</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20">
                    <Zap className="h-6 w-6 text-emerald-400 mb-2" />
                    <p className="text-xs font-bold text-white">Tezkor yetkazish</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">24 soat · 35,000 so'm</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20">
                    <Gift className="h-6 w-6 text-purple-400 mb-2" />
                    <p className="text-xs font-bold text-white">Olib ketish</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">Manzildan · Bepul</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <p className="text-xs text-blue-300 font-light leading-relaxed">
                    <Shield className="h-4 w-4 inline mr-1" /> 
                    1,000,000 so'mdan yuqori buyurtmalarda yetkazib berish bepul! To'lov naqd, karta yoki Click orqali amalga oshirilishi mumkin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
        O'XSHASH MAHSULOTLAR
        ============================================================ */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-900 pb-4">
              <Layers className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-black uppercase tracking-widest">
                O'xshash <span className="text-emerald-400">Mahsulotlar</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard key={related._id || related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}