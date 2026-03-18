import { useMemo, useState } from "react";
import { Search, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type UserStatus = "Faol" | "Bloklangan";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  status: UserStatus;
};

const usersSeed: AdminUser[] = [
  { id: 1, name: "Aziza Karimova", email: "aziza@innohub.uz", avatar: "AK", joinedAt: "18 Mart 2026", status: "Faol" },
  { id: 2, name: "Bekzod Haydarov", email: "bekzod@gmail.com", avatar: "BH", joinedAt: "17 Mart 2026", status: "Bloklangan" },
  { id: 3, name: "Javohir Tursunov", email: "javohir@mail.com", avatar: "JT", joinedAt: "16 Mart 2026", status: "Faol" },
  { id: 4, name: "Madinabonu Xasanova", email: "madina@icloud.com", avatar: "MX", joinedAt: "16 Mart 2026", status: "Faol" },
  { id: 5, name: "Nilufar Qodirova", email: "nilufar@mail.uz", avatar: "NQ", joinedAt: "15 Mart 2026", status: "Faol" },
  { id: 6, name: "Otabek Isroilov", email: "otabek@pm.me", avatar: "OI", joinedAt: "14 Mart 2026", status: "Bloklangan" },
  { id: 7, name: "Sardor Raxmatov", email: "sardor@yahoo.com", avatar: "SR", joinedAt: "13 Mart 2026", status: "Faol" },
  { id: 8, name: "Zilola Abdullayeva", email: "zilola@inbox.uz", avatar: "ZA", joinedAt: "12 Mart 2026", status: "Faol" },
  { id: 9, name: "Umid Ergashev", email: "umid@mail.ru", avatar: "UE", joinedAt: "11 Mart 2026", status: "Faol" },
];

const inputClassName =
  "w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#94A3B8] focus:border-[#22C55E]";

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>(usersSeed);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [searchQuery, users]);

  const toggleStatus = (userId: number) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Faol" ? "Bloklangan" : "Faol" }
          : user,
      ),
    );
  };

  const removeUser = (userId: number) => {
    setUsers((current) => current.filter((user) => user.id !== userId));
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
              Foydalanuvchilarni qidiring, holatini almashtiring va lokal ro'yxatni boshqaring.
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

          <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111111]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#1E293B] text-left text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Avatar</th>
                    <th className="px-6 py-4 font-medium">Ism</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Qo'shilgan sana</th>
                    <th className="px-6 py-4 font-medium">Holat</th>
                    <th className="px-6 py-4 font-medium">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-t border-[#1E293B] ${
                        index % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
                          {user.avatar}
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
                            onClick={() => toggleStatus(user.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-3 py-2 text-xs font-medium text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]"
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
                            onClick={() => removeUser(user.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#ef4444] hover:text-[#ef4444]"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
