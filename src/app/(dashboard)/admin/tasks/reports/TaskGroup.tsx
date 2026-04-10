"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import TaskUserCard from "./TaskUserCard";

export default function TaskGroup({ 
  report, 
  onDelete, 
  onCardClick 
}: { 
  report: any, 
  onDelete: (ids: string[]) => void, 
  onCardClick: (statuses: any[], index: number) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Вы уверены, что хотите УДАЛИТЬ задачу "${report.title}" и все отчеты по ней из базы данных? Это действие необратимо.`)) return;
    
    setIsDeleting(true);
    await onDelete(report.taskIds);
    setIsDeleting(false);
  };

  const handleCopyCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    const completed = report.userStatuses.filter((u: any) => u.status === "COMPLETED").map((u: any) => u.user.fullName).join("\n");
    if (completed.length) {
      navigator.clipboard.writeText(completed);
      alert("Скопировано");
    } else {
      alert("Никто еще не выполнил задачу.");
    }
  };

  const handleCopyNotCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    const notCompleted = report.userStatuses.filter((u: any) => u.status === "NOT_COMPLETED" || u.status === "PENDING").map((u: any) => u.user.fullName).join("\n");
    if (notCompleted.length) {
      navigator.clipboard.writeText(notCompleted);
      alert("Скопировано");
    } else {
      alert("Нет сотрудников, не выполнивших задачу.");
    }
  };

  return (
    <div className={`bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all ${isDeleting ? 'opacity-30 pointer-events-none' : ''}`}>
      {/* Accordion Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-brand-blue dark:text-brand-yellow shadow-sm">
             <ClipboardList className="w-6 h-6" />
           </div>
            <div>
               <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">{report.title}</h3>
                  <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-[10px] font-black text-zinc-500 rounded-lg">
                    {report.date}
                  </span>
               </div>
               <p className="text-xs text-zinc-500 font-medium font-sans uppercase tracking-widest mt-1 opacity-70 italic line-clamp-1">{report.description || "Без описания"}</p>
            </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
           <div className="flex items-center gap-2">
              <div 
                onClick={handleCopyCompleted}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform" 
                title="Нажмите, чтобы скопировать список выполнивших"
              >
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 {report.completedCount}
              </div>
              <div 
                onClick={handleCopyNotCompleted}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform" 
                title="Нажмите, чтобы скопировать список НЕ выполнивших"
              >
                 <AlertCircle className="w-3.5 h-3.5" />
                 {report.notCompletedCount}
              </div>
           </div>

           <div className="flex items-center gap-2">
              <button 
                onClick={handleDelete}
                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-500 rounded-2xl transition-all active:scale-90"
                title="Удалить задачу и отчеты"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-2xl text-zinc-400">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
           </div>
        </div>
      </div>

      {/* Accordion Content (Grid of users) */}
      {isOpen && (
        <div className="p-6 sm:p-8 pt-0 border-t border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-300">
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {report.userStatuses.map((us: any, idx: number) => (
                <TaskUserCard 
                  key={us.user.id} 
                  userStatus={us} 
                  onClick={() => onCardClick(report.userStatuses, idx)} 
                />
              ))}
              {report.userStatuses.length === 0 && (
                <p className="col-span-full py-10 text-center text-zinc-400 italic font-medium">Никто не назначен на эту задачу</p>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
