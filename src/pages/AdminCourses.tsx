import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

interface Course {
  id: number;
  name: string;
  category: string;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "JavaScript Fundamentals", category: "Frontend" },
    { id: 2, name: "Node.js Basics", category: "Backend" },
    { id: 3, name: "React Advanced", category: "Frontend" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-[28px] font-bold mb-8">Kurslar boshqaruvi</h1>

        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Qidirish..."
            className="max-w-xs bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button disabled>Yangi kurs</Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary text-primary text-sm">
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">Nomi</th>
                <th className="text-left px-6 py-3 font-medium">Kategoriya</th>
                <th className="text-left px-6 py-3 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course, i) => (
                <tr
                  key={course.id}
                  className={`border-t border-border ${
                    i % 2 === 0 ? "" : "bg-secondary/30"
                  }`}
                >
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">
                    {course.id}
                  </td>
                  <td className="px-6 py-3.5 text-sm">{course.name}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">
                    {course.category}
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

export default AdminCourses;
