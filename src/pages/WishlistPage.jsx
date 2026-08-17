import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 font-sans text-white relative min-h-screen">
      {/* Orqa fon */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-20 -z-10" />

      {/* Yuqori panel */}
      <div className="pt-10 mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-400" />
          Sevimlilar <span className="text-rose-400">Ro'yxati</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-light">
          {wishlist.length > 0 ? `${wishlist.length} ta mahsulot sevimlilarda saqlangan` : "Sevimlilar ro'yxati bo'sh"}
        </p>
      </div>

      {/* Sevimlilar */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-slate-950/10 max-w-2xl mx-auto flex flex-col items-center p-8">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-slate-700 mb-4">
            <Heart className="h-8 w-8 text-rose-500/50" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Sevimlilar bo'sh</h3>
          <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
            Sevimli mahsulotlaringizga yulduzcha belgisi bilan qo'shishingiz mumkin. Ularni bu erda topasiz.
          </p>
          <Link
            to="/katalog"
            className="mt-6 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-[10px] uppercase font-mono tracking-widest rounded-xl border border-slate-800 transition active:scale-95"
          >
            Katalogga o'tish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}