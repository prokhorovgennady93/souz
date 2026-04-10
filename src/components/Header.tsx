"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Menu, 
  X, 
  ChevronRight, 
  GraduationCap, 
  Building2, 
  BookMarked, 
  CreditCard, 
  UserCircle 
} from "lucide-react";

interface HeaderProps {
  session: any;
}

export function Header({ session: initialSession }: HeaderProps) {
  const { data: session } = useSession();
  const currentSession = session || initialSession;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Курсы", href: "/", icon: GraduationCap },
    { name: "База знаний", href: "/articles", icon: BookMarked },
    { name: "Тарифы", href: "/pricing", icon: CreditCard },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-lg shadow-black/5" 
          : "bg-white dark:bg-zinc-950 border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-black font-black text-[10px] tracking-tighter">ADR</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-black text-lg tracking-tight">ДОПОГ Экзамен</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? "text-orange-600 bg-orange-50 dark:bg-orange-500/10" 
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions / Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {!currentSession ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors px-3 py-2"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-black px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Регистрация
                </Link>
              </>
            ) : (
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-yellow-500/10 active:scale-95"
              >
                Личный кабинет
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-[85%] max-w-xs bg-white dark:bg-zinc-950 z-50 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden border-l border-zinc-200 dark:border-zinc-800 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="font-black text-xl uppercase tracking-tighter">Меню</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 border border-orange-200 dark:border-orange-500/20" 
                      : "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-orange-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold">{link.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "translate-x-1" : "opacity-0"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-10 flex flex-col gap-3">
             {currentSession ? (
               <Link 
                 href="/dashboard"
                 className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-black py-4 rounded-2xl font-black shadow-lg shadow-yellow-500/20"
               >
                 <UserCircle className="w-5 h-5" /> Личный кабинет
               </Link>
             ) : (
               <>
                 <Link 
                   href="/login"
                   className="flex items-center justify-center w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white py-4 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-800"
                 >
                   Вход
                 </Link>
                 <Link 
                   href="/register"
                   className="flex items-center justify-center w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black shadow-xl"
                 >
                   Регистрация
                 </Link>
               </>
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
