import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, UserPlus } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  status: "Faol" | "NoFaol";
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Ali Valiyev", email: "ali@mail.com", status: "Faol" },
    { id: 2, name: "Nodir Akbarov", email: "nodir@mail.com", status: "NoFaol" },
    { id: 3, name: "Laylo Saidova", email: "laylo@mail.com", status: "Faol" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-[28px] font-bold mb-8">Foydalanuvchilar boshqaruvi</h1>

        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Qidirish..."
            className="max-w-xs bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button disabled>Yangi foydalanuvchi</Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary text-primary text-sm">
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">Ism</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Holat</th>
                <th className="text-left px-6 py-3 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-t border-border ${
                    i % 2 === 0 ? "" : "bg-secondary/30"
                  }`}
                >
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">
                    {user.id}
                  </td>
                  <td className="px-6 py-3.5 text-sm">{user.name}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-2">
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        title="Tahrirlash"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="text-muted-foreground hover:text-destructive"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
