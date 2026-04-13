"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, AlertCircle, Megaphone, FileText, Camera, ClipboardList, Send, Calendar, Image as ImageIcon, UserCircle, Building2, ListPlus, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { confirmNewsRead, getCompanyNews, deleteNews } from "@/app/actions/news";
import { submitTaskResponse } from "@/app/actions/task";
import { Trash2, RotateCcw } from "lucide-react";

interface Props {
  initialTasks: any[];
  initialNews: any[];
  role?: string;
  penaltyTotal?: number;
}

export default function TasksDashboard({ initialTasks, initialNews, role, penaltyTotal = 0 }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "news">("tasks");
  const [news, setNews] = useState(initialNews);
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState<string | null>(null);
  
  // Фильтры для новостей
  const [newsFrom, setNewsFrom] = useState("");
  const [newsTo, setNewsTo] = useState("");
  const [newsDept, setNewsDept] = useState("all");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const departments = ["Бухгалтерия", "Учебная часть", "Отдел продаж", "Архив", "Руководство"];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFetchNews = async (f: string, t: string, dept: string, unread: boolean) => {
    setNewsLoading(true);
    const res = await getCompanyNews({ from: f, to: t, department: dept, onlyUnread: unread });
    setNews(res);
    setNewsLoading(false);
  };

  const handleResetFilters = () => {
    setNewsFrom("");
    setNewsTo("");
    setNewsDept("all");
    setOnlyUnread(false);
    handleFetchNews("", "", "all", false);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту новость?")) return;
    const res = await deleteNews(id);
    if (res.success) {
      setNews(prev => prev.filter(n => n.id !== id));
    } else {
      alert(res.error);
    }
  };

  const unreadNews = news.filter(n => !n.isRead && n.isImportant).length;
  // Считаем активные задачи
  const activeTasksCount = tasks.length;

  const handleConfirmNews = async (id: string) => {
    setLoading(id);
    try {
      const res = await confirmNewsRead(id);
      if (res.success) {
        setNews(prev => prev.map(n => n.id === id ? { 
          ...n, 
          isRead: true,
          confirmations: [{ id: 'temp', readAt: new Date().toISOString() }]
        } : n));
      } else {
        alert(res.error || "Ошибка при подтверждении");
      }
    } catch (err) {
      alert("Ошибка сети или сервера");
    }
    setLoading(null);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" suppressHydrationWarning>
      
      {/* --- PREMIUM TABS --- */}
      <div className="grid grid-cols-2 lg:w-fit p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl w-full gap-1 shadow-inner border border-zinc-200 dark:border-zinc-700">
        <button 
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center justify-center gap-2 px-2 py-3 rounded-xl transition-all duration-300 font-bold ${activeTab === 'tasks' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-blue dark:text-brand-yellow' : 'text-zinc-500 hover:bg-white/50 dark:hover:bg-zinc-800'}`}
        >
          <ClipboardList className="w-4 h-4 shrink-0" />
          <span className="text-sm">Задачи {activeTasksCount > 0 && <span className="bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-bold">{activeTasksCount}</span>}</span>
        </button>
        <button 
          onClick={() => setActiveTab("news")}
          className={`flex items-center justify-center gap-2 px-2 py-3 rounded-xl transition-all duration-300 font-bold ${activeTab === 'news' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-blue dark:text-brand-yellow' : 'text-zinc-500 hover:bg-white/50 dark:hover:bg-zinc-800'}`}
        >
          <Megaphone className="w-4 h-4 shrink-0" />
          <span className="text-sm">Новости {unreadNews > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse ml-1 font-bold">{unreadNews}</span>}</span>
        </button>
      </div>


      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px]">
        {activeTab === "tasks" ? (
          <div className="space-y-6">
            {/* Penalty Summary for Employee */}
            {penaltyTotal > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row items-center sm:justify-between gap-4 animate-in zoom-in-95">
                 <div className="flex items-center gap-3 sm:gap-4 w-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                       <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                    <div>
                       <h4 className="font-black text-red-600 dark:text-red-500 text-sm sm:text-lg leading-tight">Штрафные баллы за месяц: {penaltyTotal % 1 === 0 ? penaltyTotal : penaltyTotal.toFixed(1)}</h4>
                       <p className="text-[10px] sm:text-sm text-red-500/70 font-medium">Это влияет на ваш рейтинг и премии. Выполняйте задачи вовремя!</p>
                    </div>
                 </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 animate-in fade-in scale-95 duration-500">
                   <CheckCircle2 className="w-16 h-16 text-zinc-100 dark:text-zinc-800 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Всё выполнено!</h3>
                   <p className="text-zinc-500 mt-1">Новых задач для вас пока нет.</p>
                </div>
              ) : (
                tasks.map(task => (
                  <TaskCard key={task.id} task={task} mounted={mounted} onComplete={() => setTasks(prev => prev.filter(t => t.id !== task.id))} />
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* News Filters */}
            <div className="flex flex-col md:flex-row items-end gap-4 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 animate-in slide-in-from-top-2">
               <div className="space-y-1.5 w-full md:w-auto">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">С даты</label>
                 <input 
                   type="date" 
                   value={newsFrom}
                   onChange={(e) => { setNewsFrom(e.target.value); handleFetchNews(e.target.value, newsTo, newsDept, onlyUnread); }}
                   className="w-full md:w-40 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-bold outline-none ring-1 ring-zinc-200 dark:ring-zinc-700"
                 />
               </div>
               <div className="space-y-1.5 w-full md:w-auto">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">По дату</label>
                 <input 
                   type="date" 
                   value={newsTo}
                   onChange={(e) => { setNewsTo(e.target.value); handleFetchNews(newsFrom, e.target.value, newsDept, onlyUnread); }}
                   className="w-full md:w-40 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-bold outline-none ring-1 ring-zinc-200 dark:ring-zinc-700"
                 />
               </div>
               <div className="space-y-1.5 flex-2 w-full md:w-auto min-w-[200px]">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Отдел</label>
                 <select 
                   value={newsDept}
                   onChange={(e) => { setNewsDept(e.target.value); handleFetchNews(newsFrom, newsTo, e.target.value, onlyUnread); }}
                   className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-bold outline-none ring-1 ring-zinc-200 dark:ring-zinc-700"
                 >
                   <option value="all">Все отделы</option>
                   {departments.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
               </div>
               
               <div className="flex gap-2 w-full md:w-auto">
                 <button 
                   onClick={() => { setOnlyUnread(!onlyUnread); handleFetchNews(newsFrom, newsTo, newsDept, !onlyUnread); }}
                   className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-xs font-bold transition-all ${onlyUnread ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'}`}
                 >
                   Не прочитанные
                 </button>
                 <button 
                   onClick={handleResetFilters}
                   className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 rounded-xl transition-all"
                   title="Сбросить фильтры"
                 >
                   <RotateCcw className="w-4 h-4" />
                 </button>
               </div>
            </div>

            <div className="relative min-h-[200px]">
              {newsLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                   <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {news.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                   <Megaphone className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                   <p className="text-zinc-500 font-bold">Ничего не найдено</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {news.map(item => (
                    <NewsCard 
                      key={item.id} 
                      item={item} 
                      onRead={handleConfirmNews} 
                      onDelete={handleDeleteNews}
                      isAdmin={role === 'ADMIN' || role === 'OWNER'}
                      loading={loading === item.id} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



/**
 * КРАСИВАЯ КАРТОЧКА ЗАДАЧИ
 */
function TaskCard({ task, mounted, onComplete }: { task: any, mounted: boolean, onComplete: () => void }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<any>({}); // { reqId: { value: '', file: null } }

  const handleFileChange = (reqId: string, file: File | null) => {
    setFormValues((prev: any) => ({ ...prev, [reqId]: { ...prev[reqId], file } }));
  };

  const handleInputChange = (reqId: string, value: string) => {
    setFormValues((prev: any) => ({ ...prev, [reqId]: { ...prev[reqId], value } }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("taskId", task.id);
      
      const requirementsMetadata = Object.entries(formValues).map(([reqId, val]: [string, any]) => {
        if (val.file) {
          formData.append(`file_${reqId}`, val.file);
        }
        return { id: reqId, value: val.value };
      });
      
      formData.append("requirements", JSON.stringify(requirementsMetadata));

      const res = await submitTaskResponse(formData);
      if (res.success) {
        onComplete();
      } else {
        alert(res.error || "Произошла ошибка при отправке");
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      alert("Ошибка сети или сервера");
      setSubmitting(false);
    }
  };


  const isOverdue = mounted && task.deadline && new Date(task.deadline) < new Date();

  return (
    <div className={`group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ${task.priority === 'URGENT' || task.priority === 'HIGH' || isOverdue ? (task.priority === 'URGENT' || isOverdue ? 'ring-2 ring-red-500/20' : 'ring-2 ring-orange-500/20') : ''}`} suppressHydrationWarning>
      <div className="p-4 sm:p-6">
        {/* Status & Deadline Badge */}
        <div className="flex justify-between items-start gap-2 mb-4">
           {/* Left Indicators Column */}
           <div className="flex flex-col gap-1.5 items-start shrink-0 w-[90px]">
              <span className={`w-full text-center text-[10px] font-black uppercase tracking-widest py-1 rounded-full ${
                task.priority === 'URGENT' ? 'bg-red-500 text-white animate-pulse' :
                task.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                'bg-zinc-100 text-zinc-500'
              }`}>
                {task.priority === 'URGENT' ? 'Срочно' : task.priority === 'HIGH' ? 'Высоко' : 'Обычная'}
              </span>
              <span className="w-full text-center text-[10px] font-black uppercase tracking-widest py-1 border border-brand-yellow/50 dark:border-brand-yellow/30 rounded-full text-zinc-900 dark:text-brand-yellow bg-brand-yellow/5 dark:bg-transparent">
                {task.points % 1 === 0 ? task.points : task.points.toFixed(1)} балла
              </span>

              {isOverdue && (
                <span className="w-full text-center text-[10px] font-black uppercase tracking-widest py-1 bg-red-100 text-red-600 rounded-full flex items-center justify-center gap-1">
                   <AlertCircle className="w-3 h-3" />
                   Просрочено
                </span>
              )}
           </div>
           
           {/* Right Date Column */}
           <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Выполнить до:</span>
              <span className={`text-[10px] font-black ${isOverdue ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
                 {task.deadline ? format(new Date(task.deadline), "d MMMM HH:mm", { locale: ru }) : "Без срока"}
              </span>
           </div>
        </div>


        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-brand-blue dark:group-hover:text-brand-yellow transition-colors">{task.title}</h3>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed">
          {task.description || "Нет описания"}
        </p>

        {/* Instruction Image if exists */}
        {task.instructionImageUrl && (
          <div className="mt-4 relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 group/img">
             <img src={task.instructionImageUrl} alt="Instruction" className="w-full h-full object-cover transition-transform group-hover/img:scale-105" />
             <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                <span className="bg-white/90 dark:bg-zinc-900/90 p-2 rounded-xl text-[10px] font-black uppercase text-zinc-900 dark:text-zinc-50 shadow-xl flex items-center gap-2">
                   <ImageIcon className="w-3 h-3" /> Увеличить образец
                </span>
             </div>
             <a href={task.instructionImageUrl} target="_blank" className="absolute inset-0 z-10" title="Открыть оригинал"></a>
          </div>
        )}

        {/* Requirements Preview */}
        <div className="mt-6 flex flex-wrap gap-2">
            {task.requirements.map((req: any) => (
              <span key={req.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-[10px] font-bold text-zinc-400 uppercase">
                 {req.type === 'PHOTO' ? <Camera className="w-3 h-3" /> : req.type === 'CHECKLIST' ? <Circle className="w-3 h-3" /> : req.type === 'FILE' ? <Paperclip className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                 {req.label}
              </span>
            ))}
        </div>
      </div>

      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full py-3 bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-blue/20 dark:shadow-brand-yellow/10 hover:opacity-90 active:scale-95 transition-all"
        >
          {isFormOpen ? "Закрыть задачу" : "Приступить к выполнению"}
        </button>
      </div>

      {/* --- DYNAMIC COMPLETION FORM --- */}
      {isFormOpen && (
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 space-y-6 bg-white dark:bg-zinc-900 animate-in slide-in-from-top-2 duration-300">
           {task.requirements.map((req: any) => (
             <div key={req.id} className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-blue dark:bg-brand-yellow"></div>
                  {req.label} {req.isRequired && <span className="text-red-500">*</span>}
                </label>
                
                {req.type === 'PHOTO' ? (
                  <div className="relative group/photo">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={(e) => handleFileChange(req.id, e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                      formValues[req.id]?.file ? 'border-green-500 bg-green-500/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-brand-blue/50 dark:hover:border-brand-yellow/50'
                    }`}>
                      {formValues[req.id]?.file ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                          <span className="text-xs font-bold text-green-600">Фото выбрано: {formValues[req.id].file.name.slice(0, 15)}...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2 group-hover/photo:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-zinc-400">Нажмите, чтобы сделать фото</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : req.type === 'TEXT' ? (
                  <textarea 
                    onChange={(e) => handleInputChange(req.id, e.target.value)}
                    placeholder="Введите текст ответа..."
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-sm focus:ring-2 ring-brand-blue dark:ring-brand-yellow"
                    rows={2}
                  />
                ) : req.type === 'FILE' ? (
                  <div className="relative group/file">
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange(req.id, e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                      formValues[req.id]?.file ? 'border-brand-blue bg-brand-blue/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-brand-blue/50'
                    }`}>
                      {formValues[req.id]?.file ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-brand-blue mb-2" />
                          <span className="text-xs font-bold text-brand-blue">Файл выбран: {formValues[req.id].file.name.slice(0, 20)}...</span>
                        </>
                      ) : (
                        <>
                          <Paperclip className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2 group-hover/file:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-zinc-400">Нажмите, чтобы прикрепить файл</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-100" onClick={() => handleInputChange(req.id, formValues[req.id]?.value === 'ON' ? 'OFF' : 'ON')}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${formValues[req.id]?.value === 'ON' ? 'bg-brand-blue dark:bg-brand-yellow border-transparent text-white' : 'border-zinc-300'}`}>
                       {formValues[req.id]?.value === 'ON' && <CheckCircle2 className="w-4 h-4 ml-[1.5px]" />}
                    </div>
                    <span className="text-sm font-medium">Подтверждаю выполнение</span>
                  </div>
                )}
             </div>
           ))}

           <button 
             disabled={submitting}
             onClick={handleSubmit}
             className="w-full py-4 mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
           >
             {submitting ? "Отправка..." : <><Send className="w-4 h-4" /> Отправить отчет</>}
           </button>
        </div>
      )}
    </div>
  );
}

/**
 * КРАСИВАЯ КАРТОЧКА НОВОСТИ
 */
function NewsCard({ item, onRead, onDelete, isAdmin, loading }: { item: any, onRead: (id: string) => void, onDelete: (id: string) => void, isAdmin: boolean, loading: boolean }) {
  return (
    <div className={`relative bg-white dark:bg-zinc-900 rounded-3xl border ${item.isImportant && !item.isRead ? 'border-red-500/50 shadow-red-500/5' : 'border-zinc-200 dark:border-zinc-800'} overflow-hidden shadow-sm transition-all animate-in slide-in-from-right-4 duration-500`} suppressHydrationWarning>
      <div className="flex flex-col">
        
        {/* News Indicator */}
        <div className={`h-1.5 w-full ${item.isImportant ? 'bg-red-500' : 'bg-brand-blue dark:bg-brand-yellow'}`}></div>
        
        <div className="p-5 sm:p-8">
           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   {item.isImportant && <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter">Срочно</span>}
                   <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(item.createdAt), "d MMMM yyyy", { locale: ru })}</span>
                </div>
                
                <h2 className="text-xl sm:text-3xl font-black text-brand-blue dark:text-brand-yellow leading-tight mb-1">
                  {item.department || "Компания"}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                      <UserCircle className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.creator.fullName}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  {item.title}
                </h3>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                  title="Удалить новость"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
           </div>

           <div className="space-y-6">
              {/* Media Content */}
              {item.imageUrl && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm max-w-2xl bg-zinc-50 dark:bg-zinc-800/20">
                   <img src={item.imageUrl} alt="News media" className="w-full h-full object-cover" />
                </div>
              )}

              {item.videoUrl && (
                <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm bg-black max-w-2xl">
                   <video src={item.videoUrl} controls className="w-full h-full max-h-[450px]" />
                </div>
              )}

              <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium whitespace-pre-wrap leading-relaxed">
                 {item.content}
              </div>
           </div>

           {!item.isRead ? (
             <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
               <button 
                 onClick={() => onRead(item.id)}
                 disabled={loading}
                 className="flex items-center gap-3 px-8 py-4 bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-blue/20 dark:shadow-brand-yellow/10 hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50"
               >
                 {loading ? "Минутку..." : <><CheckCircle2 className="w-5 h-5" /> Ознакомлен и согласен</>}
               </button>
             </div>
           ) : (
             <div className="mt-8 flex items-center gap-2 text-green-500 font-bold text-sm bg-green-500/5 w-fit px-4 py-2 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
                Вы получили эту информацию {item.confirmations?.[0]?.readAt ? format(new Date(item.confirmations[0].readAt), "HH:mm") : format(new Date(), "HH:mm")}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

