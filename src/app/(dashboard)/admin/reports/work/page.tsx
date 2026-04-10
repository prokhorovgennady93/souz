"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Calendar, Clock, Coffee, AlertCircle, 
  ChevronLeft, ChevronRight, Download, Users, TrendingUp 
} from "lucide-react";
import { getManagerWorkReport } from "@/app/actions/report";

export default function ManagerWorkReportPage() {
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });

  useEffect(() => {
    setMounted(true);
    // Refresh date range on mount to ensure client and server match or are updated
    setDateRange({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    });
  }, []);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getManagerWorkReport(dateRange.start, dateRange.end);
      if (res.success) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handlePrevMonth = () => {
    const newStart = startOfMonth(subMonths(dateRange.start, 1));
    const newEnd = endOfMonth(newStart);
    setDateRange({ start: newStart, end: newEnd });
  };

  const handleNextMonth = () => {
    const newStart = startOfMonth(subMonths(dateRange.start, -1));
    const newEnd = endOfMonth(newStart);
    setDateRange({ start: newStart, end: newEnd });
  };

  const handleSetToday = () => {
    setDateRange({ start: startOfDay(new Date()), end: endOfDay(new Date()) });
  };

  const handleSetWeek = () => {
    const now = new Date();
    // Начало текущей недели (понедельник)
    const day = now.getDay() || 7;
    const start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1));
    setDateRange({ start, end: endOfDay(now) });
  };

  const handleSetMonth = () => {
    setDateRange({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
  };

  const PeriodButton = ({ label, onClick, active }: any) => (
    <button 
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-brand-blue text-brand-yellow shadow-lg shadow-brand-blue/20' : 'bg-white dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
    >
      {label}
    </button>
  );

  // Определение активного периода для подсветки кнопок - только после монтирования
  const isToday = mounted && format(dateRange.start, 'yyyyMMdd') === format(new Date(), 'yyyyMMdd') && 
                  format(dateRange.end, 'yyyyMMdd') === format(new Date(), 'yyyyMMdd');
  
  const isMonth = mounted && format(dateRange.start, 'yyyyMMdd') === format(startOfMonth(new Date()), 'yyyyMMdd') && 
                  format(dateRange.end, 'yyyyMMdd') === format(endOfMonth(new Date()), 'yyyyMMdd');

  // Для недели проверим только начало (упрощенно)
  const getIsWeek = () => {
    if (!mounted) return false;
    const now = new Date();
    const day = now.getDay() || 7;
    const weekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1));
    return format(dateRange.start, 'yyyyMMdd') === format(weekStart, 'yyyyMMdd') && !isToday;
  };
  
  const isWeek = getIsWeek();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-brand-yellow/10 rounded-xl text-brand-yellow">
                  <Users className="w-6 h-6" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Аналитика дисциплины</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">Отчёт по работе</h1>
            <p className="text-zinc-500 mt-2 font-bold text-sm uppercase tracking-widest italic opacity-70">Сводные данные за период</p>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
               <PeriodButton label="Сегодня" onClick={handleSetToday} active={isToday} />
               <PeriodButton label="Неделя" onClick={handleSetWeek} active={isWeek} />
               <PeriodButton label="Месяц" onClick={handleSetMonth} active={isMonth} />
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <button onClick={handlePrevMonth} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <ChevronLeft className="w-5 h-5 text-zinc-400" />
               </button>
               <div className="px-6 py-2 text-sm font-black uppercase text-zinc-900 dark:text-zinc-100 min-w-40 text-center">
                  {mounted ? format(dateRange.start, "MMMM yyyy", { locale: ru }) : "..."}
               </div>
               <button onClick={handleNextMonth} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
               </button>
            </div>
         </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
            icon={Clock} 
            label="Всего опозданий" 
            value={`${data.reduce((sum, m) => sum + m.totalLateness, 0)} мин`} 
            color="red" 
         />
         <StatCard 
            icon={Coffee} 
            label="Время перерывов" 
            value={`${data.reduce((sum, m) => sum + m.totalBreakTime, 0)} мин`} 
            color="blue" 
         />
         <StatCard 
            icon={TrendingUp} 
            label="Ср. опоздание" 
            value={`${(data.reduce((sum, m) => sum + m.totalLateness, 0) / (data.reduce((sum, m) => sum + m.shiftCount, 0) || 1)).toFixed(1)} мин`}
            color="yellow" 
         />
      </div>

      {/* MAIN DATA TABLE */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
               <div className="h-1 w-6 bg-brand-yellow rounded-full"></div>
               Дисциплинарные показатели
            </h3>
            <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
               <Download className="w-4 h-4" />
               Экспорт
            </button>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">ФИО Сотрудника</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 text-center">Опоздания (сум.)</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 text-center">Ср. опоздание</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 text-center">Время перерывов</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 text-right">Кол-во перерывов</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {loading ? (
                     <tr>
                        <td colSpan={5} className="p-20 text-center text-zinc-400 animate-pulse font-bold uppercase tracking-widest">Выполняем расчеты...</td>
                     </tr>
                  ) : data.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="p-20 text-center italic text-zinc-400">Нет данных для анализа за этот период</td>
                     </tr>
                  ) : (
                     data.map((m, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                           <td className="p-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-zinc-400 text-sm shadow-inner group-hover:bg-brand-blue group-hover:text-brand-yellow transition-all">
                                    {m.fullName.charAt(0)}
                                 </div>
                                 <div>
                                    <span className="font-black text-base text-zinc-900 dark:text-zinc-50 group-hover:text-brand-blue transition-colors leading-tight">{m.fullName}</span>
                                    {m.totalLateness > 30 && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight mt-0.5">Критическое опоздание</p>}
                                 </div>
                              </div>
                           </td>
                           <td className="p-6 text-center">
                              <span className={`px-4 py-2 rounded-2xl text-sm font-black italic ${m.totalLateness > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                 {m.totalLateness > 0 ? `-${m.totalLateness} мин` : '0 мин'}
                              </span>
                           </td>
                           <td className="p-6 text-center font-bold text-zinc-500">
                              {m.shiftCount > 0 ? (m.totalLateness / m.shiftCount).toFixed(1) : 0} мин
                           </td>
                           <td className="p-6 text-center font-black text-zinc-900 dark:text-zinc-50">{m.totalBreakTime} мин</td>
                           <td className="p-6 text-right font-black text-zinc-400 pr-10">{m.totalBreakCount}</td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-brand-yellow/10 text-brand-yellow",
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
       <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform ${colors[color]}`}>
          <Icon className="w-7 h-7" />
       </div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
          <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{value}</h4>
       </div>
    </div>
  );
}
