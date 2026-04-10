"use client";

import { useState } from "react";
import { deleteBranch, createBranch, updateBranch } from "@/app/actions/branch";
import { Trash2, Edit2, MapPin, Clock, Search, Plus, X } from "lucide-react";

export default function BranchList({ initialBranches }: { initialBranches: any[] }) {
  const [branches, setBranches] = useState(initialBranches);
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    scheduleType: "5/2",
    openTime: "09:00",
    closeTime: "18:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00"
  });

  const handleOpenCreate = () => {
    setEditingBranch(null);
    setFormData({
      name: "", address: "", scheduleType: "5/2",
      openTime: "09:00", closeTime: "18:00",
      breakStartTime: "13:00", breakEndTime: "14:00"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      scheduleType: branch.scheduleType,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      breakStartTime: branch.breakStartTime,
      breakEndTime: branch.breakEndTime
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address) { alert("Заполните Название и Адрес!"); return; }
    setLoading("submit");
    
    let res;
    if (editingBranch) {
      res = await updateBranch(editingBranch.id, formData);
    } else {
      res = await createBranch(formData);
    }

    if (res?.error) {
      alert(res.error);
    } else {
      window.location.reload();
    }
    setLoading(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы действительно хотите удалить филиал "${name}"? Это действие необратимо.`)) return;
    setLoading(id);
    const res = await deleteBranch(id);
    if (res?.error) alert(res.error);
    else setBranches(branches.filter(b => b.id !== id));
    setLoading(null);
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Поиск по названию или адресу..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-brand-yellow font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" /> Добавить филиал
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBranches.map(branch => (
          <div key={branch.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-5">
              <h3 className="font-bold text-lg text-brand-blue dark:text-brand-yellow pr-4 leading-tight">{branch.name}</h3>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(branch)}
                  title="Редактировать" 
                  className="p-2 text-zinc-400 hover:text-brand-blue hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  title="Удалить" 
                  onClick={() => handleDelete(branch.id, branch.name)}
                  disabled={loading === branch.id}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 flex-grow mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{branch.address}</div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div className="text-sm text-zinc-700 dark:text-zinc-300 flex flex-col space-y-1">
                  <span className="font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block w-max">
                    {branch.openTime} — {branch.closeTime}
                  </span>
                  <span className="text-zinc-500 text-xs">График: {branch.scheduleType}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto -mx-6 -mb-6 px-6 py-4 bg-orange-50 dark:bg-orange-950/20 rounded-b-2xl border-t border-orange-100 dark:border-orange-900/30">
               <div className="text-sm text-orange-700 dark:text-orange-400 flex items-center gap-2 font-medium">
                 <span>🍽 Перерыв:</span>
                 <span>{branch.breakStartTime} — {branch.breakEndTime}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
              <h3 className="font-bold text-lg text-brand-blue dark:text-brand-yellow">
                {editingBranch ? "Редактировать филиал" : "Новый филиал"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Название офиса</label>
                <input type="text" className="w-full mt-1 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Напр: Ворошиловский, 91" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Адрес</label>
                <input type="text" className="w-full mt-1 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Улица, дом..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Тип графика</label>
                  <select className="w-full mt-1 p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl" value={formData.scheduleType} onChange={e => setFormData({...formData, scheduleType: e.target.value})}>
                    <option value="5/2">5/2</option>
                    <option value="2/2">2/2</option>
                    <option value="3/3">3/3</option>
                    <option value="Ежедневно">Ежедневно</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-semibold mb-3">Время работы и обед</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase ml-1">Открытие</label>
                    <input type="time" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase ml-1">Закрытие</label>
                    <input type="time" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase ml-1 text-orange-600">Обед (с)</label>
                    <input type="time" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.breakStartTime} onChange={e => setFormData({...formData, breakStartTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase ml-1 text-orange-600">Обед (по)</label>
                    <input type="time" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg" value={formData.breakEndTime} onChange={e => setFormData({...formData, breakEndTime: e.target.value})} />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={loading === "submit"} 
                className="w-full py-3 mt-4 bg-brand-blue hover:bg-brand-blue-hover text-brand-yellow font-bold tracking-wide rounded-xl transition-colors disabled:opacity-50"
              >
                {loading === "submit" ? "Сохранение..." : editingBranch ? "Обновить филиал" : "Создать филиал"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
