"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Calendar, Edit2, Check, User, Building2 } from "lucide-react";
import { getTasksByDate, deleteTask, updateTaskTitle } from "@/app/actions/task";

export default function TaskManagement({ onClose, onEdit }: { onClose: () => void, onEdit: (task: any) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [date]);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await getTasksByDate(date);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту задачу для всех?")) return;
    const res = await deleteTask(id);
    if (res.success) setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
              <Calendar className="w-6 h-6 text-brand-blue dark:text-brand-yellow" />
              Управление задачами
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Просмотр, полное редактирование и удаление задач</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:scale-110 transition-transform"><X className="w-6 h-6 text-zinc-500" /></button>
        </div>

        {/* Date Filter */}
        <div className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
           <label className="text-xs font-black uppercase text-zinc-400">Выберите дату:</label>
           <input 
             type="date"
             value={date}
             onChange={(e) => setDate(e.target.value)}
             className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-brand-blue/20"
           />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
               <p className="mt-4 text-sm font-bold text-zinc-400">Загрузка задач...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20">
               <p className="text-zinc-500 font-bold text-lg italic">На эту дату задач не найдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-zinc-50 dark:bg-zinc-800/30 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg flex items-center gap-2 leading-tight">
                        {task.title}
                        <button 
                          onClick={() => {
                            onEdit(task);
                            onClose();
                          }} 
                          className="p-1 px-3 bg-brand-blue/10 text-brand-blue rounded-lg text-[10px] font-black uppercase flex items-center gap-1 hover:bg-brand-blue hover:text-white transition-all ml-2"
                        >
                          <Edit2 className="w-3 h-3" /> Редактировать всё
                        </button>
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                         {task.targetAllUsers && <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase rounded-full">Всем</span>}
                         {task.targetRole && <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase rounded-full">По роли: {task.targetRole}</span>}
                         {task.assignee && (
                           <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                              <User className="w-3 h-3" /> {task.assignee.fullName}
                           </span>
                         )}
                         {task.branch && (
                           <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {task.branch.name}
                           </span>
                         )}
                         <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${task.completions.length > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                           {task.completions.length > 0 ? 'Выполнено' : 'Не выполнено'}
                         </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
