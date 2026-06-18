import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Plus, Trash2, Edit3, Search, Package, 
  Coins, Layers, Check, X, Percent, AlertTriangle, Sparkles, 
  ShieldAlert, RefreshCw, FolderPlus 
} from 'lucide-react';

export default function AdminDashboard() {
  // context ichidan categories va addCategory funksiyasini ham chaqirib olamiz
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, showToast } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);

  // Alohida kategoriya qo'shish uchun state
  const [newCategoryName, setNewCategoryName] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Sektor tanlang', 
    image: '',
    discount: '0',
    stock: '10',
    isNew: false,
    specs: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";
  };

  // --- DINAMIK KATEGORIYALAR MATRIXI ---
  // Agar context'dan maxsus 'categories' kelsa o'shani oladi, bo'lmasa mahsulotlar ichidagilarini yig'adi
  const dbCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map(c => ({ id: c._id || c.id, name: c.name }));
    }
    if (!products) return [];
    const uniqueMap = new Map();
    
    products.forEach(p => {
      if (p.category && typeof p.category === 'object' && p.category._id) {
        uniqueMap.set(p.category._id, p.category.name);
      } else if (p.category && typeof p.category === 'string') {
        uniqueMap.set(p.category, p.category);
      }
    });

    return Array.from(uniqueMap.entries()).map(([id, name]) => ({ id, name }));
  }, [products, categories]);

  // --- ANALYTICAL METRIKALAR ---
  const analytics = useMemo(() => {
    const total = products ? products.length : 0;
    
    const grossValuation = products ? products.reduce((acc, curr) => {
      return acc + (Number(curr.price) || 0) * (Number(curr.stock) || 1);
    }, 0) : 0;

    const discountedCount = products ? products.filter(p => Number(p.discount) > 0).length : 0;
    const lowStockCount = products ? products.filter(p => p.stock && Number(p.stock) < 5).length : 0;

    return {
      total,
      grossValuation,
      categoriesCount: dbCategories.length,
      discountedCount,
      lowStockCount
    };
  }, [products, dbCategories]);

  // Real vaqtda qidirish va filtrlar
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const catName = typeof p.category === 'object' ? p.category?.name : p.category;
      const catId = typeof p.category === 'object' ? p.category?._id : p.category;
      
      const pTitle = String(p.name || p.title || '').toLowerCase();
      const pCategoryName = String(catName || '').toLowerCase();
      const pId = String(p._id || p.id || '');

      const matchesSearch = 
        pTitle.includes(search.toLowerCase()) || 
        pCategoryName.includes(search.toLowerCase()) ||
        pId.includes(search);
        
      const matchesCategory = 
        selectedCategory === 'ALL' || 
        catId === selectedCategory || 
        String(catName).toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // --- ALOHIDA KATEGORIYA QO'SHISH FUNKSIYASI ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast("Kategoriya nomini kiriting!", "error");
      return;
    }

    setIsCatSubmitting(true);
    try {
      if (addCategory) {
        await addCategory({ name: newCategoryName.trim() });
        showToast("Yangi kategoriya tizimga muvaffaqiyatli kiritildi!", "success");
        setNewCategoryName('');
      } else {
        showToast("Context ichida addCategory funksiyasi topilmadi.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Kategoriya qo'shishda xatolik yuz berdi.", "error");
    } finally {
      setIsCatSubmitting(false);
    }
  };

  // --- MAHSULOT QO'SHISH VA YANGILASH ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || form.category === 'Sektor tanlang' || !form.image) {
      showToast("Kritik maydonlar (nom, narx, sektor, rasm) to'ldirilishi shart!", "error");
      return;
    }

    setIsSubmitting(true);

    const specsArray = form.specs
      ? form.specs.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const productPayload = {
      title: form.title,
      name: form.title, 
      description: form.description || "Premium mahsulot.",
      price: Number(form.price),
      category: form.category, 
      image: form.image,
      img: form.image, 
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      isNew: Boolean(form.isNew),
      specs: specsArray
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productPayload);
        setEditingId(null);
        resetForm();
        showToast("Resurs muvaffaqiyatli yangilandi!", "success");
      } else {
        await addProduct({
          ...productPayload,
          rating: 5.0,
          reviewsCount: 0
        });
        resetForm();
        showToast("Yangi resurs konveyerga qo'shildi!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Mahsulot qo'shish operatsiyasida xatolik.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInit = (p) => {
    const currentId = p._id || p.id;
    const catValue = typeof p.category === 'object' ? p.category?._id : p.category;
    
    setEditingId(currentId);
    setForm({
      title: p.name || p.title || '',
      description: p.description || '',
      price: String(p.price || ''),
      category: catValue || 'Sektor tanlang',
      image: p.image || p.img || '',
      discount: String(p.discount || '0'),
      stock: String(p.stock || '10'),
      isNew: Boolean(p.isNew),
      specs: Array.isArray(p.specs) ? p.specs.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmWipe = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProduct(deleteConfirmId);
      if (editingId === deleteConfirmId) resetForm();
      setDeleteConfirmId(null);
      showToast("Resurs tizimdan o'chirildi.", "success");
    } catch (error) {
      showToast("O'chirishda xatolik yuz berdi.", "error");
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      category: 'Sektor tanlang',
      image: '',
      discount: '0',
      stock: '10',
      isNew: false,
      specs: ''
    });
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-sans text-white relative min-h-screen">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 -z-10" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-8 mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-emerald-400 border border-slate-800 shadow-xl shadow-emerald-500/5">
            <LayoutDashboard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider uppercase font-mono">
              Control <span className="text-emerald-400">Terminal</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 tracking-wide font-light">
              Tizim mutatsiyalari, ma'lumotlar ombori tahlili va resurslarni manipulyatsiya qilish segmenti.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            CLUSTER STATUS: CORE_READY
          </span>
        </div>
      </div>

      {/* ANALYTICAL CRYPTO-WIDGETS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-10">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><Package className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Indekslangan</p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">{analytics.total} <span className="text-xs text-slate-600 font-normal">ta</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl col-span-1">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><Coins className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Yalpi Qiymat</p>
            <p className="text-sm font-black text-white mt-1 font-mono tracking-tight">{formatPrice(analytics.grossValuation)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20"><Layers className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Kategoriyalar</p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">{analytics.categoriesCount} <span className="text-xs text-slate-600 font-normal">ta</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><Percent className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Chegirmalar</p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">{analytics.discountedCount} <span className="text-xs text-slate-600 font-normal">tovar</span></p>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 flex items-center gap-4 shadow-xl transition duration-300 col-span-2 lg:col-span-1 ${
          analytics.lowStockCount > 0 ? 'border-amber-500/30 bg-amber-950/10 text-amber-400 animate-pulse' : 'border-slate-900 bg-slate-950/60'
        }`}>
          <div className={`p-3 rounded-xl border ${analytics.lowStockCount > 0 ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-slate-900 text-slate-500 border-slate-800'}`}><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Kritik Zaxira</p>
            <p className="text-xl font-black mt-0.5 font-mono">{analytics.lowStockCount} <span className="text-xs text-slate-600 font-normal">ta qoldi</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* CHAP TOMON: FORMALAR MATRIXI */}
        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
          
          {/* ALOHIDA KATEGORIYA QO'SHISH FORMASI */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-violet-500/20">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FolderPlus className="h-4 w-4 text-violet-400" />
                YANGI KATEGORIYA QO'SHISH
              </h2>
            </div>
            <form onSubmit={handleCategorySubmit} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-violet-500/50 focus:outline-none transition font-medium"
                  placeholder="Masalan: iPhone, Aksessuarlar..."
                />
              </div>
              <button 
                type="submit"
                disabled={isCatSubmitting}
                className="bg-violet-500 text-slate-950 px-4 rounded-xl flex items-center justify-center transition active:scale-95 disabled:opacity-50"
              >
                {isCatSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 font-black" />}
              </button>
            </form>
          </div>

          {/* MAHSULOT KIRITISH FORMASI */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-emerald-500/20">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-5">
              <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                {editingId ? "SXEMANI O'ZGARTIRISH" : "YANGI RESURS KIRITISH"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">MAHSULOT TIZIMLI NOMI</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-medium"
                  placeholder='Masalan: MacBook Pro 16"' 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">BAZA NARXI (UZS)</label>
                  <input
                    type="number" required value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-mono"
                    placeholder="3499"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">SEKTOR (KATEGORIYA)</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-medium"
                  >
                    <option disabled value="Sektor tanlang">Sektor tanlang</option>
                    {dbCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">CHEGIRMA FOIZI (%)</label>
                  <input
                    type="number" value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-mono"
                    min="0" max="99"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">OMBOR KVANT ZAXIRASI</label>
                  <input
                    type="number" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-mono"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">IMAGE URL</label>
                <input
                  type="url" required value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                  placeholder="Rasm havolasini kiriting..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">TEXNIK XUSUSIYATLAR</label>
                <input
                  type="text" value={form.specs}
                  onChange={(e) => setForm({ ...form, specs: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                  placeholder="M3 Max, 48GB RAM, 1TB SSD"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">TAVSIF</label>
                <textarea
                  rows="2" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-light"
                  placeholder="Mahsulot haqida tavsif..."
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <input
                  type="checkbox" id="isNew" checked={form.isNew}
                  onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  className="h-4 w-4 rounded bg-slate-950 text-emerald-500 accent-emerald-400 cursor-pointer"
                />
                <label htmlFor="isNew" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider cursor-pointer font-mono select-none">
                  "YANGI" STATUSINI YOQISH
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-wider transition active:scale-[0.98] disabled:opacity-50 ${
                    editingId ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {editingId ? "SXEMANI YANGILASH" : "KONVEYERGA QO'SHISH"}
                </button>
                
                {editingId && (
                  <button 
                    type="button" onClick={resetForm} 
                    className="p-3 rounded-xl border border-slate-900 bg-slate-950 text-slate-500 hover:text-white transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* O'NG TOMON: OMBOR JADVALI */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-900 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <input
                type="text" placeholder="Tizimdan qidirish..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-900 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                  selectedCategory === 'ALL' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Barchasi
              </button>
              {dbCategories.map((cat) => (
                <button
                  key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition border ${
                    selectedCategory === cat.id ? 'bg-emerald-400 border-emerald-400 text-slate-950' : 'bg-slate-900 border-slate-900 text-slate-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  <th className="p-4">Resurs (Node)</th>
                  <th className="p-4">Sektor Class</th>
                  <th className="p-4">Kvant Zaxira</th>
                  <th className="p-4">Birlik Qiymati</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {filteredProducts.map((p) => {
                  const currentId = p._id || p.id;
                  const isLowStock = p.stock && Number(p.stock) < 5;
                  const displayDiscount = Number(p.discount) || 0;
                  const catName = typeof p.category === 'object' ? p.category?.name : p.category;

                  return (
                    <tr key={currentId} className="hover:bg-slate-900/40 transition-colors group">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          <img src={p.image || p.img} alt="" className="h-full w-full object-cover group-hover:scale-110 transition" />
                          {displayDiscount > 0 && (
                            <div className="absolute top-0 left-0 bg-rose-500 text-[8px] font-black text-white px-1 py-0.5 rounded-br">
                              -{displayDiscount}%
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase group-hover:text-emerald-400 transition">
                            {p.name || p.title}
                          </p>
                          <p className="text-[9px] text-slate-600 font-mono">ID: #{currentId}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 font-mono">
                          {catName}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold">
                        <span className={isLowStock ? 'text-rose-400' : 'text-slate-300'}>
                          {p.stock || 0} ta
                        </span>
                      </td>

                      <td className="p-4 font-mono font-black text-slate-200">
                        {formatPrice(p.price)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleEditInit(p)} className="p-2 text-slate-500 hover:text-amber-400 transition">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(currentId)} className="p-2 text-slate-600 hover:text-rose-400 transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                      <ShieldAlert className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                      Hech qanday resurs topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DELETE DIALOG MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-rose-500/30 p-6 text-center">
            <h3 className="text-base font-black text-white font-mono uppercase">O'chirishni tasdiqlang</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6 font-light">Bu amalni ortga qaytarib bo'lmaydi!</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
              <button onClick={handleConfirmWipe} className="flex-1 rounded-xl bg-rose-600 text-slate-950 font-black py-2.5 text-xs uppercase">O'chirish</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}