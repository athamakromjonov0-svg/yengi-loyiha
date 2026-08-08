import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const { products, categories, loading } = useApp();

  const category = useMemo(() => {
    if (!Array.isArray(categories)) return null;
    return categories.find(c => 
      c.slug?.toLowerCase() === String(slug).toLowerCase() || 
      c.name?.toLowerCase() === String(slug).toLowerCase()
    );
  }, [categories, slug]);

  const categoryName = category?.name || (slug ? slug.replace(/-/g, ' ') : '');

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => {
      let pCat = p.category;
      if (!pCat) return false;
      if (typeof pCat === 'object') pCat = pCat.name || '';
      return String(pCat).toLowerCase() === categoryName.toLowerCase();
    });
  }, [products, categoryName]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 font-sans text-white relative min-h-screen">
      {/* Orqa fon */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-20 -z-10" />

      {/* Yuqori panel */}
      <div className="pt-10 mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest flex items-center gap-3">
          <Layers className="h-7 w-7 text-emerald-400" />
          Kategoriya: <span className="text-emerald-400">{categoryName}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-light">
          {loading ? "Katalog yuklanmoqda..." : `${filteredProducts.length} ta mahsulot mavjud`}
        </p>
      </div>

      {/* Mahsulotlar */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse border border-slate-900 bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-4 h-[520px]">
              <div className="aspect-square w-full rounded-xl bg-slate-900/60" />
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-slate-900 rounded w-1/3" />
                <div className="h-5 bg-slate-900 rounded w-3/4" />
                <div className="h-3 bg-slate-900 rounded w-full" />
              </div>
              <div className="h-10 bg-slate-900 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-slate-950/10 max-w-2xl mx-auto flex flex-col items-center p-8">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-slate-700 mb-4">
            <Package className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Bu kategoriyada mahsulot yo'q</h3>
          <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
            Bu kategoriya bo'yicha hozircha mahsulotlar mavjud emas. Tez orada qo'shiladi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}