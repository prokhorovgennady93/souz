"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

export function PushManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        // Here you would normally register with a push service and send the subscription to your backend
        console.log("Notification permission granted!");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setLoading(false);
    }
  };

  if (permission === "granted") return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-600">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Будьте в курсе</h3>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold leading-relaxed">
            Включите уведомления, чтобы получать напоминания о важных обновлениях ADR и пропусках в обучении.
          </p>
        </div>
        <button
          onClick={requestPermission}
          disabled={loading || permission === "denied"}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all active:scale-95 whitespace-nowrap ${
            permission === "denied"
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            : "bg-orange-600 text-white shadow-lg shadow-orange-950/20 hover:bg-orange-500"
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (permission === "denied" ? <BellOff className="w-4 h-4" /> : "Включить")}
        </button>
      </div>
      {permission === "denied" && (
        <p className="text-[10px] text-red-500 font-bold mt-3">Уведомления заблокированы в настройках браузера.</p>
      )}
    </div>
  );
}
