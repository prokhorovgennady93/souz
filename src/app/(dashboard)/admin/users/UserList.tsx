"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { updateUser, deleteUser, createUser } from "@/app/actions/user";
import { getUserOverrides, saveUserOverride } from "@/app/actions/scheduleOverrides";
import { Download, Upload, Plus, Trash2, Settings, Clock, X, Search, Eye, EyeOff, Calendar } from "lucide-react";

const ROLE_MAP: Record<string, string> = {
  ADMIN: "Администратор",
  SENIOR_MANAGER: "Старший менеджер",
  EMPLOYEE: "Сотрудник",
  CANDIDATE: "Стажер",
};

export default function UserList({ initialUsers, branches, userRole }: { initialUsers: any[], branches: any[], userRole: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Date selection for Schedule overrides
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [overrides, setOverrides] = useState<any[]>([]);

  // Modals state
  const [creatingUser, setCreatingUser] = useState(false);
  const [configUser, setConfigUser] = useState<any | null>(null);
  const [configScheduleUser, setConfigScheduleUser] = useState<any | null>(null);
  const [loadingObj, setLoadingObj] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const isAdmin = userRole === "ADMIN";

  // Load overrides when selectedDate changes
  useEffect(() => {
    async function loadOverrides() {
      const res = await getUserOverrides(selectedDate);
      setOverrides(res || []);
    }
    loadOverrides();
  }, [selectedDate]);

  // Actions
  const openUserConfig = (u: any) => {
    setConfigUser(u);
    setFormData({ fullName: u.fullName, phone: u.phone, role: u.role, password: u.plainPassword || "" });
  };

  const openScheduleConfig = (u: any, ovr: any) => {
    setConfigScheduleUser(u);
    setFormData({
      branchId: ovr ? (ovr.branchId || "none") : (u.branchId || "none"),
      workTimeStart: ovr ? (ovr.workTimeStart || "") : (u.workTimeStart || ""),
      workTimeEnd:  ovr ? (ovr.workTimeEnd || "") : (u.workTimeEnd || ""),
      breakTimeStart:  ovr ? (ovr.breakTimeStart || "") : (u.breakTimeStart || ""),
      breakTimeEnd: ovr ? (ovr.breakTimeEnd || "") : (u.breakTimeEnd || ""),
    });
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Вы действительно хотите удалить ${name}?`)) return;
    setLoadingObj(userId);
    const res = await deleteUser(userId);
    if (res?.error) alert(res.error);
    else setUsers(users.filter(u => u.id !== userId));
    setLoadingObj(null);
  };

  const saveUserConfig = async () => {
    setLoadingObj(configUser.id);
    const dataToSave = { 
      fullName: formData.fullName, 
      phone: formData.phone.replace(/\D/g, ''), 
      role: formData.role,
      ...(formData.password ? { password: formData.password } : {}) 
    };
    const res = await updateUser(configUser.id, dataToSave);
    if (res?.error) { alert(res.error); setLoadingObj(null); return; }
    
    setUsers(users.map(u => u.id === configUser.id ? { ...u, ...dataToSave } : u));
    setConfigUser(null);
    setLoadingObj(null);
  };

  const quickSaveSchedule = async (userId: string, dataToSave: any) => {
    setLoadingObj(userId);
    // When doing quick save, we apply this rule as an OVERRIDE to the selected date.
    // If they check "По графику", we just delete the override for this user for this date.
    if (dataToSave.clearOverride) {
      await saveUserOverride(userId, selectedDate, { clearOverride: true });
    } else {
      await saveUserOverride(userId, selectedDate, dataToSave);
    }
    // Reload overrides
    const latestOverrides = await getUserOverrides(selectedDate);
    setOverrides(latestOverrides || []);
    setLoadingObj(null);
  };

  const saveScheduleConfig = async () => {
    setLoadingObj(configScheduleUser.id);
    const dataToSave = {
      branchId: formData.branchId,
      workTimeStart: formData.workTimeStart || null,
      workTimeEnd: formData.workTimeEnd || null,
      breakTimeStart: formData.breakTimeStart || null,
      breakTimeEnd: formData.breakTimeEnd || null,
    };
    const res = await saveUserOverride(configScheduleUser.id, selectedDate, dataToSave);
    if (res?.error) { alert(res.error); setLoadingObj(null); return; }
    
    const latestOverrides = await getUserOverrides(selectedDate);
    setOverrides(latestOverrides || []);
    setConfigScheduleUser(null);
    setLoadingObj(null);
  };

  const handleCreate = async () => {
    if (!formData.fullName || !formData.phone) { alert("Укажите ФИО и Телефон!"); return; }
    setLoadingObj("new");
    const data = {
      fullName: formData.fullName,
      phone: formData.phone.replace(/\D/g, ''),
      role: formData.role || "EMPLOYEE",
      password: formData.password || "12345678",
      branchId: null
    };
    const res = await createUser(data);
    if (res?.error) alert("Ошибка: " + res.error);
    else window.location.reload();
    setLoadingObj(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const resp = await fetch("/api/admin/users/import", { method: "POST", body: fd });
      const data = await resp.json();
      if (data.error) alert("Ошибка импорта: " + data.error);
      else { alert(data.message); window.location.reload(); }
    } catch (err) { alert("Ошибка сети"); } 
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* Control Panel */}
      <div className="flex flex-wrap gap-4 items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
        
        {/* Date Selector placed prominently for Override usage */}
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm mr-2">
          <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg text-brand-blue dark:text-brand-yellow shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col mr-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-1">Дата управления</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <div className="relative w-full max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Поиск сотрудника..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all text-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <a href="/api/admin/users/export" download="Employees.xlsx" className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 text-sm font-medium rounded-xl transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Экспорт
          </a>
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" /> {uploading ? "..." : "Импорт"}
          </button>
          <button onClick={() => { setCreatingUser(true); setFormData({ fullName: "", phone: "", role: "EMPLOYEE" }); }} className="flex items-center gap-2 px-5 py-2 bg-brand-yellow hover:bg-brand-yellow/80 text-brand-blue font-bold rounded-xl transition-colors text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Добавить
          </button>
          <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".xlsx, .xls" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium uppercase text-xs">Сотрудник</th>
                <th className="px-6 py-4 font-medium uppercase text-xs min-w-[280px]">Статус на {format(new Date(selectedDate), "dd.MM")}</th>
                <th className="px-6 py-4 font-medium uppercase text-xs min-w-[320px]">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredUsers.map(u => {
                const ovr = overrides.find(o => o.userId === u.id);
                
                const activeBranchId = ovr ? ovr.branchId : u.branchId;
                const activeBranch = branches.find(b => b.id === activeBranchId);
                const isOffDay = ovr ? ovr.isOffDay : u.isOffDay;
                
                const wtStart = ovr && ovr.workTimeStart ? ovr.workTimeStart : u.workTimeStart;
                const wtEnd = ovr && ovr.workTimeEnd ? ovr.workTimeEnd : u.workTimeEnd;
                const btStart = ovr && ovr.breakTimeStart ? ovr.breakTimeStart : u.breakTimeStart;
                const btEnd = ovr && ovr.breakTimeEnd ? ovr.breakTimeEnd : u.breakTimeEnd;

                const hasOverride = !!ovr;
                const isBranchSchedule = !wtStart && !btStart;
                const isSaving = loadingObj === u.id;

                return (
                  <tr key={u.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group ${isSaving ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {u.fullName} {hasOverride && <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] rounded animate-pulse" title="График изменен на выбранную дату">Изменен</span>}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-zinc-500 font-mono text-xs">+{u.phone}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-blue/10 text-brand-blue uppercase">
                            {ROLE_MAP[u.role] || u.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {activeBranch ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 mb-1">{activeBranch.name}</span>
                          
                          {isOffDay ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span className="text-red-500 font-bold text-xs uppercase tracking-tighter">На выходном</span>
                            </div>
                          ) : (
                            <div 
                              className="text-[11px] font-bold tracking-wide flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                              onClick={() => openScheduleConfig(u, ovr)}
                            >
                              <span className="text-brand-blue">
                                {wtStart || activeBranch.openTime} - {wtEnd || activeBranch.closeTime}
                              </span>
                              <span className="text-zinc-300 dark:text-zinc-600">|</span>
                              <span className="text-orange-600">
                                {btStart || activeBranch.breakStartTime} - {btEnd || activeBranch.breakEndTime}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                           {isOffDay ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span className="text-red-500 font-bold text-xs uppercase tracking-tighter">На выходном</span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 italic">Филиал не назначен</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start w-fit">
                        <div className="flex items-center gap-2">
                           <button onClick={() => openUserConfig(u)} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                             <Settings className="w-4 h-4" /> Данные
                           </button>
                           <button onClick={() => openScheduleConfig(u, ovr)} disabled={isSaving} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${hasOverride ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm" : "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400"}`}>
                             <Clock className="w-4 h-4" /> График
                           </button>
                           <button onClick={() => handleDelete(u.id, u.fullName)} disabled={isSaving} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50" title="Удалить">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                        {/* Чек-боксы быстрого изменения на ДАТУ */}
                         <div className="flex flex-col gap-2 mt-3 text-[11px] text-zinc-500 font-medium pl-1">
                           <label className="flex items-center gap-1.5 cursor-pointer hover:text-brand-blue transition-colors group/chk">
                             <input type="checkbox" className="accent-brand-blue cursor-pointer" checked={!hasOverride} disabled={isSaving}
                               onChange={(e) => {
                                 if (e.target.checked) quickSaveSchedule(u.id, { clearOverride: true });
                               }} 
                             /> <span className="group-hover/chk:underline">Стандарт (очистить изменения)</span>
                           </label>
                           <label className="flex items-center gap-1.5 cursor-pointer hover:text-red-500 transition-colors group/chk">
                             <input type="checkbox" className="accent-red-500 cursor-pointer" checked={isOffDay} disabled={isSaving}
                               onChange={(e) => {
                                 quickSaveSchedule(u.id, { isOffDay: e.target.checked, branchId: "none" }); // Отправка на выходной обычно снимает филиал
                               }}
                             /> <span className={`${isOffDay ? 'text-red-500 font-bold' : ''} group-hover/chk:underline`}>Выходной на этот день</span>
                           </label>
                         </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* <... Creating & User settings skipped ...> */}
      {creatingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Новый сотрудник</h3>
              <button onClick={() => setCreatingUser(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-xs font-bold text-zinc-500 uppercase">ФИО</label>
              <input type="text" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Иванов И.И."/></div>
              <div><label className="text-xs font-bold text-zinc-500 uppercase">Телефон</label>
              <input type="text" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="7900..."/></div>
              <div><label className="text-xs font-bold text-zinc-500 uppercase">Пароль</label>
              <input type="text" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="12345678 (по умолчанию)"/></div>
              <button onClick={handleCreate} disabled={loadingObj==="new"} className="w-full py-2 bg-brand-blue text-brand-yellow font-bold rounded-lg mt-2">Добавить</button>
            </div>
          </div>
        </div>
      )}

      {configUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2"><Settings className="w-5 h-5"/> Данные сотрудника</h3>
              <button onClick={() => setConfigUser(null)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">ФИО</label>
                <input type="text" className="w-full mt-1 p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Телефон (Логин)</label>
                <input type="text" className="w-full mt-1 p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-brand-blue" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                <label className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase ml-1">Пароль сотрудника</label>
                <div className="relative mt-1">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pr-12 font-mono" 
                    value={formData.password} 
                    placeholder="Введите новый пароль..."
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                  </button>
                </div>
                <p className="text-[10px] text-orange-600 mt-2 ml-1">Вы можете изменить пароль прямо здесь. После сохранения он обновится.</p>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Роль доступа</label>
                <select 
                  className="w-full mt-1 p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl disabled:opacity-50" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  disabled={!isAdmin}
                >
                  <option value="CANDIDATE">Кандидат / Стажер</option>
                  <option value="EMPLOYEE">Сотрудник филиала</option>
                  <option value="SENIOR_MANAGER">Старший менеджер (Доступ к Excel)</option>
                  <option value="ADMIN">Главный Администратор (Полный доступ)</option>
                </select>
                {!isAdmin && <p className="text-[10px] text-red-500 mt-1 ml-1">Только Главный Администратор может изменять роли.</p>}
              </div>
              
              <button 
                onClick={saveUserConfig} 
                disabled={loadingObj === configUser.id} 
                className="w-full py-3 mt-2 bg-brand-blue hover:bg-brand-blue-hover text-brand-yellow font-bold tracking-wide rounded-xl transition-colors disabled:opacity-50"
              >
                {loadingObj === configUser.id ? "Сохранение..." : "Сохранить профиль"}
              </button>
            </div>
          </div>
        </div>
      )}

      {configScheduleUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-orange-50 dark:bg-orange-900/20 rounded-t-2xl">
               <div>
                  <h3 className="font-bold text-lg text-orange-600 dark:text-orange-500 flex items-center gap-2"><Clock className="w-5 h-5"/> График на эту дату</h3>
                  <p className="text-xs text-orange-600/80 font-medium ml-7 mt-0.5">{format(new Date(selectedDate), "dd.MM.yyyy")}</p>
               </div>
              <button onClick={() => setConfigScheduleUser(null)} className="text-zinc-400 hover:text-zinc-600 self-start"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Филиал на {format(new Date(selectedDate), "dd.MM")}</label>
                <select className="w-full mt-1 p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium" value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
                  <option value="none">-- Без привязки (Выходной/Замена) --</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name.substring(0, 35)}</option>)}
                </select>
              </div>

              <div className={`pt-4 border-t border-zinc-100 dark:border-zinc-800 transition-opacity ${formData.branchId === "none" ? "opacity-30 pointer-events-none" : ""}`}>
                <p className="text-sm font-semibold mb-3">Индивидуальные часы <span className="text-xs font-normal text-zinc-400">(перекрывают филиал)</span></p>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 mb-1 block">Начало смены</label>
                    <input type="time" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-brand-blue font-bold" value={formData.workTimeStart} onChange={e => setFormData({...formData, workTimeStart: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 mb-1 block">Конец смены</label>
                    <input type="time" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-brand-blue font-bold" value={formData.workTimeEnd} onChange={e => setFormData({...formData, workTimeEnd: e.target.value})} />
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 mb-1 block">Начало перерыва</label>
                    <input type="time" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-orange-600 font-bold" value={formData.breakTimeStart} onChange={e => setFormData({...formData, breakTimeStart: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 mb-1 block">Конец перерыва</label>
                    <input type="time" className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-orange-600 font-bold" value={formData.breakTimeEnd} onChange={e => setFormData({...formData, breakTimeEnd: e.target.value})} />
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 leading-tight">Оставьте поля пустыми, чтобы сбросить график.</p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                 <button 
                   onClick={saveScheduleConfig} 
                   disabled={loadingObj === configScheduleUser.id} 
                   className="w-full py-3 bg-brand-blue hover:bg-brand-blue-hover text-brand-yellow font-bold tracking-wide rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                 >
                   {loadingObj === configScheduleUser.id ? "Сохранение..." : formData.branchId === "none" ? "Сохранить как Выходной" : "Сохранить график на дату"}
                 </button>
                 <button 
                   onClick={() => quickSaveSchedule(configScheduleUser.id, { clearOverride: true }).then(() => setConfigScheduleUser(null))} 
                   disabled={loadingObj === configScheduleUser.id} 
                   className="w-full py-2 bg-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl text-xs font-semibold"
                 >
                   Сбросить и использовать базовый профиль
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
