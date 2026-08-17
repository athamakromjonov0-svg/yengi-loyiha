import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Home, AlertOctagon, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';

/**
 * Premium Kiber-Futuristik Tizim Xatolik Shlyuzi (NotFoundPage - 404)
 * Mavjud bo'lmagan marshrutlarni ushlab qoluvchi va operatorni asosiy tarmoqqa qaytaruvchi qalqon.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Terminal mantiqiy loglarini ketma-ketlikda simulyatsiya qilish matrixi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const logs = [
      "CRITICAL: HTTP_STATUS_CODE_404 -> ROUTE_NOT_FOUND",
      "CORE::GRAND_DECOR_GATEWAY: Skanerlash boshlandi...",
      "SYSTEM_MESH: Kiber-xarita indekslari tekshirilmoqda...",
      "WARNING: So'ralgan resurs klaster xaritasida mavjud emas.",
      "FAIL: Ingestion pipeline terminates prematurely.",
      "SUGGESTION: Rollback protokoli yoki bosh sahifa tuguniga o'ting."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
      }, (index + 1) * 250);
    });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center font-sans select-none text-white relative bg-slate-950 overflow-hidden">
      
      {/* ORQA FON MATRITSA VA KIBER-SETKA EFFEKTLARI */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xl space-y-8 relative z-10">
        
        {/* REZONANS BERUVChI KIBER BELGILAR PIPELINE */}
        <div className="relative flex justify-center">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500 to-amber-500 opacity-20 blur-xl animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-rose-500/30 text-rose-400 shadow-2xl shadow-rose-500/10">
            <AlertOctagon className="h-8 w-8 animate-spin-slow text-rose-500" />
            <Terminal className="h-4 w-4 absolute top-2 right-2 text-rose-400/60" />
          </div>
        </div>

        {/* XATOLIK MATNI SEGMENTI */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-widest font-mono text-white uppercase sm:text-5xl">
            ERR_404: <span className="text-rose-500">NOT_DISCOVERED</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-light">
            Siz so'ragan tizim interfeysi matritsasi indekslangan faol marshrut nuqtalariga mos kelmadi. Resurs topilmadi yoki kiber-konveyerdan o'chirilgan.
          </p>
        </div>

        {/* DIALOGIK INTERAKTIV KIBER-TERMINAL CONSOLE */}
        <div className="w-full bg-black/80 backdrop-blur-xl border border-slate-900 rounded-2xl p-4 text-left font-mono text-[10px] md:text-xs text-rose-400/80 shadow-2xl space-y-1.5 h-44 overflow-y-auto no-scrollbar border-t-rose-500/10 shadow-rose-950/20 relative">
          <div className="absolute top-2 right-3 flex items-center gap-1.5 text-slate-600">
            <Cpu className="h-3 w-3 text-rose-500 animate-pulse" />
            <span>DIAGNOSTIC_LOG_v1.0</span>
          </div>
          
          <div className="text-slate-600 border-b border-slate-900 pb-1.5 mb-2 select-none uppercase tracking-wider font-bold">
            &gt;_ Matrix Shell Diagnostics:
          </div>
          
          {terminalLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 animate-fade-in">
              <span className="text-slate-700 shrink-0">[{index + 1}]</span>
              <span className={log.includes("CRITICAL") || log.includes("FAIL") ? "text-rose-500 font-bold" : log.includes("WARNING") ? "text-amber-400" : "text-slate-400"}>
                {log}
              </span>
            </div>
          ))}
          
          {terminalLogs.length < 6 && (
            <div className="flex items-center gap-1 text-slate-600 font-bold animate-pulse">
              <span className="inline-block w-2 h-3 bg-rose-500" /> Skanerlanmoqda...
            </div>
          )}
        </div>

        {/* AMALLAR VA NAVIGATSIYA NAVBATCHILIGI (ACTION PIPELINE) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          
          {/* Ortga qaytish shlyuzi (Rollback Protocol) */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-950 border border-slate-900 px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-widest transition hover:text-white hover:border-slate-800 active:scale-95 shadow-md"
          >
            <RotateCcw className="h-4 w-4" /> Rollback protokoli
          </button>

          {/* Bosh sahifaga qaytish */}
          <Link 
            to="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-6 py-3 text-xs font-black text-slate-200 uppercase tracking-widest transition hover:bg-rose-500 hover:text-slate-950 hover:border-rose-500 active:scale-95 shadow-lg shadow-rose-500/5"
          >
            <Home className="h-4 w-4" /> Bosh boshqaruv hubi
          </Link>

        </div>

      </div>
    </div>
  );
}