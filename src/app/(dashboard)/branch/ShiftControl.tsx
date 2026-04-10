"use client";

import { useState, useEffect } from "react";
import { startShift, endShift, startBreak, endBreak } from "@/app/actions/shift";

export default function ShiftControl({ 
  initialShift, 
  userName, 
  hasBranch, 
  isOffDay, 
  allBranches,
  todayTasksSummary = { count: 0, totalPoints: 0 }
}: { 
  initialShift: any, 
  userName: string, 
  hasBranch: boolean, 
  isOffDay: boolean, 
  allBranches: any[],
  todayTasksSummary?: { count: number, totalPoints: number }
}) {
  const [mounted, setMounted] = useState(false);
  const [shift, setShift] = useState(initialShift);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("Обед");
  const [now, setNow] = useState(new Date(2024, 0, 1));
  
  // Подмена
  const [showSubUI, setShowSubUI] = useState(false); // Всегда начинаем с обычного вида, если нет смены
  const [selectedSubBranch, setSelectedSubBranch] = useState(allBranches[0]?.id || "");

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (actionFn: () => Promise<any>) => {
    setLoading(true);
    try {
      const res = await actionFn();
      if (res.error) {
        alert(res.error);
      } else {
        // Fast optimistic reload logic can be just window.location.reload()
        window.location.reload(); 
      }
    } finally {
      setLoading(false);
    }
  };

  const getDuration = (start: Date, end: Date = now) => {
    const diff = Math.floor((end.getTime() - new Date(start).getTime()) / 1000);
    if (diff < 0) return "00:00:00";
    const h = Math.floor(diff / 3600).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!mounted) return null;

  if (!shift) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center" suppressHydrationWarning>
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-3xl">👋</div>
        <h2 className="text-xl font-bold text-brand-blue dark:text-brand-yellow mb-2">Смена не начата!</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm">Добро пожаловать, {userName}. Для начала работы и получения задач необходимо открыть смену.</p>
        
        {isOffDay ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
            <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">Сегодня ваш выходной!</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">В системе отмечено, что вы сегодня отдыхаете. Открытие смены невозможно.</p>
          </div>
        ) : !hasBranch ? (
          <div className="p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl text-center flex flex-col items-center">
            <p className="text-orange-700 dark:text-orange-400 font-bold text-base mb-3 leading-snug">
              За вами не закреплен график и филиал. 
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
              Для назначения свяжитесь со старшим менеджером:<br/>
              <span className="font-bold text-zinc-900 dark:text-white">Вишнякова Анастасия Алексеевна</span><br/>
              <a href="tel:+79604690784" className="text-brand-blue font-bold flex items-center justify-center gap-2 mt-2 hover:underline">
                 📞 +7 960 469-07-84
              </a>
            </p>
          </div>
        ) : showSubUI ? (
          <div className="w-full max-w-xs flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Выберите филиал для подмены:</label>
            <select 
              value={selectedSubBranch} 
              onChange={e => setSelectedSubBranch(e.target.value)}
              className="w-full p-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
            >
              <option value="">-- Выберите --</option>
              {allBranches.map((b: any) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <button 
              onClick={() => handleAction(() => startShift(selectedSubBranch))}
              disabled={loading || !selectedSubBranch}
              className="w-full px-4 py-3 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blue font-bold rounded-lg transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Открытие..." : "Начать смену по подмене"}
            </button>
            <button onClick={() => setShowSubUI(false)} className="text-xs text-zinc-500 hover:text-zinc-700 mt-2">
              Отмена
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleAction(() => startShift())}
              disabled={loading}
              className="px-8 py-4 bg-brand-blue hover:bg-brand-blue-hover text-brand-yellow font-bold text-xl rounded-2xl shadow-lg shadow-brand-blue/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Открытие..." : "▶ Начать рабочую смену"}
            </button>
            <button 
              onClick={() => setShowSubUI(true)}
              className="px-8 py-2 text-zinc-400 hover:text-brand-blue transition-colors text-xs font-medium uppercase tracking-widest mt-2"
            >
              Выйти на подмену в другой офис
            </button>
          </div>
        )}
      </div>
    );
  }

  // Active shift logic
  const activeBreak = shift.breaks?.find((b: any) => !b.endedAt);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
      
      {/* Current status info */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center">
        <h2 className="text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-2">Длительность смены</h2>
        <div className="text-5xl font-mono font-bold text-brand-blue dark:text-brand-yellow mb-4">
          {mounted ? getDuration(shift.openedAt) : "--:--:--"}
        </div>
        <div className="text-sm text-zinc-400" suppressHydrationWarning>
          Смена открыта в: {mounted ? new Date(shift.openedAt).toLocaleTimeString('ru-RU') : "--:--"}
        </div>
        
        {activeBreak && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl w-full text-center">
            <h3 className="text-orange-600 dark:text-orange-400 font-bold mb-1">Вы на перерыве ({activeBreak.reason})</h3>
            <div className="text-3xl font-mono text-orange-500">
              {mounted ? getDuration(activeBreak.startedAt) : "--:--:--"}
            </div>
          </div>
        )}
      </div>

      {/* Control panel */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4">
        <h3 className="font-bold text-xl text-brand-blue dark:text-brand-yellow mb-2">Действия</h3>
        
        {activeBreak ? (
          <button 
            onClick={() => handleAction(() => endBreak(activeBreak.id))}
            disabled={loading}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all"
          >
            Возобновить работу
          </button>
        ) : (
          <div className="space-y-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-2">
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                Уйти на перерыв
              </label>
              <select 
                value={reason} 
                onChange={e => setReason(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl mb-3 dark:text-white"
              >
                <option value="Обед">Обед (Длительный перерыв)</option>
                <option value="Перекур">Короткий перерыв (Перекур)</option>
                <option value="Личные дела">Личные дела</option>
              </select>
            </div>
            <button 
              onClick={() => handleAction(() => startBreak(shift.id, reason))}
              disabled={loading}
              className="w-full py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl transition-all"
            >
              ⏸ Начать перерыв
            </button>
          </div>
        )}

        <div className="pt-2">
          <button 
            onClick={() => {
              let msg = "Вы уверены, что хотите завершить текущую смену?";
              if (todayTasksSummary.count > 0) {
                msg = `У вас ${todayTasksSummary.count} незавершенных задач. Если вы закроете смену сейчас, Вам будет начислено ${todayTasksSummary.totalPoints} штрафных баллов. Вы уверены?`;
              }
              if (confirm(msg)) {
                handleAction(() => endShift(shift.id));
              }
            }}
            disabled={loading || activeBreak != null}
            className="w-full py-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-all disabled:opacity-40"
          >
            ⏹ Завершить смену
          </button>
          {activeBreak && (
             <p className="text-xs text-red-400 text-center mt-2">Сначала завершите перерыв</p>
          )}
        </div>
      </div>

    </div>
  );
}
