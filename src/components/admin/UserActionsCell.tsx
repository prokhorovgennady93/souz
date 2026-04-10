"use client";

import { useTransition } from "react";
import { toggleFullAccess, toggleAdmin, deleteUser, generateNewPassword } from "@/app/admin/userActions";
import { Crown, Shield, Trash2, Key, Loader2 } from "lucide-react";

interface UserActionsCellProps {
  userId: string;
  hasFullAccess: boolean;
  isAdmin: boolean;
  userEmail?: string | null;
  currentUserEmail?: string | null;
}

export function UserActionsCell({ 
  userId, 
  hasFullAccess, 
  isAdmin, 
  userEmail, 
  currentUserEmail 
}: UserActionsCellProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleFullAccess = () => {
    if (confirm(`Вы действительно хотите изменить тип доступа "Все курсы" для ${userEmail}?`)) {
      startTransition(() => toggleFullAccess(userId, hasFullAccess));
    }
  };

  const handleGeneratePassword = () => {
    if (confirm(`Создать новый пароль для пользователя ${userEmail}?`)) {
      startTransition(async () => {
        try {
          const newPass = await generateNewPassword(userId);
          alert(`Новый пароль для ${userEmail}:\n\n${newPass}\n\nОбязательно скопируйте его и передайте пользователю!`);
        } catch (error) {
          alert("Ошибка при создании пароля.");
        }
      });
    }
  };

  const handleToggleAdmin = () => {
    if (confirm(`Берегись! Вы действительно хотите изменить права администратора для ${userEmail}?`)) {
      startTransition(() => toggleAdmin(userId, isAdmin));
    }
  };


  const handleDelete = () => {
    if (confirm(`Внимание! Это действие необратимо. Удалить пользователя ${userEmail} и весь его прогресс?`)) {
      startTransition(() => deleteUser(userId));
    }
  };

  const isSelf = userEmail === currentUserEmail;

  return (
    <div className="flex items-center justify-center gap-2">
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
      ) : (
        <>
          <button
            onClick={handleToggleFullAccess}
            title={hasFullAccess ? "Убрать полный доступ" : "Выдать полный доступ ко всем курсам"}
            className={`p-1.5 rounded-lg transition-colors ${
              hasFullAccess 
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" 
                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
            }`}
          >
            <Crown className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleGeneratePassword}
            title="Создать новый пароль"
            className="p-1.5 rounded-lg bg-zinc-100 text-zinc-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
          >
            <Key className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggleAdmin}
            disabled={isSelf}
            title={isAdmin ? "Убрать права админа" : "Сделать админом"}
            className={`p-1.5 rounded-lg transition-colors ${
              isAdmin 
                ? "bg-red-100 text-red-700 hover:bg-red-200" 
                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
            } ${isSelf ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <Shield className="w-4 h-4" />
          </button>


          <button
            onClick={handleDelete}
            disabled={isSelf}
            title="Удалить пользователя"
            className={`p-1.5 rounded-lg bg-zinc-100 text-zinc-400 hover:bg-red-500 hover:text-white transition-colors ${
              isSelf ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
