"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

export default function NewsControlGallery({ 
  report, 
  onClose 
}: { 
  report: any; 
  onClose: () => void 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 translate-y-0 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">{report.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {report.date}</span>
               {report.department && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">{report.department}</span>}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto no-scrollbar space-y-8">
           
           {/* Section: Прочитали */}
           <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-green-500 mb-4 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" />
                 Ознакомлены ({report.readCount})
              </h3>
              
              {report.readBy.length === 0 ? (
                <p className="text-zinc-400 italic text-sm">Никто еще не ознакомился с этой новостью.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {report.readBy.map((user: any) => (
                     <div key={user.id} className="flex flex-col p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{user.fullName}</span>
                        <span className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">{user.readAt}</span>
                     </div>
                   ))}
                </div>
              )}
           </div>

           <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

           {/* Section: Не прочитали */}
           <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                 <AlertCircle className="w-5 h-5" />
                 Не ознакомлены ({report.unreadCount})
              </h3>
              
              {report.unreadBy.length === 0 ? (
                <p className="text-zinc-400 italic text-sm">Все сотрудники уже ознакомлены.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {report.unreadBy.map((user: any) => (
                     <div key={user.id} className="flex flex-col p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{user.fullName}</span>
                        <span className="text-xs text-red-500 mt-1 uppercase tracking-widest font-black opacity-70">Ожидание</span>
                     </div>
                   ))}
                </div>
              )}
           </div>
           
        </div>
      </div>
    </div>
  );
}
