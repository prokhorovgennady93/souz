import { getUsers } from "@/app/actions/user";
import { getBranches } from "@/app/actions/branch";
import { auth } from "../../../../../auth";
import UserList from "./UserList";

export const metadata = { title: "Сотрудники | Админ-панель" };

export default async function UsersAdminPage() {
  const session = await auth();
  const role = (session?.user as any)?.role || "EMPLOYEE";

  const [usersRes, branchesRes] = await Promise.all([
    getUsers(),
    getBranches()
  ]);

  if (usersRes.error) return <div className="text-red-500">Ошибка: {usersRes.error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-sans text-brand-blue dark:text-brand-yellow">Управление сотрудниками</h1>
      </div>

      <UserList 
        initialUsers={usersRes.users || []} 
        branches={branchesRes.branches || []} 
        userRole={role}
      />
    </div>
  );
}
