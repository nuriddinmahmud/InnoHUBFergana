import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminUser, updateAdminUserStatus } from "@/api/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminUsers } from "@/hooks/useAdminData";
import { getApiErrorMessage } from "@/lib/api";
import type { AdminUser } from "@/types/api";

const inputClassName =
  "w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#94A3B8] focus:border-[#22C55E]";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const usersQuery = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, nextStatus }: { userId: string; nextStatus: AdminUser["status"] }) =>
      updateAdminUserStatus(userId, nextStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Foydalanuvchi holati yangilandi.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Foydalanuvchi holatini yangilab bo'lmadi."));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Foydalanuvchi o'chirildi.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Foydalanuvchini o'chirib bo'lmadi."));
    },
  });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [searchQuery, users]);

  const handleToggleStatus = (user: AdminUser) => {
    const nextStatus: AdminUser["status"] = user.status === "Faol" ? "Bloklangan" : "Faol";
    toggleStatusMutation.mutate({ userId: user.id, nextStatus });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm text-[#22C55E]">Foydalanuvchilar</p>
            <h1 className="mt-2 text-3xl font-bold">Foydalanuvchilar boshqaruvi</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Foydalanuvchilarni qidiring, holatini almashtiring va serverdagi real holatni boshqaring.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-[#1E293B] bg-[#111111] p-4">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ism yoki email bo'yicha qidirish"
                className={`${inputClassName} pl-11`}
              />
            </div>
          </div>

          {usersQuery.isLoading ? (
            <div className="rounded-2xl border border-[#1E293B] bg-[#111111] p-8 text-sm text-[#94A3B8]">
              Foydalanuvchilar yuklanmoqda...
            </div>
          ) : usersQuery.isError ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-sm text-red-500">
              Foydalanuvchilar ma&apos;lumotini yuklab bo&apos;lmadi.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111111]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#1E293B] text-left text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Avatar</th>
                      <th className="px-6 py-4 font-medium">Ism</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Qo&apos;shilgan sana</th>
                      <th className="px-6 py-4 font-medium">Holat</th>
                      <th className="px-6 py-4 font-medium">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#94A3B8]">
                          Ma&apos;lumot yo&apos;q.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className={`border-t border-[#1E293B] ${
                            index % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
                              {user.avatar ?? user.name.slice(0, 2).toUpperCase()}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-[#F8FAFC]">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-[#94A3B8]">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-[#94A3B8]">{user.joinedAt}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                user.status === "Faol"
                                  ? "bg-[#22C55E]/10 text-[#22C55E]"
                                  : "bg-[#ef4444]/10 text-[#ef4444]"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(user)}
                                disabled={toggleStatusMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-3 py-2 text-xs font-medium text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E] disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {user.status === "Faol" ? (
                                  <ShieldBan className="h-4 w-4" />
                                ) : (
                                  <ShieldCheck className="h-4 w-4" />
                                )}
                                {user.status === "Faol" ? "Bloklash" : "Faollashtirish"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deleteUserMutation.isPending}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#ef4444] hover:text-[#ef4444] disabled:cursor-not-allowed disabled:opacity-70"
                                title="O'chirish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
