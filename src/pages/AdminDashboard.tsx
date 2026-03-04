import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Users, BookOpen, FileText, UserPlus } from "lucide-react";

const AdminDashboard = () => {
  const [stats] = useState([
    { icon: Users, value: "124", label: "Foydalanuvchilar" },
    { icon: BookOpen, value: "7", label: "Kurslar" },
    { icon: FileText, value: "89", label: "Mavzular" },
    { icon: UserPlus, value: "12", label: "Bugun qo'shilganlar" },
  ]);

  const [recentUsers] = useState([
    { name: "Sardor Karimov", email: "sardor@mail.com", date: "2025-03-01", status: "Faol" },
    { name: "Nilufar Rahimova", email: "nilufar@mail.com", date: "2025-03-01", status: "Faol" },
    { name: "Jasur Toshmatov", email: "jasur@mail.com", date: "2025-02-28", status: "Faol" },
    { name: "Kamola Usmanova", email: "kamola@mail.com", date: "2025-02-28", status: "Faol" },
  ]);
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-[28px] font-bold mb-8">Boshqaruv paneli</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold">So'nggi foydalanuvchilar</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-secondary text-primary text-sm">
                <th className="text-left px-6 py-3 font-medium">Ism</th>
                <th className="text-left px-6 py-3 font-medium">Email</th>
                <th className="text-left px-6 py-3 font-medium">Qo'shilgan sana</th>
                <th className="text-left px-6 py-3 font-medium">Holat</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-secondary/30"}`}>
                  <td className="px-6 py-3.5 text-sm">{user.name}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{user.date}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {user.status}
                    </span>
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

export default AdminDashboard;
