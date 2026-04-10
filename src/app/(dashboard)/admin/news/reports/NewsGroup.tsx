"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Megaphone, CheckCircle2, AlertCircle } from "lucide-react";

export default function NewsGroup({
  report,
  onDelete,
  onCardClick
}: {
  report: any;
  onDelete: (ids: string[]) => void;
  onCardClick: (report: any) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Вы уверены, что хотите УДАЛИТЬ новость "${report.title}"? Это обнулит статистику и скроет новость для всех.`)) return;
    setIsDeleting(true);
    await onDelete([report.id]);
    setIsDeleting(false);
  };

  return (
    <div 
      className={`bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all ${isDeleting ? 'opacity-30 pointer-events-none' : ''}`}
      onClick={() => onCardClick(report)}
    >
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-brand-blue shadow-sm shrink-0">
             <Megaphone className="w-6 h-6" />
           </div>
            <div>
               <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">{report.title}</h3>
                  <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-[10px] font-black text-zinc-500 rounded-lg whitespace-nowrap">
                    {report.date}
                  </span>
                  {report.department && (
                     <span className="px-2 py-0.5 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-black uppercase rounded-lg">
                       {report.department}
                     </span>
                  )}
               </div>
               <p className="text-xs text-zinc-500 font-medium font-sans mt-1 opacity-70 line-clamp-1">{report.contentPreview || "Без описания"}</p>
            </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
           <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl text-xs font-black uppercase" title="Ознакомлены">
                 <CheckCircle2 className="w-4 h-4" />
                 {report.readCount}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase" title="Осталось">
                 <AlertCircle className="w-4 h-4" />
                 {report.unreadCount}
              </div>
           </div>

           <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleDelete}
                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-500 rounded-2xl transition-all active:scale-90"
                title="Удалить новость"
              >
                <Trash2 className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
