"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [swStatus, setSwStatus] = useState("Инициализация...");
  const [cacheCount, setCacheCount] = useState(0);

  useEffect(() => {
    const updateStats = async () => {
      // SW Status check
      if ("serviceWorker" in navigator) {
        if (navigator.serviceWorker.controller) {
          setSwStatus("Активен");
        } else {
          // Check if it's there but not yet controlling
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            if (reg.installing) setSwStatus("Установка...");
            else if (reg.waiting) setSwStatus("Обновление...");
            else if (reg.active) setSwStatus("Готов (перезагрузите)");
            else setSwStatus("Зарегистрирован");
          } else {
            setSwStatus("Не зарегистрирован");
          }
        }
      } else {
        setSwStatus("Не поддерживается");
      }

      // Cache Count
      if ("caches" in window) {
        try {
          const cache = await caches.open("dopog-cache-v1");
          const keys = await cache.keys();
          setCacheCount(keys.length);
        } catch (e) {
          console.warn("Cache access error:", e);
        }
      }
    };

    const interval = setInterval(updateStats, 2000);
    const handleOnline = () => { setIsOffline(false); setShowStatus(true); setTimeout(() => setShowStatus(false), 3000); };
    const handleOffline = () => { setIsOffline(true); setShowStatus(true); };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    updateStats();
    if (!navigator.onLine) { setIsOffline(true); setShowStatus(true); }

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showStatus || isOffline ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
      <div className={`px-6 py-3 rounded-2xl flex flex-col gap-1 shadow-2xl border ${
        isOffline 
        ? 'bg-red-600 border-red-500 text-white' 
        : 'bg-zinc-900 border-zinc-800 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest leading-none">{isOffline ? 'Работаем офлайн' : 'Система ДОПОГ'}</h4>
            <p className="text-[10px] font-bold opacity-80 mt-0.5 whitespace-nowrap">
              {swStatus} • {cacheCount} файлов в памяти
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
