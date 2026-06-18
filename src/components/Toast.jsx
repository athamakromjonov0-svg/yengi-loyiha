import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { notification, clearNotification } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const DURATION = 3500; 

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setProgress(100);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) return 0;
          return prev - (100 / (DURATION / 10));
        });
      }, 10);

      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, DURATION);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (clearNotification) clearNotification();
    }, 200);
  };

  if (!notification || (!isVisible && progress === 100)) return null;

  const toastStyles = {
    success: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
      borderColor: 'border-emerald-500/20 shadow-emerald-950/20',
      progressBg: 'bg-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.08)]',
      title: "SYSTEM_SUCCESS"
    },
    error: {
      icon: <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />,
      borderColor: 'border-rose-500/20 shadow-rose-950/20',
      progressBg: 'bg-rose-500',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.08)]',
      title: "CRITICAL_ERROR"
    },
    warning: {
      icon: <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />,
      borderColor: 'border-amber-500/20 shadow-amber-950/20',
      progressBg: 'bg-amber-500',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.08)]',
      title: "GATEWAY_WARNING"
    },
    info: {
      icon: <Info className="h-4 w-4 text-blue-400 shrink-0" />,
      borderColor: 'border-blue-500/20 shadow-blue-950/20',
      progressBg: 'bg-blue-400',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.08)]',
      title: "CYBER_INFO"
    }
  };

  const currentStyle = toastStyles[notification.type] || toastStyles.info;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[100] flex flex-col overflow-hidden rounded-xl border bg-slate-950/95 backdrop-blur-xl text-sm font-medium text-white shadow-2xl max-w-sm w-full md:w-80 select-none transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-2 scale-95'
      } ${currentStyle.borderColor} ${currentStyle.glow}`}
    >
      <div className="flex items-start gap-3 p-4 relative z-10">
        <div className="mt-0.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
          {currentStyle.icon}
        </div>
        
        <div className="flex-1 pr-4">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5 font-mono">
            {currentStyle.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            {notification.message}
          </p>
        </div>

        <button 
          onClick={handleClose} 
          className="absolute top-3 right-3 p-1 rounded-md text-slate-600 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress Bar Line */}
      <div className="h-[2px] w-full bg-slate-900 mt-auto">
        <div 
          className={`h-full transition-all duration-10 ease-linear ${currentStyle.progressBg}`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}