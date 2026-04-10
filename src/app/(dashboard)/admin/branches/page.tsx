import { getBranches } from "@/app/actions/branch";
import BranchList from "./BranchList";

export const metadata = { title: "Филиалы | Админ-панель" };

export default async function BranchesAdminPage() {
  const { branches, error } = await getBranches();

  if (error) {
    return <div className="text-red-500">Ошибка загрузки: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-sans text-brand-blue dark:text-brand-yellow">Управление филиалами</h1>
      </div>

      <BranchList initialBranches={branches || []} />
    </div>
  );
}
