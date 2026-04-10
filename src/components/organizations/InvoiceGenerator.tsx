"use client";

import { useState } from "react";
import { Receipt, CheckCircle2, PackageSearch } from "lucide-react";
import { createInvoice } from "@/app/actions/org-actions";

const PACKAGES = [
  { size: 10, discount: 20, pricePerCode: 160 },
  { size: 30, discount: 30, pricePerCode: 140 },
  { size: 50, discount: 40, pricePerCode: 120 },
  { size: 100, discount: 50, pricePerCode: 100 },
];

export function InvoiceGenerator() {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
     if (!selected) return;
     setLoading(true);
     setError("");
     setSuccess("");

     try {
       const res = await createInvoice(selected);
       if (res.error) setError(res.error);
       if (res.success) setSuccess(res.message);
     } catch {
       setError("Ошибка сети");
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center rounded-2xl text-green-600">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Покупка лицензий</h2>
          <p className="text-zinc-500 text-sm font-bold">Выберите пакет для выставления счета</p>
        </div>
      </div>

      {success ? (
         <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-black text-green-600 mb-2">Заявка принята</h3>
            <p className="text-green-700/80 font-bold">{success}</p>
         </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.size}
                onClick={() => setSelected(pkg.size)}
                className={`flex flex-col items-start p-6 rounded-[24px] border-2 transition-all ${
                  selected === pkg.size 
                    ? "border-orange-600 bg-orange-50 dark:bg-orange-600/10" 
                    : "border-zinc-100 dark:border-zinc-800 hover:border-orange-500/30"
                }`}
              >
                 <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">
                    Скидка {pkg.discount}%
                 </span>
                 <div className="text-3xl font-black mb-3">{pkg.size} <span className="text-lg text-zinc-400">кодов</span></div>
                 <div className="w-full flex justify-between items-center text-sm font-bold mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500">По {pkg.pricePerCode} ₽</span>
                    <span className="text-orange-600">{pkg.size * pkg.pricePerCode} ₽</span>
                 </div>
              </button>
            ))}
          </div>

          {error && <div className="text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl">{error}</div>}

          <button 
            onClick={handleGenerate}
            disabled={!selected || loading}
            className={`w-full font-black uppercase tracking-widest text-sm p-5 rounded-2xl flex justify-center gap-2 items-center transition-all ${
              selected && !loading
                ? "bg-orange-600 text-white shadow-xl shadow-orange-950/20 hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Формирование..." : "Создать счет на оплату"}
          </button>
        </div>
      )}
    </div>
  );
}
