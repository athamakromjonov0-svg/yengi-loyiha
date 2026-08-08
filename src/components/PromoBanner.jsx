import React, { useEffect, useState } from 'react';
import heroImg from '../assets/hero.png';

// Load all images from src/assets (png,jpg,jpeg,webp) using Vite's glob with eager option
const assetModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
const assetList = Object.values(assetModules || {});

export default function PromoBanner() {
  const items = assetList.length
    ? assetList.map((img, i) => ({ id: i + 1, img, title: `Aksiya ${i + 1}`, badge: `-${10 + (i * 5)}%` }))
    : [{ id: 1, img: '/src/assets/hero.png', title: 'MYMUSE -20%', badge: '-20%' }];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % items.length), 3500);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900/40 to-slate-950/40 border border-slate-800 p-4 flex items-center gap-4">
        {items.map((it, i) => (
          <div
            key={it.id}
            className={`flex-shrink-0 w-64 h-36 rounded-lg overflow-hidden relative transition-transform duration-700 ${i === index ? 'scale-100 shadow-2xl' : 'scale-95 opacity-60'}`}
            style={{ transform: `translateX(${(i - index) * 110}%)` }}
          >
            <img src={it.img} alt={it.title} className="w-full h-full object-cover" />
            <div className="absolute left-3 top-3 bg-amber-400 text-slate-900 font-bold px-2 py-1 rounded">{it.badge}</div>
            <div className="absolute left-3 bottom-3 text-white font-black text-sm drop-shadow">{it.title}</div>
          </div>
        ))}

        <div className="ml-auto text-sm text-slate-400">Aksiya: Chegirmalar aylanishi — eng yaxshi takliflarni ko'ring</div>
      </div>
    </div>
  );
}
