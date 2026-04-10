"use client";

import { useState } from "react";
import { saveOrgProfile } from "@/app/actions/org-actions";
import { Building2, Save } from "lucide-react";

export function OrganizationProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await saveOrgProfile(new FormData(e.currentTarget));
      if (result.error) {
         setError(result.error);
      } else {
         setSuccess(true);
      }
    } catch {
       setError("Ошибка сети");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-500/10 flex items-center justify-center rounded-2xl text-orange-600">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Реквизиты организации</h2>
          <p className="text-zinc-500 text-sm font-bold">Необходимы для работы по договору</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl">{error}</div>}
        {success && <div className="text-green-500 text-sm font-bold bg-green-500/10 p-4 rounded-xl">Реквизиты успешно сохранены</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-500">ИНН</label>
            <input name="inn" defaultValue={initialData?.inn || ""} required
                   className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl p-4 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-500">КПП</label>
            <input name="kpp" defaultValue={initialData?.kpp || ""}
                   className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl p-4 font-bold" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-black uppercase text-zinc-500">Юридический адрес</label>
            <input name="address" defaultValue={initialData?.address || ""} required
                   className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl p-4 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-500">Р/С</label>
            <input name="bankAccount" defaultValue={initialData?.bankAccount || ""} required
                   className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl p-4 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-zinc-500">БИК</label>
            <input name="bik" defaultValue={initialData?.bik || ""} required
                   className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl p-4 font-bold" />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm p-4 rounded-xl hover:opacity-90 transition-opacity flex justify-center gap-2 items-center"
        >
          <Save className="w-4 h-4" /> {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
