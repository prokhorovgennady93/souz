"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Megaphone } from "lucide-react";
import { getNewsReports, deleteNews } from "@/app/actions/news_reports";
import NewsGroup from "./NewsGroup";
import NewsControlGallery from "./NewsControlGallery";

export default function NewsControlClient({ 
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
  
  const [activeGallery, setActiveGallery] = useState<any | null>(null);

  const fetchReports = async (f: string, t: string, q: string) => {
    setLoading(true);
    const res = await getNewsReports(f, t, q || undefined);
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
    fetchReports(from, to, val);
  };

  const handleDeleteNews = async (newsIds: string[]) => {
    const res = await deleteNews(newsIds);
    if (res.success) {
      setReports(prev => prev.filter(r => !newsIds.includes(r.id)));
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
               <Megaphone className="w-10 h-10 text-brand-blue" />
               Аудит новостей
            </h1>
            <p className="text-zinc-500 mt-2 font-medium italic">Контроль ознакомления за период</p>
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

      {/* REPORTS LIST */}
      <div className="space-y-4 min-h-[400px] relative">
         {loading && (
           <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[3rem]">
              <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
           </div>
         )}

         {reports.length === 0 && !loading ? (
           <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-20 text-center">
              <Search className="w-16 h-16 text-zinc-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-zinc-400">Новостей не найдено</h3>
              <p className="text-zinc-500 mt-2">Попробуйте изменить период или поисковый запрос</p>
           </div>
         ) : (
           <div className="space-y-4">
              {reports.map((report) => (
                <NewsGroup 
                  key={report.id} 
                  report={report} 
                  onDelete={handleDeleteNews}
                  onCardClick={(r) => setActiveGallery(r)}
                />
              ))}
           </div>
         )}
      </div>

      {/* GALLERY OVERLAY */}
      {activeGallery && (
        <NewsControlGallery 
          report={activeGallery} 
          onClose={() => setActiveGallery(null)} 
        />
      )}
    </div>
  );
}
