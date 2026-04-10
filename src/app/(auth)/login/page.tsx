"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Phone } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("7") || val.startsWith("8")) {
      val = val.slice(1);
    }

    let formatted = "";
    if (val.length > 0) {
      formatted = "+7 ";
      if (val.length > 0) formatted += `(${val.substring(0, 3)}`;
      if (val.length > 3) formatted += `) ${val.substring(3, 6)}`;
      if (val.length > 6) formatted += `-${val.substring(6, 8)}`;
      if (val.length > 8) formatted += `-${val.substring(8, 10)}`;
    } else if (e.target.value === "+") {
      formatted = "+";
    }
    setPhone(formatted || e.target.value.replace(/[^\+0-9]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });
    
    console.log("[LOGIN DEBUG] Response:", res);

    if (res?.error) {
      setError("Неверный номер телефона или пароль");
      setLoading(false);
    } else {
      router.push("/branch");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        
        <div className="p-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 text-center">
          <div className="mx-auto flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="Союз Автошкол" className="h-[60px] w-auto drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold font-sans text-brand-blue dark:text-brand-yellow mt-4">Корпоративный портал</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Войдите в систему</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="px-4 py-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center text-center justify-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-blue dark:text-zinc-300 ml-1">
                Номер телефона
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue dark:text-white outline-none transition-all placeholder:text-zinc-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-blue dark:text-zinc-300 ml-1">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите ваш пароль"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue dark:text-white outline-none transition-all placeholder:text-zinc-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-blue hover:bg-brand-blue-hover text-brand-yellow font-semibold rounded-xl transition-colors focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-70 flex justify-center"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin"></span>
              ) : (
                "Войти в систему"
              )}
            </button>
            
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <a href="/schedule" className="text-sm font-medium text-brand-blue hover:underline dark:text-zinc-400">
                Посмотреть график работы (публичный)
              </a>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
