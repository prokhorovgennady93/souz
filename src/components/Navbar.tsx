"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Building2, CheckSquare, BookOpen, LogOut, User as UserIcon, UserCircle, Clock
} from "lucide-react";

interface Props {
  user: {
    name?: string | null;
    role?: string | null;
  };
  signOutAction: () => Promise<void>;
  taskCount?: number;
  newsCount?: number;
}

export default function Navbar({ user, signOutAction, taskCount = 0, newsCount = 0 }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/branch", label: "Мой Филиал", icon: Building2 },
    { href: "/tasks", label: "Задачи и Новости", icon: CheckSquare },
    { href: "/lms", label: "Обучение", icon: BookOpen },
    { href: "/schedule", label: "График работы", icon: Clock },
    ...(user.role === 'ADMIN' ? [{ href: "/admin", label: "Управление", icon: UserCircle }] : []),
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const isTasksNews = link.href === "/tasks";
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm ${
                isActive 
                ? 'bg-brand-blue text-brand-yellow shadow-lg shadow-brand-blue/20 transform scale-[1.02]' 
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-brand-blue dark:hover:text-brand-yellow'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-yellow' : ''}`} />
                <span>{link.label}</span>
              </div>
              
              {isTasksNews && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {taskCount > 0 && (
                    <span className="w-5 h-5 bg-brand-yellow text-brand-blue text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in group-hover:scale-110 transition-transform shadow-sm">
                      {taskCount}
                    </span>
                  )}
                  {newsCount > 0 && (
                    <span className="w-5 h-5 bg-brand-yellow/80 text-brand-blue text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in group-hover:scale-110 transition-transform shadow-sm">
                      {newsCount}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 truncate">{user.name || "Сотрудник"}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{user.role || "EMPLOYEE"}</span>
          </div>
        </div>
        
        <button 
          onClick={() => signOutAction()}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 flex items-center justify-between px-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className="relative w-4/5 max-w-sm h-full">
          <NavContent />
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 flex-col z-30">
        <NavContent />
      </aside>
    </>
  );
}
