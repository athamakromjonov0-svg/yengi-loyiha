import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  Search, 
  Heart, 
  User, 
  Settings, 
  ChevronDown,
  Cpu,
  Compass,
  Percent,
  Bell,
  BadgePercent,
  History,
  Scale,
  Package,
  Wallet,
  ClipboardList,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Star,
  ChevronRight,
  TrendingUp,
  Zap,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Premium Kiber-Futuristik Navigatsiya Paneli (Navbar)
 * Ilovaning global holatini boshqaradi va real vaqt rejimida metrikalarni yangilaydi.
 */
export default function Navbar() {
  // Global kontekstdan dinamik ma'lumotlarni qabul qilamiz
  const { 
    isAuthenticated, 
    logout, 
    cart, 
    wishlist, 
    user, 
    isSiteAuthenticated, 
    siteUser, 
    siteLogout,
    categories,
    products,
    recentlyViewed,
    compareList,
    notifications,
    markAllNotificationsRead,
    bonusPoints,
    stats,
    applyCoupon,
    showToast
  } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeNotificationFilter, setActiveNotificationFilter] = useState('all');
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const notificationsRef = useRef(null);

  // Savat va sevimlilar elementlarining real vaqtda haqiqiy soni
  const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;
  const compareCount = compareList ? compareList.length : 0;
  const unreadNotifications = notifications ? notifications.filter(n => !n.read).length : 0;
  
  // Sahifa skroll bo'lganda navbarni vizual o'zgartirish (Glassmorphism)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sahifa o'zgarganda barcha ochilgan panellarni avtomatik yopish
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsCategoriesOpen(false);
    setIsNotificationsOpen(false);
    setShowSuggestions(false);
  }, [location]);

  // Tashqi klikda panellarni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Qidiruv bo'sh bo'lganda tavsiyalarni tozalash
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }
    
    // Real vaqtli qidiruv takliflari
    const query = searchQuery.toLowerCase();
    const suggestions = (products || [])
      .filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const category = typeof p.category === 'object' ? (p.category.name || '') : (p.category || '');
        return name.includes(query) || desc.includes(query) || String(category).toLowerCase().includes(query);
      })
      .slice(0, 5)
      .map(p => ({
        id: p._id || p.id,
        name: p.name || p.title || '',
        category: typeof p.category === 'object' ? (p.category.name || '') : (p.category || ''),
        price: p.price,
        discount: p.discount || 0,
        image: p.image,
        isNew: p.isNew,
      }));
    setSearchSuggestions(suggestions);
  }, [searchQuery, products]);

  // Global qidiruv jo'natish tizimi
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/qidiruv?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  // Qidiruv orqali mahsulotga o'tish
  const handleSuggestionClick = (id) => {
    navigate(`/product/${id}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // Kategoriyani formatlash
  const formatCategory = (cat) => {
    if (!cat) return 'GENERAL';
    if (typeof cat === 'object') return (cat.name || 'GENERAL').toUpperCase();
    return String(cat).toUpperCase();
  };

  // Kategoriya guruhlari
  const categoryGroups = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    const allCats = new Set((products || []).map(p => {
      let cat = p.category;
      if (!cat) return 'GENERAL';
      if (typeof cat === 'object') return cat.name || 'GENERAL';
      return String(cat);
    }));
    
    return [
      { title: "BARCHA KATEGORIYALAR", items: Array.from(allCats), icon: Filter },
    ];
  }, [categories, products]);

  // Bildirishnoma filtrlash
  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    if (activeNotificationFilter === 'all') return notifications;
    return notifications.filter(n => n.type === activeNotificationFilter);
  }, [notifications, activeNotificationFilter]);

  // Narx formatlash
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";
  };

  // Kupon qo'llash
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      showToast?.("Kupon kodini kiriting!", "error");
      return;
    }
    const success = applyCoupon?.(couponInput);
    if (success) {
      setCouponInput('');
      setShowCouponModal(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'border-slate-900 bg-slate-950/85 backdrop-blur-xl shadow-xl shadow-black/40 h-16' 
        : 'border-slate-900/40 bg-slate-950 h-20'
    }`}>
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full justify-between items-center">
          
          {/* 1. BRAND LOGOTIPI */}
          <Link to="/" className="flex items-center gap-3 font-black text-xl tracking-widest text-white shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white via-slate-200 to-slate-400 text-slate-950 shadow-md shadow-white/5 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="hidden sm:block uppercase">
              A.A.A<span className="text-emerald-400 font-normal">.uz</span>
            </span>
          </Link>

          {/* 2. VERTIKAL HAVOLALAR (Katta Ekranlar) */}
          <div className="hidden lg:flex items-center gap-6 mx-4">
            <Link to="/" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1 ${location.pathname === '/' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              <Compass className="h-3.5 w-3.5" /> Bosh sahifa
            </Link>

            {/* Kategoriya Dropdown */}
            <div className="relative" onMouseEnter={() => setIsCategoriesOpen(true)} onMouseLeave={() => setIsCategoriesOpen(false)}>
              <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" /> Kategoriyalar
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && categoryGroups.length > 0 && (
                <div className="absolute left-0 mt-3 w-72 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="border-b border-slate-900 pb-2 mb-2">
                    <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                      /// BARCHA SEKTORLAR
                    </p>
                  </div>
                  <div className="grid gap-1 max-h-80 overflow-y-auto custom-scrollbar">
                    {categoryGroups.flatMap(g => 
                      g.items.map((cat, idx) => (
                        <Link
                          key={`${g.title}-${idx}`}
                          to={`/kategoriya/${encodeURIComponent(String(cat).toLowerCase())}`}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-800 border border-transparent transition-all group/cat"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group-hover/cat:text-emerald-400 group-hover/cat:border-emerald-500/30 transition-colors">
                            <Cpu className="h-3 w-3" />
                          </span>
                          <span className="flex-1">{cat}</span>
                          <ChevronRight className="h-3 w-3 text-slate-700 group-hover/cat:text-emerald-400 transition-colors" />
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/chegirmalar" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1">
              <Percent className="h-3.5 w-3.5" /> Kampaniyalar
            </Link>
            <Link to="/chegirmalar" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-1">
              <BadgePercent className="h-3.5 w-3.5" /> Chegirmalar
            </Link>
          </div>

          {/* 3. INTELLEKTUAL QIDIRUV INPUTI */}
          <div className="hidden md:flex relative max-w-xs lg:max-w-md w-full mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Kiber-aksessuarlar va gadjetlar qidiruvi..."
                className="w-full bg-slate-900/40 border border-slate-900 rounded-xl pl-11 pr-4 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30 focus:bg-slate-900/90 focus:ring-1 focus:ring-emerald-500/10 transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-600" />
            </form>

            {/* Qidiruv takliflari */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 min-w-max">
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {searchSuggestions.map((s) => {
                    const sPrice = Number(s.discount) > 0 ? s.price * (1 - s.discount / 100) : s.price;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={() => handleSuggestionClick(s.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-900/60 transition-colors border-b border-slate-900/30 last:border-b-0 group"
                      >
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{s.category}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {s.discount > 0 && (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">
                              -{s.discount}%
                            </span>
                          )}
                          <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                            {formatPrice(sPrice)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. INTERAKTIV AMALLAR PANEL (O'ng Tomon) */}
          <div className="hidden md:flex items-center gap-4.5">
            
            {/* Bonus ballar */}
            {bonusPoints > 0 && (
              <div className="relative group">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400">
                  <Wallet className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono font-bold">{bonusPoints} ball</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  BONUS BALLAR
                </div>
              </div>
            )}

            {/* Bildirishnomalar vidjeti */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen && unreadNotifications > 0) {
                    setTimeout(() => markAllNotificationsRead?.(), 2000);
                  }
                }}
                className="relative p-2.5 rounded-xl border border-transparent hover:border-slate-900 bg-transparent hover:bg-slate-900/30 text-slate-400 hover:text-yellow-400 transition-all duration-200"
                aria-label="Bildirishnomalar"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-mono font-bold text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Bildirishnomalar paneli */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-900 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">Bildirishnomalar</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                      {notifications.length} TA
                    </span>
                  </div>

                  {/* Filtrlar */}
                  <div className="flex gap-1 px-3 py-2 border-b border-slate-900">
                    {['all', 'success', 'warning', 'error', 'info'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveNotificationFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                          activeNotificationFilter === filter
                            ? 'bg-slate-900 text-white border border-slate-700'
                            : 'text-slate-500 hover:text-white border border-transparent'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Bildirishnomalar ro'yxati */}
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {filteredNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle2 className="h-8 w-8 text-slate-700 mb-2" />
                        <p className="text-xs text-slate-500 font-light">Bildirishnomalar yo'q</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => {
                        const iconMap = {
                          success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
                          error: <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />,
                          warning: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
                          info: <Info className="h-3.5 w-3.5 text-blue-400" />,
                        };
                        return (
                          <div key={notif.id} className={`px-4 py-3 border-b border-slate-900/50 flex gap-3 hover:bg-slate-900/50 transition-colors ${notif.read ? 'opacity-50' : ''}`}>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                              {iconMap[notif.type] || <Info className="h-3.5 w-3.5 text-slate-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                              <p className="text-[9px] text-slate-600 font-mono mt-1">
                                {new Date(notif.time).toLocaleString('uz-UZ')}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sevimlilar vidjeti */}
            <Link to="/sevimlilar" className="relative p-2.5 rounded-xl border border-transparent hover:border-slate-900 bg-transparent hover:bg-slate-900/30 text-slate-400 hover:text-rose-400 transition-all duration-200" aria-label="Sevimlilar">
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white shadow-lg shadow-rose-500/20 animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Solishtirish vidjeti */}
            {compareCount > 0 && (
              <Link to="/solishtirish" className="relative p-2.5 rounded-xl border border-transparent hover:border-slate-900 bg-transparent hover:bg-slate-900/30 text-slate-400 hover:text-blue-400 transition-all duration-200" aria-label="Solishtirish">
                <Scale className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-mono font-bold text-white shadow-lg shadow-blue-500/20">
                  {compareCount}
                </span>
              </Link>
            )}

            {/* Savat vidjeti */}
            <Link to="/savat" className="relative p-2.5 rounded-xl border border-transparent hover:border-slate-900 bg-transparent hover:bg-slate-900/30 text-slate-400 hover:text-emerald-400 transition-all duration-200" aria-label="Savat">
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-mono font-bold text-slate-950 shadow-lg shadow-emerald-400/20">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-slate-900 mx-1" />

            {/* SAYT FOYDALANUVCHISI (GOOGLE/FIREBASE) */}
            {isSiteAuthenticated ? (
              <Link 
                to="/sayt/profil" 
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-500/30 px-3 py-2 text-xs font-bold text-indigo-300 hover:text-white hover:border-indigo-400/50 transition-all duration-200"
                title="Shaxsiy kabinet"
              >
                {siteUser?.photoURL ? (
                  <img 
                    src={siteUser.photoURL} 
                    alt={siteUser.name || 'User'}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
                <span className="hidden xl:block max-w-[100px] truncate">{siteUser?.name || 'Profil'}</span>
              </Link>
            ) : (
              <Link to="/sayt/kirish" className="flex items-center gap-1.5 text-xs font-black rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-300 hover:text-white hover:border-slate-700 transition-all active:scale-95">
                <User className="h-3.5 w-3.5" /> KIRISH
              </Link>
            )}

            {/* AVTORIZATSIYA / FOYDALANUVCHI STATUSI */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-xl bg-slate-900/60 border border-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-800 transition-all duration-200"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user?.name || 'Kiber Root'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-900 bg-slate-950 p-1.5 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-900 mb-1.5">
                      <p className="text-xs font-black text-white">{user?.name || 'Admin Terminal'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{user?.email}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="h-2.5 w-2.5" /> ROOT
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 px-1.5 pb-1.5 border-b border-slate-900 mb-1.5">
                      <div className="text-center rounded-lg bg-slate-900/40 border border-slate-800 px-1 py-2">
                        <div className="text-sm font-black text-emerald-400">{stats?.totalProducts || 0}</div>
                        <div className="text-[8px] text-slate-500 font-mono uppercase">Mahsulot</div>
                      </div>
                      <div className="text-center rounded-lg bg-slate-900/40 border border-slate-800 px-1 py-2">
                        <div className="text-sm font-black text-blue-400">{stats?.totalOrders || 0}</div>
                        <div className="text-[8px] text-slate-500 font-mono uppercase">Buyurtma</div>
                      </div>
                      <div className="text-center rounded-lg bg-slate-900/40 border border-slate-800 px-1 py-2">
                        <div className="text-sm font-black text-rose-400">{stats?.lowStockProducts || 0}</div>
                        <div className="text-[8px] text-slate-500 font-mono uppercase">Kam ombor</div>
                      </div>
                    </div>
                    <Link to="/admin" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> ADMINSTRACIYA
                    </Link>
                    <Link to="/sozlamalar" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
                      <Settings className="h-4 w-4 text-blue-400" /> TIZIM SOZLAMALARI
                    </Link>
                    <div className="my-1 border-t border-slate-900" />
                    <button 
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-550/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" /> REJIMDAN CHIQISH
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-xs font-black rounded-xl bg-emerald-400 px-5 py-2.5 text-slate-950 shadow-md shadow-emerald-400/5 hover:bg-emerald-300 transition-all active:scale-95">
                <User className="h-3.5 w-3.5" /> ADMIN KIRISH
              </Link>
            )}

          </div>

          {/* MOBIL QURILMALAR MULTI-TUGMASI */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/savat" className="relative p-2 text-slate-400 hover:text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 text-[8px] font-mono font-bold text-slate-950">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-xl border border-slate-900 bg-slate-900/40 text-slate-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBIL EXPANSIYA MENYUSI */}
      {isOpen && (
        <div className="border-t border-slate-900 bg-slate-950 px-4 py-6 md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          
          {/* Mobil Qidiruv */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nimani qidiramiz?..."
              className="w-full bg-slate-900 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/30"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
          </form>

          {/* Linklar Matritsasi */}
          <div className="space-y-1">
            <Link to="/" className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
              Asosiy Sahifa
            </Link>
            
            {/* Kategoriyalar (Mobil) */}
            <div className="border-t border-slate-900 pt-3 mt-3">
              <p className="px-3 py-2 text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                /// Kategoriyalar
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                {Array.from(new Set((products || []).map(p => {
                  let cat = p.category;
                  if (!cat) return 'GENERAL';
                  if (typeof cat === 'object') return cat.name || 'GENERAL';
                  return String(cat);
                }))).map((cat) => (
                  <Link
                    key={cat}
                    to={`/kategoriya/${encodeURIComponent(String(cat).toLowerCase())}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <span>{cat}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-700" />
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/chegirmalar" className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
              <span className="flex items-center gap-2"><Percent className="h-4 w-4 text-rose-400" /> Chegirmalar</span>
            </Link>
            <Link to="/sevimlilar" className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
              <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-rose-400" /> Sevimlilar Ro'yxati</span>
              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded-full">{wishlistCount} ta</span>
            </Link>
            {compareCount > 0 && (
              <Link to="/solishtirish" className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
                <span className="flex items-center gap-2"><Scale className="h-4 w-4 text-blue-400" /> Solishtirish</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded-full">{compareCount} ta</span>
              </Link>
            )}
            {bonusPoints > 0 && (
              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300">
                <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-amber-400" /> Bonus Ballar</span>
                <span className="text-amber-400 font-mono text-xs">{bonusPoints} ball</span>
              </div>
            )}
          </div>

          {/* SAYT FOYDALANUVCHISI (MOBIL) */}
          <div className="border-t border-slate-900 pt-4 flex flex-col gap-2">
            {isSiteAuthenticated ? (
              <>
                <Link to="/sayt/profil" className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900">
                  <img 
                    src={siteUser?.photoURL} 
                    alt={siteUser?.name || 'User'}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  Shaxsiy Kabinet
                </Link>
                <button 
                  onClick={() => { siteLogout(); navigate('/'); }} 
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-500/5 text-left w-full"
                >
                  <LogOut className="h-4 w-4" /> Saytdan Chiqish
                </button>
              </>
            ) : (
              <Link to="/sayt/kirish" className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900">
                <User className="h-4 w-4" /> SAYTGA KIRISH
              </Link>
            )}
          </div>

          {/* Mobil Avtorizatsiya Nazorati */}
          {isAuthenticated ? (
            <div className="border-t border-slate-900 pt-4 flex flex-col gap-2">
              <Link to="/admin" className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Boshqaruv Paneli
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-500/5 text-left w-full"
              >
                <LogOut className="h-4 w-4" /> Seansni Yakunlash
              </button>
            </div>
          ) : (
            <Link to="/login" className="block text-center rounded-xl bg-emerald-400 py-3 text-xs font-black text-slate-950 mt-2 shadow-lg">
              ROOT TIZIMGA KIRISH
            </Link>
          )}

          {/* Bonus / Kupon qisqartma */}
          <div className="border-t border-slate-900 pt-4 mt-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <p className="text-xs font-black text-white uppercase tracking-wider">Maxsus Taklif</p>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Kupon: <span className="text-emerald-400 font-mono font-bold">WELCOME10</span> — 500,000 so'mdan yuqori xaridlarda 10% chegirma!
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}