import { db } from "@/lib/db";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { AlertCircle, User, Clock, ChevronLeft, ChevronRight, History } from "lucide-react";
import { getPenaltyLog } from "@/app/actions/penalty";
import PenaltyForm from "./PenaltyForm";
import PenaltyActions from "./PenaltyActions";
import PenaltySummaryTable from "./PenaltySummaryTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PenaltyLogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ month?: string }> 
}) {
  const params = await searchParams;
  const monthOffset = parseInt(params.month || "0");
  const penalties = await getPenaltyLog(monthOffset);
  const users = await db.user.findMany({ 
    where: { role: { not: 'CANDIDATE' } },
    select: { id: true, fullName: true }, 
    orderBy: { fullName: 'asc' } 
  });

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthOffset);
  const monthName = format(targetDate, "LLLL yyyy", { locale: ru });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-brand-yellow/10 rounded-xl text-brand-yellow">
                  <History className="w-6 h-6" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Архив взысканий</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">Журнал штрафов</h1>
            <p className="text-zinc-500 mt-2 font-bold text-sm uppercase tracking-widest">{monthName}</p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <PenaltySummaryTable penalties={penalties} monthName={monthName} />
            
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm self-start">
               <Link 
                 href={`?month=${monthOffset - 1}`} 
                 className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-brand-blue"
               >
                  <ChevronLeft className="w-5 h-5" />
               </Link>
               <div className="px-6 py-2 text-sm font-black uppercase text-zinc-900 dark:text-zinc-100 min-w-40 text-center">
                  {monthName}
               </div>
               <Link 
                 href={`?month=${monthOffset + 1}`} 
                 className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-brand-blue"
               >
                  <ChevronRight className="w-5 h-5" />
               </Link>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         
         {/* --- LOG LIST --- */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
                  <div className="h-1 w-6 bg-brand-yellow rounded-full"></div>
                  Список нарушений
               </h3>
               <span className="text-[10px] font-black text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                  Всего записей: {penalties.length}
               </span>
            </div>

            <div className="space-y-4">
               {penalties.length === 0 && (
                 <div className="py-24 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <AlertCircle className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mx-auto mb-6" />
                    <p className="text-zinc-400 font-bold italic uppercase tracking-widest text-sm">Нарушений не зафиксировано</p>
                 </div>
               )}
               
               {penalties.map(p => (
                 <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl hover:shadow-brand-blue/5 transition-all group overflow-hidden relative">
                    {/* TYPE INDICATOR BAR */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${p.type === 'MANUAL' ? 'bg-orange-400' : 'bg-red-500'}`}></div>
                    
                    <div className="flex items-start sm:items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${p.type === 'MANUAL' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                          {p.type === 'MANUAL' ? <AlertCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-black text-lg text-zinc-900 dark:text-zinc-50 leading-tight">{p.user.fullName}</h4>
                             {p.type === 'TASK_OVERDUE' && (
                                <span className="text-[10px] font-black text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 px-2 py-0.5 rounded-md uppercase">Авто</span>
                             )}
                          </div>
                          <p className="text-sm text-zinc-500 font-bold italic leading-relaxed">{p.reason}</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-10">
                       <PenaltyActions penalty={p} />
                       
                       <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-red-600 italic">-{p.amount}</div>
                          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                             {format(new Date(p.createdAt), "d MMMM, HH:mm", { locale: ru })}
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* --- ADD FORM --- */}
         <div className="space-y-8 lg:sticky lg:top-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
               <div className="h-1 w-6 bg-brand-yellow rounded-full"></div>
               Ручное начисление
            </h3>

            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <PenaltyForm users={users} />
            </div>
         </div>


      </div>
    </div>
  );
}
