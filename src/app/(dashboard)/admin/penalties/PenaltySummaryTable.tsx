"use client";

import { useState, useMemo } from "react";
import { User, Award, ListFilter, X, TrendingDown, Users } from "lucide-react";

interface Props {
  penalties: any[];
  monthName: string;
}

export default function PenaltySummaryTable({ penalties, monthName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Группировка данных
  const summary = useMemo(() => {
    const usersMap: Record<string, { fullName: string, total: number, count: number }> = {};
    
    penalties.forEach(p => {
      if (!usersMap[p.userId]) {
        usersMap[p.userId] = { fullName: p.user.fullName, total: 0, count: 0 };
      }
      usersMap[p.userId].total += p.amount;
      usersMap[p.userId].count += 1;
    });

    return Object.values(usersMap).sort((a, b) => b.total - a.total);
  }, [penalties]);

  const grandTotal = summary.reduce((sum, u) => sum + u.total, 0);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-brand-yellow rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-brand-blue/20 border border-brand-yellow/10"
      >
        <ListFilter className="w-4 h-4" />
        Сводная таблица
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
       <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          
          {/* MODAL HEADER */}
          <div className="p-8 pb-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
             <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
                   <Users className="w-6 h-6 text-brand-blue dark:text-brand-yellow" />
                   Сводная таблица
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">{monthName}</p>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
             </button>
          </div>

          {/* TOTAL BAR */}
          <div className="bg-red-50 dark:bg-red-900/10 px-8 py-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold text-red-600 uppercase tracking-tight">Общая сумма штрафов за период:</span>
             </div>
             <span className="text-2xl font-black text-red-600">-{grandTotal.toFixed(1)}</span>
          </div>

          {/* TABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 pt-6 no-scrollbar">
             {summary.length === 0 ? (
                <div className="py-10 text-center italic text-zinc-400">Нет данных для анализа</div>
             ) : (
                <div className="space-y-3">
                   {summary.map((u, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-black text-zinc-500 text-xs">
                               #{i + 1}
                            </div>
                            <div>
                               <h4 className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-brand-blue dark:group-hover:text-brand-yellow transition-colors">{u.fullName}</h4>
                               <p className="text-[10px] font-black uppercase text-zinc-400">{u.count} нарушения(ий)</p>
                            </div>
                         </div>
                         <div className="text-xl font-black text-red-600">-{u.total.toFixed(1)}</div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* FOOTER */}
          <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 flex justify-end">
             <button 
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
             >
                Закрыть
             </button>
          </div>

       </div>
    </div>
  );
}
