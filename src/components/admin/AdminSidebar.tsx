import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, FolderTree, BookOpen, FileText, Users, BarChart3, LogOut } from "lucide-react";

const navItems = [
  { label: "Bosh sahifa", icon: LayoutDashboard, href: "/admin" },
  { label: "Kategoriyalar", icon: FolderTree, href: "/admin/categories" },
  { label: "Kurslar", icon: BookOpen, href: "/admin/courses" },
  { label: "Mavzular", icon: FileText, href: "/admin/topics" },
  { label: "Foydalanuvchilar", icon: Users, href: "/admin/users" },
  { label: "Statistika", icon: BarChart3, href: "/admin/stats" },
];

const AdminSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <aside className="w-[240px] bg-card border-r border-border flex flex-col shrink-0 min-h-screen">
      <div className="p-5 border-b border-border flex items-center">
        <Link to="/" className="flex items-center">
          <Logo className="h-14 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 py-3">
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">👤</div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground text-sm font-medium truncate">Super Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive cursor-pointer"
          title="Tizimdan chiqish"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
