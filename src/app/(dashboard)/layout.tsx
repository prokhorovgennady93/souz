import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { signOut } from "../../../auth";
import Navbar from "@/components/Navbar";
import { getMyTasks } from "@/app/actions/task";
import { getCompanyNews } from "@/app/actions/news";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Получаем счетчики для бейджей
  const [tasks, news] = await Promise.all([
    getMyTasks(),
    getCompanyNews()
  ]);

  const taskCount = tasks.length;
  const newsCount = news.filter((n: any) => !n.isRead).length;

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* RESPONSIVE NAVIGATION */}
      <Navbar 
        user={session.user} 
        signOutAction={handleSignOut} 
        taskCount={taskCount}
        newsCount={newsCount}
      />


      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

