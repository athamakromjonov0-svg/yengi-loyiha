import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { notification } = useApp();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-slide-in rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10 shadow-slate-950/50">
      {notification.type === 'error' ? (
        <AlertTriangle className="h-5 w-5 text-rose-400" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      )}
      <span>{notification.message}</span>
    </div>
  );
}