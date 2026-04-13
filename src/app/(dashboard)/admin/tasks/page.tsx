"use client";

import { useState, useEffect } from "react";
import { ListPlus, Send, Camera, FileText, CheckSquare, Plus, Trash2, User, Building2, ShieldCheck, Clock, UserCircle, Image as ImageIcon, AlertCircle, X, Paperclip } from "lucide-react";
import { createTask, getSearchData, updateTaskFull } from "@/app/actions/task";
import { useRouter } from "next/navigation";
import TaskManagement from "./TaskManagement";

export default function CreateTaskPage() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [targetType, setTargetType] = useState<"ROLE" | "BRANCH" | "USER" | "ALL">("ROLE");
  const [targetValue, setTargetValue] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showManagement, setShowManagement] = useState(false);
  const [instructionPhoto, setInstructionPhoto] = useState<File | null>(null);
  const [instructionPreview, setInstructionPreview] = useState<string | null>(null);
  const [points, setPoints] = useState("0");
  const [editingTask, setEditingTask] = useState<any>(null);
  
  const [allData, setAllData] = useState<{ branches: any[], users: any[] }>({ branches: [], users: [] });


  
  // Новые поля для расписания
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [frequency, setFrequency] = useState("DAILY");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [dayOfMonth, setDayOfMonth] = useState("1");

  const [requirements, setRequirements] = useState<any[]>([
    { type: "CHECKLIST", label: "Подтверждаю выполнение", isRequired: true }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setDeadline(new Date().toISOString().split("T")[0]);
    async function loadData() {
      const data = await getSearchData();
      setAllData(data);
    }
    loadData();
  }, []);

  // Переключение в режим редактирования
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "NORMAL");
      setPoints(editingTask.points?.toString() || "0");
      setDeadline(editingTask.deadline ? new Date(editingTask.deadline).toISOString().split("T")[0] : "");
      
      if (editingTask.targetAllUsers) setTargetType("ALL");
      else if (editingTask.targetRole) {
        setTargetType("ROLE");
        setTargetValue(editingTask.targetRole);
      } else if (editingTask.assignedBranchId) {
        setTargetType("BRANCH");
        setTargetValue(editingTask.assignedBranchId);
        const branch = allData.branches.find(b => b.id === editingTask.assignedBranchId);
        if (branch) setSearchQuery(branch.name);
      } else if (editingTask.assignedUserId) {
        setTargetType("USER");
        setSelectedUserIds([editingTask.assignedUserId]);
        if (editingTask.assignee) setSelectedUserNames([editingTask.assignee.fullName]);
      }

      if (editingTask.requirements) {
        setRequirements(editingTask.requirements.map((r: any) => ({
          type: r.type,
          label: r.label,
          isRequired: r.isRequired
        })));
      }
      
      // Скролл наверх к форме
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingTask, allData.branches]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInstructionPhoto(file);
      setInstructionPreview(URL.createObjectURL(file));
    }
  };


  const addRequirement = (type: "PHOTO" | "TEXT" | "CHECKLIST" | "FILE") => {
    if (requirements.length >= 10) return;
    setRequirements([...requirements, { type, label: "", isRequired: true }]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, field: string, value: any) => {
    const newReqs = [...requirements];
    newReqs[index][field] = value;
    setRequirements(newReqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.some(r => !r.label)) {
      alert("Пожалуйста, заполните названия для всех требований");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("isRecurrent", isRecurrent.toString());
    formData.append("deadline", deadline);
    formData.append("points", points);
    if (instructionPhoto) formData.append("instructionPhoto", instructionPhoto);

    
    if (isRecurrent) {

      formData.append("frequency", frequency);
      formData.append("dayOfWeek", dayOfWeek);
      formData.append("dayOfMonth", dayOfMonth);
    }
    
    if (targetType === "ALL") formData.append("targetAllUsers", "true");
    if (targetType === "ROLE") formData.append("targetRole", targetValue);
    if (targetType === "BRANCH") formData.append("branchId", targetValue);
    if (targetType === "USER") formData.append("userId", selectedUserIds.join(","));
    
    formData.append("requirements", JSON.stringify(requirements));

    let res;
    if (editingTask) {
      res = await updateTaskFull(editingTask.id, formData);
    } else {
      res = await createTask(formData);
    }

    if (res.success) {
      if (editingTask) {
        alert("Задача успешно обновлена");
        setEditingTask(null);
        // Очистка формы
        setTitle("");
        setDescription("");
        setRequirements([{ type: "CHECKLIST", label: "Подтверждаю выполнение", isRequired: true }]);
      } else {
        router.push("/admin/tasks/reports");
      }
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  // Фильтрация данных для поиска
  const filteredBranches = allData.branches.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  const filteredUsers = allData.users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);


  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 animate-pulse">
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] h-[800px] border border-zinc-200 dark:border-zinc-800 shadow-xl opacity-50" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-10 animate-in fade-in duration-700">
      <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl sm:rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-lg sm:shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 sm:p-14 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex justify-between items-center w-full">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-4">
                <div className="p-2 sm:p-3 bg-brand-blue/10 dark:bg-brand-yellow/10 rounded-2xl sm:rounded-3xl">
                  <ListPlus className="w-7 h-7 sm:w-10 sm:h-10 text-brand-blue dark:text-brand-yellow" />
                </div>
                {editingTask ? "Редактирование задачи" : "Поставить задачу"}
              </h1>
              <p className="text-zinc-500 mt-3 font-medium text-lg italic">
                {editingTask ? "Измените параметры текущей задачи" : "Создайте детальную задачу с проверкой выполнения через фото и текст"}
              </p>
            </div>
            
            {!editingTask ? (
              <button 
                type="button"
                onClick={() => setShowManagement(true)}
                className="flex items-center gap-2 px-6 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-3xl font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <Clock className="w-5 h-5 text-brand-blue dark:text-brand-yellow" />
                <span className="hidden sm:inline">Текущие задачи</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setTitle("");
                  setDescription("");
                  setRequirements([{ type: "CHECKLIST", label: "Подтверждаю выполнение", isRequired: true }]);
                }}
                className="flex items-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 rounded-3xl font-bold transition-all"
              >
                <X className="w-5 h-5" />
                Отменить редактирование
              </button>
            )}
          </div>
        </div>

        <form id="create-task-form" onSubmit={handleSubmit} className="p-4 sm:p-14 space-y-12" autoComplete="off" suppressHydrationWarning>
          
          {/* Section: Основная информация */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Название задачи</label>
                 <input 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Фото кассы и порядок на полках"
                    className="w-full text-lg font-bold bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue dark:focus:border-brand-yellow rounded-2xl p-5 transition-all outline-none"
                    suppressHydrationWarning
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Приоритет</label>
                 <div className="flex gap-2">
                    {['NORMAL', 'HIGH', 'URGENT'].map((p) => (
                      <button 
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase transition-all border-2 ${
                          priority === p 
                            ? (p === 'URGENT' ? 'bg-red-500 border-red-500 text-white' : 
                               p === 'HIGH' ? 'bg-orange-500 border-orange-500 text-white' :
                               'bg-brand-blue dark:bg-brand-yellow border-transparent text-brand-yellow dark:text-brand-blue') 
                            : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50'
                        }`}
                      >
                        {p === 'URGENT' ? 'Срочно!' : p === 'HIGH' ? 'Высокий' : 'Обычный'}
                      </button>
                    ))}
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1 font-sans italic">Распоряжение (Текст задачи)</label>
              <textarea 
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробно опишите, что именно нужно сделать..."
                rows={4}
                className="w-full text-md bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue dark:focus:border-brand-yellow rounded-3xl p-6 transition-all outline-none resize-none leading-relaxed"
                suppressHydrationWarning
              />
            </div>

            {/* Instruction Photo Upload */}
            <div className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
               <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border-2 border-zinc-100 overflow-hidden shadow-sm">
                     {instructionPreview ? (
                       <img src={instructionPreview} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <ImageIcon className="w-8 h-8 text-zinc-300" />
                     )}
                     <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Фото-инструкция (необязательно)</h4>
                     <p className="text-xs text-zinc-500 mt-1">Прикрепите образец или наглядное пособие. Сотрудник увидит его сразу при получении задачи.</p>
                     <button type="button" className="mt-3 text-xs font-black uppercase text-brand-blue dark:text-brand-yellow relative">
                        Выбрать файл
                        <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                     </button>
                  </div>
               </div>
            </div>
          </div>


          <div className="h-px bg-zinc-100 dark:bg-zinc-800"></div>

          {/* New Section: Расписание */}
          <div className="space-y-8 p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-brand-blue dark:text-brand-yellow" />
                   Расписание
                </h3>
                <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                   <button 
                     type="button"
                     onClick={() => setIsRecurrent(false)}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!isRecurrent ? 'bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue shadow-sm' : 'text-zinc-400'}`}
                   >
                     Разовая
                   </button>
                   <button 
                     type="button"
                     onClick={() => setIsRecurrent(true)}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${isRecurrent ? 'bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue shadow-sm' : 'text-zinc-400'}`}
                   >
                     Регулярная
                   </button>
                </div>
             </div>

             {!isRecurrent ? (
               <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 ml-1">Выполнить до (Дедлайн)</label>
                  <input 
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-zinc-900 border-none rounded-2xl font-bold font-mono"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1 italic ml-1">Задача будет видна сотруднику сразу, но станет просроченной после этой даты</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400 ml-1">Частота повторения</label>
                    <select 
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full p-4 bg-white dark:bg-zinc-900 rounded-2xl border-none font-bold"
                    >
                      <option value="DAILY">Каждый день</option>
                      <option value="WEEKLY">Еженедельно</option>
                      <option value="MONTHLY">Ежемесячно</option>
                    </select>
                  </div>

                  {frequency === 'WEEKLY' && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-400 ml-1">День недели</label>
                      <select 
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-zinc-900 rounded-2xl border-none font-bold"
                      >
                        <option value="1">Понедельник</option>
                        <option value="2">Вторник</option>
                        <option value="3">Среда</option>
                        <option value="4">Четверг</option>
                        <option value="5">Пятница</option>
                        <option value="6">Суббота</option>
                        <option value="7">Воскресенье</option>
                      </select>
                    </div>
                  )}

                  {frequency === 'MONTHLY' && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-400 ml-1">Число месяца</label>
                      <input 
                        type="number"
                        min="1" max="31"
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-zinc-900 border-none rounded-2xl font-bold"
                      />
                    </div>
                  )}
               </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Points / Penalty */}
             <div className="space-y-4">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <AlertCircle className="w-4 h-4 text-brand-blue dark:text-brand-yellow" />
                   Цена задачи (штрафные баллы)
                </label>
                <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                   <input 
                     type="number"
                     min="0"
                     step="0.2"
                     value={points}
                     onChange={(e) => setPoints(e.target.value)}
                     className="w-24 text-2xl font-black bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-brand-blue dark:focus:border-brand-yellow outline-none text-center"
                     suppressHydrationWarning
                   />
                   <p className="text-xs text-zinc-500 font-medium">Баллы зачисляются сотруднику автоматически, если задача просрочена и не выполнена.</p>
                </div>
             </div>

             {/* Recurrence Toggle */}
             <div className="space-y-4">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Clock className="w-4 h-4 text-brand-blue dark:text-brand-yellow" />
                   Повторение
                </label>
             </div>
          </div>

          {/* Section: Кому назначить */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
               <User className="w-5 h-5 text-brand-blue dark:text-brand-yellow" />
               Кто должен выполнить?
            </h3>
            <div className="flex flex-wrap gap-3">
               {[
                 { id: 'ROLE', label: 'По ролям', icon: ShieldCheck },
                 { id: 'BRANCH', label: 'Весь филиал', icon: Building2 },
                 { id: 'USER', label: 'Конкретный человек', icon: User },
                 { id: 'ALL', label: 'ВСЕ СОТРУДНИКИ', icon: UserCircle }
               ].map((type) => (
                 <button 
                   key={type.id}
                   type="button"
                   onClick={() => { setTargetType(type.id as any); setTargetValue(""); }}
                   className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-sm ${targetType === type.id ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
                 >
                   {/* @ts-ignore */}
                   <type.icon className="w-4 h-4" />
                   {type.label}
                 </button>
               ))}
            </div>

            <div className="mt-4 relative">
              {targetType === 'ROLE' && (
                <select 
                  value={targetValue} 
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-none font-bold text-zinc-700 dark:text-zinc-300"
                  suppressHydrationWarning
                >
                  <option value="">Выберите роль...</option>
                  <option value="SHIFT_MANAGERS">🔥 Менеджеры на смене (за кем закреплен филиал сегодня)</option>
                  <option value="EMPLOYEE">Все Менеджеры</option>
                  <option value="SENIOR_MANAGER">Старшие менеджеры</option>
                  <option value="ADMIN">Администраторы</option>
                </select>
              )}

              {targetType === 'BRANCH' && (
                <div className="space-y-2">
                   <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Начните вводить название филиала..."
                      className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl font-bold"
                   />
                   {searchQuery && targetValue === "" && (
                     <div className="absolute z-50 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl mt-1 overflow-hidden">
                        {filteredBranches.map(b => (
                          <div 
                            key={b.id} 
                            onClick={() => { setTargetValue(b.id); setSearchQuery(b.name); }}
                            className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer font-bold border-b border-zinc-100 dark:border-zinc-800 last:border-none"
                          >
                            {b.name}
                          </div>
                        ))}
                        {filteredBranches.length === 0 && <div className="p-4 text-zinc-400 italic">Ничего не найдено</div>}
                     </div>
                   )}
                </div>
              )}

               {targetType === 'USER' && (
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl">
                      {selectedUserIds.length === 0 && <span className="text-sm text-zinc-400 italic">Сотрудники не выбраны</span>}
                      {selectedUserIds.map((uid, idx) => (
                        <div key={uid} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95 duration-200">
                          {selectedUserNames[idx]}
                          <button type="button" onClick={() => {
                            setSelectedUserIds(selectedUserIds.filter(id => id !== uid));
                            setSelectedUserNames(selectedUserNames.filter((_, i) => i !== idx));
                          }}><X className="w-3 h-3 hover:scale-125 transition-transform" /></button>
                        </div>
                      ))}
                   </div>

                   <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Начните вводить фамилию или имя..."
                      className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl font-bold"
                   />
                   {searchQuery && (
                     <div className="absolute z-50 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl mt-1 overflow-hidden">
                        {filteredUsers.filter(u => !selectedUserIds.includes(u.id)).map(u => (
                          <div 
                            key={u.id} 
                            onClick={() => { 
                              setSelectedUserIds([...selectedUserIds, u.id]); 
                              setSelectedUserNames([...selectedUserNames, u.fullName]);
                              setSearchQuery(""); 
                            }}
                            className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 last:border-none"
                          >
                            <span className="font-bold">{u.fullName}</span>
                            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded uppercase tracking-tighter">{u.role}</span>
                          </div>
                        ))}
                        {filteredUsers.length === 0 && <div className="p-4 text-zinc-400 italic">Ничего не найдено</div>}
                     </div>
                   )}
                </div>
              )}

              {targetType === 'ALL' && (
                <div className="p-6 bg-brand-blue/5 border-2 border-dashed border-brand-blue/20 rounded-3xl text-center">
                   <p className="text-brand-blue font-bold">Задача будет назначена ВСЕМ сотрудникам автоматически</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800"></div>

          {/* Section: Динамический конструктор (Контроль выполнения) */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                 <CheckSquare className="w-5 h-5 text-brand-blue dark:text-brand-yellow" />
                 Конструктор отчета (что прислать?)
              </h3>
              <div className="flex gap-2">
                 <button type="button" onClick={() => addRequirement('PHOTO')} className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 transition-colors" title="Добавить фото"><Camera className="w-5 h-5" /></button>
                 <button type="button" onClick={() => addRequirement('TEXT')} className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 transition-colors" title="Добавить поле ввода"><FileText className="w-5 h-5" /></button>
                 <button type="button" onClick={() => addRequirement('CHECKLIST')} className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 transition-colors" title="Добавить чекбокс"><CheckSquare className="w-5 h-5" /></button>
                 <button type="button" onClick={() => addRequirement('FILE')} className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 transition-colors" title="Добавить загрузку файла"><Paperclip className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-4">
               {requirements.map((req, idx) => (
                 <div key={idx} className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-800/30 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 group animate-in zoom-in-95 duration-300">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                       {req.type === 'PHOTO' ? <Camera className="w-6 h-6 text-orange-500" /> : req.type === 'TEXT' ? <FileText className="w-6 h-6 text-blue-500" /> : req.type === 'FILE' ? <Paperclip className="w-6 h-6 text-purple-500" /> : <CheckSquare className="w-6 h-6 text-green-500" />}
                    </div>
                    
                    <input 
                      required
                       value={req.label}
                       onChange={(e) => updateRequirement(idx, "label", e.target.value)}
                       placeholder={
                         req.type === 'PHOTO' ? "Например: Фото витрины издалека" : 
                         req.type === 'TEXT' ? "Например: Напишите сумму остатка" : 
                         req.type === 'FILE' ? "Например: Загрузите скан накладной" :
                         "Например: Помыл пол"
                       }
                       className="flex-1 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-brand-blue dark:focus:border-brand-yellow transition-colors font-bold p-2 outline-none"
                      suppressHydrationWarning
                    />


                    <button 
                      type="button" 
                      onClick={() => removeRequirement(idx)}
                      className="p-3 text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))}

               <button 
                  type="button"
                  onClick={() => addRequirement('PHOTO')}
                  className="w-full py-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-400 hover:border-brand-blue dark:hover:border-brand-yellow hover:text-brand-blue dark:hover:text-brand-yellow font-bold uppercase text-xs flex items-center justify-center gap-2 transition-all mt-6 active:scale-[0.99]"
               >
                  <Plus className="w-5 h-5" /> Добавить еще одну кнопку для фото или текста
               </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-sm sm:text-lg uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
              editingTask 
                ? 'bg-green-500 text-white shadow-green-500/20 hover:bg-green-600' 
                : 'bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue shadow-brand-blue/20 dark:shadow-brand-yellow/10 hover:translate-y-[-2px] active:scale-[0.98]'
            }`}
          >
            {loading ? "Минутку..." : (
              <>
                {editingTask ? <CheckSquare className="w-5 h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
                {editingTask ? "Сохранить изменения" : "Поставить задачу"}
              </>
            )}
          </button>
        </form>
      </div>

      {showManagement && (
        <TaskManagement 
          onClose={() => setShowManagement(false)} 
          onEdit={(task) => setEditingTask(task)} 
        />
      )}
    </div>
  );
}
