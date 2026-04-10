import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Панель управления</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 font-bold text-xs sm:text-sm uppercase tracking-widest">Администрирование ресурсов и контроль исполнения</p>
        </div>
      </div>
      
      <AdminDashboard />
    </div>
  );
}
