"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, MapPin, ClipboardList, Trash2, CameraOff } from "lucide-react";
import { getTaskReports, deleteTaskReport } from "@/app/actions/task_reports";
import TaskGroup from "./TaskGroup";
import TaskControlGallery from "./TaskControlGallery";

export default function TaskControlClient({ 
  initialReports, 
  initialFrom,
  initialTo,
  initialQuery
}: { 
  initialReports: any[], 
  initialFrom: string,
  initialTo: string,
  initialQuery: string
}) {
  const [reports, setReports] = useState(initialReports);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  
  const [activeGallery, setActiveGallery] = useState<{ items: any[], index: number } | null>(null);

  const fetchReports = async (f: string, t: string, q: string) => {
    setLoading(true);
    const res = await getTaskReports(f, t, q || undefined);
    if (res.reports) setReports(res.reports);
    setLoading(false);
  };

  const handleFromChange = (val: string) => {
    setFrom(val);
    fetchReports(val, to, query);
  };

  const handleToChange = (val: string) => {
    setTo(val);
    fetchReports(from, val, query);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    // Для поиска можно добавить дебаунс, но для простоты пока сразу
    fetchReports(from, to, val);
  };

  const handleDeleteTask = async (taskIds: string[]) => {
    const res = await deleteTaskReport(taskIds);
    if (res.success) {
      setReports(prev => prev.filter(r => !taskIds.includes(r.id)));
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
         <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
               <ClipboardList className="w-10 h-10 text-brand-blue dark:text-brand-yellow" />
               Контроль задач
            </h1>
            <p className="text-zinc-500 mt-2 font-medium italic">Мониторинг выполнения за период</p>
         </div>

         <div className="flex flex-col xl:flex-row items-center gap-4 w-full lg:w-auto">
            {/* SEARCH */}
            <div className="relative w-full xl:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
               <input 
                 type="text" 
                 placeholder="Поиск по названию..."
                 value={query}
                 onChange={(e) => handleQueryChange(e.target.value)}
                 className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-brand-blue/30 transition-all"
               />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-44">
                   <span className="absolute -top-6 left-1 text-[10px] font-black uppercase text-zinc-400">С даты</span>
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                   <input 
                     type="date" 
                     value={from}
                     onChange={(e) => handleFromChange(e.target.value)}
                     className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-brand-blue/30 transition-all"
                   />
                </div>

                <div className="relative w-full sm:w-44">
                   <span className="absolute -top-6 left-1 text-[10px] font-black uppercase text-zinc-400">По дату</span>
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                   <input 
                     type="date" 
                     value={to}
                     onChange={(e) => handleToChange(e.target.value)}
                     className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 ring-brand-blue/30 transition-all"
                   />
                </div>
            </div>
         </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-8 min-h-[400px] relative">
         {loading && (
           <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[3rem]">
              <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
           </div>
         )}

         {reports.length === 0 && !loading ? (
           <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-20 text-center">
              <Search className="w-16 h-16 text-zinc-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-zinc-400">Задач не найдено</h3>
              <p className="text-zinc-500 mt-2">Попробуйте изменить период или поисковый запрос</p>
           </div>
         ) : (
           <div className="space-y-8">
              {reports.map((report) => (
                <TaskGroup 
                  key={`${report.id}-${report.date}`} 
                  report={report} 
                  onDelete={handleDeleteTask}
                  onCardClick={(items, index) => setActiveGallery({ items, index })}
                />
              ))}
           </div>
         )}
      </div>


      {/* GALLERY OVERLAY */}
      {activeGallery && (
        <TaskControlGallery 
          items={activeGallery.items} 
          initialIndex={activeGallery.index} 
          onClose={() => setActiveGallery(null)} 
        />
      )}
    </div>
  );
}
