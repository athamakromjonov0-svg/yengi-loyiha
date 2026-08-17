import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Layers, Percent, Heart, Scale, ShoppingBag, User, Wallet,
  ShieldCheck, ChevronDown, X, Compass, Sparkles, LogOut,
  ShoppingCart, Sparkle, Coins, Truck, Newspaper, LifeBuoy, RotateCcw,
  CreditCard, HelpCircle, Headset, Package, ReceiptText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * O'NG TOMON SIDEBAR — saytning barcha sahifalari shu yerda.
 * Katta ekranlarda (xl+) doimiy ko'rinadi, kichik ekranlarda
 * navbar tugmasi orqali ochiladigan drawer bo'lib ishlaydi.
 */
export default function SiteSidebar({ open, onClose }) {
  const {
    cart, wishlist, compareList,
    isSiteAuthenticated, siteUser, siteLogout,
    isAuthenticated,
    bonusPoints, networkStatus,
    products,
  } = useApp();

  const location = useLocation();
  const [catsOpen, setCatsOpen] = useState(false);

  const cartCount = (cart || []).reduce((s, i) => s + (i.quantity || 1), 0);
  const wishlistCount = (wishlist || []).length;
  const compareCount = (compareList || []).length;

  // Sayt kategoriyalari (mahsulotlardan yig'iladi)
  const cats = useMemo(() => {
    const set = new Set((products || []).map(p => {
      const c = p.category;
      if (!c) return 'GENERAL';
      return typeof c === 'object' ? (c.name || 'GENERAL') : String(c);
    }));
    return Array.from(set).sort();
  }, [products]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkCls = (path) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all border ${
    isActive(path)
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border-transparent'
  }`;

  const sectionTitle = (text) => (
    <p className="px-3 mb-2 mt-6 text-[9px] font-mono font-bold text-slate-600 uppercase tracking-[0.2em] first:mt-0">{text}</p>
  );

  const badge = (count, cls) => count > 0 ? (
    <span className={`ml-auto text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${cls}`}>{count}</span>
  ) : null;

  return (
    <>
      {/* MOBIL ORQA FON (drawer) */}
      {open && (
        <div className="fixed inset-0 z-[55] bg-slate-950/70 backdrop-blur-sm xl:hidden" onClick={onClose} />
      )}

      <aside className={`fixed right-0 top-0 bottom-0 z-[60] w-64 flex flex-col border-l border-slate-900 bg-slate-950/95 backdrop-blur-2xl transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
      }`}>
        {/* LOGO */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-900">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">GRAND<span className="text-amber-400">DECOR</span></p>
              <p className="text-[8px] font-mono text-slate-500 tracking-widest uppercase">Premium Store</p>
            </div>
          </Link>
          <button onClick={onClose} className="xl:hidden p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* NAVIGATSIYA */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
          {sectionTitle('/// Navigatsiya')}
          <Link to="/" onClick={onClose} className={linkCls('/')}>
            <Home className="h-4 w-4 shrink-0" /> Bosh sahifa
          </Link>

          {/* Kategoriyalar (ochiluvchi) */}
          <div>
            <button
              onClick={() => setCatsOpen(!catsOpen)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all border ${
                isActive('/kategoriya') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border-transparent'
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Kategoriyalar</span>
              <span className="text-[9px] font-mono text-slate-600">{cats.length}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${catsOpen ? 'rotate-180' : ''}`} />
            </button>
            {catsOpen && (
              <div className="mt-1 ml-7 pl-3 border-l border-slate-800 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
                {cats.map(cat => (
                  <Link
                    key={cat}
                    to={`/kategoriya/${encodeURIComponent(String(cat).toLowerCase())}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[11px] text-slate-500 hover:text-emerald-400 hover:bg-slate-900/60 transition-all"
                  >
                    <span className="truncate">{cat}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/katalog" onClick={onClose} className={linkCls('/katalog')}>
            <Package className="h-4 w-4 shrink-0" /> Barcha mahsulotlar
          </Link>
          <Link to="/yangi-kelganlar" onClick={onClose} className={linkCls('/yangi-kelganlar')}>
            <Sparkle className="h-4 w-4 shrink-0" /> Yangi kelganlar
          </Link>
          <Link to="/chegirmalar" onClick={onClose} className={linkCls('/chegirmalar')}>
            <Percent className="h-4 w-4 shrink-0" /> Chegirmalar
          </Link>
          <Link to="/solishtirish" onClick={onClose} className={linkCls('/solishtirish')}>
            <Scale className="h-4 w-4 shrink-0" /> Solishtirish {badge(compareCount, 'bg-blue-500/20 text-blue-400 border border-blue-500/30')}
          </Link>

          {sectionTitle('/// Do\'kon')}
          <Link to="/sevimlilar" onClick={onClose} className={linkCls('/sevimlilar')}>
            <Heart className="h-4 w-4 shrink-0" /> Sevimlilar {badge(wishlistCount, 'bg-rose-500/20 text-rose-400 border border-rose-500/30')}
          </Link>
          <Link to="/savat" onClick={onClose} className={linkCls('/savat')}>
            <ShoppingCart className="h-4 w-4 shrink-0" /> Savat {badge(cartCount, 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')}
          </Link>
          <Link to="/buyurtmalarim" onClick={onClose} className={linkCls('/buyurtmalarim')}>
            <ReceiptText className="h-4 w-4 shrink-0" /> Buyurtmalarim
          </Link>

          {sectionTitle('/// Xizmatlar')}
          <Link to="/bonus-dasturi" onClick={onClose} className={linkCls('/bonus-dasturi')}>
            <Coins className="h-4 w-4 shrink-0" /> Bonus dasturi
          </Link>
          <Link to="/yetkazib-berish" onClick={onClose} className={linkCls('/yetkazib-berish')}>
            <Truck className="h-4 w-4 shrink-0" /> Yetkazib berish
          </Link>
          <Link to="/tolov-usullari" onClick={onClose} className={linkCls('/tolov-usullari')}>
            <CreditCard className="h-4 w-4 shrink-0" /> To'lov usullari
          </Link>
          <Link to="/qaytarish" onClick={onClose} className={linkCls('/qaytarish')}>
            <RotateCcw className="h-4 w-4 shrink-0" /> Qaytarish
          </Link>
          <Link to="/faq" onClick={onClose} className={linkCls('/faq')}>
            <HelpCircle className="h-4 w-4 shrink-0" /> FAQ
          </Link>
          <Link to="/aloqa" onClick={onClose} className={linkCls('/aloqa')}>
            <Headset className="h-4 w-4 shrink-0" /> Aloqa
          </Link>
          <Link to="/blog" onClick={onClose} className={linkCls('/blog')}>
            <Newspaper className="h-4 w-4 shrink-0" /> Blog / Yangiliklar
          </Link>
          <Link to="/ommaviy-oferta" onClick={onClose} className={linkCls('/ommaviy-oferta')}>
            <LifeBuoy className="h-4 w-4 shrink-0" /> Ommaviy oferta
          </Link>

          {sectionTitle('/// Hisob')}
          {isSiteAuthenticated ? (
            <>
              <Link to="/sayt/profil" onClick={onClose} className={linkCls('/sayt/profil')}>
                <User className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{siteUser?.name || 'Shaxsiy kabinet'}</span>
              </Link>
              <button
                onClick={() => { siteLogout(); onClose(); }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all border border-transparent w-full text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" /> Saytdan chiqish
              </button>
            </>
          ) : (
            <Link to="/sayt/kirish" onClick={onClose} className={linkCls('/sayt/kirish')}>
              <User className="h-4 w-4 shrink-0" /> Kirish / Ro'yxatdan o'tish
            </Link>
          )}
          <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 border border-slate-900 bg-slate-950/60 mt-1">
            <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-amber-400" /> Bonus ballar</span>
            <span className="text-amber-400 font-mono font-black">{bonusPoints}</span>
          </div>

          {sectionTitle('/// Tizim')}
          <Link to="/admin" onClick={onClose} className={linkCls('/admin')}>
            <ShieldCheck className="h-4 w-4 shrink-0" /> Admin panel
          </Link>
          {!isAuthenticated && (
            <Link to="/login" onClick={onClose} className={linkCls('/login')}>
              <Compass className="h-4 w-4 shrink-0" /> Root kirish
            </Link>
          )}

          {/* Aksiya kartasi */}
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <p className="text-[10px] font-black text-white uppercase tracking-wider">Maxsus taklif</p>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Kupon: <span className="text-emerald-400 font-mono font-bold">WELCOME10</span> — 500 000 so'mdan yuqori xaridlarda 10% chegirma!
            </p>
          </div>
        </nav>

        {/* PASTKI HOLAT */}
        <div className="px-4 py-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${networkStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${networkStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{networkStatus === 'online' ? 'Tarmoq: Ulangan' : 'Tarmoq: Uzilgan'}</span>
            </div>
            <span className="text-[9px] font-mono text-slate-600">v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
