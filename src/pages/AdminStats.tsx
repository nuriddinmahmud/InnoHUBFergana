import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Users, BookOpen, FileText, Clock } from "lucide-react";

const AdminStats = () => {
  const [stats] = useState([
    { icon: Users, value: "124", label: "Foydalanuvchilar" },
    { icon: BookOpen, value: "7", label: "Kurslar" },
    { icon: FileText, value: "89", label: "Mavzular" },
    { icon: Clock, value: "5h", label: "O'rtacha o'qish vaqti" },
  ]);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-[28px] font-bold mb-8">Statistika</h1>

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
      </main>
    </div>
  );
};

export default AdminStats;
