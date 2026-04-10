"use client";

import { useState } from "react";
import { Trash2, Edit2, Check, X, ExternalLink } from "lucide-react";
import { deletePenalty, updatePenalty } from "@/app/actions/penalty";
import Link from "next/link";

interface Props {
  penalty: any;
}

export default function PenaltyActions({ penalty }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(penalty.amount);
  const [reason, setReason] = useState(penalty.reason);

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот штраф?")) return;
    setLoading(true);
    await deletePenalty(penalty.id);
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    await updatePenalty(penalty.id, amount, reason);
    setLoading(false);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-brand-yellow/20 animate-in fade-in zoom-in-95">
         <div className="flex gap-2">
            <input 
              type="number" 
              step="0.1"
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-20 p-2 text-sm font-black bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-yellow"
            />
            <input 
              type="text" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="flex-1 p-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-yellow"
            />
         </div>
         <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
               <X className="w-4 h-4" />
            </button>
            <button 
              onClick={handleUpdate} 
              disabled={loading}
              className="px-4 py-2 bg-brand-yellow text-brand-blue rounded-lg text-xs font-black uppercase tracking-tight flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
               {loading ? "..." : <><Check className="w-4 h-4" /> Сохранить</>}
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
       {penalty.taskId && (
         <Link 
           href={`/admin/tasks/reports?taskId=${penalty.taskId}`}
           className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-brand-blue dark:hover:text-brand-yellow rounded-xl transition-all"
           title="Перейти к задаче"
         >
            <ExternalLink className="w-4 h-4" />
         </Link>
       )}
       <button 
         onClick={() => setIsEditing(true)}
         className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-blue-500 rounded-xl transition-all"
       >
          <Edit2 className="w-4 h-4" />
       </button>
       <button 
         onClick={handleDelete}
         disabled={loading}
         className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-500 rounded-xl transition-all"
       >
          <Trash2 className="w-4 h-4" />
       </button>
    </div>
  );
}
