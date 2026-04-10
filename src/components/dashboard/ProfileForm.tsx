"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/auth-actions";
import { Save, User, Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
}

export function ProfileForm({ initialName, initialEmail }: ProfileFormProps) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    try {
      const result = await updateProfile(formData);
      if (result?.success) {
        setMessage({ type: 'success', text: "Профиль успешно обновлен" });
      } else {
        setMessage({ type: 'error', text: result?.error || "Ошибка обновления" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Произошла ошибка" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight">Ваши данные</h3>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Для документов и восстановления</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-bold">{message.text}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Фамилия Имя Отчество</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl pl-12 pr-4 py-4 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all font-bold"
              placeholder="Введите ФИО"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email (восстановление доступа)</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl pl-12 pr-4 py-4 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all font-bold"
              placeholder="example@mail.ru"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Сохранение..." : "Сохранить профиль"}
        </button>
      </form>
    </div>
  );
}
