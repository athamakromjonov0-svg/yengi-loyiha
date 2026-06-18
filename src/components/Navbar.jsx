import React, { useState, useEffect } from 'react';
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
  Percent
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Premium Kiber-Futuristik Navigatsiya Paneli (Navbar)
 * Ilovaning global holatini boshqaradi va real vaqt rejimida metrikalarni yangilaydi.
 */
export default function Navbar() {
  // Global kontekstdan dinamik ma'lumotlarni qabul qilamiz
  const { isAuthenticated, logout, cart, wishlist, user } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Savat va sevimlilar elementlarining real vaqtda haqiqiy soni
  const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

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
  }, [location]);

  // Global qidiruv jo'natish tizimi
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/qidiruv?q=${encodeURIComponent(searchQuery)}`);
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
            <a href="#mahsulotlar" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> Katalog
            </a>
            <a href="#chegirmalar" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1">
              <Percent className="h-3.5 w-3.5" /> Kampaniyalar
            </a>
          </div>

          {/* 3. INTELLEKTUAL QIDIRUV INPUTI */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-xs lg:max-w-md w-full mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kiber-aksessuarlar va gadjetlar qidiruvi..."
              className="w-full bg-slate-900/40 border border-slate-900 rounded-xl pl-11 pr-4 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30 focus:bg-slate-900/90 focus:ring-1 focus:ring-emerald-500/10 transition-all duration-200"
            />
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-600" />
          </form>

          {/* 4. INTERAKTIV AMALLAR PANEL (O'ng Tomon) */}
          <div className="hidden md:flex items-center gap-4.5">
            
            {/* Sevimlilar vidjeti */}
            <Link to="/sevimlilar" className="relative p-2.5 rounded-xl border border-transparent hover:border-slate-900 bg-transparent hover:bg-slate-900/30 text-slate-400 hover:text-rose-400 transition-all duration-200" aria-label="Sevimlilar">
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white shadow-lg shadow-rose-500/20 animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

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
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-900 bg-slate-950 p-1.5 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
        <div className="border-t border-slate-900 bg-slate-950 px-4 py-6 md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          
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
            <Link to="/sevimlilar" className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
              <span>Sevimlilar Ro\`yxati</span>
              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded-full">{wishlistCount} ta</span>
            </Link>
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

        </div>
      )}
    </nav>
  );
}