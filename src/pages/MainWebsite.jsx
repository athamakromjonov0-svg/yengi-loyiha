import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  SlidersHorizontal, 
  Layers, 
  ArrowUpDown, 
  TrendingUp, 
  Grid3X3, 
  Activity,
  CheckCircle2,
  FilterX,
  Clock,
  Cpu,
  Percent,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  BadgePercent,
  Flame,
  Heart,
  Package,
  Gift,
  Wallet,
  Info,
  ChevronRight,
  Smartphone,
  Laptop,
  Monitor,
  Headphones,
  Mouse,
  Keyboard,
  Camera,
  Printer,
  Router,
  Gamepad2,
  HardDrive,
  MemoryStick,
  Boxes,
  ShoppingCart,
  Globe,
  Banknote,
  CreditCard,
  X,
  ChevronDown,
  Sliders,
  Filter,
  SortDesc,
  Eye,
  ThumbsUp,
  Award,
  Calendar,
  Timer,
  AlertTriangle,
  Grid2X2,
  List,
  ArrowRight,
  DollarSign,
  PackageCheck,
  Clock3
} from 'lucide-react';

/**
 * Premium Kiber-Futuristik Global Vitrina va Katalog Markazi (MainWebsite)
 * A.A.A.uz - Ultra yirik onlayn savdo platformasi
 */

// Kategoriya ikonlari mapping
const categoryIcons = {
  'MACBOOK': Laptop,
  'NOTEBOOK': Laptop,
  'KOMPYUTERLAR': Monitor,
  'KOMPYUTER JIHOZLARI': Cpu,
  'MONITORLAR': Monitor,
  'KLAVIATURALAR': Keyboard,
  'SICHQONCHALAR': Mouse,
  'NAUSHNIKLAR': Headphones,
  'KOLONKALAR': Headphones,
  'WEB-KAMERALAR': Camera,
  'MIKROFONLAR': Camera,
  'SSD DISKLAR': HardDrive,
  'RAM XOTIRA': MemoryStick,
  'VIDEOKARTALAR': Cpu,
  'PROTSESSORLAR': Cpu,
  'QUVVAT BLOKLARI': Zap,
  'KORPUSLAR': Boxes,
  'SOVUTISH TIZIMLARI': Zap,
  'ROUTERLAR': Router,
  'PRINTERLAR': Printer,
  'PLANSHETLAR': Smartphone,
  'SMARTFONLAR': Smartphone,
  'AKSESSUARLAR': Package,
  "O'YIN KONSOLARI": Gamepad2,
};

// Kategoriya muvofiq ranglar
const categoryColors = {
  'MACBOOK': 'text-red-400 bg-red-500/10',
  'NOTEBOOK': 'text-blue-400 bg-blue-500/10',
  'KOMPYUTERLAR': 'text-emerald-400 bg-emerald-500/10',
  'KOMPYUTER JIHOZLARI': 'text-purple-400 bg-purple-500/10',
  'MONITORLAR': 'text-cyan-400 bg-cyan-500/10',
  'KLAVIATURALAR': 'text-amber-400 bg-amber-500/10',
  'SICHQONCHALAR': 'text-orange-400 bg-orange-500/10',
  'NAUSHNIKLAR': 'text-indigo-400 bg-indigo-500/10',
  'KOLONKALAR': 'text-pink-400 bg-pink-500/10',
  'WEB-KAMERALAR': 'text-lime-400 bg-lime-500/10',
  'MIKROFONLAR': 'text-teal-400 bg-teal-500/10',
  'SSD DISKLAR': 'text-sky-400 bg-sky-500/10',
  'RAM XOTIRA': 'text-violet-400 bg-violet-500/10',
  'VIDEOKARTALAR': 'text-fuchsia-400 bg-fuchsia-500/10',
  'PROTSESSORLAR': 'text-rose-400 bg-rose-500/10',
  'QUVVAT BLOKLARI': 'text-yellow-400 bg-yellow-500/10',
  'KORPUSLAR': 'text-slate-400 bg-slate-500/10',
  'SOVUTISH TIZIMLARI': 'text-cyan-400 bg-cyan-500/10',
  'ROUTERLAR': 'text-blue-400 bg-blue-500/10',
  'PRINTERLAR': 'text-emerald-400 bg-emerald-500/10',
  'PLANSHETLAR': 'text-indigo-400 bg-indigo-500/10',
  'SMARTFONLAR': 'text-purple-400 bg-purple-500/10',
  'AKSESSUARLAR': 'text-amber-400 bg-amber-500/10',
  "O'YIN KONSOLARI": 'text-rose-400 bg-rose-500/10',
};

export default function MainWebsite() {
  const { 
    products, 
    loading, 
    recentlyViewed, 
    stats, 
    compareList, 
    toggleCompare,
    categories: allCategories,
  } = useApp();
  
  // ============================================================
  // FILTRLASH VA SARALASH HOLATLARI
  // ============================================================
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [activeTab, setActiveTab] = useState('CATALOG');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState('grid');

  // Flash sale taymeri
  const [flashSaleEnds] = useState(() => {
    return Date.now() + 8 * 60 * 60 * 1000; // 8 soat
  });
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 0, seconds: 0 });

  // Foydalanuvchi sahifani birinchi marta ochganda yuqoriga silliq siljitish effekti
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Flash sale taymerini yangilash
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, flashSaleEnds - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, [flashSaleEnds]);

  // Max price ni topish
  const maxPrice = useMemo(() => {
    if (!Array.isArray(products)) return 100000;
    return Math.max(...products.map(p => Number(p.price) || 0), 100000);
  }, [products]);

  // Filtrlarni reset qilish
  const handleResetFilters = useCallback(() => {
    setSearch('');
    setSelectedCategory('ALL');
    setSortBy('DEFAULT');
    setActiveTab('CATALOG');
    setSelectedBrand('ALL');
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setCurrentPage(1);
  }, []);

  // ============================================================
  // KATEGORIYALAR MATRIX GENERATORI
  // ============================================================
  const generatedCategories = useMemo(() => {
    if (!Array.isArray(products)) return ['ALL'];
    const unique = new Set(products.map((p) => {
      if (!p.category) return 'GADGET';
      if (typeof p.category === 'object') return p.category.name?.toUpperCase() || 'GADGET';
      return String(p.category).toUpperCase();
    }));
    return ['ALL', ...Array.from(unique)];
  }, [products]);

  // ============================================================
  // BRENDLAR GENERATORI
  // ============================================================
  const brands = useMemo(() => {
    if (!Array.isArray(products)) return ['ALL'];
    const allBrands = new Set(products.map(p => (p.name || p.title || '').split(' ')[0].toUpperCase()));
    return ['ALL', ...Array.from(allBrands).slice(0, 15)];
  }, [products]);

  // ============================================================
  // ILG'OR KO'P BOSQICHLI FILTRLASH VA SARALASH
  // ============================================================
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let result = products.filter((p) => {
      const pName = p.name || p.title || '';
      const titleMatch = pName.toLowerCase().includes(search.toLowerCase());
      const descMatch = p.description?.toLowerCase().includes(search.toLowerCase()) || false;
      const idMatch = String(p._id || p.id).includes(search);
      
      let pCat = 'GADGET';
      if (p.category) {
        pCat = typeof p.category === 'object' ? p.category.name || 'GADGET' : String(p.category);
      }
      const categoryMatch = selectedCategory === 'ALL' || pCat.toUpperCase() === selectedCategory;
      
      const pBrand = (p.name || p.title || '').split(' ')[0].toUpperCase();
      const brandMatch = selectedBrand === 'ALL' || pBrand === selectedBrand;
      
      const discountMatch = !onlyDiscount || Number(p.discount) > 0;
      const stockMatch = !onlyInStock || Number(p.stock) > 0;

      return (titleMatch || descMatch || idMatch) && categoryMatch && brandMatch && discountMatch && stockMatch;
    });

    if (activeTab === 'EXCLUSIVE') {
      result = result.filter(p => Number(p.discount) > 0);
    }

    switch (sortBy) {
      case 'PRICE_ASC':
        return [...result].sort((a, b) => {
          const aPrice = Number(a.discount) > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const bPrice = Number(b.discount) > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return aPrice - bPrice;
        });
      case 'PRICE_DESC':
        return [...result].sort((a, b) => {
          const aPrice = Number(a.discount) > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const bPrice = Number(b.discount) > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return bPrice - aPrice;
        });
      case 'DISCOUNT':
        return [...result].sort((a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0));
      case 'RATING':
        return [...result].sort((a, b) => (Number(b.rating) || 5) - (Number(a.rating) || 5));
      case 'NEWEST':
        return [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'POPULAR':
        return [...result].sort((a, b) => (Number(b.reviewsCount) || 0) - (Number(a.reviewsCount) || 0));
      case 'NAME_ASC':
        return [...result].sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
      case 'NAME_DESC':
        return [...result].sort((a, b) => (b.name || b.title || '').localeCompare(a.name || a.title || ''));
      default:
        return result;
    }
  }, [products, search, selectedCategory, sortBy, activeTab, selectedBrand, onlyDiscount, onlyInStock]);

  // ============================================================
  // PAGINATION LOGIC
  // ============================================================
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, safePage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, activeTab, search, selectedBrand, onlyDiscount, onlyInStock]);

  // ============================================================
  // REAL VAQT REJIMIDAGI METRIKALAR
  // ============================================================
  const catalogStats = useMemo(() => {
    const totalInGrid = filteredProducts.length;
    const itemsWithDiscount = filteredProducts.filter(p => Number(p.discount) > 0).length;
    const itemsNew = filteredProducts.filter(p => p.isNew).length;
    const itemsLowStock = filteredProducts.filter(p => Number(p.stock) < 5).length;
    return { totalInGrid, itemsWithDiscount, itemsNew, itemsLowStock };
  }, [filteredProducts]);

  // Flash sale mahsulotlari
  const flashSaleProducts = useMemo(() => {
    return [...(Array.isArray(products) ? products : [])]
      .filter(p => Number(p.discount) >= 15)
      .sort((a, b) => Number(b.discount) - Number(a.discount))
      .slice(0, 4);
  }, [products]);

  // Yangi mahsulotlar
  const newProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).filter(p => p.isNew).slice(0, 4);
  }, [products]);

  // Top rated mahsulotlar
  const topRatedProducts = useMemo(() => {
    return [...(Array.isArray(products) ? products : [])]
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 4);
  }, [products]);

  // Kam omborli mahsulotlar
  const lowStockProducts = useMemo(() => {
    return (Array.isArray(products) ? products : [])
      .filter(p => Number(p.stock) > 0 && Number(p.stock) < 5)
      .slice(0, 4);
  }, [products]);

  // Narx formatlash
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + " so'm";
  };

  // Kategoriya sarlavhasi
  const getCategoryLabel = (cat) => {
    if (cat === 'ALL') return 'Barcha Gadjetlar';
    return cat;
  };

  // Kategoriya slug
  const getCategorySlug = (cat) => {
    return String(cat).toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 font-sans select-none text-white relative min-h-screen">
      
      {/* ============================================================
      KIBER-FON CHIZIQLARI VA PLAZMA MATRITSASI
      ============================================================ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-20 -z-10" />

      {/* ============================================================
      BREKDOWN: YUQORI STATISTIK PANEL
      ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10 pt-6">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-3 text-center">
          <div className="text-xl font-black text-emerald-400">{stats?.totalProducts || 0}</div>
          <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Mahsulotlar</div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-3 text-center">
          <div className="text-xl font-black text-blue-400">{stats?.totalCategories || 0}</div>
          <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Kategoriyalar</div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-3 text-center">
          <div className="text-xl font-black text-rose-400">{stats?.discountedProducts || 0}</div>
          <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Chegirmalar</div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-3 text-center">
          <div className="text-xl font-black text-amber-400">{stats?.newProducts || 0}</div>
          <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Yangi kelgan</div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-3 text-center">
          <div className="text-xl font-black text-purple-400">{stats?.totalOrders || 0}</div>
          <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Buyurtmalar</div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-3 text-center">
          <div className="text-xl font-black text-cyan-400">{stats?.lowStockProducts || 0}</div>
          <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Kam zaxira</div>
        </div>
      </div>

      {/* ============================================================
      1. KIBER HERO BANNER SEGMENTI
      ============================================================ */}
      <div className="mb-14 relative">
        <div className="absolute -top-10 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <HeroBanner />
      </div>

      {/* ============================================================
      XUSUSIYATLAR PANELI (UX BELGILARI)
      ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
        <div className="rounded-2xl border border-slate-900/60 bg-slate-900/20 backdrop-blur-md p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Truck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Tezkor yetkazish</p>
            <p className="text-[9px] text-slate-500 mt-0.5">1-2 kun ichida</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-900/60 bg-slate-900/20 backdrop-blur-md p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">1 yil kafolat</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Rasmiy himoya</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-900/60 bg-slate-900/20 backdrop-blur-md p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
            <RotateCcw className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">14 kun qaytarish</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Bepul qaytarish</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-900/60 bg-slate-900/20 backdrop-blur-md p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
            <CreditCard className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Xavfsiz to'lov</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Naqd / Karta / Click</p>
          </div>
        </div>
      </div>

      {/* ============================================================
      FLASH SALE SEKSIYASI
      ============================================================ */}
      {flashSaleProducts.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30 rounded-2xl px-4 py-2.5">
                <Flame className="h-5 w-5 text-rose-500 animate-pulse" />
                <h2 className="text-lg font-black uppercase tracking-widest">
                  Flash <span className="text-rose-500">Sale</span>
                </h2>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-black text-rose-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                <span className="text-rose-500 font-bold">:</span>
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-black text-rose-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <span className="text-rose-500 font-bold">:</span>
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-black text-rose-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
              </div>
            </div>
            <Link to="/chegirmalar" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors">
              Barcha chegirmalar <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
      KATEGORIYA GRID PANELI
      ============================================================ */}
      {generatedCategories.length > 1 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Boxes className="h-5 w-5 text-emerald-400" /> Kategoriyalar <span className="text-slate-600 font-normal">/// {generatedCategories.length - 1} TUR</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {generatedCategories.filter(c => c !== 'ALL').slice(0, 18).map((cat) => {
              const CatIcon = categoryIcons[cat] || Package;
              const colorCls = categoryColors[cat] || 'text-slate-400 bg-slate-500/10';
              const count = products.filter(p => {
                let pCat = p.category;
                if (typeof pCat === 'object') pCat = pCat.name || '';
                return String(pCat).toUpperCase() === cat;
              }).length;
              return (
                <Link
                  key={cat}
                  to={`/kategoriya/${encodeURIComponent(cat.toLowerCase())}`}
                  className="group rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-4 hover:border-emerald-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col items-center text-center gap-2"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 ${colorCls} group-hover:scale-110 transition-transform duration-300`}>
                    <CatIcon className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 group-hover:text-white uppercase tracking-wide leading-tight">{cat}</p>
                  <span className="text-[9px] font-mono text-slate-600">{count} ta</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DUAL-TABS TIZIMI (CATALOG VS EXCLUSIVE PIPELINE) */}
      <div className="flex border-b border-slate-900 mb-10 overflow-x-auto no-scrollbar select-none gap-6">
        <button
          onClick={() => { setActiveTab('CATALOG'); setSelectedCategory('ALL'); }}
          className={`pb-4 text-xs font-bold uppercase tracking-widest font-mono transition relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'CATALOG' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'CATALOG' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#FFC107]" />}
          <Grid3X3 className="h-4 w-4" /> BARCHA TOVARLAR MATRIXI
        </button>
        
        <button
          onClick={() => { setActiveTab('EXCLUSIVE'); setSelectedCategory('ALL'); }}
          className={`pb-4 text-xs font-bold uppercase tracking-widest font-mono transition relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'EXCLUSIVE' ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'EXCLUSIVE' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_#E5B20D]" />}
          <TrendingUp className="h-4 w-4" /> EKSKLYUZIV KIBER CHEGIRMALAR
        </button>

        {/* Ko'rinish rejimi */}
        <div className="ml-auto hidden sm:flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border transition-all ${
              viewMode === 'grid' ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'border-slate-900 text-slate-500 hover:text-white'
            }`}
          >
            <Grid2X2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border transition-all ${
              viewMode === 'list' ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'border-slate-900 text-slate-500 hover:text-white'
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3. INTEGRATSIYALASHGAN FILTR VA QIDIRUV STRUKTURASI */}
      <div className="bg-slate-950/40 backdrop-blur-xl border border-slate-900 rounded-2xl p-4 md:p-6 mb-10 shadow-2xl relative">
        <div className="absolute top-0 right-10 -translate-y-1/2 flex items-center gap-2 bg-slate-950 border border-slate-900 px-3 py-1 rounded-lg text-[9px] font-mono tracking-wider text-slate-500">
          <Activity className="h-3 w-3 text-emerald-400 animate-pulse" /> LIVE_FILTER_STREAM
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Chap qism: Real vaqtli matnli kiber qidiruv */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Katalog tizimidan resurslarni qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-900 bg-slate-950 py-3 pl-11 pr-24 text-xs text-white placeholder-slate-700 focus:border-emerald-500/30 focus:outline-none focus:ring-0 transition font-medium font-mono"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase font-mono font-bold bg-slate-900 border border-slate-800 px-2 py-1 rounded-md text-slate-400 hover:text-white transition"
              >
                Tozalash
              </button>
            )}
          </div>

          {/* O'ng qism: Saralash matritsasi */}
          <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-900 w-full lg:w-auto justify-between lg:justify-start">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" /> Saralash:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold font-mono text-emerald-400 focus:outline-none cursor-pointer border-none p-0 pr-6 uppercase tracking-tight"
              >
                <option value="DEFAULT" className="bg-slate-950 text-slate-400">Standart Shlyuz</option>
                <option value="PRICE_ASC" className="bg-slate-950 text-slate-400">Narx: O'sish</option>
                <option value="PRICE_DESC" className="bg-slate-950 text-slate-400">Narx: Kamayish</option>
                <option value="DISCOUNT" className="bg-slate-950 text-slate-400">Chegirma</option>
                <option value="RATING" className="bg-slate-950 text-slate-400">Reyting</option>
                <option value="NEWEST" className="bg-slate-950 text-slate-400">Yangi</option>
                <option value="POPULAR" className="bg-slate-950 text-slate-400">Ommabop</option>
                <option value="NAME_ASC" className="bg-slate-950 text-slate-400">Nomi: A-Z</option>
                <option value="NAME_DESC" className="bg-slate-950 text-slate-400">Nomi: Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* DINAMIK KATEGORIYALAR CHIZIG'I */}
        <div className="mt-5 pt-5 border-t border-slate-900/60 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 select-none no-scrollbar">
          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest shrink-0 mr-2 border-r border-slate-900 pr-3">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" /> Sektorlar:
          </div>
          
          {generatedCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return cat === 'ALL' ? (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap transition-all active:scale-[0.97] ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                    : 'bg-slate-950/80 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                Barcha Gadjetlar
              </button>
            ) : (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap transition-all active:scale-[0.97] ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                    : 'bg-slate-950/80 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Qo'shimcha filtrlari */}
        <div className="mt-4 pt-4 border-t border-slate-900/60 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest shrink-0 mr-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" /> Brend:
          </div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] font-bold font-mono text-emerald-400 focus:outline-none cursor-pointer"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand} className="bg-slate-950 text-slate-400">
                {brand === 'ALL' ? 'Barchasi' : brand}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOnlyDiscount(!onlyDiscount)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
              onlyDiscount ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'border-slate-900 text-slate-500 hover:text-white'
            }`}
          >
            <Percent className="h-3 w-3 inline mr-1" /> Chegirmalilar
          </button>

          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
              onlyInStock ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-slate-900 text-slate-500 hover:text-white'
            }`}
          >
            <PackageCheck className="h-3 w-3 inline mr-1" /> Omborida bor
          </button>
        </div>
      </div>

      {/* METRIKALAR PANELI VA FILTR STATUSI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 mb-6 font-mono px-1 gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-900 text-[11px]">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Ekran matritsasida: <span className="text-white font-bold">{catalogStats.totalInGrid} ta resurs</span> topildi
          {catalogStats.itemsWithDiscount > 0 && (
            <>
              <span className="text-slate-800">|</span> 
              <span className="text-rose-400 font-bold">{catalogStats.itemsWithDiscount} ta maxsus taklif</span>
            </>
          )}
          {catalogStats.itemsNew > 0 && (
            <>
              <span className="text-slate-800">|</span>
              <span className="text-amber-400 font-bold">{catalogStats.itemsNew} yangi</span>
            </>
          )}
        </div>

        {(search || selectedCategory !== 'ALL' || sortBy !== 'DEFAULT' || activeTab !== 'CATALOG' || selectedBrand !== 'ALL' || onlyDiscount || onlyInStock) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider transition text-[10px] bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10"
          >
            <FilterX className="h-3.5 w-3.5" /> Filtrlarni tozalash
          </button>
        )}
      </div>

      {/* 4. ASOSIY MAHSULOTLAR GRIDI YOKI SKELETON INTEGRATSIYASI */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse border border-slate-900 bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden h-72 sm:h-[520px]">
              <div className="aspect-square w-full rounded-xl bg-slate-900/60 border border-slate-900/80" />
              <div className="space-y-3 flex-1 mt-2">
                <div className="h-4 bg-slate-900 rounded w-1/3" />
                <div className="h-5 bg-slate-900 rounded w-3/4" />
                <div className="h-3 bg-slate-900 rounded w-full" />
                <div className="h-3 bg-slate-900 rounded w-5/6" />
              </div>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-900/40">
                <div className="h-6 bg-slate-900 rounded w-1/3" />
                <div className="h-10 bg-slate-900 rounded-xl w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-900 rounded-3xl bg-slate-950/10 backdrop-blur-sm max-w-2xl mx-auto flex flex-col items-center justify-center p-6 shadow-xl">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-slate-700 mb-4">
            <Layers className="h-8 w-8 text-slate-600 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Hech qanday kiber-aktiv topilmadi</h3>
          <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed font-light">
            Siz kiritgan kalit so'zlar yoki tanlangan sektor segmentlari bo'yicha ma'lumotlar omborida hech qanday moslik aniqlanmadi.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-emerald-400 font-bold text-[10px] uppercase font-mono tracking-widest rounded-xl border border-slate-800 transition active:scale-95"
          >
            Tizim parametrlarini tiklash
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-2 rounded-xl border border-slate-900 bg-slate-950/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-xl border text-xs font-mono font-bold transition-all ${
                    safePage === page
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-900 bg-slate-950/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-2 rounded-xl border border-slate-900 bg-slate-950/50 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================
      YANGI KELGAN MAHSULOTLAR
      ============================================================ */}
      {newProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-900 pb-4">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Yangi <span className="text-amber-400">Kelganlar</span>
            </h2>
            <Link to="/yangi-kelganlar" className="ml-auto text-[10px] font-bold text-slate-500 hover:text-white flex items-center gap-1">
              Hammasi <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
      TOP REYTINGLI MAHSULOTLAR
      ============================================================ */}
      {topRatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-900 pb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Top <span className="text-yellow-400">Reyting</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-lg ml-2">
              ENG YAXSHILAR
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {topRatedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
      KAM OMBORLI MAHSULOTLAR (SHOSHILINCH)
      ============================================================ */}
      {lowStockProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-900 pb-4">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Oxirgi <span className="text-rose-400">Nusxalar</span>
            </h2>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg ml-2 animate-pulse">
              SHOSHILINCH!
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {lowStockProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 5. KO'RILGAN MAHSULOTLAR BO'LIMI */}
      {recentlyViewed.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-900 pb-4">
            <Clock className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Yaqinda <span className="text-blue-400">Ko'rilgan</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-lg ml-2">
              {recentlyViewed.length} TA
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
            {recentlyViewed.slice(0, 5).map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}