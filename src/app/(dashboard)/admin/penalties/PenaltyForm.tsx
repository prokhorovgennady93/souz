"use client";

import { useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { addManualPenalty } from "@/app/actions/penalty";

export default function PenaltyForm({ users }: { users: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const res = await addManualPenalty(formData);
      if (res.error) {
        alert(res.error);
      } else {
        // Reset form or show success
        const form = document.querySelector('form') as HTMLFormElement;
        form?.reset();
      }
    });
  };

  return (
    <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] p-8 shadow-2xl">
       <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Сотрудник</label>
             <select name="userId" required className="w-full bg-zinc-800 dark:bg-zinc-100 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-brand-blue">
                <option value="">Выберите человека...</option>
                {users.map(u => <option key={u.id} value={u.id} className="text-zinc-950">{u.fullName}</option>)}
             </select>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Сумма (баллы)</label>
             <input 
                type="number" 
                name="amount" 
                required
                step="0.2"
                placeholder="10"
                className="w-full bg-zinc-800 dark:bg-zinc-100 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-brand-blue"
             />
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Причина / Основание</label>
             <textarea 
                name="reason" 
                required
                placeholder="Например: Нарушение формы одежды"
                rows={3}
                className="w-full bg-zinc-800 dark:bg-zinc-100 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-brand-blue"
             />
          </div>

          <button 
            disabled={isPending}
            className="w-full py-4 bg-brand-yellow text-brand-blue rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-brand-yellow/10"
          >
             {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Начислить баллы</>}
          </button>
       </form>
       
       <p className="mt-6 text-[10px] text-center opacity-40 font-medium">После начисления баллы мгновенно отобразятся в личном кабинете сотрудника.</p>
    </div>
  );
}
