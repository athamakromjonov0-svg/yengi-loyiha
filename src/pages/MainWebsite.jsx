import React, { useState, useMemo, useEffect } from 'react';
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
  FilterX
} from 'lucide-react';

/**
 * Premium Kiber-Futuristik Global Vitrina va Katalog Markazi (MainWebsite)
 * VORTEX.uz kiber-platformasining asosiy savdo va filtrlash shlyuzi.
 */
export default function MainWebsite() {
  const { products, loading } = useApp();
  
  // Mahalliylashtirilgan qidiruv va filtrlash holatlari
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT'); // DEFAULT, PRICE_ASC, PRICE_DESC, DISCOUNT, RATING
  const [activeTab, setActiveTab] = useState('CATALOG'); // CATALOG, EXCLUSIVE

  // Foydalanuvchi sahifani birinchi marta ochganda yuqoriga silliq siljitish effekti
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // --- KATEGORIYALAR MATRIX GENERATORI ---
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['ALL'];
    const unique = new Set(products.map((p) => {
      if (!p.category) return 'GADGET';
      if (typeof p.category === 'object') return p.category.name?.toUpperCase() || 'GADGET';
      return String(p.category).toUpperCase();
    }));
    return ['ALL', ...Array.from(unique)];
  }, [products]);

  // --- ILG'OR KO'P BOSQICHLI FILTRLASH VA SARALASH MATRITSASI ---
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    // 1-bosqich: Qidiruv kalit so'zlari va kategoriya filtri
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

      return (titleMatch || descMatch || idMatch) && categoryMatch;
    });

    // 2-bosqich: Eksklyuziv chegirmali tovarlar tabi
    if (activeTab === 'EXCLUSIVE') {
      result = result.filter(p => Number(p.discount) > 0);
    }

    // 3-bosqich: Matematik saralash (Sorting Logic)
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
      default:
        return result; // Tizimning standart holati
    }
  }, [products, search, selectedCategory, sortBy, activeTab]);

  // --- REAL VAQT REJIMIDAGI METRIKALAR ---
  const catalogStats = useMemo(() => {
    const totalInGrid = filteredProducts.length;
    const itemsWithDiscount = filteredProducts.filter(p => Number(p.discount) > 0).length;
    return { totalInGrid, itemsWithDiscount };
  }, [filteredProducts]);

  // Barcha filtrlarni boshlang'ich holatga keltirish shlyuzi
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSortBy('DEFAULT');
    setActiveTab('CATALOG');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 font-sans select-none text-white relative min-h-screen">
      
      {/* KIBER-FON CHIZIQLARI VA PLAZMA MATRITSASI */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-20 -z-10" />

      {/* 1. KIBER HERO BANNER SEGMENTI */}
      <div className="mb-14 relative">
        <div className="absolute -top-10 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <HeroBanner />
      </div>

      {/* 2. DUAL-TABS TIZIMI (CATALOG VS EXCLUSIVE PIPELINE) */}
      <div className="flex border-b border-slate-900 mb-10 overflow-x-auto no-scrollbar select-none gap-6">
        <button
          onClick={() => { setActiveTab('CATALOG'); setSelectedCategory('ALL'); }}
          className={`pb-4 text-xs font-bold uppercase tracking-widest font-mono transition relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'CATALOG' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'CATALOG' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#34d399]" />}
          <Grid3X3 className="h-4 w-4" /> BARCHA TOVARLAR MATRIXI
        </button>
        
        <button
          onClick={() => { setActiveTab('EXCLUSIVE'); setSelectedCategory('ALL'); }}
          className={`pb-4 text-xs font-bold uppercase tracking-widest font-mono transition relative whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'EXCLUSIVE' ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'EXCLUSIVE' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e]" />}
          <TrendingUp className="h-4 w-4" /> EKSKLYUZIV KIBER CHEGIRMALAR
        </button>
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

          {/* O'ng qism: Saralash matritsasi (Custom Styled Dropdown) */}
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
                <option value="PRICE_ASC" className="bg-slate-950 text-slate-400">Narx: O'sish tartibida</option>
                <option value="PRICE_DESC" className="bg-slate-950 text-slate-400">Narx: Kamayish tartibida</option>
                <option value="DISCOUNT" className="bg-slate-950 text-slate-400">Maksimal Chegirma</option>
                <option value="RATING" className="bg-slate-950 text-slate-400">Yuqori Reyting</option>
              </select>
            </div>
          </div>
        </div>

        {/* DINAMIK KATEGORIYALAR CHIZIG'I */}
        <div className="mt-5 pt-5 border-t border-slate-900/60 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 select-none no-scrollbar">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest shrink-0 mr-2 border-r border-slate-900 pr-3 hidden md:flex">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" /> Sektorlar:
          </div>
          
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap transition-all active:scale-[0.97] ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-950/80 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'Barcha Gadjetlar' : cat}
              </button>
            );
          })}
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
        </div>

        {(search || selectedCategory !== 'ALL' || sortBy !== 'DEFAULT' || activeTab !== 'CATALOG') && (
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
        /* KIBER-SKELETON YUKLANISH MATRITSASI */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse border border-slate-900 bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden h-[520px]">
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
        /* HECH NARSA TOPILMAGAN HOLATDAGI QALQON */
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
        /* ASOSIY DYNAMIC MAHSULOTLAR GRIDI */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}