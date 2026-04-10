import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Info Section */}
          <div className="space-y-4 max-w-sm">
            <h3 className="font-bold text-lg">ДОПОГ Экзамен 2026</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              Профессиональная платформа для подготовки к экзаменам ДОПОГ. 
              Актуальные вопросы, статистика прогресса и удобные режимы обучения.
            </p>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-3">
             <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Навигация</h4>
             <Link 
               href="/articles" 
               className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all shadow-lg shadow-orange-900/20 active:scale-95 mb-2 text-center"
             >
                База знаний
             </Link>
             <Link href="/terms" className="text-sm text-zinc-500 hover:text-yellow-600 transition-colors font-bold">Пользовательское соглашение</Link>
             <Link href="/privacy" className="text-sm text-zinc-500 hover:text-yellow-600 transition-colors font-bold">Политика конфиденциальности</Link>
             <Link href="/data-policy" className="text-sm text-zinc-500 hover:text-yellow-600 transition-colors font-bold">Обработка персональных данных</Link>
          </div>

          {/* Owner Section */}
          <div className="flex flex-col gap-3">
             <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Контакты</h4>
             <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold">ИП Карманович Алексей Сергеевич</p>
             <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold">ИНН 611405438968</p>
             <a href="mailto:grevelien@yandex.ru" className="text-sm text-zinc-500 hover:text-yellow-600 transition-colors font-bold">grevelien@yandex.ru</a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400 font-bold">
            © 2026 ДОПОГ Экзамен. Все права защищены.
          </p>
          <div className="flex items-center gap-1">
             <div className="w-1 h-1 rounded-full bg-yellow-500" />
             <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-black">
                Сделано с заботой о безопасности перевозок
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
